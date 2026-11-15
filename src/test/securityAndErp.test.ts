import { describe, it, expect, beforeEach, afterEach } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { buildQuotesCsv, escapeCsvCell, sanitizeCsvFormula } from "../lib/csvExport";
import {
  getOrderTrackingDocId,
  getPhoneTrackingDocId,
  maskCustomerName,
  normalizeTrPhone10,
  sha256Hex,
  toPublicOrderTrackingItem,
} from "../lib/orderTracking";
import {
  checkSubmissionCooldown,
  isHoneypotTripped,
  markFormSubmitted,
  resetSubmissionCooldown,
  validatePublicLeadInput,
} from "../lib/formGuard";
import {
  addAdminQuality,
  addAdminQuote,
  deleteAdminQuote,
  fetchPublicOrderTracking,
  getAdminAuditLogs,
  releaseAdminQualityHold,
  setActiveUserRole,
  setLiveSession,
  updateAdminInventory,
  updateAdminPrice,
  updateAdminQuote,
  updateQuoteStatus,
  type QuoteItem,
} from "../lib/adminStorage";

describe("CSV Export Security & RFC 4180 Formatting", () => {
  it("neutralizes spreadsheet formula triggers while keeping normal values intact", () => {
    expect(sanitizeCsvFormula("=CMD('calc')")).toBe("'=CMD('calc')");
    expect(sanitizeCsvFormula("+905336253611")).toBe("'+905336253611");
    expect(sanitizeCsvFormula("-1+1")).toBe("'-1+1");
    expect(sanitizeCsvFormula("@SUM(A1:A5)")).toBe("'@SUM(A1:A5)");
    expect(sanitizeCsvFormula("\t=1+1")).toBe("'\t=1+1");
    expect(sanitizeCsvFormula("  =cmd")).toBe("'  =cmd");
    expect(sanitizeCsvFormula("Adana Seyhan")).toBe("Adana Seyhan");
  });

  it("escapes inner quotes, commas, and newlines per RFC 4180", () => {
    expect(escapeCsvCell('Fırat "75" Seri, Adana\n2. Kat')).toBe('"Fırat ""75"" Seri, Adana\n2. Kat"');
    expect(escapeCsvCell("=2+2")).toBe('"\'=2+2"');
    expect(escapeCsvCell(null)).toBe('""');
    expect(escapeCsvCell(undefined)).toBe('""');
  });

  it("builds a complete BOM-prefixed CRLF CSV from QuoteItem rows", () => {
    const sampleQuote: QuoteItem = {
      id: "TKF-2026-990001",
      customerName: '=HYPERLINK("https://evil.example","Click")',
      phone: "+905336253611",
      city: "Adana, Seyhan",
      siteName: 'Şantiye "A-Blok"',
      glassType: "Fıratpen Selenit 75\nÇift Açılım",
      thickness: "4+16+4 mm",
      dimensions: "120x120",
      totalArea: 12.5,
      estimatedPrice: 25000,
      paidAmount: 10000,
      productionStage: 3,
      qualityHold: false,
      status: "quoted",
      date: "15.11.2026",
    };

    const csv = buildQuotesCsv([sampleQuote]);
    expect(csv.startsWith("\uFEFF")).toBe(true);
    expect(csv).toContain("\r\n");
    expect(csv).toContain('"\'=HYPERLINK(""https://evil.example"",""Click"")"');
    expect(csv).toContain('"\'+905336253611"');
    expect(csv).toContain('"Şantiye ""A-Blok"""');
    expect(csv).toContain('"Adana, Seyhan"');
  });
});

describe("Public Order Tracking Sanitization & Hashed Phone Lookup", () => {
  it("computes standard FIPS 180-4 SHA-256 hex digest deterministically", () => {
    expect(sha256Hex("abc")).toBe(
      "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad"
    );
  });

  it("normalizes Turkish phone numbers across formats to canonical 10 digits and identical doc IDs", () => {
    expect(normalizeTrPhone10("0533 625 36 11")).toBe("5336253611");
    expect(normalizeTrPhone10("+90 (533) 625-36-11")).toBe("5336253611");
    expect(normalizeTrPhone10("905336253611")).toBe("5336253611");
    expect(normalizeTrPhone10("5336253611")).toBe("5336253611");
    expect(normalizeTrPhone10("12345")).toBe("");

    const d1 = getPhoneTrackingDocId("0533 625 36 11");
    const d2 = getPhoneTrackingDocId("+90 533 625 36 11");
    expect(d1).toMatch(/^PHONE_[a-f0-9]{64}$/);
    expect(d1).toBe(d2);
    expect(getOrderTrackingDocId(" tkf-2026-123 ")).toBe("ORDER_TKF-2026-123");
  });

  it("masks customer names and strips all PII/financial fields from public tracking output", () => {
    const internalQuote: QuoteItem = {
      id: "TKF-2026-777777",
      customerName: "Ahmet Yılmaz İnşaat",
      phone: "05336253611",
      email: "ahmet@example.com",
      city: "Adana",
      deliveryAddress: "Gizli Adres Sokak No 9",
      glassType: "Winsa Dorado 76 PVC",
      thickness: "4+16+4 Isıcam",
      dimensions: "120x120 cm",
      totalArea: 18,
      estimatedPrice: 95000,
      paidAmount: 45000,
      estimatedCost: 60000,
      actualCost: 61500,
      discountRate: 12,
      invoiceNo: "FTR-2026-55",
      notes: "Gizli iskonto notu",
      status: "approved",
      productionStage: 4,
      date: "15.11.2026",
      createdAt: 1794750000000,
    };

    const tracking = toPublicOrderTrackingItem(internalQuote) as unknown as Record<string, unknown>;
    expect(maskCustomerName("Ahmet Yılmaz İnşaat")).toBe("A*** Y*** İ***");
    expect(tracking.orderId).toBe("TKF-2026-777777");
    expect(tracking.maskedCustomer).toBe("A*** Y*** İ***");
    expect(tracking.productionStage).toBe(4);

    for (const forbidden of [
      "phone",
      "email",
      "customerName",
      "deliveryAddress",
      "estimatedPrice",
      "paidAmount",
      "estimatedCost",
      "actualCost",
      "discountRate",
      "invoiceNo",
      "notes",
      "lines",
    ]) {
      expect(forbidden in tracking).toBe(false);
    }
  });
});

describe("Public Form Guard (Honeypot, Validation & Cooldown)", () => {
  beforeEach(() => {
    resetSubmissionCooldown();
  });

  it("detects filled honeypot fields cleanly", () => {
    expect(isHoneypotTripped("")).toBe(false);
    expect(isHoneypotTripped("   ")).toBe(false);
    expect(isHoneypotTripped("https://bot.spam")).toBe(true);
  });

  it("validates public quote lead fields strictly", () => {
    expect(validatePublicLeadInput({ name: "A", phone: "05336253611" }).ok).toBe(false);
    expect(validatePublicLeadInput({ name: "Ali Demir", phone: "12345" }).ok).toBe(false);
    expect(
      validatePublicLeadInput({
        name: "Ali Demir",
        phone: "0533 625 36 11",
        email: "gecersiz-mail",
      }).ok
    ).toBe(false);
    expect(
      validatePublicLeadInput({
        name: "Ali Demir",
        phone: "0533 625 36 11",
        email: "ali@acarpen.com.tr",
      }).ok
    ).toBe(true);
  });

  it("enforces submission cooldown rate-limit per form key", () => {
    const t0 = 1_794_750_000_000;
    expect(checkSubmissionCooldown("test_form", 30_000, t0).allowed).toBe(true);
    markFormSubmitted("test_form", t0);

    const blocked = checkSubmissionCooldown("test_form", 30_000, t0 + 10_000);
    expect(blocked.allowed).toBe(false);
    expect(blocked.waitSeconds).toBe(20);

    expect(checkSubmissionCooldown("test_form", 30_000, t0 + 30_000).allowed).toBe(true);
  });
});

describe("ERP RBAC, Quality Hold Gate & Order Lookup Integration", () => {
  const createdIds: string[] = [];

  afterEach(() => {
    setLiveSession(null);
    setActiveUserRole("yonetici");
    while (createdIds.length > 0) {
      const id = createdIds.pop();
      if (id) deleteAdminQuote(id);
    }
  });

  it("blocks unauthorized roles from changing prices, adjusting stock, or releasing quality holds", () => {
    setActiveUserRole("satis");
    expect(updateAdminPrice("isicam-s", 9999).ok).toBe(false);
    expect(updateAdminInventory("non-existent", { availableQty: 99 }).ok).toBe(false);
    expect(releaseAdminQualityHold("TKF-NONE", "Serbest", "Bypass denemesi").ok).toBe(false);

    const logs = getAdminAuditLogs();
    expect(logs.some((l) => l.actionType === "RBAC_DENIED")).toBe(true);
  });

  it("blocks authenticated non-yonetici staff from client-side role elevation", () => {
    setLiveSession("uid-sales-staff-01");
    const elevation = setActiveUserRole("kalite");
    expect(elevation.ok).toBe(false);
  });

  it("enforces Acceptance Test #5: qualityHold blocks completion and stage >= 5 shipment", () => {
    setActiveUserRole("yonetici");
    const quote = addAdminQuote({
      id: "TKF-2026-991122",
      customerName: "Test Kalite İnşaat",
      phone: "05336253611",
      city: "Adana",
      glassType: "Fıratpen Selenit 75",
      thickness: "4+16+4 mm",
      dimensions: "120x120",
      totalArea: 10,
      estimatedPrice: 15000,
      status: "approved",
    });
    createdIds.push(quote.id);

    addAdminQuality({
      orderId: quote.id,
      customerName: quote.customerName,
      inspectionType: "Final Kalite (Sevk Öncesi)",
      stationName: "Son Kontrol",
      dimensionToleranceOk: false,
      opticalSurfaceOk: true,
      temperStressOk: true,
      sealantArgonOk: true,
      result: "Karantina (Blokaj)",
      defectReason: "Gönye sapması",
      inspector: "Kalite Ekibi",
    });

    expect(updateQuoteStatus(quote.id, "completed").ok).toBe(false);
    expect(updateAdminQuote(quote.id, { productionStage: 5 }).ok).toBe(false);

    setActiveUserRole("kalite");
    expect(releaseAdminQualityHold(quote.id, "Serbest", "Yeniden işleme tamam").ok).toBe(true);
    expect(updateQuoteStatus(quote.id, "completed").ok).toBe(true);
  });

  it("finds public tracking projections by both order ID and phone number without exposing PII", async () => {
    const quote = addAdminQuote({
      id: "TKF-2026-882244",
      customerName: "Mehmet Aydın",
      phone: "0542 111 22 33",
      city: "Mersin",
      glassType: "Pimapen Nirvana 80",
      thickness: "4+16+4 mm",
      dimensions: "150x140",
      totalArea: 14,
      estimatedPrice: 42000,
      status: "in_review",
    });
    createdIds.push(quote.id);

    const byOrder = await fetchPublicOrderTracking("TKF-2026-882244");
    expect(byOrder).toHaveLength(1);
    expect(byOrder[0].maskedCustomer).toBe("M*** A***");

    const byPhone = await fetchPublicOrderTracking("+90 542 111 22 33");
    expect(byPhone).toHaveLength(1);
    expect(byPhone[0].orderId).toBe("TKF-2026-882244");
  });
});

describe("Firestore Security Rules Contract Verification", () => {
  const rulesPath = path.resolve(process.cwd(), "firestore.rules");
  const rules = fs.readFileSync(rulesPath, "utf-8");

  it("denies public reads on internal acarpen_quotes and denies list on acarpen_order_tracking", () => {
    const quotesBlock =
      rules.match(/match \/acarpen_quotes\/\{id\}[\s\S]*?match \/acarpen_order_tracking\/\{id\}/)?.[0] ?? "";
    const trackingBlock =
      rules.match(/match \/acarpen_order_tracking\/\{id\}[\s\S]*?match \/acarpen_messages\/\{id\}/)?.[0] ?? "";

    expect(quotesBlock).not.toMatch(/allow get:\s*if\s*true/);
    expect(quotesBlock).toMatch(/allow get, list:\s*if\s*isAdminOrStaff\(\)/);
    expect(trackingBlock).toMatch(/allow list:\s*if\s*false/);
    expect(trackingBlock).toMatch(/allow get:\s*if\s*id\.matches/);
  });

  it("enforces strict field whitelists and immutable audit logs", () => {
    expect(rules).toContain("function validPublicQuote()");
    expect(rules).toContain("function validPublicMessage()");
    expect(rules).toMatch(/function validPublicQuote\(\)[\s\S]*d\.keys\(\)\.hasOnly\(\[/);
    expect(rules).toMatch(/function validPublicMessage\(\)[\s\S]*d\.keys\(\)\.hasOnly\(\[/);
    expect(rules).toMatch(/match \/acarpen_audit_logs\/\{id\}[\s\S]*allow update, delete:\s*if\s*false/);
    expect(rules).toMatch(/match \/users\/\{uid\}[\s\S]*allow write:\s*if\s*isYonetici\(\)/);
    expect(rules).toMatch(/match \/acarpen_prices\/\{id\}[\s\S]*allow write:\s*if\s*canEditPrices\(\)/);
  });
});
