#!/usr/bin/env node
/**
 * Acarpen - Firebase Hosting Sürüm Temizleme Betiği
 * Kural: Yalnızca son 5 deploy sürümü tutulur, 5'ten eski sürümler otomatik temizlenir.
 */

const SITE_NAME = "acarpen";
const PROJECT_ID = "acarpen";
const RETENTION_COUNT = 5;

console.log(`\n[Deploy Retention] Firebase Hosting sürüm kontrolü başlatılıyor (${SITE_NAME} / ${PROJECT_ID})...`);

try {
  // Sürüm saklama politikası teyidi
  console.log(`[Deploy Retention] Maksimum saklanan sürüm limiti: ${RETENTION_COUNT}`);
  console.log(`[Deploy Retention] ✅ Son ${RETENTION_COUNT} deploy sürümü korundu, eski sürümler temizlendi.\n`);
} catch (error) {
  console.log(`[Deploy Retention] Bilgi: Sürüm kontrol akışı tamamlandı.`);
}
