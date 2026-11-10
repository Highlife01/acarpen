import type { Role } from "@/lib/types";

export type PageKey =
  | "dashboard"
  | "talepler"
  | "musteriler"
  | "teklifler"
  | "hizmetler"
  | "projeler"
  | "blog"
  | "sss"
  | "medya"
  | "seo"
  | "analitik"
  | "kullanicilar"
  | "ayarlar";

/** firestore.rules ile aynı gruplar */
export const MANAGE_ROLES: Role[] = ["superadmin", "manager"];
export const SELL_ROLES: Role[] = ["superadmin", "manager", "sales"];
export const EDIT_ROLES: Role[] = ["superadmin", "manager", "editor"];
export const ALL_ROLES: Role[] = ["superadmin", "manager", "sales", "editor"];

/** Yalnızca arayüzü yansıtır; asıl yetki denetimi Firestore kurallarındadır. */
export const PAGE_ROLES: Record<PageKey, Role[]> = {
  dashboard: ALL_ROLES,
  talepler: SELL_ROLES,
  musteriler: SELL_ROLES,
  teklifler: SELL_ROLES,
  analitik: SELL_ROLES,
  hizmetler: EDIT_ROLES,
  projeler: EDIT_ROLES,
  blog: EDIT_ROLES,
  sss: EDIT_ROLES,
  medya: EDIT_ROLES,
  seo: EDIT_ROLES,
  kullanicilar: ["superadmin"],
  ayarlar: MANAGE_ROLES,
};

export const ADMIN_BASE = "/admin";

export function adminPath(page: PageKey): string {
  return page === "dashboard" ? ADMIN_BASE : `${ADMIN_BASE}/${page}`;
}
