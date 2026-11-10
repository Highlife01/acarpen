#!/usr/bin/env node
/**
 * Acarpen - Dayanıklı ve Çok Uç Noktalı IndexNow Gönderim Otomasyonu
 *
 * Bing, Copilot, Yahoo, Yandex, Seznam ve Naver arama motorlarına
 * site haritasındaki tüm URL'leri anında indeksleme için sırayla bildirir.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

const PRIMARY_HOST = process.env.INDEXNOW_HOST || "www.acarpen.com.tr";
const SECONDARY_HOST = "acarpen.web.app";
const INDEXNOW_KEY = process.env.INDEXNOW_KEY || "c9e46a782b1d40f28e57f6b9318a4d70";

const keyFilePath = path.join(rootDir, "public", `${INDEXNOW_KEY}.txt`);
if (!fs.existsSync(keyFilePath)) {
  fs.writeFileSync(keyFilePath, INDEXNOW_KEY, "utf-8");
  console.log(`[IndexNow] Anahtar doğrulama dosyası oluşturuldu: public/${INDEXNOW_KEY}.txt`);
}

const sitemapPath = path.join(rootDir, "public", "sitemap.xml");
if (!fs.existsSync(sitemapPath)) {
  console.error(`[IndexNow HATA] Sitemap dosyası bulunamadı: ${sitemapPath}`);
  process.exit(1);
}

const sitemapContent = fs.readFileSync(sitemapPath, "utf-8");
const urlMatches = [...sitemapContent.matchAll(/<loc>(.*?)<\/loc>/g)];
const urls = Array.from(new Set(urlMatches.map((m) => m[1].trim()))).filter((u) => u.startsWith("http"));

if (urls.length === 0) {
  console.error("[IndexNow HATA] sitemap.xml içerisinde geçerli URL bulunamadı!");
  process.exit(1);
}

console.log(`\n======================================================`);
console.log(`🚀 Acarpen IndexNow Otomasyonu Başlatıldı`);
console.log(`======================================================`);
console.log(`• Birincil Host: ${PRIMARY_HOST}`);
console.log(`• İkincil Host: ${SECONDARY_HOST}`);
console.log(`• Toplam İndekslenecek URL: ${urls.length} adet`);
console.log(`• Doğrulama Dosyası: https://${PRIMARY_HOST}/${INDEXNOW_KEY}.txt`);

const ENDPOINTS = [
  {
    name: "Bing (Microsoft & Copilot & Yahoo & Seznam & Naver)",
    url: "https://www.bing.com/indexnow",
  },
  {
    name: "Yandex Webmaster IndexNow",
    url: "https://yandex.com/indexnow",
  },
  {
    name: "IndexNow Central API (api.indexnow.org)",
    url: "https://api.indexnow.org/indexnow",
  },
];

async function pingEndpointForHost(endpoint, hostName, urlList) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  const payload = {
    host: hostName,
    key: INDEXNOW_KEY,
    keyLocation: `https://${hostName}/${INDEXNOW_KEY}.txt`,
    urlList: urlList.map((u) => {
      try {
        const parsed = new URL(u);
        parsed.host = hostName;
        return parsed.toString();
      } catch {
        return u;
      }
    }),
  };

  try {
    const startTime = Date.now();
    const response = await fetch(endpoint.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "User-Agent": "Acarpen-IndexNow-Ping/2.0 (+https://www.acarpen.com.tr)",
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    const duration = Date.now() - startTime;
    const status = response.status;
    const statusText = response.statusText;

    if (status === 200 || status === 202) {
      console.log(`✅ [${endpoint.name}] (${hostName}) BAŞARILI! (HTTP ${status} ${statusText} - ${duration}ms)`);
      return { success: true, status, duration };
    } else {
      console.warn(`⚠️ [${endpoint.name}] (${hostName}) Yanıt Kodu: HTTP ${status} ${statusText} (${duration}ms)`);
      return { success: false, status, duration };
    }
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === "AbortError") {
      console.error(`⏱️ [${endpoint.name}] (${hostName}) ZAMAN AŞIMI (10.000ms aşıldı)`);
    } else {
      console.error(`❌ [${endpoint.name}] (${hostName}) Ağ/İletişim Hatası: ${error.message}`);
    }
    return { success: false, error: error.message };
  }
}

async function run() {
  let anySuccess = false;
  const results = [];

  for (const host of [PRIMARY_HOST, SECONDARY_HOST]) {
    console.log(`\n------------------------------------------------------`);
    console.log(`🌐 Dağıtım Başlatılıyor: ${host}`);
    console.log(`------------------------------------------------------`);

    for (const endpoint of ENDPOINTS) {
      const res = await pingEndpointForHost(endpoint, host, urls);
      results.push({ host, ...endpoint, ...res });
      if (res.success) {
        anySuccess = true;
      }
    }
  }

  console.log(`\n======================================================`);
  console.log(`📊 IndexNow Gönderim Özeti:`);
  console.log(`======================================================`);
  results.forEach((r) => {
    const icon = r.success ? "✅" : "⚠️";
    console.log(`${icon} [${r.host}] ${r.name}: ${r.success ? `Başarılı (HTTP ${r.status})` : `HTTP ${r.status || "Hata"}`}`);
  });

  if (anySuccess) {
    console.log(`\n🎉 Tebrikler! ${urls.length} adet URL arama motorlarına başarıyla iletildi.\n`);
    process.exit(0);
  } else {
    console.error(`\n❌ Tüm uç noktalar yanıt vermedi veya hata döndürdü.\n`);
    process.exit(0);
  }
}

run();
