import { describe, it, expect, beforeEach, afterEach } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { buildQuotesCsv, escapeCsvCell, sanitizeCsvFormula } from "../lib/csvExport";
import {
  generateOrderId,
  generateTrackingPin,
  getOrderTrackingDocId,
  getPhoneTrackingDocId,
  maskCustomerName,
  normalizeTrPhone10,
  sha256Hex,
  toProductionOrderItem,
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
  addAdminCashLedgerEntry,
  addAdminCheck,
  addAdminMessage,
  addAdminQuality,
  addAdminQuote,
  clearAdminSyncError,
  deleteAdminQuote,
  fetchPublicOrderTracking,
  fetchPublicOrderTrackingWithStatus,
  getAdminAuditLogs,
  getAdminAuthState,
  getAdminCashLedger,
  getAdminChecks,
  getAdminCustomers,
  getAdminMessages,
  getAdminQuotes,
  releaseAdminQualityHold,
  saveAdminCustomer,
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

    expect(getPhoneTrackingDocId("0533 625 36 11")).toBeNull();
    expect(getOrderTrackingDocId("tkf-2026-123")).toBe("");

    const d1 = getPhoneTrackingDocId("0533 625 36 11", "K7M9PQ");
    const d2 = getPhoneTrackingDocId("+90 533 625 36 11", "k7m9pq");
    expect(d1).toMatch(/^PHONE_[a-f0-9]{64}$/);
    expect(d1).toBe(d2);
    expect(d1).not.toBe(getPhoneTrackingDocId("0533 625 36 11", "X2Y3Z4"));

    const o1 = getOrderTrackingDocId(" tkf-2026-123 ", "K7M9PQ");
    const o2 = getOrderTrackingDocId("TKF-2026-123", "k7m9pq");
    expect(o1).toMatch(/^ORDER_[a-f0-9]{64}$/);
    expect(o1).toBe(o2);
    expect(o1).not.toBe(getOrderTrackingDocId("TKF-2026-123", "X2Y3Z4"));
  });

  it("generates CSPRNG order IDs and 6-character tracking PINs", () => {
    const id1 = generateOrderId(2026);
    const id2 = generateOrderId(2026);
    const pin = generateTrackingPin();

    expect(id1).toMatch(/^TKF-2026-[23456789ABCDEFGHJKLMNPQRSTUVWXYZ]{8}$/);
    expect(id1).not.toBe(id2);
    expect(pin).toMatch(/^[23456789ABCDEFGHJKLMNPQRSTUVWXYZ]{6}$/);
  });

  it("masks customer names and strips all PII/metadata/financial fields from public tracking and workshop output", () => {
    const internalQuote: QuoteItem = {
      id: "TKF-2026-777777",
      trackingPin: "K7M9PQ",
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
    expect(tracking.systemCategory).toBe("PVC Doğrama Sistemleri");
    expect(tracking.productionStage).toBe(4);

    for (const forbidden of [
      "phone",
      "email",
      "customerName",
      "maskedCustomer",
      "city",
      "deliveryAddress",
      "glassType",
      "thickness",
      "dimensions",
      "totalArea",
      "estimatedPrice",
      "paidAmount",
      "estimatedCost",
      "actualCost",
      "discountRate",
      "invoiceNo",
      "notes",
      "lines",
      "trackingPin",
    ]) {
      expect(forbidden in tracking).toBe(false);
    }

    const workshopOrder = toProductionOrderItem(internalQuote) as unknown as Record<string, unknown>;
    expect(workshopOrder.id).toBe("TKF-2026-777777");
    expect(workshopOrder.dimensions).toBe("120x120 cm");
    for (const workshopForbidden of [
      "phone",
      "email",
      "customerName",
      "city",
      "deliveryAddress",
      "estimatedPrice",
      "paidAmount",
      "estimatedCost",
      "actualCost",
      "discountRate",
      "invoiceNo",
      "waybillNo",
    ]) {
      expect(workshopForbidden in workshopOrder).toBe(false);
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
    clearAdminSyncError();
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

  it("requires valid two-factor PIN and finds public tracking projections without exposing PII", async () => {
    const quote = addAdminQuote({
      id: "TKF-2026-882244",
      trackingPin: "K7M9PQ",
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

    expect(await fetchPublicOrderTracking("TKF-2026-882244")).toEqual([]);
    expect(await fetchPublicOrderTracking("TKF-2026-882244", "WRONG1")).toEqual([]);
    expect(await fetchPublicOrderTracking("+90 542 111 22 33", "WRONG1")).toEqual([]);

    const byOrder = await fetchPublicOrderTrackingWithStatus("TKF-2026-882244", "k7m9pq");
    expect(byOrder.ok).toBe(true);
    expect(byOrder.items).toHaveLength(1);
    expect(byOrder.items[0].orderId).toBe("TKF-2026-882244");
    expect(byOrder.items[0].systemCategory).toBe("PVC Doğrama Sistemleri");
    expect("maskedCustomer" in (byOrder.items[0] as unknown as Record<string, unknown>)).toBe(false);

    const byPhone = await fetchPublicOrderTracking("+90 542 111 22 33", "K7M9PQ");
    expect(byPhone).toHaveLength(1);
    expect(byPhone[0].orderId).toBe("TKF-2026-882244");
  });

  it("enforces strict session/user/localStorage data isolation across logout and account switch", () => {
    setActiveUserRole("yonetici");
    const quote = addAdminQuote({
      id: "TKF-2026-ISO111",
      customerName: "İzolasyon Müşteri A.Ş.",
      phone: "05336253611",
      city: "Adana",
      glassType: "Fıratpen Selenit 75",
      thickness: "4+16+4 mm",
      dimensions: "100x100",
      totalArea: 5,
      estimatedPrice: 12000,
      status: "quoted",
    });
    createdIds.push(quote.id);

    addAdminMessage({
      name: "Veli Kaya",
      phone: "05331112233",
      subject: "Teklif Talebi",
      message: "Gizli müşteri mesajı",
    });
    saveAdminCustomer({
      companyName: "Özel Müşteri Ltd.",
      contactPerson: "Veli Kaya",
      phone: "05331112233",
      city: "Adana",
      customerType: "Kurumsal / Müteahhit",
      salesRep: "Merkez",
      paymentTerms: "Peşin",
      creditLimit: 50000,
      kvkkConsent: true,
    });
    addAdminCheck({
      direction: "received",
      serialNo: "CHK-991",
      counterparty: "Özel Müşteri Ltd.",
      bankName: "İş Bankası",
      amount: 15000,
      dueDate: "30.12.2026",
      status: "Portföyde (Kasada)",
    });
    addAdminCashLedgerEntry({
      type: "in",
      accountName: "Merkez Nakit Kasa",
      category: "Müşteri Sipariş Tahsilatı",
      counterparty: "Özel Müşteri Ltd.",
      amount: 5000,
      description: "Kapora",
    });

    // Global unscoped localStorage must remain completely empty (zero PII leakage across tabs/visitors)
    expect(localStorage.getItem("acarpen_live_v3_quotes")).toBeNull();
    expect(localStorage.getItem("acarpen_live_v3_messages")).toBeNull();
    expect(localStorage.getItem("acarpen_live_v3_customers")).toBeNull();
    expect(localStorage.getItem("acarpen_live_v3_checks")).toBeNull();
    expect(localStorage.getItem("acarpen_live_v3_cash_ledger")).toBeNull();

    // Switching to another session UID immediately wipes prior operational data and blocks unauthorized reads
    setLiveSession("uid-user-b");
    expect(getAdminAuthState().isAuthorizedStaff).toBe(false);
    expect(getAdminQuotes()).toEqual([]);
    expect(getAdminMessages()).toEqual([]);
    expect(getAdminCustomers()).toEqual([]);
    expect(getAdminChecks()).toEqual([]);
    expect(getAdminCashLedger()).toEqual([]);
    expect(getAdminAuditLogs()).toEqual([]);

    // Explicit sign-out wipes operational state cleanly
    setLiveSession(null);
    expect(getAdminQuotes()).toEqual([]);
    expect(getAdminMessages()).toEqual([]);
    expect(getAdminCustomers()).toEqual([]);
    expect(getAdminChecks()).toEqual([]);
    expect(getAdminCashLedger()).toEqual([]);
    expect(getAdminAuditLogs()).toEqual([]);
  });
});

describe("Firestore Security Rules & No-reCAPTCHA Contract Verification", () => {
  const rulesPath = path.resolve(process.cwd(), "firestore.rules");
  const rules = fs.readFileSync(rulesPath, "utf-8");

  it("removes hardcoded admin emails, stale JWT role escalation, and unused non-Acarpen collections", () => {
    expect(rules).not.toContain("isPrimaryAdmin");
    expect(rules).not.toContain("admin@acarpen.com.tr");
    expect(rules).toContain("request.auth.token.email_verified == true");
    expect(rules).toContain("exists(userDocPath())");
    expect(rules).toContain("me().active == true");
    expect(rules).toContain("me().role in roles");
    expect(rules).not.toMatch(/\|\|\s*\(\('acarpenRole' in request\.auth\.token\)/);
    expect(rules).not.toMatch(/request\.auth\.token\.role\b/);
    expect(rules).toContain("isSameTenant");
    expect(rules).toContain("incomingTenantValid");
    expect(rules).not.toContain("siteSettings");
    expect(rules).not.toContain("blogPosts");
  });

  it("separates PII/financial acarpen_quotes from workshop acarpen_production_orders and locks tracking to two-factor hashes", () => {
    const quotesBlock =
      rules.match(/match \/acarpen_quotes\/\{id\}[\s\S]*?match \/acarpen_production_orders\/\{id\}/)?.[0] ?? "";
    const prodBlock =
      rules.match(/match \/acarpen_production_orders\/\{id\}[\s\S]*?match \/acarpen_order_tracking\/\{id\}/)?.[0] ?? "";
    const trackingBlock =
      rules.match(/match \/acarpen_order_tracking\/\{id\}[\s\S]*?match \/acarpen_rate_limits\/\{id\}/)?.[0] ?? "";

    expect(quotesBlock).not.toMatch(/allow get:\s*if\s*true/);
    expect(quotesBlock).toContain("canSell() || canManageFinance()");
    expect(quotesBlock).toContain("isAssignedOrOwnerless");
    expect(quotesBlock).toContain("validDiscountState");
    expect(quotesBlock).toContain("validQuoteReleaseTransition");
    expect(prodBlock).toContain("isAdminOrStaff()");
    expect(prodBlock).toContain("'estimatedPrice'");
    expect(prodBlock).toContain("'customerName'");
    expect(trackingBlock).toMatch(/allow list:\s*if\s*false/);
    expect(trackingBlock).toContain("^(ORDER|PHONE)_[a-f0-9]{64}$");
  });

  it("blocks all anonymous Firestore lead writes and locks rate-limit counters and audit logs", () => {
    expect(rules).not.toContain("validPublicQuote");
    expect(rules).not.toContain("validPublicMessage");
    expect(rules).not.toContain("validLead");
    expect(rules).toMatch(/match \/acarpen_rate_limits\/\{id\}[\s\S]*allow read, write:\s*if\s*false/);
    expect(rules).toMatch(/match \/acarpen_audit_logs\/\{id\}[\s\S]*allow update, delete:\s*if\s*false/);
    expect(rules).toMatch(/match \/acarpen_audit_logs\/\{id\}[\s\S]*actorUid/);
    expect(rules).toMatch(/match \/users\/\{uid\}[\s\S]*allow write:\s*if\s*isYonetici\(\)/);
    expect(rules).toMatch(/match \/acarpen_prices\/\{id\}[\s\S]*allow write:\s*if\s*canEditPrices\(\)/);
  });

  it("keeps reCAPTCHA / App Check completely removed from Firebase client and CSP", () => {
    const firebaseTs = fs.readFileSync(path.resolve(process.cwd(), "src/lib/firebase.ts"), "utf-8");
    const firebaseJson = fs.readFileSync(path.resolve(process.cwd(), "firebase.json"), "utf-8");
    expect(firebaseTs).not.toMatch(/recaptcha|ReCaptcha|initializeAppCheck/i);
    expect(firebaseJson).not.toMatch(/recaptcha|gstatic\.com\/recaptcha/i);
    expect(firebaseJson).toContain("cloudfunctions.net");
  });
});
