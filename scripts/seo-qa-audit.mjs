import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const distDir = path.join(rootDir, "dist");
const publicDir = path.join(rootDir, "public");

const BASE_URL = "https://www.acarpen.com.tr";

const FORBIDDEN_UNVERIFIED_REGEX =
  /yetkili\s*(?:üretici\s*)?bayi|resmi\s*yetkili|authorized\s*dealer|iso\s*9001|aggregaterating/i;

const failures = [];
const warnings = [];
const passes = [];

function pass(msg) {
  passes.push(msg);
}
function warn(msg) {
  warnings.push(msg);
}
function fail(msg) {
  failures.push(msg);
}

function readUtf8(filePath) {
  return fs.readFileSync(filePath, "utf-8");
}

function auditHtmlFiles() {
  if (!fs.existsSync(distDir)) {
    fail("dist/ klasörü bulunamadı; önce 'npm run build' çalıştırın.");
    return;
  }

  const expectedRoutes = [
    "/",
    "/hesaplama",
    "/hizmetler",
    "/urunler/cift-cam",
    "/urunler/temperli-cam",
    "/urunler/balkon-cami",
    "/urunler/jaluzili-isicam",
    "/urunler/dis-cephe-camlari",
    "/urunler/lamine-cam",
    "/urunler/renkli-camlar",
    "/bolgeler",
    "/bolgeler/adana-cam-fabrikasi",
    "/bolgeler/mersin-cam-imalati",
    "/bolgeler/osmaniye-cam-ureticisi",
    "/bolgeler/hatay-cam-firmalari",
    "/bolgeler/gaziantep-cam-cozumleri",
    "/bolgeler/kayseri-cam-toptan",
    "/bolgeler/nigde-cam-sevkiyati",
    "/rehber",
    "/projeler",
    "/uretim-teknolojisi",
    "/hakkimizda",
    "/iletisim",
    "/siparis-takip",
    "/projeler/cukurova-prestij-konutlari",
    "/projeler/seyhan-modern-rezidans",
    "/projeler/cukurova-panoramik-villa",
  ];

  const seenTitles = new Map();

  for (const route of expectedRoutes) {
    const htmlPath =
      route === "/"
        ? path.join(distDir, "index.html")
        : path.join(distDir, ...route.split("/").filter(Boolean), "index.html");

    if (!fs.existsSync(htmlPath)) {
      fail(`Prerender eksik sayfa: ${route} -> ${path.relative(rootDir, htmlPath)}`);
      continue;
    }

    const html = readUtf8(htmlPath);
    const expectedCanonical = `${BASE_URL}${route === "/" ? "/" : route}`;

    const titleMatch = html.match(/<title>(.*?)<\/title>/is);
    const title = titleMatch?.[1]?.trim() || "";
    if (!title) {
      fail(`${route}: Boş <title> etiketi.`);
    } else {
      if (seenTitles.has(title)) {
        fail(`${route}: Tekrarlanan <title> (${seenTitles.get(title)} ile aynı): ${title}`);
      } else {
        seenTitles.set(title, route);
      }
      if (title.length > 88) {
        warn(`${route}: Başlık 88 karakterden uzun (${title.length} kar.): "${title}"`);
      }
    }

    const descMatch = html.match(/<meta\s+name=["']description["']\s+content=(?:"([^"]*)"|'([^']*)')/is);
    const desc = (descMatch?.[1] ?? descMatch?.[2] ?? "").trim();
    if (desc.length < 40) {
      fail(`${route}: Meta description çok kısa veya eksik (${desc.length} kar.).`);
    }

    if (/content=(?:"\s*"|'\s*')/i.test(html.match(/<meta\s+name=["'](?:google-site-verification|msvalidate\.01|yandex-verification)["'][^>]*>/i)?.[0] || "")) {
      fail(`${route}: Boş verification meta etiketi (content="") tespit edildi.`);
    }

    const h1Count = (html.match(/<h1\b/gi) || []).length;
    if (h1Count !== 1) {
      fail(`${route}: Prerender HTML içinde tam 1 adet <h1> beklenirken ${h1Count} adet bulundu.`);
    }

    const canonicalMatch = html.match(/<link\s+rel=["']canonical["']\s+href=(?:"([^"]*)"|'([^']*)')/i);
    const canonicalHref = canonicalMatch?.[1] ?? canonicalMatch?.[2];
    if (!canonicalHref || canonicalHref !== expectedCanonical) {
      fail(`${route}: Canonical uyumsuz. Beklenen: ${expectedCanonical}, Bulunan: ${canonicalHref}`);
    }

    for (const lang of ["x-default", "tr", "en", "ar"]) {
      const re = new RegExp(`<link\\s+rel=["']alternate["']\\s+hreflang=["']${lang}["']`, "i");
      if (!re.test(html)) {
        fail(`${route}: hreflang="${lang}" bağlantısı eksik.`);
      }
    }

    const jsonLdMatch = html.match(/<script\s+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/i);
    if (!jsonLdMatch) {
      fail(`${route}: Statik JSON-LD bloğu bulunamadı.`);
    } else {
      try {
        const parsed = JSON.parse(jsonLdMatch[1]);
        if (!Array.isArray(parsed["@graph"]) || parsed["@graph"].length < 2) {
          fail(`${route}: JSON-LD @graph geçersiz.`);
        }
      } catch (err) {
        fail(`${route}: JSON-LD parse hatası: ${err.message}`);
      }
    }

    if (FORBIDDEN_UNVERIFIED_REGEX.test(html)) {
      const match = html.match(FORBIDDEN_UNVERIFIED_REGEX);
      fail(`${route}: Doğrulanmamış ifade tespit edildi: "${match?.[0]}"`);
    }
  }
  pass(`Prerender kontrolü: ${expectedRoutes.length} kamusal rota benzersiz title, H1=1, canonical, hreflang ve geçerli JSON-LD ile doğrulandı.`);

  // /admin/index.html check
  const adminHtmlPath = path.join(distDir, "admin", "index.html");
  if (!fs.existsSync(adminHtmlPath)) {
    fail("dist/admin/index.html bulunamadı.");
  } else {
    const adminHtml = readUtf8(adminHtmlPath);
    if (!/noindex,\s*nofollow,\s*noarchive/i.test(adminHtml)) {
      fail("dist/admin/index.html içinde 'noindex, nofollow, noarchive' robots etiketi eksik.");
    } else {
      pass("dist/admin/index.html noindex, nofollow, noarchive doğrulandı.");
    }
  }

  // /404.html check
  const notFoundPath = path.join(distDir, "404.html");
  if (!fs.existsSync(notFoundPath)) {
    fail("dist/404.html bulunamadı (gerçek HTTP 404 yanıtı için gereklidir).");
  } else {
    const notFoundHtml = readUtf8(notFoundPath);
    if (!/noindex/i.test(notFoundHtml)) {
      fail("dist/404.html içinde noindex robots meta etiketi eksik.");
    } else if (/<link\s+rel=["']canonical["']/i.test(notFoundHtml)) {
      fail("dist/404.html üzerinde hatalı canonical bağlantısı bulundu.");
    } else {
      pass("dist/404.html gerçek HTTP 404 yapısı (noindex + canonicalsız) doğrulandı.");
    }
  }
}

function auditFirebaseConfig() {
  const fbPath = path.join(rootDir, "firebase.json");
  const fb = JSON.parse(readUtf8(fbPath));
  const rewrites = fb?.hosting?.rewrites || [];
  const hasCatchAllRewrite = rewrites.some(
    (r) => r.source === "**" && r.destination === "/index.html"
  );
  if (hasCatchAllRewrite) {
    fail("firebase.json içinde Soft-404 üreten '** -> /index.html' rewrite kuralı hâlâ mevcut.");
  } else {
    pass("firebase.json Soft-404 catch-all rewrite içermiyor (gerçek HTTP 404 aktif).");
  }

  const redirects = fb?.hosting?.redirects || [];
  if (redirects.length < 25) {
    warn(`firebase.json içinde yalnızca ${redirects.length} adet 301 yönlendirme bulundu.`);
  } else {
    pass(`firebase.json ${redirects.length} adet 301 SEO yönlendirme kuralı doğrulandı.`);
  }
}

function auditSitemapAndCrawlers() {
  const sitemapPath = path.join(publicDir, "sitemap.xml");
  const sitemap = readUtf8(sitemapPath);
  const locs = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1].trim());
  if (locs.length < 25) {
    fail(`public/sitemap.xml içinde beklenenden az URL var: ${locs.length}`);
  }
  for (const loc of locs) {
    if (!loc.startsWith(BASE_URL)) {
      fail(`sitemap.xml kanonik olmayan alan adı içeriyor: ${loc}`);
    }
    if (loc.includes("/admin")) {
      fail(`sitemap.xml admin URL'si sızdırıyor: ${loc}`);
    }
  }
  if (FORBIDDEN_UNVERIFIED_REGEX.test(sitemap)) {
    fail("public/sitemap.xml içinde doğrulanmamış yetkili bayi ifadesi bulundu.");
  } else {
    pass(`public/sitemap.xml (${locs.length} URL) kanonik alan adı ve temiz meta açısından doğrulandı.`);
  }

  for (const fname of ["robots.txt", "llms.txt", "llms-full.txt", "ai.txt"]) {
    const fpath = path.join(publicDir, fname);
    if (!fs.existsSync(fpath)) {
      fail(`public/${fname} eksik.`);
      continue;
    }
    const content = readUtf8(fpath);
    if (FORBIDDEN_UNVERIFIED_REGEX.test(content)) {
      fail(`public/${fname} doğrulanmamış ifade içeriyor.`);
    }
    if (fname === "robots.txt" && !/Disallow:\s*\/admin/i.test(content)) {
      fail("public/robots.txt içinde 'Disallow: /admin' eksik.");
    }
  }
  pass("robots.txt, llms.txt, llms-full.txt ve ai.txt tarayıcı ve yapay zeka uyumu doğrulandı.");
}

function loadTsModule(relPath) {
  const fullPath = path.join(rootDir, relPath);
  const src = readUtf8(fullPath);
  const js = ts.transpileModule(src, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
      esModuleInterop: true,
    },
  }).outputText;
  const mod = { exports: {} };
  vm.runInNewContext(js, { module: mod, exports: mod.exports, console });
  return mod.exports;
}

function auditKeywordAndGeoSources() {
  const kwMod = loadTsModule(path.join("src", "data", "seoKeywordMap.ts"));
  const keywordDb = Array.isArray(kwMod.SEO_KEYWORD_DATABASE) ? kwMod.SEO_KEYWORD_DATABASE : [];
  if (keywordDb.length < 300) {
    fail(`src/data/seoKeywordMap.ts içinde en az 300 sorgu beklenirken ${keywordDb.length} bulundu.`);
  } else {
    pass(`src/data/seoKeywordMap.ts: ${keywordDb.length} benzersiz anahtar kelime sorgusu doğrulandı (>= 300).`);
  }

  const cannibalConflicts = typeof kwMod.detectKeywordCannibalization === "function"
    ? kwMod.detectKeywordCannibalization()
    : [];
  if (cannibalConflicts.length > 0) {
    fail(`src/data/seoKeywordMap.ts içinde ${cannibalConflicts.length} adet yamyamlık (cannibalization) çakışması bulundu.`);
  } else {
    pass("src/data/seoKeywordMap.ts: Yamyamlık (cannibalization) çakışması = 0 doğrulandı.");
  }

  const geoMod = loadTsModule(path.join("src", "data", "geoQuestionsData.ts"));
  const geoDb = Array.isArray(geoMod.GEO_QUESTIONS_DATABASE) ? geoMod.GEO_QUESTIONS_DATABASE : [];
  if (geoDb.length < 100) {
    fail(`src/data/geoQuestionsData.ts içinde en az 100 GEO soru-cevap beklenirken ${geoDb.length} bulundu.`);
  } else {
    pass(`src/data/geoQuestionsData.ts: ${geoDb.length} GEO soru-cevap kaydı doğrulandı (>= 100).`);
  }
}

auditHtmlFiles();
auditFirebaseConfig();
auditSitemapAndCrawlers();
auditKeywordAndGeoSources();

console.log("======================================================");
console.log("🔍 ACARPEN — OTOMATİK TECHNICAL SEO & GEO QA DENETİMİ");
console.log("======================================================");
for (const p of passes) console.log(`✓ PASS: ${p}`);
for (const w of warnings) console.warn(`⚠ WARN: ${w}`);
for (const f of failures) console.error(`✗ FAIL: ${f}`);
console.log("------------------------------------------------------");
console.log(`Özet: ${passes.length} Başarılı | ${warnings.length} Uyarı | ${failures.length} Kritik Hata`);
console.log("======================================================");

if (failures.length > 0) {
  process.exit(1);
}
