import type { PublicOrderTrackingItem, QuoteItem } from "./erpTypes";

const SHA256_K = new Uint32Array([
  0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
  0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
  0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
  0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
  0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
  0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
  0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
  0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
]);

const rotr = (value: number, bits: number) => (value >>> bits) | (value << (32 - bits));

/** Deterministic pure-TS SHA-256 hex digest (works identically in HTTPS, HTTP dev, SSR, and tests). */
export function sha256Hex(message: string): string {
  const utf8 = new TextEncoder().encode(message);
  const bitLen = utf8.length * 8;
  const paddedLen = Math.ceil((utf8.length + 9) / 64) * 64;
  const padded = new Uint8Array(paddedLen);
  padded.set(utf8);
  padded[utf8.length] = 0x80;

  const view = new DataView(padded.buffer);
  view.setUint32(paddedLen - 8, Math.floor(bitLen / 0x100000000), false);
  view.setUint32(paddedLen - 4, bitLen >>> 0, false);

  const hash = new Uint32Array([
    0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
    0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19,
  ]);
  const w = new Uint32Array(64);

  for (let offset = 0; offset < paddedLen; offset += 64) {
    for (let i = 0; i < 16; i += 1) {
      w[i] = view.getUint32(offset + i * 4, false);
    }
    for (let i = 16; i < 64; i += 1) {
      const s0 = rotr(w[i - 15], 7) ^ rotr(w[i - 15], 18) ^ (w[i - 15] >>> 3);
      const s1 = rotr(w[i - 2], 17) ^ rotr(w[i - 2], 19) ^ (w[i - 2] >>> 10);
      w[i] = (w[i - 16] + s0 + w[i - 7] + s1) >>> 0;
    }

    let [a, b, c, d, e, f, g, h] = hash;
    for (let i = 0; i < 64; i += 1) {
      const S1 = rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25);
      const ch = (e & f) ^ (~e & g);
      const temp1 = (h + S1 + ch + SHA256_K[i] + w[i]) >>> 0;
      const S0 = rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22);
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const temp2 = (S0 + maj) >>> 0;

      h = g;
      g = f;
      f = e;
      e = (d + temp1) >>> 0;
      d = c;
      c = b;
      b = a;
      a = (temp1 + temp2) >>> 0;
    }

    hash[0] = (hash[0] + a) >>> 0;
    hash[1] = (hash[1] + b) >>> 0;
    hash[2] = (hash[2] + c) >>> 0;
    hash[3] = (hash[3] + d) >>> 0;
    hash[4] = (hash[4] + e) >>> 0;
    hash[5] = (hash[5] + f) >>> 0;
    hash[6] = (hash[6] + g) >>> 0;
    hash[7] = (hash[7] + h) >>> 0;
  }

  return Array.from(hash)
    .map((word) => word.toString(16).padStart(8, "0"))
    .join("");
}

/** Extract canonical 10-digit Turkish national number (e.g. 5336253611) when valid. */
export function normalizeTrPhone10(phone: string): string {
  const digits = (phone || "").replace(/\D+/g, "");
  if (digits.length === 12 && digits.startsWith("90")) {
    return digits.slice(2);
  }
  if (digits.length === 13 && digits.startsWith("090")) {
    return digits.slice(3);
  }
  if (digits.length === 11 && digits.startsWith("0")) {
    return digits.slice(1);
  }
  if (digits.length === 10 && !digits.startsWith("0")) {
    return digits;
  }
  return "";
}

/** Deterministic non-PII Firestore document ID for single-order tracking lookups. */
export function getOrderTrackingDocId(orderId: string): string {
  const sanitized = orderId
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9_-]/g, "");
  return sanitized ? `ORDER_${sanitized}` : "";
}

/** Deterministic SHA-256 Firestore document ID for hashed-phone remote lookups without storing raw phones. */
export function getPhoneTrackingDocId(phone: string): string | null {
  const canonical10 = normalizeTrPhone10(phone);
  if (!canonical10) return null;
  return `PHONE_${sha256Hex(`acarpen-track-v1:${canonical10}`)}`;
}

/** Mask full customer/company names before exposing status projections publicly. */
export function maskCustomerName(name: string): string {
  const clean = (name || "").trim();
  if (!clean) return "A*** Müşteri";
  return clean
    .split(/\s+/)
    .slice(0, 4)
    .map((word) => {
      if (word.length <= 1) return "*";
      return `${word.slice(0, 1)}***`;
    })
    .join(" ");
}

function defaultStageForStatus(status: QuoteItem["status"]): 1 | 2 | 3 | 4 | 5 | 6 {
  switch (status) {
    case "new":
      return 1;
    case "in_review":
      return 2;
    case "quoted":
      return 3;
    case "approved":
      return 4;
    case "completed":
      return 6;
    default:
      return 1;
  }
}

/** Project an internal QuoteItem onto a strictly sanitized public tracking record (no PII/prices). */
export function toPublicOrderTrackingItem(q: QuoteItem): PublicOrderTrackingItem {
  const stage =
    q.productionStage && q.productionStage >= 1 && q.productionStage <= 6
      ? q.productionStage
      : defaultStageForStatus(q.status);

  const item: PublicOrderTrackingItem = {
    orderId: q.id,
    maskedCustomer: maskCustomerName(q.customerName),
    city: (q.city || "Adana").slice(0, 60),
    glassType: (q.glassType || "PVC Doğrama & Isıcam").slice(0, 120),
    thickness: (q.thickness || "4+16+4 Isıcam").slice(0, 100),
    dimensions: (q.dimensions || "Özel Ölçü").slice(0, 200),
    totalArea: Number(q.totalArea || 0),
    status: q.status,
    productionStage: stage,
    date: q.date || "",
    updatedAt: q.createdAt || Date.now(),
  };

  if (q.stationStatus) item.stationStatus = q.stationStatus;
  if (q.estimatedDeliveryDate) item.estimatedDeliveryDate = q.estimatedDeliveryDate;
  return item;
}
