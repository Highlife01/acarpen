import { describe, it, expect, beforeEach } from "vitest";
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { SiteIntro } from "@/components/site/SiteIntro";
import {
  getCookieConsent,
  setCookieConsent,
  resetCookieConsent,
  trackPageView,
  getVisitorStats,
} from "@/lib/analytics";
import { SEO_KEYWORD_DATABASE, detectKeywordCannibalization } from "@/data/seoKeywordMap";
import { GEO_QUESTIONS_DATABASE } from "@/data/geoQuestionsData";
import { trackConversion, getCroStats } from "@/lib/conversionTracker";
import fs from "fs";
import path from "path";

describe("1. Multilingual Cookie Consent & First-Party Analytics", () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    resetCookieConsent();
  });

  it("should not collect local or GA telemetry before consent or after revocation", () => {
    expect(getCookieConsent()).toBeNull();
    trackPageView("/urunler/oncesi", "İzinsiz Ziyaret");
    expect(getVisitorStats().totalPageviews).toBe(0);
    expect(localStorage.getItem("acarpen_visitor_telemetry_v2")).toBeNull();

    setCookieConsent("granted");
    expect(getCookieConsent()).toBe("granted");
    expect(localStorage.getItem("acarpen_cookie_consent")).toBe("granted");
    expect(document.getElementById("ga4-script")).not.toBeNull();

    const afterGrantViews = getVisitorStats().totalPageviews;
    trackPageView("/urunler/cift-cam", "PVC Pencere Sistemleri");
    const updatedStats = getVisitorStats();
    expect(updatedStats.totalPageviews).toBe(afterGrantViews + 1);
    expect(updatedStats.topPages.some((p) => p.path === "/urunler/cift-cam")).toBe(true);

    // Revoke consent and verify full telemetry wipe + GA disable + script removal
    setCookieConsent("denied");
    expect(getCookieConsent()).toBe("denied");
    expect(getVisitorStats().totalPageviews).toBe(0);
    expect(localStorage.getItem("acarpen_visitor_telemetry_v2")).toBeNull();
    expect(document.getElementById("ga4-script")).toBeNull();
    expect((window as unknown as Record<string, unknown>)["ga-disable-G-ACARPEN001"]).toBe(true);

    trackPageView("/urunler/sonrasi", "Red Sonrası");
    expect(getVisitorStats().totalPageviews).toBe(0);
  });

  it("CookieConsent copy must accurately disclose third-party Google integrations", () => {
    const cookieConsentPath = path.resolve(__dirname, "../components/site/CookieConsent.tsx");
    const content = fs.readFileSync(cookieConsentPath, "utf-8");
    expect(content).not.toContain("asla 3. taraflarla paylaşılmaz");
    expect(content).not.toContain("never sold or shared with third parties");
    expect(content).toContain("Google Analytics");
  });
});

describe("2. Search Engine Verification & Hreflang", () => {
  it("index.html should declare verification meta tags and strictly tr, en, ar hreflang", () => {
    const indexPath = path.resolve(__dirname, "../../index.html");
    const indexContent = fs.readFileSync(indexPath, "utf-8");

    expect(indexContent).not.toContain('content=""');
    expect(indexContent).toContain('rel="canonical" href="https://www.acarpen.com.tr/"');
    expect(indexContent).toContain('hreflang="x-default" href="https://www.acarpen.com.tr/"');
    expect(indexContent).toContain('hreflang="tr" href="https://www.acarpen.com.tr/"');
    expect(indexContent).toContain('hreflang="en" href="https://www.acarpen.com.tr/?lang=en"');
    expect(indexContent).toContain('hreflang="ar" href="https://www.acarpen.com.tr/?lang=ar"');
    expect(indexContent).toContain("acarpen.com.tr");
    expect(indexContent).toContain("acarpen.web.app");
    expect(indexContent).toContain("acarpen.firebaseapp.com");
    expect(indexContent).not.toContain('hreflang="de"');
    expect(indexContent).not.toContain('hreflang="ru"');
  });

  it("NotFound page should enforce noindex so soft-404 routes are not indexed", () => {
    const notFoundPath = path.resolve(__dirname, "../pages/NotFound.tsx");
    const content = fs.readFileSync(notFoundPath, "utf-8");
    expect(content).toContain("noindex");
  });
});

describe("3. IndexNow Automation & Endpoints", () => {
  it("ping-indexnow.mjs should exist, use www.acarpen.com.tr exclusively, and include all 3 endpoints", () => {
    const scriptPath = path.resolve(__dirname, "../../scripts/ping-indexnow.mjs");
    expect(fs.existsSync(scriptPath)).toBe(true);
    const scriptContent = fs.readFileSync(scriptPath, "utf-8");

    expect(scriptContent).toContain("www.acarpen.com.tr");
    expect(scriptContent).not.toContain("acarpen.web.app");
    expect(scriptContent).toContain("https://www.bing.com/indexnow");
    expect(scriptContent).toContain("https://yandex.com/indexnow");
    expect(scriptContent).toContain("https://api.indexnow.org/indexnow");
  });

  it("IndexNow verification key file should exist in public directory", () => {
    const key = "c9e46a782b1d40f28e57f6b9318a4d70";
    const keyPath = path.resolve(__dirname, `../../public/${key}.txt`);
    expect(fs.existsSync(keyPath)).toBe(true);
    expect(fs.readFileSync(keyPath, "utf-8").trim()).toBe(key);
  });
});

describe("4. International SEO & GEO (AI Search Engines)", () => {
  it("llms.txt, llms-full.txt and ai.txt should exist and contain verified Acarpen & colored glass details", () => {
    const llmsPath = path.resolve(__dirname, "../../public/llms.txt");
    const llmsFullPath = path.resolve(__dirname, "../../public/llms-full.txt");
    const aiTxtPath = path.resolve(__dirname, "../../public/ai.txt");

    expect(fs.existsSync(llmsPath)).toBe(true);
    expect(fs.existsSync(llmsFullPath)).toBe(true);
    expect(fs.existsSync(aiTxtPath)).toBe(true);

    const fullContent = fs.readFileSync(llmsFullPath, "utf-8");
    expect(fullContent).toContain("ACAR PEN İNŞAAT SANAYİ VE TİCARET LİMİTED ŞİRKETİ");
    expect(fullContent).toContain("TSE EN 12608-1");
    expect(fullContent).toContain("TSE EN 1279");
    expect(fullContent).toContain("Selenit 75");
    expect(fullContent).toContain("Füme (Gri) & Füme Reflekte Isıcam");
    expect(fullContent).not.toContain("Bottero");
  });

  it("robots.txt should permit AI search crawlers (GEO) and reference llms.txt & ai.txt", () => {
    const robotsPath = path.resolve(__dirname, "../../public/robots.txt");
    expect(fs.existsSync(robotsPath)).toBe(true);
    const robotsContent = fs.readFileSync(robotsPath, "utf-8");

    expect(robotsContent).toContain("User-agent: GPTBot");
    expect(robotsContent).toContain("User-agent: PerplexityBot");
    expect(robotsContent).toContain("User-agent: ClaudeBot");
    expect(robotsContent).toContain("User-agent: Applebot");
    expect(robotsContent).toContain("llms.txt");
    expect(robotsContent).toContain("ai.txt");
  });

  it("prerender script should produce valid semantic static HTML with www.acarpen.com.tr canonical, hreflang and SpeakableSpecification", () => {
    const homeHtmlPath = path.resolve(__dirname, "../../dist/index.html");
    const regionalHtmlPath = path.resolve(__dirname, "../../dist/bolgeler/adana-cam-fabrikasi/index.html");
    expect(fs.existsSync(homeHtmlPath)).toBe(true);
    expect(fs.existsSync(regionalHtmlPath)).toBe(true);

    const homeHtml = fs.readFileSync(homeHtmlPath, "utf-8");
    expect(homeHtml).toContain('rel="canonical" href="https://www.acarpen.com.tr/"');
    expect(homeHtml).toContain('"url": "https://www.acarpen.com.tr/"');

    const html = fs.readFileSync(regionalHtmlPath, "utf-8");
    expect(html).toContain("<title>Adana PVC Pencere, Sürme & Cam Balkon Merkezi | Acarpen</title>");
    expect(html).toContain('rel="canonical" href="https://www.acarpen.com.tr/bolgeler/adana-cam-fabrikasi"');
    expect(html).toContain('hreflang="en" href="https://www.acarpen.com.tr/bolgeler/adana-cam-fabrikasi?lang=en"');
    expect(html).toContain('hreflang="ar" href="https://www.acarpen.com.tr/bolgeler/adana-cam-fabrikasi?lang=ar"');
    expect(html).toContain('id="static-prerender-jsonld"');
    expect(html).toContain("SpeakableSpecification");
    expect(html).toContain("prerender-table");
    expect(html).toContain("prerender-faqs");
  });

  it("sitemap.xml should contain valid www.acarpen.com.tr URLs exclusively and updated lastmod", () => {
    const sitemapPath = path.resolve(__dirname, "../../public/sitemap.xml");
    const content = fs.readFileSync(sitemapPath, "utf-8");
    const locs = [...content.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);

    expect(locs.length).toBeGreaterThanOrEqual(27);
    expect(locs.every((u) => u.startsWith("https://www.acarpen.com.tr/"))).toBe(true);
    expect(content).toContain("<loc>https://www.acarpen.com.tr/</loc>");
    expect(content).toContain("<loc>https://www.acarpen.com.tr/hesaplama</loc>");
    expect(content).toContain("<loc>https://www.acarpen.com.tr/urunler/cift-cam</loc>");
    expect(content).toContain("<loc>https://www.acarpen.com.tr/bolgeler/adana-cam-fabrikasi</loc>");
    expect(content).toMatch(/2026-11-\d{2}/);
    expect(content).not.toContain("acarpen.web.app");
  });

  it("entity.jsonld should exist, declare Organization and WebSite schema for www.acarpen.com.tr", () => {
    const entityPath = path.resolve(__dirname, "../../public/entity.jsonld");
    expect(fs.existsSync(entityPath)).toBe(true);
    const content = fs.readFileSync(entityPath, "utf-8");
    const json = JSON.parse(content);
    expect(json["@context"]).toBe("https://schema.org");
    expect(content).toContain("https://www.acarpen.com.tr/");
    expect(content).not.toContain("acarpen.web.app");
  });

  it("all Acarpen favicon, app icon, manifest and Organization logo assets should exist and be linked", () => {
    const publicDir = path.resolve(__dirname, "../../public");
    const requiredAssets = [
      "favicon.svg",
      "favicon.ico",
      "favicon-32x32.png",
      "favicon-16x16.png",
      "apple-touch-icon.png",
      "pwa-192x192.png",
      "pwa-512x512.png",
      "masked-icon.svg",
      "site.webmanifest",
      "assets/acarpen-logo.png",
    ];
    for (const rel of requiredAssets) {
      expect(fs.existsSync(path.join(publicDir, rel))).toBe(true);
    }

    const indexHtml = fs.readFileSync(path.resolve(__dirname, "../../index.html"), "utf-8");
    expect(indexHtml).toContain('href="/favicon.svg"');
    expect(indexHtml).toContain('href="/favicon-32x32.png"');
    expect(indexHtml).toContain('href="/favicon.ico"');
    expect(indexHtml).toContain('href="/apple-touch-icon.png"');
    expect(indexHtml).toContain('href="/site.webmanifest"');
  });
});

describe("5. Branded Architectural Site Entry Intro & Asset Optimization", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it("stages an optimized uploaded ACARPEN intro logo under 120 KB and wires SiteIntro into App.tsx", () => {
    const logoAssetPath = path.resolve(__dirname, "../assets/acarpen-intro-logo.png");
    expect(fs.existsSync(logoAssetPath)).toBe(true);
    expect(fs.statSync(logoAssetPath).size).toBeLessThan(120 * 1024);

    const appContent = fs.readFileSync(path.resolve(__dirname, "../App.tsx"), "utf-8");
    expect(appContent).toContain("SiteIntro");
  });

  it("renders SiteIntro once per session on public routes, supports instant skip, and skips /admin", () => {
    const { unmount } = render(
      React.createElement(
        MemoryRouter,
        { initialEntries: ["/"] },
        React.createElement(SiteIntro)
      )
    );

    expect(screen.getByTestId("acarpen-site-intro")).toBeInTheDocument();
    expect(screen.getByAltText("ACARPEN PVC Pencere Kapı Cam Balkon Logosu")).toBeInTheDocument();
    expect(sessionStorage.getItem("acarpen_intro_seen")).toBe("1");

    const skipButton = screen.getByRole("button", { name: "Giriş animasyonunu atla" });
    fireEvent.click(skipButton);
    unmount();

    // Subsequent visit in same session must not replay automatically
    render(
      React.createElement(
        MemoryRouter,
        { initialEntries: ["/"] },
        React.createElement(SiteIntro)
      )
    );
    expect(screen.queryByTestId("acarpen-site-intro")).toBeNull();

    // Admin routes must never mount SiteIntro even in a fresh session
    sessionStorage.clear();
    render(
      React.createElement(
        MemoryRouter,
        { initialEntries: ["/admin"] },
        React.createElement(SiteIntro)
      )
    );
    expect(screen.queryByTestId("acarpen-site-intro")).toBeNull();
  });
});

describe("6. SEO + GEO Master Audit, Keyword Strategy & CRO Conversion Gating", () => {
  beforeEach(() => {
    localStorage.clear();
    resetCookieConsent();
  });

  it("should provide 300+ unique SEO/GEO queries with zero keyword cannibalization conflicts", () => {
    expect(SEO_KEYWORD_DATABASE.length).toBeGreaterThanOrEqual(300);
    const conflicts = detectKeywordCannibalization();
    expect(conflicts).toEqual([]);
  });

  it("should provide 100+ verified GEO Q&As across all core service categories", () => {
    expect(GEO_QUESTIONS_DATABASE.length).toBeGreaterThanOrEqual(100);
    for (const q of GEO_QUESTIONS_DATABASE) {
      expect(q.question.length).toBeGreaterThan(10);
      expect(q.answer.length).toBeGreaterThan(30);
      expect(q.targetUrl.startsWith("/")).toBe(true);
    }
  });

  it("prerendered dist/404.html and dist/admin/index.html must enforce noindex and strip fake ratings/unverified claims", () => {
    const notFoundPath = path.resolve(__dirname, "../../dist/404.html");
    const adminPath = path.resolve(__dirname, "../../dist/admin/index.html");
    const homeHtmlPath = path.resolve(__dirname, "../../dist/index.html");

    expect(fs.existsSync(notFoundPath)).toBe(true);
    expect(fs.existsSync(adminPath)).toBe(true);

    const notFoundHtml = fs.readFileSync(notFoundPath, "utf-8");
    expect(notFoundHtml).toContain("noindex");
    expect(notFoundHtml).not.toMatch(/<link\b[^>]*rel=["']canonical["']/i);

    const adminHtml = fs.readFileSync(adminPath, "utf-8");
    expect(adminHtml).toContain("noindex, nofollow, noarchive");

    const homeHtml = fs.readFileSync(homeHtmlPath, "utf-8");
    expect(homeHtml).not.toMatch(/yetkili\s*(?:üretici\s*)?bayi/i);
    expect(homeHtml).not.toContain("AggregateRating");
  });

  it("CRO conversionTracker should strictly respect cookie consent and purge data on revocation", () => {
    expect(getCroStats().whatsappClicks).toBe(0);
    trackConversion("whatsapp_click", "İzinsiz Test");
    expect(getCroStats().whatsappClicks).toBe(0);

    setCookieConsent("granted");
    trackConversion("whatsapp_click", "İzinli Test");
    expect(getCroStats().whatsappClicks).toBe(1);
    expect(getCroStats().recentEvents.length).toBe(1);

    setCookieConsent("denied");
    expect(getCroStats().whatsappClicks).toBe(0);
    expect(localStorage.getItem("acarpen_cro_funnel_v1")).toBeNull();
  });
});
