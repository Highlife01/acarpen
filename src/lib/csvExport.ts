import type { QuoteItem } from "./erpTypes";

const FORMULA_PREFIX_RE = /^[\s\u00A0]*[=+\-@\t\r]/;

/** Neutralize spreadsheet formula triggers before CSV quoting (OWASP CWE-1236). */
export function sanitizeCsvFormula(raw: string): string {
  if (!raw) return "";
  return FORMULA_PREFIX_RE.test(raw) ? `'${raw}` : raw;
}

/** Escape a single cell per RFC 4180 while neutralizing spreadsheet formulas. */
export function escapeCsvCell(value: unknown): string {
  if (value === null || value === undefined) return '""';
  const raw = sanitizeCsvFormula(String(value));
  const escaped = raw.replace(/"/g, '""');
  return `"${escaped}"`;
}

/** Build a UTF-8 BOM RFC 4180 CSV export of ERP quotes/orders. */
export function buildQuotesCsv(quotes: QuoteItem[]): string {
  const headers = [
    "Teklif No",
    "Surum",
    "Musteri",
    "Santiye/Proje",
    "Telefon",
    "Sehir",
    "Sistem / Profil",
    "Alan (m2)",
    "Net Tutar (TL)",
    "Tahsil Edilen (TL)",
    "Istasyon",
    "Kalite Blokaji",
    "Fatura Ref",
  ];

  const rows = quotes.map((q) =>
    [
      q.id,
      `v${q.version || 1}`,
      q.customerName,
      q.siteName || q.city,
      q.phone,
      q.city,
      q.glassType,
      q.totalArea,
      q.estimatedPrice,
      q.paidAmount || 0,
      q.productionStage || 1,
      q.qualityHold ? "BLOKAJLI" : "UYGUN",
      q.invoiceNo || "",
    ]
      .map(escapeCsvCell)
      .join(",")
  );

  return "\uFEFF" + [headers.map(escapeCsvCell).join(","), ...rows].join("\r\n");
}
