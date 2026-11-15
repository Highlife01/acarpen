#!/usr/bin/env node
/**
 * Acarpen — Firestore (database: acarpen) users/{uid} kayıtlarını
 * Firebase Auth customClaims.acarpenRole alanıyla güvenli biçimde senkronize eder.
 * Diğer projelere ait custom claim alanlarını (ör. admin, role) korur.
 */

import { execSync } from "node:child_process";

const PROJECT_ID = "advera-c8dd0";
const DATABASE_ID = "acarpen";
const VALID_ROLES = new Set([
  "yonetici",
  "satis_yoneticisi",
  "satis",
  "uretim_planlama",
  "operator",
  "kalite",
  "depo_satinalma",
  "finans",
]);

function normalizeRole(raw) {
  if (typeof raw !== "string") return null;
  const clean = raw.trim().toLowerCase();
  if (
    clean === "superadmin" ||
    clean === "super_admin" ||
    clean === "manager" ||
    clean === "admin"
  ) {
    return "yonetici";
  }
  if (clean === "sales") return "satis";
  if (clean === "editor") return "satis_yoneticisi";
  return VALID_ROLES.has(clean) ? clean : null;
}

function getAccessToken() {
  return execSync("gcloud auth print-access-token", {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  }).trim();
}

async function main() {
  const token = getAccessToken();
  const headers = {
    Authorization: `Bearer ${token}`,
    "x-goog-user-project": PROJECT_ID,
    "Content-Type": "application/json",
  };

  const usersRes = await fetch(
    `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/${DATABASE_ID}/documents/users?pageSize=200`,
    { headers }
  );
  if (!usersRes.ok) {
    throw new Error(`Firestore users okunamadı: ${usersRes.status} ${await usersRes.text()}`);
  }
  const usersJson = await usersRes.json();
  const docs = usersJson.documents || [];
  console.log(`[Claims Sync] Toplam Firestore users kaydı: ${docs.length}`);

  for (const docItem of docs) {
    const uid = docItem.name.split("/").pop();
    const fields = docItem.fields || {};
    const active = fields.active?.booleanValue !== false;
    const targetRole = active ? normalizeRole(fields.role?.stringValue) : null;

    const lookupRes = await fetch(
      `https://identitytoolkit.googleapis.com/v1/projects/${PROJECT_ID}/accounts:lookup`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({ localId: [uid] }),
      }
    );
    const lookupJson = await lookupRes.json();
    const user = lookupJson.users?.[0];
    if (!user) {
      console.warn(`[Claims Sync] Auth kullanıcısı bulunamadı: ${uid}`);
      continue;
    }

    let existingClaims = {};
    try {
      existingClaims = user.customAttributes ? JSON.parse(user.customAttributes) : {};
    } catch {
      existingClaims = {};
    }

    const currentAcarpenRole = existingClaims.acarpenRole ?? null;
    if (currentAcarpenRole === targetRole) {
      console.log(`[Claims Sync] ${user.email || uid}: güncel (${targetRole || "<yok>"})`);
      continue;
    }

    if (targetRole) {
      existingClaims.acarpenRole = targetRole;
    } else {
      delete existingClaims.acarpenRole;
    }

    const updRes = await fetch(
      `https://identitytoolkit.googleapis.com/v1/projects/${PROJECT_ID}/accounts:update`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({
          localId: uid,
          customAttributes: JSON.stringify(existingClaims),
        }),
      }
    );
    if (!updRes.ok) {
      throw new Error(`Claim güncellenemedi (${uid}): ${updRes.status} ${await updRes.text()}`);
    }
    console.log(
      `[Claims Sync] Güncellendi -> ${user.email || uid}: acarpenRole=${targetRole || "<kaldırıldı>"}`
    );
  }
}

main().catch((err) => {
  console.error("[Claims Sync HATA]", err.message);
  process.exit(1);
});
