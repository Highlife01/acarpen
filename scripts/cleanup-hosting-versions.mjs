#!/usr/bin/env node
/**
 * Acarpen - Firebase Hosting Sürüm Temizleme Betiği (Son 5 Deploy Kuralı)
 * Resmi Firebase Hosting REST API üzerinden yalnızca en yeni 5 FINALIZED sürümü korur,
 * 5'ten eski FINALIZED sürümleri otomatik olarak siler.
 */

import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const RETENTION_COUNT = 5;

function readConfig() {
  let projectId = "advera-c8dd0";
  let siteId = "acarpen";

  try {
    const firebaserc = JSON.parse(readFileSync(resolve(process.cwd(), ".firebaserc"), "utf8"));
    if (firebaserc?.projects?.default) {
      projectId = firebaserc.projects.default;
    }
  } catch {
    // Varsayılan projectId kullanılır
  }

  try {
    const firebaseJson = JSON.parse(readFileSync(resolve(process.cwd(), "firebase.json"), "utf8"));
    if (firebaseJson?.hosting?.site) {
      siteId = firebaseJson.hosting.site;
    }
  } catch {
    // Varsayılan siteId kullanılır
  }

  return { projectId, siteId };
}

function getAccessToken() {
  return execSync("gcloud auth print-access-token", {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  }).trim();
}

async function fetchAllVersions(projectId, siteId, headers) {
  const versions = [];
  let pageToken = "";

  do {
    const url = new URL(
      `https://firebasehosting.googleapis.com/v1beta1/projects/${projectId}/sites/${siteId}/versions`
    );
    url.searchParams.set("pageSize", "100");
    if (pageToken) {
      url.searchParams.set("pageToken", pageToken);
    }

    const res = await fetch(url, { headers });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data?.error?.message || `HTTP ${res.status}`);
    }
    if (Array.isArray(data.versions)) {
      versions.push(...data.versions);
    }
    pageToken = data.nextPageToken || "";
  } while (pageToken);

  return versions;
}

async function getLatestLiveVersionName(projectId, siteId, headers) {
  try {
    const url = `https://firebasehosting.googleapis.com/v1beta1/projects/${projectId}/sites/${siteId}/releases?pageSize=1`;
    const res = await fetch(url, { headers });
    const data = await res.json();
    return data?.releases?.[0]?.version?.name || null;
  } catch {
    return null;
  }
}

async function deleteVersion(versionName, headers) {
  const url = `https://firebasehosting.googleapis.com/v1beta1/${versionName}`;
  const res = await fetch(url, { method: "DELETE", headers });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`${versionName} silinemedi (${res.status}): ${body}`);
  }
}

async function main() {
  const { projectId, siteId } = readConfig();
  console.log(`\n[Deploy Retention] Firebase Hosting sürüm kontrolü başlatılıyor (${siteId} / ${projectId})...`);

  const token = getAccessToken();
  const headers = {
    Authorization: `Bearer ${token}`,
    "x-goog-user-project": projectId,
  };

  const [allVersions, liveVersionName] = await Promise.all([
    fetchAllVersions(projectId, siteId, headers),
    getLatestLiveVersionName(projectId, siteId, headers),
  ]);

  const finalized = allVersions
    .filter((v) => v.status === "FINALIZED")
    .sort((a, b) => new Date(b.createTime || 0).getTime() - new Date(a.createTime || 0).getTime());

  console.log(`[Deploy Retention] Toplam FINALIZED sürüm: ${finalized.length}, hedef saklama limiti: ${RETENTION_COUNT}`);

  if (finalized.length <= RETENTION_COUNT) {
    console.log(`[Deploy Retention] Silinecek eski sürüm yok; son ${finalized.length} sürüm korunuyor.\n`);
    return;
  }

  const kept = finalized.slice(0, RETENTION_COUNT);
  const candidatesToDelete = finalized.slice(RETENTION_COUNT);
  const toDelete = candidatesToDelete.filter((v) => v.name !== liveVersionName);

  console.log(`[Deploy Retention] Korunan sürümler (${kept.length}): ${kept.map((v) => v.name.split("/").pop()).join(", ")}`);

  let deletedCount = 0;
  for (const version of toDelete) {
    await deleteVersion(version.name, headers);
    deletedCount += 1;
    console.log(`[Deploy Retention] Eski sürüm silindi: ${version.name.split("/").pop()} (${version.createTime})`);
  }

  console.log(`[Deploy Retention] Tamamlandı: ${deletedCount} eski sürüm temizlendi, son ${RETENTION_COUNT} sürüm korundu.\n`);
}

main().catch((err) => {
  console.error(`[Deploy Retention] Hata: ${err instanceof Error ? err.message : String(err)}`);
  process.exitCode = 1;
});
