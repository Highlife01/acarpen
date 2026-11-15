const crypto = require("crypto");
const functions = require("@google-cloud/functions-framework");
const { initializeApp, getApps } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");
const { getFirestore } = require("firebase-admin/firestore");

const app = getApps().length ? getApps()[0] : initializeApp();
const db = getFirestore(app, "acarpen");
const auth = getAuth(app);

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

function extractUidFromCloudEvent(cloudEvent) {
  const candidates = [
    cloudEvent?.subject,
    cloudEvent?.document,
    cloudEvent?.source,
  ].filter((v) => typeof v === "string" && v.length > 0);

  for (const val of candidates) {
    const match = val.match(/(?:^|\/)users\/([^/?#]+)$/);
    if (match && match[1]) return decodeURIComponent(match[1]);
  }
  return null;
}

/**
 * Eventarc Firestore trigger (`database=acarpen`, `document=users/{uid}`).
 * Merges `acarpenRole` into existing Firebase Auth customClaims without
 * overwriting claims used by sibling apps on project `advera-c8dd0`.
 */
functions.cloudEvent("acarpenSyncStaffClaims", async (cloudEvent) => {
  const uid = extractUidFromCloudEvent(cloudEvent);
  if (!uid) {
    console.warn("acarpenSyncStaffClaims: could not extract uid from event", {
      subject: cloudEvent?.subject,
    });
    return;
  }

  let userRecord;
  try {
    userRecord = await auth.getUser(uid);
  } catch (err) {
    if (err?.code === "auth/user-not-found") {
      console.warn(`acarpenSyncStaffClaims: Auth user not found for uid=${uid}`);
      return;
    }
    throw err;
  }

  const snap = await db.collection("users").doc(uid).get();
  const data = snap.exists ? snap.data() : null;
  const targetRole =
    data && data.active !== false ? normalizeRole(data.role) : null;

  const existingClaims = { ...(userRecord.customClaims || {}) };
  const currentAcarpenRole = existingClaims.acarpenRole ?? null;

  if (currentAcarpenRole === targetRole) {
    return;
  }

  if (targetRole) {
    existingClaims.acarpenRole = targetRole;
  } else {
    delete existingClaims.acarpenRole;
  }

  await auth.setCustomUserClaims(uid, existingClaims);
  console.log(
    `acarpenSyncStaffClaims: uid=${uid} acarpenRole=${targetRole ?? "<removed>"}`
  );
});

const TOKEN_ALPHABET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ"; // 32 chars (bitmask 31, zero bias)
const ALLOWED_ORIGINS = new Set([
  "https://www.acarpen.com.tr",
  "https://acarpen.com.tr",
  "https://acarpen.web.app",
  "https://acarpen.firebaseapp.com",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:4173",
  "http://127.0.0.1:4173",
]);

function sha256Hex(value) {
  return crypto.createHash("sha256").update(value, "utf8").digest("hex");
}

function randomToken(length) {
  const bytes = crypto.randomBytes(length);
  let out = "";
  for (let i = 0; i < length; i += 1) {
    out += TOKEN_ALPHABET[bytes[i] & 31];
  }
  return out;
}

function normalizeTrPhone10(phone) {
  const digits = String(phone || "").replace(/\D+/g, "");
  if (digits.length === 12 && digits.startsWith("90")) return digits.slice(2);
  if (digits.length === 13 && digits.startsWith("090")) return digits.slice(3);
  if (digits.length === 11 && digits.startsWith("0")) return digits.slice(1);
  if (digits.length === 10 && !digits.startsWith("0")) return digits;
  return "";
}

function normalizeOrderId(orderId) {
  return String(orderId || "")
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9_-]/g, "");
}

function normalizeTrackingPin(pin) {
  return String(pin || "")
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "");
}

function getOrderTrackingDocId(orderId, trackingPin) {
  const cleanId = normalizeOrderId(orderId);
  const cleanPin = normalizeTrackingPin(trackingPin);
  if (!cleanId || cleanPin.length < 6) return "";
  return `ORDER_${sha256Hex(`acarpen-order-pin-v2:${cleanId}:${cleanPin}`)}`;
}

function getPhoneTrackingDocId(phone, trackingPin) {
  const phone10 = normalizeTrPhone10(phone);
  const cleanPin = normalizeTrackingPin(trackingPin);
  if (!phone10 || cleanPin.length < 6) return null;
  return `PHONE_${sha256Hex(`acarpen-phone-pin-v2:${phone10}:${cleanPin}`)}`;
}

function inferSystemCategory(glassType) {
  const lower = String(glassType || "").toLowerCase();
  if (lower.includes("balkon")) return "Cam Balkon Sistemleri";
  if (lower.includes("alüminyum") || lower.includes("aluminyum") || lower.includes("panjur")) {
    return "Alüminyum / Panjur Sistemleri";
  }
  if (lower.includes("sürme") || lower.includes("surme") || lower.includes("hebeschiebe")) {
    return "Sürme Doğrama Sistemleri";
  }
  if (lower.includes("winsa") || lower.includes("pimapen") || lower.includes("fıratpen") || lower.includes("firatpen") || lower.includes("pvc")) {
    return "PVC Doğrama Sistemleri";
  }
  return "Özel İmalat & Doğrama";
}

function formatTrNow(now) {
  return new Intl.DateTimeFormat("tr-TR", {
    timeZone: "Europe/Istanbul",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(now));
}

function cleanStr(val, maxLen) {
  if (typeof val !== "string") return "";
  return val.trim().slice(0, maxLen);
}

function extractClientIp(req) {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.trim()) {
    return forwarded.split(",")[0].trim().slice(0, 64);
  }
  return String(req.ip || "unknown").slice(0, 64);
}

async function enforceRateLimit(clientIp, phoneKeySource, now) {
  const ipDocId = `RL_IP_${sha256Hex(`acarpen-rl-ip-v1:${clientIp}`)}`;
  const phoneDocId = phoneKeySource
    ? `RL_PH_${sha256Hex(`acarpen-rl-phone-v1:${phoneKeySource}`)}`
    : null;

  const ipRef = db.collection("acarpen_rate_limits").doc(ipDocId);
  const phoneRef = phoneDocId ? db.collection("acarpen_rate_limits").doc(phoneDocId) : null;

  const TEN_MIN = 10 * 60 * 1000;
  const ONE_HOUR = 60 * 60 * 1000;

  return db.runTransaction(async (tx) => {
    const ipSnap = await tx.get(ipRef);
    const phoneSnap = phoneRef ? await tx.get(phoneRef) : null;

    const ipTimestamps = (ipSnap.exists && Array.isArray(ipSnap.data()?.timestamps)
      ? ipSnap.data().timestamps
      : []
    ).filter((ts) => typeof ts === "number" && now - ts < ONE_HOUR);

    const lastIpAt = ipTimestamps.length ? ipTimestamps[ipTimestamps.length - 1] : 0;
    const recentIp10m = ipTimestamps.filter((ts) => now - ts < TEN_MIN);

    if (lastIpAt && now - lastIpAt < 15_000) {
      return {
        allowed: false,
        retryAfterSec: Math.ceil((15_000 - (now - lastIpAt)) / 1000),
      };
    }
    if (recentIp10m.length >= 6 || ipTimestamps.length >= 15) {
      return { allowed: false, retryAfterSec: 120 };
    }

    let phoneTimestamps = [];
    if (phoneRef && phoneSnap) {
      phoneTimestamps = (phoneSnap.exists && Array.isArray(phoneSnap.data()?.timestamps)
        ? phoneSnap.data().timestamps
        : []
      ).filter((ts) => typeof ts === "number" && now - ts < ONE_HOUR);

      const lastPhoneAt = phoneTimestamps.length
        ? phoneTimestamps[phoneTimestamps.length - 1]
        : 0;
      const recentPhone10m = phoneTimestamps.filter((ts) => now - ts < TEN_MIN);

      if (lastPhoneAt && now - lastPhoneAt < 25_000) {
        return {
          allowed: false,
          retryAfterSec: Math.ceil((25_000 - (now - lastPhoneAt)) / 1000),
        };
      }
      if (recentPhone10m.length >= 3 || phoneTimestamps.length >= 8) {
        return { allowed: false, retryAfterSec: 180 };
      }
    }

    const expireAt = new Date(now + 24 * ONE_HOUR);
    tx.set(ipRef, { timestamps: [...ipTimestamps, now], updatedAt: now, expireAt });
    if (phoneRef) {
      tx.set(phoneRef, { timestamps: [...phoneTimestamps, now], updatedAt: now, expireAt });
    }
    return { allowed: true, retryAfterSec: 0 };
  });
}

/**
 * Isolated HTTPS Cloud Function Gen2 handling anonymous web quote & contact submissions.
 * Enforces server-side origin checks, honeypot/timing validation, Firestore rate limiting,
 * CSPRNG orderId + 6-char trackingPin generation, non-PII workshop/tracking projections,
 * and strict server-controlled default fields without trusting anonymous Firestore writes.
 */
functions.http("acarpenSubmitPublicLead", async (req, res) => {
  const origin = req.headers.origin;
  res.set("Vary", "Origin");
  if (typeof origin === "string" && origin.length > 0) {
    if (!ALLOWED_ORIGINS.has(origin)) {
      return res.status(403).json({ ok: false, error: "Origin not allowed." });
    }
    res.set("Access-Control-Allow-Origin", origin);
    res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.set("Access-Control-Allow-Headers", "Content-Type");
  }

  if (req.method === "OPTIONS") {
    return res.status(204).send("");
  }
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed." });
  }

  const body = req.body && typeof req.body === "object" ? req.body : null;
  if (!body) {
    return res.status(400).json({ ok: false, error: "Geçersiz JSON yükü." });
  }

  // Honeypot check before any database write
  if (typeof body.website === "string" && body.website.trim().length > 0) {
    return res.status(400).json({ ok: false, error: "Geçersiz form gönderimi." });
  }

  if (
    typeof body.formElapsedMs === "number" &&
    Number.isFinite(body.formElapsedMs) &&
    body.formElapsedMs >= 0 &&
    body.formElapsedMs < 800
  ) {
    res.set("Retry-After", "5");
    return res.status(429).json({
      ok: false,
      error: "Çok hızlı form gönderimi algılandı. Lütfen birkaç saniye sonra tekrar deneyin.",
    });
  }

  const kind = body.kind === "contact" ? "contact" : "quote";
  const customerName = cleanStr(body.customerName, 100);
  const phone = cleanStr(body.phone, 24);
  const phoneDigits = phone.replace(/\D+/g, "");
  const phone10 = normalizeTrPhone10(phone);
  const email = cleanStr(body.email, 120);

  if (customerName.length < 2) {
    return res.status(400).json({
      ok: false,
      error: "Lütfen geçerli bir Ad Soyad / Firma bilgisi giriniz (en az 2 karakter).",
    });
  }
  if (phoneDigits.length < 10 || phoneDigits.length > 15) {
    return res.status(400).json({
      ok: false,
      error: "Lütfen en az 10 haneli geçerli bir telefon numarası giriniz.",
    });
  }
  if (email && email !== "-" && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return res.status(400).json({
      ok: false,
      error: "Lütfen geçerli bir e-posta adresi giriniz.",
    });
  }

  const now = Date.now();
  const clientIp = extractClientIp(req);

  try {
    const rateCheck = await enforceRateLimit(clientIp, phone10 || phoneDigits, now);
    if (!rateCheck.allowed) {
      res.set("Retry-After", String(rateCheck.retryAfterSec));
      return res.status(429).json({
        ok: false,
        error: `Çok fazla talep gönderildi. Lütfen ${rateCheck.retryAfterSec} saniye bekleyip tekrar deneyin.`,
      });
    }

    const city = cleanStr(body.city, 80) || "Adana";
    const siteName = cleanStr(body.siteName, 120);
    const leadSource = cleanStr(body.leadSource, 60) || (kind === "contact" ? "İletişim Formu" : "Web Teklif Formu");
    const glassType = cleanStr(body.glassType, 160) || "Fıratpen PVC Doğrama";
    const thickness = cleanStr(body.thickness, 120) || "4+16+4 Isıcam";
    const dimensions = cleanStr(body.dimensions, 500) || "Keşif / Ölçü Bekleniyor";
    const notes = cleanStr(body.notes, 2000);
    const subject = cleanStr(body.subject, 200) || `Teklif Talebi: ${glassType}`;
    const messageBody = cleanStr(body.message, 2500) || notes || "Web formu üzerinden teklif/keşif talebi.";

    const rawArea = Number(body.totalArea);
    const totalArea = Number.isFinite(rawArea) && rawArea >= 0 && rawArea <= 50000
      ? Number(rawArea.toFixed(2))
      : 0;

    const year = new Date(now).getUTCFullYear();
    const orderId = `TKF-${year}-${randomToken(8)}`;
    const trackingPin = randomToken(6);
    const messageId = `MSG-${now.toString().slice(-6)}-${randomToken(4)}`;
    const dateStr = formatTrNow(now);

    const quoteDoc = {
      id: orderId,
      trackingPin,
      customerName,
      phone,
      ...(email && email !== "-" ? { email } : {}),
      city,
      ...(siteName ? { siteName } : {}),
      leadSource,
      glassType,
      thickness,
      dimensions,
      totalArea,
      estimatedPrice: 0,
      estimatedCost: 0,
      actualCost: 0,
      discountRate: 0,
      extraCost: 0,
      paymentStatus: "unpaid",
      paidAmount: 0,
      version: 1,
      priceListVersion: "2026-Liste-v1",
      approvalStatus: "pending_approval",
      routeSteps: [1, 2, 3, 4, 5, 6],
      productionStage: 1,
      stationStatus: "waiting",
      qualityHold: false,
      status: "new",
      ...(notes ? { notes } : {}),
      date: dateStr,
      createdAt: now,
    };

    const productionDoc = {
      id: orderId,
      trackingPin,
      glassType,
      thickness,
      dimensions,
      totalArea,
      routeSteps: [1, 2, 3, 4, 5, 6],
      productionStage: 1,
      stationStatus: "waiting",
      qualityHold: false,
      status: "new",
      ...(notes ? { notes: notes.slice(0, 500) } : {}),
      date: dateStr,
      createdAt: now,
      updatedAt: now,
    };

    const trackingItem = {
      orderId,
      status: "new",
      productionStage: 1,
      stationStatus: "waiting",
      qualityHold: false,
      systemCategory: inferSystemCategory(glassType),
      date: dateStr,
      updatedAt: now,
    };

    const batch = db.batch();
    batch.set(db.collection("acarpen_quotes").doc(orderId), quoteDoc);
    batch.set(db.collection("acarpen_production_orders").doc(orderId), productionDoc);

    const orderTrackId = getOrderTrackingDocId(orderId, trackingPin);
    if (orderTrackId) {
      batch.set(db.collection("acarpen_order_tracking").doc(orderTrackId), trackingItem);
    }

    const phoneTrackId = getPhoneTrackingDocId(phone, trackingPin);
    if (phoneTrackId) {
      batch.set(db.collection("acarpen_order_tracking").doc(phoneTrackId), {
        kind: "phone",
        latestOrderId: orderId,
        entries: { [orderId]: trackingItem },
        updatedAt: now,
      });
    }

    if (kind === "contact") {
      batch.set(db.collection("acarpen_messages").doc(messageId), {
        id: messageId,
        name: customerName,
        phone,
        email: email || "-",
        subject,
        message: messageBody,
        relatedOrderId: orderId,
        date: dateStr,
        createdAt: now,
        isRead: false,
      });
    }

    await batch.commit();

    return res.status(201).json({
      ok: true,
      id: orderId,
      ...(kind === "contact" ? { messageId } : {}),
      trackingPin,
      date: dateStr,
      trackingItem,
    });
  } catch (err) {
    console.error("acarpenSubmitPublicLead failed:", err);
    return res.status(500).json({
      ok: false,
      error: "Talep sunucuya kaydedilemedi. Lütfen kısa süre sonra tekrar deneyin veya WhatsApp üzerinden ulaşın.",
    });
  }
});
