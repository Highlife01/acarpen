import type { QuoteItem } from "@/lib/erpTypes";

/**
 * Normalizes a Turkish phone number into a pre-filled WhatsApp Web URL.
 */
export function formatWhatsAppUrl(phone: string, text: string): string {
  const digits = (phone || "").replace(/\D/g, "");
  const normalized = digits.startsWith("90")
    ? digits
    : digits.startsWith("0")
    ? `9${digits}`
    : digits.length === 10
    ? `90${digits}`
    : "905336253611";
  return `https://wa.me/${normalized}?text=${encodeURIComponent(text)}`;
}

/**
 * UI badge labels & styles for quote/order statuses.
 */
export const STATUS_LABELS: Record<QuoteItem["status"], { label: string; badge: string }> = {
  new: {
    label: "Yeni Talep",
    badge: "bg-sky-500/15 text-sky-400 border border-sky-500/40",
  },
  in_review: {
    label: "İncelemede",
    badge: "bg-indigo-500/15 text-indigo-400 border border-indigo-500/40",
  },
  quoted: {
    label: "Teklif Verildi",
    badge: "bg-amber-500/15 text-amber-400 border border-amber-500/40",
  },
  approved: {
    label: "Üretimde",
    badge: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/40",
  },
  completed: {
    label: "Teslim Edildi",
    badge: "bg-purple-500/15 text-purple-400 border border-purple-500/40",
  },
  cancelled: {
    label: "İptal",
    badge: "bg-rose-500/15 text-rose-400 border border-rose-500/40",
  },
};
