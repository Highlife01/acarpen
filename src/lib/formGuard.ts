const COOLDOWN_PREFIX = "acarpen_form_cooldown_";
const inMemoryCooldown = new Map<string, number>();

export function isHoneypotTripped(trapValue: string): boolean {
  return (trapValue || "").trim().length > 0;
}

export interface PublicLeadValidationInput {
  name: string;
  phone: string;
  email?: string;
  details?: string;
}

export interface PublicLeadValidationResult {
  ok: boolean;
  error?: string;
  normalizedDigits?: string;
}

/** Validate visitor-submitted lead/quote fields before persisting or dispatching. */
export function validatePublicLeadInput(input: PublicLeadValidationInput): PublicLeadValidationResult {
  const cleanName = (input.name || "").trim();
  const digits = (input.phone || "").replace(/\D+/g, "");
  const cleanEmail = (input.email || "").trim();
  const cleanDetails = (input.details || "").trim();

  if (cleanName.length < 2 || cleanName.length > 100) {
    return {
      ok: false,
      error: "Lütfen geçerli bir Ad Soyad / Firma bilgisi giriniz (2-100 karakter).",
    };
  }

  if (digits.length < 10 || digits.length > 15) {
    return {
      ok: false,
      error: "Lütfen en az 10 haneli geçerli bir telefon numarası giriniz (Örn: 05XX XXX XX XX).",
    };
  }

  if (cleanEmail && cleanEmail !== "-" && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(cleanEmail)) {
    return {
      ok: false,
      error: "Lütfen geçerli bir e-posta adresi giriniz veya alanı boş bırakınız.",
    };
  }

  if (cleanDetails.length > 2500) {
    return {
      ok: false,
      error: "Mesaj / ölçü detayı en fazla 2500 karakter olabilir.",
    };
  }

  return { ok: true, normalizedDigits: digits };
}

function readCooldownTimestamp(formKey: string): number {
  const mem = inMemoryCooldown.get(formKey);
  if (typeof mem === "number") return mem;
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      const raw = window.localStorage.getItem(`${COOLDOWN_PREFIX}${formKey}`);
      const parsed = raw ? Number(raw) : 0;
      if (Number.isFinite(parsed) && parsed > 0) return parsed;
    }
  } catch {
    // Ignore restricted storage contexts
  }
  return 0;
}

/** Check whether the client has waited long enough since the last form submission. */
export function checkSubmissionCooldown(
  formKey: string,
  cooldownMs = 30_000,
  now = Date.now()
): { allowed: boolean; waitSeconds: number } {
  const lastAt = readCooldownTimestamp(formKey);
  if (!lastAt || now - lastAt >= cooldownMs) {
    return { allowed: true, waitSeconds: 0 };
  }
  const waitSeconds = Math.max(1, Math.ceil((cooldownMs - (now - lastAt)) / 1000));
  return { allowed: false, waitSeconds };
}

export function markFormSubmitted(formKey: string, now = Date.now()): void {
  inMemoryCooldown.set(formKey, now);
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.setItem(`${COOLDOWN_PREFIX}${formKey}`, String(now));
    }
  } catch {
    // Ignore restricted storage contexts
  }
}

export function resetSubmissionCooldown(formKey?: string): void {
  if (formKey) {
    inMemoryCooldown.delete(formKey);
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.removeItem(`${COOLDOWN_PREFIX}${formKey}`);
      }
    } catch {
      // Ignore
    }
    return;
  }
  inMemoryCooldown.clear();
}
