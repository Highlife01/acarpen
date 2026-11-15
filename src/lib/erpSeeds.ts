import type {
  UserRole,
  RoleDefinition,
  FactoryPriceItem,
  FactoryServiceItem,
  InventoryItem,
  CheckInstrumentItem,
  CashLedgerItem,
} from "./erpTypes";

export const ROLE_DEFINITIONS: Record<UserRole, RoleDefinition> = {
  yonetici: {
    id: "yonetici",
    label: "Yönetici (Tam Yetki)",
    badgeColor: "bg-sky-500/15 text-sky-400 border-sky-500/30",
    description: "Tüm modüller, kullanıcı/rol, fiyat listesi, stok düzeltme ve onay eşikleri.",
    maxDiscountPct: 50,
    allowedModules: [
      "control_center",
      "crm",
      "quotes",
      "orders",
      "production",
      "inventory",
      "quality",
      "shipment",
      "finance",
      "reports",
      "governance",
    ],
    permissions: {
      canEditPrices: true,
      canApproveDiscount: true,
      canAdjustStock: true,
      canReleaseQualityHold: true,
      canCancelOrder: true,
      canManageProduction: true,
      canManageFinance: true,
      canViewCosts: true,
    },
  },
  satis_yoneticisi: {
    id: "satis_yoneticisi",
    label: "Satış Yöneticisi",
    badgeColor: "bg-indigo-500/15 text-indigo-400 border-indigo-500/30",
    description: "CRM, fırsatlar, iskonto onayı, özel fiyat, teklif revizyonu ve satış raporları.",
    maxDiscountPct: 25,
    allowedModules: ["control_center", "crm", "quotes", "orders", "shipment", "finance", "reports"],
    permissions: {
      canEditPrices: true,
      canApproveDiscount: true,
      canAdjustStock: false,
      canReleaseQualityHold: false,
      canCancelOrder: true,
      canManageProduction: false,
      canManageFinance: false,
      canViewCosts: true,
    },
  },
  satis: {
    id: "satis",
    label: "Satış Temsilcisi",
    badgeColor: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    description:
      "Müşteri, fırsat, teklif ve sipariş takibi; %10 üzeri iskonto onaya düşer, fiyat listesini değiştiremez.",
    maxDiscountPct: 10,
    allowedModules: ["control_center", "crm", "quotes", "orders", "shipment"],
    permissions: {
      canEditPrices: false,
      canApproveDiscount: false,
      canAdjustStock: false,
      canReleaseQualityHold: false,
      canCancelOrder: false,
      canManageProduction: false,
      canManageFinance: false,
      canViewCosts: false,
    },
  },
  uretim_planlama: {
    id: "uretim_planlama",
    label: "Üretim Planlama",
    badgeColor: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    description: "Kapasite, üretim rotası, iş emri, istasyon kuyruğu ve termin planlama.",
    maxDiscountPct: 0,
    allowedModules: [
      "control_center",
      "orders",
      "production",
      "inventory",
      "quality",
      "shipment",
      "reports",
    ],
    permissions: {
      canEditPrices: false,
      canApproveDiscount: false,
      canAdjustStock: false,
      canReleaseQualityHold: false,
      canCancelOrder: false,
      canManageProduction: true,
      canManageFinance: false,
      canViewCosts: true,
    },
  },
  operator: {
    id: "operator",
    label: "İstasyon Operatörü",
    badgeColor: "bg-orange-500/15 text-orange-400 border-orange-500/30",
    description: "İstasyona atanmış iş emirleri, başlat/durdur/tamamla, duruş ve fire kayıtları.",
    maxDiscountPct: 0,
    allowedModules: ["production", "quality"],
    permissions: {
      canEditPrices: false,
      canApproveDiscount: false,
      canAdjustStock: false,
      canReleaseQualityHold: false,
      canCancelOrder: false,
      canManageProduction: true,
      canManageFinance: false,
      canViewCosts: false,
    },
  },
  kalite: {
    id: "kalite",
    label: "Kalite Kontrol Uzmanı",
    badgeColor: "bg-rose-500/15 text-rose-400 border-rose-500/30",
    description: "Girdi, proses ve final kalite kontrol; karantina blokajı ve serbest bırakma yetkisi.",
    maxDiscountPct: 0,
    allowedModules: ["control_center", "production", "quality", "shipment", "reports"],
    permissions: {
      canEditPrices: false,
      canApproveDiscount: false,
      canAdjustStock: false,
      canReleaseQualityHold: true,
      canCancelOrder: false,
      canManageProduction: false,
      canManageFinance: false,
      canViewCosts: false,
    },
  },
  depo_satinalma: {
    id: "depo_satinalma",
    label: "Depo & Satın Alma",
    badgeColor: "bg-purple-500/15 text-purple-400 border-purple-500/30",
    description:
      "Mal kabul, plaka/lot stok hareketleri, siparişe rezervasyon, satın alma ve sevkiyat hazırlık.",
    maxDiscountPct: 0,
    allowedModules: ["control_center", "inventory", "quality", "shipment"],
    permissions: {
      canEditPrices: false,
      canApproveDiscount: false,
      canAdjustStock: true,
      canReleaseQualityHold: false,
      canCancelOrder: false,
      canManageProduction: false,
      canManageFinance: false,
      canViewCosts: true,
    },
  },
  finans: {
    id: "finans",
    label: "Finans & Muhasebe",
    badgeColor: "bg-teal-500/15 text-teal-400 border-teal-500/30",
    description: "Cari bakiye, kredi limiti, tahsilat/ödeme, tekil fatura referansı ve günlük mutabakat.",
    maxDiscountPct: 15,
    allowedModules: ["control_center", "orders", "finance", "reports"],
    permissions: {
      canEditPrices: false,
      canApproveDiscount: false,
      canAdjustStock: false,
      canReleaseQualityHold: false,
      canCancelOrder: false,
      canManageProduction: false,
      canManageFinance: true,
      canViewCosts: true,
    },
  },
};

export const INITIAL_PRICES: FactoryPriceItem[] = [
  {
    id: "isicam-s",
    name: "Fıratpen Selenit 75 PVC Pencere (4+16+4 Isıcam)",
    m2Price: 1450,
    thickness: "4+16+4 mm",
    category: "Çift Cam",
    stock: "Mevcut",
    version: "2026-Liste-v1",
  },
  {
    id: "isicam-k",
    name: "Fıratpen Redonit 85 PVC Pencere (Renkli/Konfor Isıcam)",
    m2Price: 1680,
    thickness: "6+16+6 mm",
    category: "Güneş Kontrol",
    stock: "Mevcut",
    version: "2026-Liste-v1",
  },
  {
    id: "winsa-dorado76",
    name: "Winsa Dorado 76 PVC Pencere (4+16+4 Isıcam)",
    m2Price: 1520,
    thickness: "4+16+4 mm",
    category: "Winsa PVC",
    stock: "Mevcut",
    version: "2026-Liste-v1",
  },
  {
    id: "pimapen-nirvana80",
    name: "Pimapen Nirvana 80 PVC Pencere (4+16+4 Isıcam)",
    m2Price: 1590,
    thickness: "4+16+4 mm",
    category: "Pimapen PVC",
    stock: "Mevcut",
    version: "2026-Liste-v1",
  },
  {
    id: "balkon-8mm",
    name: "8mm Rodajlı Katlanır Balkon Camı",
    m2Price: 1250,
    thickness: "8 mm Temperli",
    category: "Balkon Camı",
    stock: "Mevcut",
    version: "2026-Liste-v1",
  },
  {
    id: "balkon-10mm",
    name: "10mm Sürgülü / Giyotin Balkon Camı",
    m2Price: 1550,
    thickness: "10 mm Temperli",
    category: "Giyotin Cam",
    stock: "Mevcut",
    version: "2026-Liste-v1",
  },
  {
    id: "jaluzili",
    name: "Jaluzili Isıcam (Mıknatıslı/Motorlu)",
    m2Price: 2850,
    thickness: "6+22+6 mm",
    category: "Jaluzili",
    stock: "Sipariş Üzeri",
    version: "2026-Liste-v1",
  },
  {
    id: "temperli-6mm",
    name: "6mm Düz / Bombeli Temperli Cam",
    m2Price: 980,
    thickness: "6 mm Temperli",
    category: "Emniyet Camı",
    stock: "Mevcut",
    version: "2026-Liste-v1",
  },
  {
    id: "lamine-8mm",
    name: "4+4 mm Akustik Lamine Emniyet Camı",
    m2Price: 1850,
    thickness: "8.76 mm PVB",
    category: "Akustik Lamine",
    stock: "Mevcut",
    version: "2026-Liste-v1",
  },
  {
    id: "dis-cephe",
    name: "Strüktürel Silikonlu Dış Cephe Camı",
    m2Price: 2150,
    thickness: "6+16+6 mm Temperli",
    category: "Dış Cephe",
    stock: "Mevcut",
    version: "2026-Liste-v1",
  },
];

export const INITIAL_SERVICES: FactoryServiceItem[] = [
  { id: "srv-rodaj", ad: "Rodaj (Balıksırtı / Düz)", fiyat: 150, birim: "İşlem" },
  { id: "srv-delik", ad: "Delik Açma (adet)", fiyat: 50, birim: "Adet" },
  { id: "srv-zimpara", ad: "Zımpara / Pah Kırma", fiyat: 80, birim: "İşlem" },
  { id: "srv-cnc", ad: "CNC Özel Kesim", fiyat: 200, birim: "İşlem" },
  { id: "srv-temper", ad: "Çift Açılım İspanyolet & EPDM Donanım", fiyat: 300, birim: "İşlem" },
  { id: "srv-montaj", ad: "Şantiye Montaj Hizmeti", fiyat: 500, birim: "Sefer" },
  { id: "srv-nakliye", ad: "Vinçli Araç Nakliye", fiyat: 250, birim: "Sefer" },
  { id: "srv-iscilik", ad: "Özel İşçilik & Silikonlama", fiyat: 400, birim: "İşlem" },
  { id: "srv-kat", ad: "Kat Çıkma / Vinç İndirme Ücreti", fiyat: 150, birim: "Kat" },
];

export const INITIAL_INVENTORY: InventoryItem[] = [];
export const INITIAL_CHECKS: CheckInstrumentItem[] = [];
export const INITIAL_CASH_LEDGER: CashLedgerItem[] = [];

export const LEGACY_MOCK_IDS = new Set([
  "CEK-AL-202601",
  "CEK-AL-202602",
  "CEK-VER-202601",
  "KASA-2026-101",
  "KASA-2026-102",
  "KASA-2026-103",
  "stk-float-4mm",
  "stk-lowe-6mm",
  "stk-temp-8mm",
  "stk-lam-44",
  "stk-sarf-tiokol",
  "stk-sehpa-metal",
  "TKF-2026-8941",
  "TKF-2026-8940",
  "TKF-2026-8938",
  "TKF-2026-8935",
  "MSG-101",
  "MSG-102",
]);

/** Legacy role string -> canonical UserRole mapping for backward compatibility with existing user docs. */
export function normalizeUserRole(raw: unknown): UserRole | null {
  if (typeof raw !== "string") return null;
  const clean = raw.trim().toLowerCase();
  if (clean === "superadmin" || clean === "manager" || clean === "admin") return "yonetici";
  if (clean === "sales") return "satis";
  if (clean === "editor") return "satis_yoneticisi";
  if (
    clean === "yonetici" ||
    clean === "satis_yoneticisi" ||
    clean === "satis" ||
    clean === "uretim_planlama" ||
    clean === "operator" ||
    clean === "kalite" ||
    clean === "depo_satinalma" ||
    clean === "finans"
  ) {
    return clean;
  }
  return null;
}
