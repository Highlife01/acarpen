import { useEffect, useRef, useState } from "react";
import {
  Timestamp,
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  type DocumentData,
  type Query,
} from "firebase/firestore";
import { getDb } from "@/lib/firebase";
import { toast } from "@/hooks/use-toast";
import { BASE_SERVICES } from "@/content/services";
import type { Lead, LeadNote, LeadStatus, Quote, Role, StaffUser } from "@/lib/types";

/* ---------- Bildirimler ve hata metinleri ---------- */

export function errorMessage(err: unknown): string {
  const code = (err as { code?: string } | null)?.code ?? "";
  if (code.includes("permission-denied") || code.includes("unauthorized")) return "Bu işlem için yetkiniz yok.";
  if (code.includes("unavailable") || code.includes("network") || code.includes("retry-limit")) {
    return "Sunucuya ulaşılamadı. İnternet bağlantınızı kontrol edin.";
  }
  if (code.includes("not-found")) return "Kayıt bulunamadı.";
  if (code.includes("resource-exhausted") || code.includes("quota")) return "İşlem sınırı aşıldı. Lütfen daha sonra tekrar deneyin.";
  return "Lütfen tekrar deneyin.";
}

export const notify = {
  success(title: string, description?: string) {
    toast({ title, description });
  },
  error(title: string, description?: string) {
    toast({ title, description, variant: "destructive" });
  },
  /** Hata nesnesini konsola yazar ve kullanıcıya Türkçe bildirim gösterir. */
  failure(err: unknown, title: string) {
    console.error(title, err);
    toast({ title, description: errorMessage(err), variant: "destructive" });
  },
};

/* ---------- Tarih yardımcıları ---------- */

export function toDate(value: unknown): Date | null {
  if (value === null || value === undefined || value === "") return null;
  if (value instanceof Timestamp) return value.toDate();
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value;
  if (typeof value === "string") return parseIso(value);
  if (typeof value === "number") {
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? null : d;
  }
  if (typeof value === "object") {
    const v = value as { toDate?: () => Date; seconds?: number };
    if (typeof v.toDate === "function") return v.toDate();
    if (typeof v.seconds === "number") return new Date(v.seconds * 1000);
  }
  return null;
}

/** "YYYY-AA-GG" ve "YYYY-AA-GGTSS:dd" değerlerini yerel saat olarak, tam ISO değerlerini olduğu gibi çözer. */
export function parseIso(value: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2}))?$/.exec(value.trim());
  const d = m
    ? new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]), Number(m[4] ?? 0), Number(m[5] ?? 0))
    : new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

const DATE_FMT = new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric" });
const DATETIME_FMT = new Intl.DateTimeFormat("tr-TR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export function formatDate(value: Date | string | null | undefined, withTime = false): string {
  const d = toDate(value);
  if (!d) return "—";
  return (withTime ? DATETIME_FMT : DATE_FMT).format(d);
}

/** Yerel saate göre "YYYY-AA-GG" */
export function dateKey(d: Date): string {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

export function todayKey(): string {
  return dateKey(new Date());
}

/* ---------- Metin yardımcıları ---------- */

const TR_MAP: Record<string, string> = { ç: "c", ğ: "g", ı: "i", ö: "o", ş: "s", ü: "u" };

export function slugify(input: string): string {
  return input
    .toLocaleLowerCase("tr-TR")
    .replace(/[çğıöşü]/g, (ch) => TR_MAP[ch] ?? ch)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
    .replace(/-+$/g, "");
}

export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function trLower(value: string | undefined | null): string {
  return (value ?? "").toLocaleLowerCase("tr-TR");
}

export function phoneDigits(value: string | undefined | null): string {
  return (value ?? "").replace(/\D/g, "");
}

export function isHttpsUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname.includes(".");
  } catch {
    return false;
  }
}

/** Firestore `undefined` değer kabul etmez; iç içe nesnelerden ayıklar. */
export function stripUndefined<T>(value: T): T {
  if (Array.isArray(value)) return value.map((v) => stripUndefined(v)) as unknown as T;
  if (value && typeof value === "object" && Object.getPrototypeOf(value) === Object.prototype) {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      if (v !== undefined) out[k] = stripUndefined(v);
    }
    return out as T;
  }
  return value;
}

/* ---------- CSV ---------- */

function csvCell(value: unknown): string {
  let text = value === null || value === undefined ? "" : String(value);
  // Formül enjeksiyonuna karşı: =, +, -, @ ile başlayan hücreler metin olarak işaretlenir.
  if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`;
  return `"${text.replace(/"/g, '""')}"`;
}

export function buildCsv(headers: string[], rows: unknown[][]): string {
  const lines = [headers, ...rows].map((row) => row.map(csvCell).join(";"));
  return `\uFEFF${lines.join("\r\n")}\r\n`;
}

export function downloadTextFile(filename: string, content: string, mime = "text/csv;charset=utf-8"): void {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/* ---------- Hizmet ve talep yardımcıları ---------- */

const SERVICE_TITLES = new Map(BASE_SERVICES.map((s) => [s.slug, s.title]));

export function serviceTitle(serviceId: string | undefined | null): string {
  if (!serviceId) return "Belirtilmedi";
  return SERVICE_TITLES.get(serviceId) ?? serviceId;
}

export const BASE_SERVICE_OPTIONS = BASE_SERVICES.map((s) => ({ value: s.slug, label: s.title }));

export const UNKNOWN_LABEL = "Bilinmiyor";

export function leadSource(lead: Pick<Lead, "source" | "utm">): string {
  return lead.source?.trim() || lead.utm?.source?.trim() || lead.utm?.utm_source?.trim() || UNKNOWN_LABEL;
}

export function leadCampaign(lead: Pick<Lead, "utm">): string {
  return lead.utm?.campaign?.trim() || lead.utm?.utm_campaign?.trim() || "";
}

export function leadRef(id: string): string {
  return id.slice(0, 8).toUpperCase();
}

export const CLOSED_STATUSES: LeadStatus[] = ["completed", "rejected"];
export const WON_STATUSES: LeadStatus[] = ["accepted", "completed"];

/* ---------- Firestore dönüştürücüler ---------- */

/** `assignedToName`: satış rolü kullanıcı listesini okuyamadığı için sorumlu adı talep üzerinde de tutulur. */
export type AdminLead = Lead & { assignedToName?: string | null };

export function mapLead(id: string, d: DocumentData): AdminLead {
  return {
    ...(d as Omit<Lead, "id" | "createdAt" | "updatedAt">),
    id,
    type: d.type ?? "contact",
    name: String(d.name ?? ""),
    phone: String(d.phone ?? ""),
    phoneNormalized: String(d.phoneNormalized ?? ""),
    serviceId: String(d.serviceId ?? ""),
    status: (d.status ?? "new") as LeadStatus,
    assignedTo: d.assignedTo ?? null,
    assignedToName: d.assignedToName ?? null,
    consent: d.consent ?? { noticeAccepted: true, noticeVersion: "", marketing: false },
    followUpAt: typeof d.followUpAt === "string" ? d.followUpAt : null,
    surveyAt: typeof d.surveyAt === "string" ? d.surveyAt : null,
    createdAt: toDate(d.createdAt),
    updatedAt: toDate(d.updatedAt),
  };
}

export function mapLeadNote(id: string, d: DocumentData): LeadNote {
  return {
    id,
    leadId: String(d.leadId ?? ""),
    authorId: String(d.authorId ?? ""),
    authorName: String(d.authorName ?? ""),
    note: String(d.note ?? ""),
    createdAt: toDate(d.createdAt),
  };
}

export function mapQuote(id: string, d: DocumentData): Quote {
  return {
    id,
    leadId: String(d.leadId ?? ""),
    quoteNumber: String(d.quoteNumber ?? ""),
    customerName: String(d.customerName ?? ""),
    serviceId: String(d.serviceId ?? ""),
    description: String(d.description ?? ""),
    amount: Number(d.amount) || 0,
    currency: String(d.currency ?? "TRY"),
    taxRate: Number.isFinite(Number(d.taxRate)) ? Number(d.taxRate) : 0,
    validUntil: String(d.validUntil ?? ""),
    status: d.status ?? "draft",
    fileUrl: d.fileUrl || undefined,
    createdAt: toDate(d.createdAt),
  };
}

const ROLES: Role[] = ["superadmin", "manager", "sales", "editor"];

export function isRole(value: unknown): value is Role {
  return typeof value === "string" && (ROLES as string[]).includes(value);
}

export function mapStaff(id: string, d: DocumentData): StaffUser {
  return {
    uid: id,
    email: String(d.email ?? ""),
    displayName: String(d.displayName ?? d.email ?? ""),
    role: isRole(d.role) ? d.role : "editor",
    active: d.active === true,
  };
}

/* ---------- Gerçek zamanlı koleksiyon kancası ---------- */

export interface CollectionState<T> {
  data: T[];
  loading: boolean;
  error: string | null;
}

/**
 * `key` değiştiğinde yeniden abone olur; `null` ise abonelik açılmaz
 * (rolün okuma yetkisi olmayan koleksiyonlar için).
 */
export function useCollection<T>(
  key: string | null,
  buildQuery: () => Query<DocumentData>,
  mapDoc: (id: string, data: DocumentData) => T,
): CollectionState<T> {
  const buildRef = useRef(buildQuery);
  buildRef.current = buildQuery;
  const mapRef = useRef(mapDoc);
  mapRef.current = mapDoc;

  const [state, setState] = useState<CollectionState<T>>({ data: [], loading: key !== null, error: null });

  useEffect(() => {
    if (key === null) {
      setState({ data: [], loading: false, error: null });
      return;
    }
    setState({ data: [], loading: true, error: null });
    let unsubscribe = () => {};
    try {
      unsubscribe = onSnapshot(
        buildRef.current(),
        (snap) => {
          setState({
            data: snap.docs.map((d) => mapRef.current(d.id, d.data({ serverTimestamps: "estimate" }))),
            loading: false,
            error: null,
          });
        },
        (err) => {
          console.error(`Koleksiyon okunamadı (${key})`, err);
          setState({ data: [], loading: false, error: `Veriler yüklenemedi. ${errorMessage(err)}` });
        },
      );
    } catch (err) {
      console.error(`Koleksiyon aboneliği açılamadı (${key})`, err);
      setState({ data: [], loading: false, error: `Veriler yüklenemedi. ${errorMessage(err)}` });
    }
    return () => unsubscribe();
  }, [key]);

  return state;
}

export function useLeads(enabled: boolean): CollectionState<AdminLead> {
  return useCollection(
    enabled ? "leads" : null,
    () => query(collection(getDb(), "leads"), orderBy("createdAt", "desc")),
    mapLead,
  );
}

export function useQuotes(enabled: boolean): CollectionState<Quote> {
  return useCollection(enabled ? "quotes" : null, () => query(collection(getDb(), "quotes")), mapQuote);
}

export function useStaffUsers(enabled: boolean): CollectionState<StaffUser> {
  return useCollection(enabled ? "users" : null, () => query(collection(getDb(), "users")), mapStaff);
}

/* ---------- Denetim kaydı ---------- */

export interface AuditActor {
  uid: string;
  displayName: string;
}

/** Denetim kaydı yazılamazsa asıl işlem geri alınmaz; hata yalnızca konsola yazılır. */
export async function logAudit(
  actor: AuditActor | null,
  action: string,
  resourceType: string,
  resourceId: string,
  metadata: Record<string, unknown> = {},
): Promise<void> {
  if (!actor) return;
  try {
    await addDoc(collection(getDb(), "auditLogs"), {
      actorId: actor.uid,
      actorName: actor.displayName,
      action,
      resourceType,
      resourceId,
      timestamp: serverTimestamp(),
      metadata: stripUndefined(metadata),
    });
  } catch (err) {
    console.error("Denetim kaydı yazılamadı", err);
  }
}
