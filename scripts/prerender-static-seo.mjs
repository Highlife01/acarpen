#!/usr/bin/env node
/**
 * Acarpen — Build-time Static SEO & Pre-rendering Engine
 *
 * Requirements:
 * 1. Reads public/sitemap.xml and ensures every canonical URL produces dist/<route>/index.html
 * 2. Injects unique <title>, <meta name="description">, <link rel="canonical" href="ANA_DOMAIN/<route>" />
 * 3. Injects OpenGraph/Twitter meta tags
 * 4. Injects semantic bot-readable HTML inside <div id="root"><main><article><h1>...</h1><p>...</p></article></main></div>
 * 5. Emits dist/admin/index.html (noindex, nofollow, noarchive) and dist/404.html (genuine 404, noindex)
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { main, ROUTES, BASE_URL } from "./prerender-seo-geo.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const sitemapPath = path.join(rootDir, "public", "sitemap.xml");

if (fs.existsSync(sitemapPath)) {
  const sitemapXml = fs.readFileSync(sitemapPath, "utf-8");
  const sitemapUrls = [...sitemapXml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1].trim());
  const routePaths = new Set(ROUTES.map((r) => `${BASE_URL}${r.path === "/" ? "/" : r.path}`));

  for (const url of sitemapUrls) {
    if (!routePaths.has(url)) {
      console.warn(`[Static SEO Prerender Uyarı] Sitemap URL'si rota tablosunda bulunamadı: ${url}`);
    }
  }
}

main()
  .then((count) => {
    console.log(`[Static SEO Prerender] ${count} statik HTML sayfası başarıyla oluşturuldu.`);
  })
  .catch((err) => {
    console.error("[Static SEO Prerender Hata]:", err);
    process.exit(1);
  });
