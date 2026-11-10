import { describe, it, expect, beforeEach } from "vitest";
import {
  getCookieConsent,
  setCookieConsent,
  trackPageView,
  getVisitorStats,
} from "@/lib/analytics";
import fs from "fs";
import path from "path";

describe("1. Multilingual Cookie Consent & First-Party Analytics", () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it("should initialize with null consent and update to granted", () => {
    expect(getCookieConsent()).toBeNull();
    setCookieConsent("granted");
    expect(getCookieConsent()).toBe("granted");
    expect(localStorage.getItem("acarpen_cookie_consent")).toBe("granted");
  });

  it("should track pageviews and update visitor telemetry", () => {
    const initialStats = getVisitorStats();
    const initialViews = initialStats.totalPageviews;

    trackPageView("/urunler/cift-cam", "PVC Pencere Sistemleri");

    const updatedStats = getVisitorStats();
    expect(updatedStats.totalPageviews).toBe(initialViews + 1);
    expect(updatedStats.topPages.some((p) => p.path === "/urunler/cift-cam")).toBe(true);
  });
});

describe("2. Search Engine Verification & Hreflang", () => {
  it("index.html should declare verification meta tags and strictly tr, en, ar hreflang", () => {
    const indexPath = path.resolve(__dirname, "../../index.html");
    const indexContent = fs.readFileSync(indexPath, "utf-8");

    expect(indexContent).toContain('name="google-site-verification"');
    expect(indexContent).toContain('name="msvalidate.01"');
    expect(indexContent).toContain('name="yandex-verification"');
    expect(indexContent).toContain('hreflang="x-default"');
    expect(indexContent).toContain('hreflang="tr"');
    expect(indexContent).toContain('hreflang="en"');
    expect(indexContent).toContain('hreflang="ar"');
    expect(indexContent).not.toContain('hreflang="de"');
    expect(indexContent).not.toContain('hreflang="ru"');
  });
});

describe("3. IndexNow Automation & Endpoints", () => {
  it("ping-indexnow.mjs should exist and include all 3 fallback endpoints", () => {
    const scriptPath = path.resolve(__dirname, "../../scripts/ping-indexnow.mjs");
    expect(fs.existsSync(scriptPath)).toBe(true);
    const scriptContent = fs.readFileSync(scriptPath, "utf-8");

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

  it("prerender script should produce valid semantic static HTML with route-specific hreflang and SpeakableSpecification", () => {
    const regionalHtmlPath = path.resolve(__dirname, "../../dist/bolgeler/adana-cam-fabrikasi/index.html");
    expect(fs.existsSync(regionalHtmlPath)).toBe(true);

    const html = fs.readFileSync(regionalHtmlPath, "utf-8");
    expect(html).toContain("<title>Adana Fıratpen Bayisi");
    expect(html).toContain('rel="canonical" href="https://www.acarpen.com.tr/bolgeler/adana-cam-fabrikasi"');
    expect(html).toContain('hreflang="en" href="https://www.acarpen.com.tr/bolgeler/adana-cam-fabrikasi?lang=en"');
    expect(html).toContain('hreflang="ar" href="https://www.acarpen.com.tr/bolgeler/adana-cam-fabrikasi?lang=ar"');
    expect(html).toContain('id="static-prerender-jsonld"');
    expect(html).toContain("SpeakableSpecification");
    expect(html).toContain("prerender-table");
    expect(html).toContain("prerender-faqs");
  });

  it("sitemap.xml should contain valid URLs and updated lastmod", () => {
    const sitemapPath = path.resolve(__dirname, "../../public/sitemap.xml");
    const content = fs.readFileSync(sitemapPath, "utf-8");

    expect(content).toContain("<loc>https://www.acarpen.com.tr/</loc>");
    expect(content).toContain("<loc>https://www.acarpen.com.tr/hesaplama</loc>");
    expect(content).toContain("<loc>https://www.acarpen.com.tr/urunler/cift-cam</loc>");
    expect(content).toContain("<loc>https://www.acarpen.com.tr/bolgeler/adana-cam-fabrikasi</loc>");
    expect(content).toContain("2026-10-26");
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
