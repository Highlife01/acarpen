import { QuoteItem } from "@/lib/adminStorage";
import { generateQrSvgMarkup } from "@/lib/qrCode";
import { toast } from "sonner";

/**
 * Safely masks PII (phone or email) when privacy mode is enabled in UI tables.
 */
export function maskPiiText(value: string | undefined, enabled: boolean): string {
  if (!value) return "-";
  if (!enabled) return value;
  const trimmed = value.trim();
  if (trimmed.length <= 4) return "****";
  return `${trimmed.slice(0, 3)}***${trimmed.slice(-3)}`;
}

/**
 * Safe DOM-constructed print window for A4 Proposal & Financial Summary
 */
export function printProposalDocument(q: QuoteItem): void {
  const printWin = window.open("", "_blank", "width=920,height=820");
  if (!printWin) {
    toast.error("Yazdırma penceresi engellendi. Lütfen açılır pencerelere izin verin.");
    return;
  }

  const doc = printWin.document;
  doc.title = `Acarpen — Resmi Fiyat Teklifi (${q.id})`;

  const style = doc.createElement("style");
  style.textContent = `
    @page { size: A4; margin: 14mm; }
    * { box-sizing: border-box; font-family: 'Segoe UI', Arial, sans-serif; }
    body { margin: 0; padding: 20px; color: #0f172a; background: #fff; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 3px solid #0284c7; padding-bottom: 14px; margin-bottom: 20px; }
    .brand { font-size: 22px; font-weight: 900; color: #0f172a; letter-spacing: 0.4px; }
    .sub { font-size: 11px; color: #475569; margin-top: 4px; }
    .badge { display: inline-block; background: #e0f2fe; color: #0369a1; font-weight: 800; padding: 5px 10px; border-radius: 6px; font-family: monospace; font-size: 14px; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 18px; }
    .box { border: 1px solid #cbd5e1; border-radius: 10px; padding: 12px; background: #f8fafc; }
    .box-title { font-size: 10px; font-weight: 800; text-transform: uppercase; color: #64748b; margin-bottom: 6px; }
    .row { font-size: 12px; margin: 4px 0; }
    table { width: 100%; border-collapse: collapse; margin: 16px 0; }
    th { background: #0f172a; color: #fff; text-align: left; padding: 9px 10px; font-size: 11px; text-transform: uppercase; }
    td { padding: 10px; border-bottom: 1px solid #cbd5e1; font-size: 12px; }
    .totals { margin-left: auto; width: 320px; border: 1px solid #cbd5e1; border-radius: 10px; padding: 12px; background: #f8fafc; }
    .t-row { display: flex; justify-content: space-between; font-size: 12px; padding: 4px 0; }
    .t-final { font-size: 16px; font-weight: 900; color: #0284c7; border-top: 2px solid #cbd5e1; padding-top: 8px; margin-top: 6px; }
    .footer { margin-top: 26px; display: flex; justify-content: space-between; align-items: flex-end; border-top: 1px solid #e2e8f0; padding-top: 14px; font-size: 11px; color: #64748b; }
  `;
  doc.head.appendChild(style);

  const body = doc.body;
  body.replaceChildren();

  const header = doc.createElement("div");
  header.className = "header";

  const leftH = doc.createElement("div");
  leftH.style.display = "flex";
  leftH.style.alignItems = "center";
  leftH.style.gap = "12px";

  const logoImg = doc.createElement("img");
  logoImg.src = `${window.location.origin}/favicon.svg`;
  logoImg.alt = "Acarpen Logo";
  logoImg.width = 44;
  logoImg.height = 44;
  logoImg.style.borderRadius = "9px";

  const leftText = doc.createElement("div");
  const brand = doc.createElement("div");
  brand.className = "brand";
  brand.textContent = "ACARPEN — FIRATPEN YETKİLİ ÜRETİCİ BAYİ";
  const sub = doc.createElement("div");
  sub.className = "sub";
  sub.textContent = "Gülbahçesi Mah. 13428 Sok. No:16/17 Seyhan / ADANA • Tel & WhatsApp: 0533 625 36 11";
  leftText.append(brand, sub);
  leftH.append(logoImg, leftText);

  const rightH = doc.createElement("div");
  rightH.style.textAlign = "right";
  const badge = doc.createElement("div");
  badge.className = "badge";
  badge.textContent = `${q.id} (Sürüm v${q.version || 1})`;
  const dateEl = doc.createElement("div");
  dateEl.className = "sub";
  dateEl.textContent = `Tarih: ${q.date} • Fiyat Kaynağı: ${q.priceListVersion || "2026-Liste-v1"}`;
  rightH.append(badge, dateEl);

  header.append(leftH, rightH);
  body.appendChild(header);

  const grid = doc.createElement("div");
  grid.className = "grid";

  const custBox = doc.createElement("div");
  custBox.className = "box";
  const custTitle = doc.createElement("div");
  custTitle.className = "box-title";
  custTitle.textContent = "Müşteri & Şantiye Bilgileri";
  const c1 = doc.createElement("div");
  c1.className = "row";
  c1.textContent = `Müşteri / Firma: ${q.customerName}`;
  const c2 = doc.createElement("div");
  c2.className = "row";
  c2.textContent = `Şantiye / Proje: ${q.siteName || q.city}`;
  const c3 = doc.createElement("div");
  c3.className = "row";
  c3.textContent = `Telefon: ${q.phone} • Şehir: ${q.city}`;
  custBox.append(custTitle, c1, c2, c3);

  const prodBox = doc.createElement("div");
  prodBox.className = "box";
  const prodTitle = doc.createElement("div");
  prodTitle.className = "box-title";
  prodTitle.textContent = "Üretim, Termin & Sözleşme Koşulları";
  const p1 = doc.createElement("div");
  p1.className = "row";
  p1.textContent = `Ödeme Koşulu: ${q.paymentTerms || "%50 Avans + Teslimde"}`;
  const p2 = doc.createElement("div");
  p2.className = "row";
  p2.textContent = `Hedef Termin: ${q.estimatedDeliveryDate || "Planlanıyor"}`;
  const p3 = doc.createElement("div");
  p3.className = "row";
  p3.textContent = `Sevk Aracı / Sehpa: ${q.vehiclePlate || "-"} / ${q.rackNo || "SHP-Standart"}`;
  prodBox.append(prodTitle, p1, p2, p3);

  grid.append(custBox, prodBox);
  body.appendChild(grid);

  const table = doc.createElement("table");
  const thead = doc.createElement("thead");
  const trHead = doc.createElement("tr");
  ["Kalem / Sistem Bileşimi", "Seri & Donanım", "Ölçü / Adet", "Toplam m²", "Tutar (₺)"].forEach((h) => {
    const th = doc.createElement("th");
    th.textContent = h;
    trHead.appendChild(th);
  });
  thead.appendChild(trHead);
  table.appendChild(thead);

  const tbody = doc.createElement("tbody");
  if (q.lines && q.lines.length > 0) {
    q.lines.forEach((line, idx) => {
      const tr = doc.createElement("tr");
      const vals = [
        `${idx + 1}. ${line.glassType} (${line.laminatedOrIgu})`,
        `${line.thickness} • Kenar: ${line.edgeWork} • Delik: ${line.holesCount} • ${line.tempered ? "Temperli" : "Standart"}`,
        `${line.widthMm} x ${line.heightMm} mm (${line.qty} Adet)`,
        `${line.m2.toFixed(2)} m²`,
        `₺${line.lineTotal.toLocaleString("tr-TR")}`,
      ];
      vals.forEach((v) => {
        const td = doc.createElement("td");
        td.textContent = v;
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
  } else {
    const tr = doc.createElement("tr");
    [
      q.glassType,
      `${q.thickness} • Fıratpen & Isıcam`,
      q.dimensions,
      `${q.totalArea} m²`,
      `₺${(q.estimatedPrice || 0).toLocaleString("tr-TR")}`,
    ].forEach((v) => {
      const td = doc.createElement("td");
      td.textContent = v;
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  }
  table.appendChild(tbody);
  body.appendChild(table);

  const totals = doc.createElement("div");
  totals.className = "totals";
  const addTotalRow = (label: string, val: string, isFinal = false) => {
    const r = doc.createElement("div");
    r.className = isFinal ? "t-row t-final" : "t-row";
    const s1 = doc.createElement("span");
    s1.textContent = label;
    const s2 = doc.createElement("span");
    s2.textContent = val;
    r.append(s1, s2);
    totals.appendChild(r);
  };

  const paid = q.paidAmount || 0;
  const remaining = Math.max(0, (q.estimatedPrice || 0) - paid);
  addTotalRow("İskonto Oranı:", `%${q.discountRate || 0}`);
  addTotalRow("Nakliye / Montaj / Ek İşlem:", `₺${(q.extraCost || 0).toLocaleString("tr-TR")}`);
  addTotalRow("Net Toplam Tutar:", `₺${(q.estimatedPrice || 0).toLocaleString("tr-TR")}`, true);
  addTotalRow("Alınan Kapora / Tahsilat:", `₺${paid.toLocaleString("tr-TR")}`);
  addTotalRow("Kalan Açık Bakiye:", `₺${remaining.toLocaleString("tr-TR")}`);
  body.appendChild(totals);

  const footer = doc.createElement("div");
  footer.className = "footer";
  const fText = doc.createElement("div");
  fText.textContent =
    "Bu teklif Acarpen ERP sistemi tarafından oluşturulmuştur. Fıratpen yetkili üretici bayi güvencesi ve TSE standartlarında garantilidir.";
  const qrWrap = doc.createElement("div");
  const trackingUrl = `https://www.acarpen.com.tr/siparis-takip?id=${encodeURIComponent(q.id)}`;
  const svgDoc = new DOMParser().parseFromString(
    generateQrSvgMarkup(trackingUrl, 84, 1),
    "image/svg+xml"
  );
  qrWrap.appendChild(doc.importNode(svgDoc.documentElement, true));
  footer.append(fText, qrWrap);
  body.appendChild(footer);

  setTimeout(() => {
    printWin.focus();
    printWin.print();
  }, 250);
}

/**
 * Safe DOM-constructed print window for 100mm x 150mm Thermal Barcode/QR Label
 */
export function printThermalLabelDocument(q: QuoteItem): void {
  const printWin = window.open("", "_blank", "width=520,height=720");
  if (!printWin) {
    toast.error("Yazdırma penceresi engellendi. Lütfen açılır pencerelere izin verin.");
    return;
  }

  const doc = printWin.document;
  doc.title = `Termal Üretim Etiketi - ${q.id}`;

  const style = doc.createElement("style");
  style.textContent = `
    @page { size: 100mm 150mm; margin: 4mm; }
    * { box-sizing: border-box; font-family: Arial, sans-serif; }
    body { margin: 0; padding: 8px; color: #000; background: #fff; }
    .card { border: 3px solid #000; border-radius: 8px; padding: 10px; }
    .top { border-bottom: 2px solid #000; padding-bottom: 6px; margin-bottom: 8px; display: flex; justify-content: space-between; align-items: center; }
    .title { font-size: 15px; font-weight: 900; }
    .id { font-family: monospace; font-size: 16px; font-weight: 900; background: #000; color: #fff; padding: 3px 7px; border-radius: 4px; }
    .row { font-size: 12px; margin: 5px 0; border-bottom: 1px dashed #94a3b8; padding-bottom: 4px; }
    .lbl { font-weight: 800; text-transform: uppercase; font-size: 10px; color: #334155; display: block; }
    .val { font-size: 13px; font-weight: 900; }
    .qr-box { text-align: center; margin-top: 10px; padding-top: 8px; border-top: 2px solid #000; }
  `;
  doc.head.appendChild(style);

  const card = doc.createElement("div");
  card.className = "card";

  const top = doc.createElement("div");
  top.className = "top";
  const t1 = doc.createElement("div");
  t1.className = "title";
  t1.textContent = "ACARPEN FABRİKA";
  const t2 = doc.createElement("div");
  t2.className = "id";
  t2.textContent = q.id;
  top.append(t1, t2);
  card.appendChild(top);

  const addField = (label: string, value: string) => {
    const r = doc.createElement("div");
    r.className = "row";
    const l = doc.createElement("span");
    l.className = "lbl";
    l.textContent = label;
    const v = doc.createElement("span");
    v.className = "val";
    v.textContent = value;
    r.append(l, v);
    card.appendChild(r);
  };

  addField("Müşteri / Şantiye", `${q.customerName} (${q.siteName || q.city})`);
  addField("Sistem Kombinasyonu", `${q.glassType} • ${q.thickness}`);
  addField("İmalat Ölçüsü & Alan", `${q.dimensions} (${q.totalArea} m²)`);
  addField(
    "Sehpa / Lot / Termin",
    `Sehpa: ${q.rackNo || "SHP-01"} • Lot: ${q.reservedLotNo || "STD"} • Termin: ${q.estimatedDeliveryDate || "-"}`
  );

  const qrBox = doc.createElement("div");
  qrBox.className = "qr-box";
  const trackingUrl = `https://www.acarpen.com.tr/siparis-takip?id=${encodeURIComponent(q.id)}`;
  const svgDoc = new DOMParser().parseFromString(
    generateQrSvgMarkup(trackingUrl, 130, 1),
    "image/svg+xml"
  );
  qrBox.appendChild(doc.importNode(svgDoc.documentElement, true));
  const cap = doc.createElement("div");
  cap.style.fontSize = "10px";
  cap.style.fontWeight = "bold";
  cap.style.marginTop = "4px";
  cap.textContent = "QR OKUTARAK İSTASYON & SEVKIYAT DOĞRULAYIN";
  qrBox.appendChild(cap);

  card.appendChild(qrBox);
  doc.body.replaceChildren(card);

  setTimeout(() => {
    printWin.focus();
    printWin.print();
  }, 250);
}
