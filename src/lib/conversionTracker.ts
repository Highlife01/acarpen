import {
  AnalyticsEventParams,
  CookieConsentStatus,
  getCookieConsent,
  subscribeCookieConsent,
  trackEvent,
} from "@/lib/analytics";

export type CroConversionType =
  | "whatsapp_click"
  | "phone_click"
  | "quote_form_submit"
  | "calculator_used"
  | "order_lookup"
  | "region_cta_click"
  | "catalog_download";

export interface CroConversionRecord {
  id: string;
  type: CroConversionType;
  label: string;
  path: string;
  timestamp: number;
}

export interface CroFunnelStats {
  whatsappClicks: number;
  phoneClicks: number;
  quoteSubmits: number;
  calculatorUses: number;
  orderLookups: number;
  regionCtaClicks: number;
  catalogDownloads: number;
  recentEvents: CroConversionRecord[];
}

const CRO_STORAGE_KEY = "acarpen_cro_funnel_v1";

function createEmptyCroStats(): CroFunnelStats {
  return {
    whatsappClicks: 0,
    phoneClicks: 0,
    quoteSubmits: 0,
    calculatorUses: 0,
    orderLookups: 0,
    regionCtaClicks: 0,
    catalogDownloads: 0,
    recentEvents: [],
  };
}

let memoryStats: CroFunnelStats = createEmptyCroStats();
const listeners = new Set<(stats: CroFunnelStats) => void>();
let consentSubscribed = false;

function readStoredCroStats(): CroFunnelStats {
  try {
    if (getCookieConsent() !== "granted") {
      return createEmptyCroStats();
    }
    const raw = localStorage.getItem(CRO_STORAGE_KEY);
    if (!raw) return createEmptyCroStats();
    const parsed = JSON.parse(raw) as Partial<CroFunnelStats>;
    return {
      ...createEmptyCroStats(),
      ...parsed,
      recentEvents: Array.isArray(parsed.recentEvents) ? parsed.recentEvents : [],
    };
  } catch {
    return createEmptyCroStats();
  }
}

function saveCroStats(stats: CroFunnelStats) {
  memoryStats = stats;
  try {
    if (getCookieConsent() === "granted") {
      localStorage.setItem(CRO_STORAGE_KEY, JSON.stringify(stats));
    } else {
      localStorage.removeItem(CRO_STORAGE_KEY);
    }
  } catch {
    // ignore storage errors
  }
  listeners.forEach((cb) => cb(stats));
}

function ensureConsentSync() {
  if (consentSubscribed) return;
  consentSubscribed = true;
  if (typeof window !== "undefined") {
    memoryStats = readStoredCroStats();
    subscribeCookieConsent((status: CookieConsentStatus) => {
      if (status !== "granted") {
        memoryStats = createEmptyCroStats();
        try {
          localStorage.removeItem(CRO_STORAGE_KEY);
        } catch {
          // ignore
        }
        listeners.forEach((cb) => cb(memoryStats));
      } else {
        memoryStats = readStoredCroStats();
        listeners.forEach((cb) => cb(memoryStats));
      }
    });
  }
}

const TYPE_TO_FIELD: Record<CroConversionType, keyof Omit<CroFunnelStats, "recentEvents">> = {
  whatsapp_click: "whatsappClicks",
  phone_click: "phoneClicks",
  quote_form_submit: "quoteSubmits",
  calculator_used: "calculatorUses",
  order_lookup: "orderLookups",
  region_cta_click: "regionCtaClicks",
  catalog_download: "catalogDownloads",
};

/**
 * Records a privacy-compliant (consent-gated) CRO conversion event and forwards it to GA4/gtag.
 */
export function trackConversion(
  type: CroConversionType,
  label: string,
  extraParams?: AnalyticsEventParams
) {
  ensureConsentSync();

  const currentPath =
    typeof window !== "undefined" ? window.location.pathname || "/" : "/";

  trackEvent(type, {
    event_category: "cro_conversion",
    event_label: label,
    page_path: currentPath,
    ...extraParams,
  });

  if (getCookieConsent() !== "granted") {
    return;
  }

  const prev = readStoredCroStats();
  const field = TYPE_TO_FIELD[type];
  const entry: CroConversionRecord = {
    id: `cro-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
    type,
    label,
    path: currentPath,
    timestamp: Date.now(),
  };

  const next: CroFunnelStats = {
    ...prev,
    [field]: (prev[field] || 0) + 1,
    recentEvents: [entry, ...prev.recentEvents].slice(0, 60),
  };
  saveCroStats(next);
}

export function getCroStats(): CroFunnelStats {
  ensureConsentSync();
  return getCookieConsent() === "granted" ? readStoredCroStats() : createEmptyCroStats();
}

export function subscribeCroStats(cb: (stats: CroFunnelStats) => void): () => void {
  ensureConsentSync();
  listeners.add(cb);
  cb(getCroStats());
  return () => listeners.delete(cb);
}
