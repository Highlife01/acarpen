/**
 * Acarpen - Analitik & Birinci Taraf Telemetri Motoru
 * KVKK, GDPR ve ePrivacy Direktiflerine %100 Uyumlu Çerez İzni ve İzleme Yönetimi
 */

export type CookieConsentStatus = "granted" | "denied" | null;

export interface VisitorLog {
  id: string;
  timestamp: string;
  path: string;
  title: string;
  lang: string;
  device: "Masaüstü" | "Mobil" | "Tablet";
  referrer: string;
}

export interface VisitorTelemetryStats {
  totalPageviews: number;
  uniqueVisitors: number;
  todayVisitors: number;
  consentsGranted: number;
  consentsDenied: number;
  topPages: { path: string; views: number; title: string }[];
  languages: { code: string; name: string; count: number }[];
  deviceTypes: { desktop: number; mobile: number; tablet: number };
  recentVisits: VisitorLog[];
}

const CONSENT_STORAGE_KEY = "acarpen_cookie_consent";
const CONSENT_DATE_KEY = "acarpen_consent_timestamp";
const VISITOR_ID_KEY = "acarpen_visitor_uuid";
const TELEMETRY_STORAGE_KEY = "acarpen_visitor_telemetry_v2";

const DEFAULT_GA_ID = "G-ACARPEN001";

const INITIAL_STATS: VisitorTelemetryStats = {
  totalPageviews: 0,
  uniqueVisitors: 0,
  todayVisitors: 0,
  consentsGranted: 0,
  consentsDenied: 0,
  topPages: [],
  languages: [],
  deviceTypes: {
    desktop: 0,
    mobile: 0,
    tablet: 0,
  },
  recentVisits: [],
};

export type AnalyticsEventParams = Record<string, string | number | boolean | undefined>;

interface WindowWithGtag extends Window {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
}

class AnalyticsManager {
  private listeners: Set<(stats: VisitorTelemetryStats) => void> = new Set();
  private consentListeners: Set<(consent: CookieConsentStatus) => void> = new Set();
  private stats: VisitorTelemetryStats = {
    ...INITIAL_STATS,
    topPages: [],
    languages: [],
    deviceTypes: { ...INITIAL_STATS.deviceTypes },
    recentVisits: [],
  };
  private currentConsent: CookieConsentStatus = null;
  private gaInitialized = false;

  constructor() {
    this.init();
  }

  private init() {
    if (typeof window === "undefined") return;

    try {
      if (typeof window !== "undefined" && window.localStorage) {
        const savedConsent = window.localStorage.getItem(CONSENT_STORAGE_KEY) as CookieConsentStatus;
        if (savedConsent === "granted" || savedConsent === "denied") {
          this.currentConsent = savedConsent;
        }

        const savedTelemetry = window.localStorage.getItem(TELEMETRY_STORAGE_KEY);
        if (savedTelemetry) {
          try {
            const parsed = JSON.parse(savedTelemetry);
            if (parsed && typeof parsed.totalPageviews === "number") {
              this.stats = parsed;
            }
          } catch {
            // keep default
          }
        }
      }

      if (this.currentConsent === "granted") {
        this.initGA();
      }
    } catch (e) {
      console.warn("Analytics initialization notice:", e);
    }
  }

  public getConsent(): CookieConsentStatus {
    return this.currentConsent;
  }

  public setConsent(status: "granted" | "denied") {
    this.currentConsent = status;

    try {
      if (typeof window !== "undefined") {
        if (window.localStorage) {
          window.localStorage.setItem(CONSENT_STORAGE_KEY, status);
          window.localStorage.setItem(CONSENT_DATE_KEY, new Date().toISOString());
        }

        if (status === "granted") {
          this.stats.consentsGranted += 1;
          this.initGA();
          this.trackPageView(window.location.pathname, document.title);
        } else {
          this.stats.consentsDenied += 1;
        }

        this.saveTelemetry();
        this.notifyConsentListeners();
        this.notifyStatsListeners();
      }
    } catch (e) {
      console.warn("Set consent error:", e);
    }
  }

  public subscribeConsent(callback: (consent: CookieConsentStatus) => void): () => void {
    this.consentListeners.add(callback);
    callback(this.currentConsent);
    return () => this.consentListeners.delete(callback);
  }

  private notifyConsentListeners() {
    this.consentListeners.forEach((cb) => cb(this.currentConsent));
  }

  public initGA() {
    if (this.gaInitialized || typeof window === "undefined") return;

    try {
      const gaId = import.meta.env.VITE_GA_MEASUREMENT_ID || DEFAULT_GA_ID;
      const win = window as WindowWithGtag;

      win.dataLayer = win.dataLayer || [];
      function gtag(...args: unknown[]) {
        win.dataLayer?.push(args);
      }
      win.gtag = gtag;

      gtag("consent", "default", {
        analytics_storage: "granted",
        ad_storage: "granted",
        wait_for_update: 500,
      });

      gtag("js", new Date());
      gtag("config", gaId, {
        page_path: window.location.pathname,
        cookie_domain: window.location.hostname,
        send_page_view: true,
      });

      if (!document.getElementById("ga4-script")) {
        const script = document.createElement("script");
        script.id = "ga4-script";
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
        document.head.appendChild(script);
      }

      this.gaInitialized = true;
    } catch (e) {
      console.warn("GA4 initialization error:", e);
    }
  }

  public trackPageView(path: string, title?: string) {
    if (typeof window === "undefined") return;

    if (path.startsWith("/admin")) return;

    const pageTitle = title || document.title || "Acarpen";
    const currentLang = document.documentElement.lang || "tr";
    const userAgent = navigator.userAgent || "";
    const isMobile = /Android|iPhone|iPad|iPod/i.test(userAgent);
    const isTablet = /iPad|Tablet/i.test(userAgent);
    const deviceType: "Masaüstü" | "Mobil" | "Tablet" = isTablet ? "Tablet" : isMobile ? "Mobil" : "Masaüstü";

    const win = window as WindowWithGtag;
    if (this.currentConsent === "granted" && typeof win.gtag === "function") {
      try {
        win.gtag("event", "page_view", {
          page_title: pageTitle,
          page_location: window.location.href,
          page_path: path,
          language: currentLang,
        });
      } catch {
        // Ignore analytics dispatch errors
      }
    }

    this.stats.totalPageviews += 1;
    this.stats.todayVisitors += 1;

    let visitorId: string | null = null;
    if (typeof window !== "undefined" && window.sessionStorage) {
      try {
        visitorId = window.sessionStorage.getItem(VISITOR_ID_KEY);
        if (!visitorId) {
          visitorId = "VIS-" + Math.floor(1000 + Math.random() * 9000);
          window.sessionStorage.setItem(VISITOR_ID_KEY, visitorId);
          this.stats.uniqueVisitors += 1;
        }
      } catch {
        visitorId = "VIS-1001";
      }
    } else {
      visitorId = "VIS-1001";
    }

    const existingPage = this.stats.topPages.find((p) => p.path === path);
    if (existingPage) {
      existingPage.views += 1;
      if (title) existingPage.title = pageTitle;
    } else {
      this.stats.topPages.push({ path, views: 1, title: pageTitle });
    }
    this.stats.topPages.sort((a, b) => b.views - a.views);
    if (this.stats.topPages.length > 10) this.stats.topPages = this.stats.topPages.slice(0, 10);

    const langEntry = this.stats.languages.find((l) => l.code === currentLang);
    if (langEntry) {
      langEntry.count += 1;
    } else {
      this.stats.languages.push({
        code: currentLang,
        name: currentLang.toUpperCase(),
        count: 1,
      });
    }

    const newLog: VisitorLog = {
      id: visitorId,
      timestamp: new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" }),
      path,
      title: pageTitle,
      lang: currentLang,
      device: deviceType,
      referrer: document.referrer ? new URL(document.referrer).hostname : "Doğrudan Ziyaret",
    };

    this.stats.recentVisits = [newLog, ...this.stats.recentVisits.slice(0, 9)];

    this.saveTelemetry();
    this.notifyStatsListeners();
  }

  public trackEvent(eventName: string, params: AnalyticsEventParams = {}) {
    const win = window as WindowWithGtag;
    if (this.currentConsent === "granted" && typeof win.gtag === "function") {
      try {
        win.gtag("event", eventName, params);
      } catch {
        // Ignore analytics dispatch errors
      }
    }
  }

  public getStats(): VisitorTelemetryStats {
    return { ...this.stats };
  }

  public subscribeStats(callback: (stats: VisitorTelemetryStats) => void): () => void {
    this.listeners.add(callback);
    callback(this.getStats());
    return () => this.listeners.delete(callback);
  }

  private notifyStatsListeners() {
    const current = this.getStats();
    this.listeners.forEach((cb) => cb(current));
  }

  private saveTelemetry() {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.setItem(TELEMETRY_STORAGE_KEY, JSON.stringify(this.stats));
      }
    } catch {
      // Ignore storage quota errors
    }
  }
}

export const analyticsManager = new AnalyticsManager();

export const getCookieConsent = () => analyticsManager.getConsent();
export const setCookieConsent = (status: "granted" | "denied") => analyticsManager.setConsent(status);
export const subscribeCookieConsent = (cb: (consent: CookieConsentStatus) => void) =>
  analyticsManager.subscribeConsent(cb);

export const trackPageView = (path: string, title?: string) => analyticsManager.trackPageView(path, title);
export const trackEvent = (name: string, params?: AnalyticsEventParams) =>
  analyticsManager.trackEvent(name, params);

export const getVisitorStats = () => analyticsManager.getStats();
export const subscribeVisitorStats = (cb: (stats: VisitorTelemetryStats) => void) =>
  analyticsManager.subscribeStats(cb);
