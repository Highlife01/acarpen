import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth, isFirebaseConfigured } from "./firebase";

// ============================================================================
// 1. ROLLER VE YETKİ MATRİSİ (RBAC - Bölüm 2 & Bölüm 8 & Kabul Testi #9)
// ============================================================================

export type UserRole =
  | "yonetici"
  | "satis_yoneticisi"
  | "satis"
  | "uretim_planlama"
  | "operator"
  | "kalite"
  | "depo_satinalma"
  | "finans";

export interface RoleDefinition {
  id: UserRole;
  label: string;
  badgeColor: string;
  description: string;
  maxDiscountPct: number;
  allowedModules: string[];
  permissions: {
    canEditPrices: boolean;
    canApproveDiscount: boolean;
    canAdjustStock: boolean;
    canReleaseQualityHold: boolean;
    canCancelOrder: boolean;
    canManageProduction: boolean;
    canManageFinance: boolean;
    canViewCosts: boolean;
  };
}

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
    description: "Müşteri, fırsat, teklif ve sipariş takibi; %10 üzeri iskonto onaya düşer, fiyat listesini değiştiremez.",
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
    allowedModules: ["control_center", "orders", "production", "inventory", "quality", "shipment", "reports"],
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
    description: "Mal kabul, plaka/lot stok hareketleri, siparişe rezervasyon, satın alma ve sevkiyat hazırlık.",
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

// ============================================================================
// 2. VERİ MODELLERİ (Bölüm 3, 4, 5, 7)
// ============================================================================

export interface QuoteLineItem {
  id: string;
  glassType: string;
  thickness: string;
  widthMm: number;
  heightMm: number;
  qty: number;
  m2: number;
  edgeWork: "Yok" | "Rodaj" | "Bizote" | "Zımpara";
  holesCount: number;
  tempered: boolean;
  laminatedOrIgu: "Tek Cam" | "Isıcam S" | "Isıcam K" | "PVB Lamine";
  wastePct: number;
  unitPrice: number;
  lineTotal: number;
}

export interface QuoteRevision {
  version: number;
  date: string;
  updatedBy: string;
  previousTotal: number;
  previousArea: number;
  dimensionsSummary: string;
  discountRate: number;
  priceListVersion: string;
  reason: string;
}

export interface DeliveryProof {
  deliveredAt: string;
  receivedBy: string;
  signatureRef: string;
  shippedM2: number;
  packageCount: number;
  damageNote?: string;
  verifiedByQr: boolean;
}

export interface QuoteItem {
  id: string;
  customerName: string;
  phone: string;
  email?: string;
  city: string;
  siteName?: string; // Şantiye / Proje adı
  customerType?: "Kurumsal / Müteahhit" | "Bayi / Camcı" | "Mimari Ofis" | "Bireysel";
  salesRep?: string;
  leadSource?: string;
  glassType: string;
  thickness: string;
  dimensions: string; // e.g. "120 x 200 cm (8 adet)"
  totalArea: number; // in m²
  estimatedPrice: number; // Final / Net Offer Amount in TL
  discountRate?: number; // % discount applied
  extraCost?: number; // Freight / Crane / Extra processing cost in TL
  // Satır bazlı konfigüratör & Sürümleme (Kabul Testi #1 & #2)
  lines?: QuoteLineItem[];
  priceListVersion?: string;
  validUntil?: string;
  version?: number;
  revisions?: QuoteRevision[];
  // Onay ve Sözleşme Kapıları (Kabul Testi #3 & #9)
  approvalStatus?: "approved" | "pending_approval" | "rejected";
  approvedBy?: string;
  technicalApproved?: boolean;
  paymentTerms?: "Peşin" | "%50 Avans + Teslimde" | "30 Gün Vadeli" | "60 Gün Vadeli";
  orderSnapshotAt?: string;
  cancelReason?: string;
  cancelledBy?: string;
  // Ödeme & Finans (Kabul Testi #8 & #10)
  paymentStatus?: "unpaid" | "deposit" | "paid";
  paidAmount?: number;
  estimatedCost?: number; // Planlanan maliyet (₺)
  actualCost?: number; // Gerçekleşen maliyet + fire maliyeti (₺)
  invoiceNo?: string; // Tekil fatura referansı (FTR-2026-...)
  waybillNo?: string; // İrsaliye No (IRS-2026-...)
  syncId?: string; // Tekil işlem / idempotency kimliği
  dueDate?: string; // Vade tarihi
  // Üretim Planlama, Rota, Operatör & Fire (Kabul Testi #4 & #6)
  routeSteps?: number[]; // örn. [1, 2, 3, 4, 5, 6]
  productionStage?: 1 | 2 | 3 | 4 | 5 | 6;
  stationStatus?: "waiting" | "running" | "paused" | "completed" | "quality_hold";
  assignedOperator?: string;
  machineName?: string;
  downtimeMinutes?: number;
  downtimeReason?: string;
  scrapM2?: number; // Fire / kırık miktarı (m²)
  scrapReason?: string;
  scrapStation?: string;
  reservedLotNo?: string;
  // Kalite Kontrol & Blokaj (Kabul Testi #5)
  qualityHold?: boolean;
  qualityHoldReason?: string;
  qualityDisposition?: "Bekliyor" | "Yeniden İşleme" | "Şartlı Kabul" | "Hurda" | "Müşteri Onayı" | "Serbest";
  qualityInspector?: string;
  qualityCheckedAt?: string;
  // Sevkiyat & Teslim Kanıtı / POD (Kabul Testi #7)
  estimatedDeliveryDate?: string;
  vehiclePlate?: string;
  driverName?: string;
  rackNo?: string; // Taşıma sehpası no (SHP-...)
  packageCount?: number;
  craneRequired?: boolean;
  deliveryAddress?: string;
  deliveryProof?: DeliveryProof;
  notes?: string;
  date: string;
  createdAt?: number;
  status: "new" | "in_review" | "quoted" | "approved" | "completed" | "cancelled";
  urgency?: "high" | "normal" | "low";
}

export interface CustomerRecord {
  id: string;
  companyName: string;
  contactPerson: string;
  phone: string;
  email?: string;
  taxOffice?: string;
  taxNumber?: string;
  city: string;
  siteName?: string;
  address?: string;
  customerType: "Kurumsal / Müteahhit" | "Bayi / Camcı" | "Mimari Ofis" | "Bireysel";
  salesRep: string;
  paymentTerms: "Peşin" | "%50 Avans + Teslimde" | "30 Gün Vadeli" | "60 Gün Vadeli";
  creditLimit: number;
  kvkkConsent: boolean;
  notes?: string;
  createdAt: number;
}

export type OpportunityStage =
  | "new_lead"
  | "measurement"
  | "technical_review"
  | "quote_prepared"
  | "quote_sent"
  | "negotiation"
  | "won"
  | "lost";

export interface OpportunityItem {
  id: string;
  customerName: string;
  phone: string;
  email?: string;
  city: string;
  siteName: string;
  source:
    | "Web Formu"
    | "Telefon"
    | "WhatsApp"
    | "E-Posta"
    | "Bayi Yönlendirmesi"
    | "Fuar"
    | "Mevcut Müşteri Tavsiyesi";
  stage: OpportunityStage;
  productGroup: string;
  estimatedAreaM2: number;
  estimatedAmount: number;
  targetDecisionDate: string;
  competitor?: string;
  nextAction: string;
  assignedRep: string;
  lossReason?:
    | "Fiyat"
    | "Termin"
    | "Teknik Uyumsuzluk"
    | "Proje İptali"
    | "Rakip"
    | "Ulaşılamama"
    | "Diğer";
  convertedQuoteId?: string;
  createdAt: number;
  date: string;
}

export interface ActivityItem {
  id: string;
  type: "Telefon Görüşmesi" | "Toplantı" | "Saha Keşfi" | "E-Posta" | "WhatsApp Notu" | "Takip Görevi";
  customerName: string;
  relatedId?: string; // Quote ID or Opportunity ID
  summary: string;
  dueDate: string;
  assignedTo: string;
  completed: boolean;
  createdAt: number;
}

export interface InventoryItem {
  id: string;
  code: string;
  name: string;
  category: "Hammadde (Plaka Cam)" | "Yarı Mamul" | "Mamul" | "Sarf Malzeme" | "Ambalaj / Sehpa";
  thickness: string;
  dimensions: string; // e.g. "6500 mm Fıratpen Boy Profil"
  supplier: string;
  warehouseLocation: string; // e.g. "Depo-A / Raf-04"
  lotNo: string;
  unit: "m²" | "Adet" | "Kg" | "Metre";
  availableQty: number;
  reservedQty: number;
  quarantineQty: number;
  damagedQty: number;
  minStockLevel: number;
  unitCost: number;
  updatedAt?: string;
}

export interface PurchaseOrderItem {
  id: string;
  materialName: string;
  category: string;
  supplier: string;
  qty: number;
  unit: string;
  unitPrice: number;
  totalAmount: number;
  expectedDate: string;
  status: "Talep Açıldı" | "Onaylandı" | "Sipariş Verildi" | "Mal Kabul Yapıldı" | "Kalite Red";
  lotNo?: string;
  invoiceMatched?: boolean;
  supplierRating?: number; // 1-100
  requestedBy: string;
  createdAt: number;
  date: string;
}

export interface QualityInspectionItem {
  id: string;
  orderId: string;
  customerName: string;
  inspectionType: "Girdi Kalite (Mal Kabul)" | "Proses Kontrol (İstasyon)" | "Final Kalite (Sevk Öncesi)";
  stationName: string;
  dimensionToleranceOk: boolean;
  opticalSurfaceOk: boolean;
  temperStressOk: boolean;
  sealantArgonOk: boolean;
  result: "Kabul" | "Karantina (Blokaj)" | "Şartlı Kabul" | "Hurda / Yeniden İşleme";
  disposition?: "Bekliyor" | "Yeniden İşleme" | "Şartlı Kabul" | "Hurda" | "Müşteri Onayı" | "Serbest";
  defectReason?: string;
  inspector: string;
  date: string;
  createdAt: number;
}

export interface AuditEventItem {
  id: string;
  actionType:
    | "PRICE_CHANGE"
    | "QUOTE_REVISION"
    | "DISCOUNT_APPROVAL"
    | "STOCK_ADJUSTMENT"
    | "QUALITY_HOLD"
    | "QUALITY_RELEASE"
    | "ORDER_CANCEL"
    | "INVOICE_CREATE"
    | "RBAC_DENIED"
    | "DATA_EXPORT";
  actorEmail: string;
  actorRole: UserRole;
  targetId: string;
  summary: string;
  timestamp: string;
  createdAt: number;
}

export interface ContactMessage {
  id: string;
  name: string;
  phone: string;
  email?: string;
  subject: string;
  message: string;
  date: string;
  createdAt?: number;
  isRead: boolean;
  replied?: boolean;
}

export interface FactoryPriceItem {
  id: string;
  name: string;
  m2Price: number;
  thickness: string;
  category?: string;
  stock?: string;
  version?: string;
}

export interface FactoryServiceItem {
  id: string;
  ad: string;
  fiyat: number;
  birim?: string;
  aktif?: boolean;
}

export const INITIAL_PRICES: FactoryPriceItem[] = [
  { id: "isicam-s", name: "Fıratpen Selenit 75 PVC Pencere (4+16+4 Isıcam)", m2Price: 1450, thickness: "4+16+4 mm", category: "Çift Cam", stock: "Mevcut", version: "2026-Liste-v1" },
  { id: "isicam-k", name: "Fıratpen Redonit 85 PVC Pencere (Renkli/Konfor Isıcam)", m2Price: 1680, thickness: "6+16+6 mm", category: "Güneş Kontrol", stock: "Mevcut", version: "2026-Liste-v1" },
  { id: "balkon-8mm", name: "8mm Rodajlı Katlanır Balkon Camı", m2Price: 1250, thickness: "8 mm Temperli", category: "Balkon Camı", stock: "Mevcut", version: "2026-Liste-v1" },
  { id: "balkon-10mm", name: "10mm Sürgülü / Giyotin Balkon Camı", m2Price: 1550, thickness: "10 mm Temperli", category: "Giyotin Cam", stock: "Mevcut", version: "2026-Liste-v1" },
  { id: "jaluzili", name: "Jaluzili Isıcam (Mıknatıslı/Motorlu)", m2Price: 2850, thickness: "6+22+6 mm", category: "Jaluzili", stock: "Sipariş Üzeri", version: "2026-Liste-v1" },
  { id: "temperli-6mm", name: "6mm Düz / Bombeli Temperli Cam", m2Price: 980, thickness: "6 mm Temperli", category: "Emniyet Camı", stock: "Mevcut", version: "2026-Liste-v1" },
  { id: "lamine-8mm", name: "4+4 mm Akustik Lamine Emniyet Camı", m2Price: 1850, thickness: "8.76 mm PVB", category: "Akustik Lamine", stock: "Mevcut", version: "2026-Liste-v1" },
  { id: "dis-cephe", name: "Strüktürel Silikonlu Dış Cephe Camı", m2Price: 2150, thickness: "6+16+6 mm Temperli", category: "Dış Cephe", stock: "Mevcut", version: "2026-Liste-v1" },
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

// --- 9.2 Çek / Senet Portföyü (Alınan Çekler & Kesilen Çekler) ---
export interface CheckInstrumentItem {
  id: string;
  direction: "received" | "issued"; // received = Müşteriden Alınan Çek, issued = Tedarikçiye Kesilen Çek
  serialNo: string;
  counterparty: string; // Keşideci Müşteri veya Alacaklı Tedarikçi
  bankName: string;
  amount: number;
  issueDate: string;
  dueDate: string; // YYYY-MM-DD
  relatedOrderId?: string;
  endorsedTo?: string; // Ciro edildiyse hangi firmaya verildiği
  status:
    | "Portföyde (Kasada)"
    | "Bankada Tahsilde"
    | "Ciro Edildi (Tedarikçiye)"
    | "Tahsil Edildi"
    | "Karşılıksız / Protestolu"
    | "Tedavülde (Ödeme Bekliyor)"
    | "Ödendi (Bankadan Çıktı)"
    | "İade / İptal";
  notes?: string;
  createdAt: number;
}

// --- 9.3 Kasa & Banka Hareketleri Defteri ---
export interface CashLedgerItem {
  id: string;
  type: "in" | "out"; // in = Giriş (Tahsilat), out = Çıkış (Ödeme / Gider)
  accountName:
    | "Merkez Nakit Kasa"
    | "Şantiye Nakit Kasa"
    | "İş Bankası Ticari Hesap"
    | "Garanti BBVA POS / Ticari"
    | "Ziraat Bankası Kurumsal";
  category:
    | "Müşteri Sipariş Tahsilatı"
    | "Alınan Çek Tahsilatı"
    | "Kesilen Çek Ödemesi"
    | "Fıratpen Profil / Hammadde Ödemesi"
    | "Nakliye / Yakıt / Vinç Gideri"
    | "Personel / İşçilik Ödemesi"
    | "Fabrika Genel Gider / Enerji"
    | "Diğer İşlem";
  counterparty: string;
  amount: number;
  referenceNo?: string;
  description: string;
  date: string;
  createdAt: number;
}

export const INITIAL_CHECKS: CheckInstrumentItem[] = [];

export const INITIAL_CASH_LEDGER: CashLedgerItem[] = [];

const LEGACY_MOCK_IDS = new Set([
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

const COLLECTIONS = {
  QUOTES: "acarpen_quotes",
  MESSAGES: "acarpen_messages",
  PRICES: "acarpen_prices",
  SERVICES: "acarpen_services",
  CUSTOMERS: "acarpen_customers",
  OPPORTUNITIES: "acarpen_opportunities",
  ACTIVITIES: "acarpen_activities",
  INVENTORY: "acarpen_inventory",
  PURCHASES: "acarpen_purchases",
  QUALITY: "acarpen_quality",
  AUDIT_LOGS: "acarpen_audit_logs",
  CHECKS: "acarpen_checks",
  CASH_LEDGER: "acarpen_cash_ledger",
};

function stripUndefined<T extends object>(obj: T): Record<string, unknown> {
  const clean: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      clean[key] = value;
    }
  }
  return clean;
}

export function formatTrNow(): string {
  return new Date().toLocaleString("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function statusToDefaultStage(status: QuoteItem["status"]): 1 | 2 | 3 | 4 | 5 | 6 {
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

class ActiveDataStore {
  private quotes: QuoteItem[] = [];
  private messages: ContactMessage[] = [];
  private prices: FactoryPriceItem[] = [...INITIAL_PRICES];
  private services: FactoryServiceItem[] = [...INITIAL_SERVICES];
  private customers: CustomerRecord[] = [];
  private opportunities: OpportunityItem[] = [];
  private activities: ActivityItem[] = [];
  private inventory: InventoryItem[] = [...INITIAL_INVENTORY];
  private purchases: PurchaseOrderItem[] = [];
  private qualityInspections: QualityInspectionItem[] = [];
  private auditLogs: AuditEventItem[] = [];
  private checks: CheckInstrumentItem[] = [...INITIAL_CHECKS];
  private cashLedger: CashLedgerItem[] = [...INITIAL_CASH_LEDGER];

  private sessionUid: string | null = null;
  private activeRole: UserRole = "yonetici";

  private pricesSeeded = false;
  private servicesSeeded = false;

  private quoteListeners: Set<(quotes: QuoteItem[]) => void> = new Set();
  private messageListeners: Set<(messages: ContactMessage[]) => void> = new Set();
  private priceListeners: Set<(prices: FactoryPriceItem[]) => void> = new Set();
  private serviceListeners: Set<(services: FactoryServiceItem[]) => void> = new Set();
  private customerListeners: Set<(customers: CustomerRecord[]) => void> = new Set();
  private opportunityListeners: Set<(items: OpportunityItem[]) => void> = new Set();
  private activityListeners: Set<(items: ActivityItem[]) => void> = new Set();
  private inventoryListeners: Set<(items: InventoryItem[]) => void> = new Set();
  private purchaseListeners: Set<(items: PurchaseOrderItem[]) => void> = new Set();
  private qualityListeners: Set<(items: QualityInspectionItem[]) => void> = new Set();
  private auditListeners: Set<(items: AuditEventItem[]) => void> = new Set();
  private checkListeners: Set<(items: CheckInstrumentItem[]) => void> = new Set();
  private cashLedgerListeners: Set<(items: CashLedgerItem[]) => void> = new Set();
  private sessionListeners: Set<(uid: string | null) => void> = new Set();
  private roleListeners: Set<(role: UserRole) => void> = new Set();

  constructor() {
    this.cleanupLegacyFakeCache();
    this.loadLiveLocalPersistence();
    this.initCrossTabStorageListener();
    this.initRealtimeFirebaseSync();
  }

  private saveLocalKey(key: string, data: unknown): void {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        localStorage.setItem(key, JSON.stringify(data));
      }
    } catch {
      // Ignore storage quota errors
    }
  }

  private loadLocalKey<T extends { id: string }>(key: string): T[] {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        const raw = localStorage.getItem(key);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          return (parsed as T[]).filter((item) => item && !LEGACY_MOCK_IDS.has(item.id));
        }
      }
    } catch {
      // Ignore parse errors
    }
    return [];
  }

  private loadLiveLocalPersistence(): void {
    this.quotes = this.loadLocalKey<QuoteItem>("acarpen_live_v3_quotes");
    this.messages = this.loadLocalKey<ContactMessage>("acarpen_live_v3_messages");
    this.checks = this.loadLocalKey<CheckInstrumentItem>("acarpen_live_v3_checks");
    this.cashLedger = this.loadLocalKey<CashLedgerItem>("acarpen_live_v3_cash_ledger");
    this.customers = this.loadLocalKey<CustomerRecord>("acarpen_live_v3_customers");
    this.opportunities = this.loadLocalKey<OpportunityItem>("acarpen_live_v3_opportunities");
    this.activities = this.loadLocalKey<ActivityItem>("acarpen_live_v3_activities");
  }

  private initCrossTabStorageListener(): void {
    if (typeof window === "undefined") return;
    window.addEventListener("storage", (e) => {
      if (e.key === "acarpen_live_v3_messages") {
        this.messages = this.loadLocalKey<ContactMessage>("acarpen_live_v3_messages");
        this.messageListeners.forEach((cb) => cb(this.getMessages()));
      } else if (e.key === "acarpen_live_v3_quotes") {
        this.quotes = this.loadLocalKey<QuoteItem>("acarpen_live_v3_quotes");
        this.quoteListeners.forEach((cb) => cb(this.getQuotes()));
      } else if (e.key === "acarpen_live_v3_checks") {
        this.checks = this.loadLocalKey<CheckInstrumentItem>("acarpen_live_v3_checks");
        this.checkListeners.forEach((cb) => cb(this.getChecks()));
      } else if (e.key === "acarpen_live_v3_cash_ledger") {
        this.cashLedger = this.loadLocalKey<CashLedgerItem>("acarpen_live_v3_cash_ledger");
        this.cashLedgerListeners.forEach((cb) => cb(this.getCashLedger()));
      }
    });
  }

  private cleanupLegacyFakeCache(): void {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        localStorage.removeItem("acarpen_quotes_v2");
        localStorage.removeItem("acarpen_messages_v2");
        localStorage.removeItem("acarpen_visitor_telemetry_v1");
        localStorage.removeItem("acarpen_visitor_telemetry_v2");
        localStorage.removeItem("acarpen_react");
      }
    } catch {
      // Ignore storage access errors
    }
  }

  private initRealtimeFirebaseSync(): void {
    if (typeof window === "undefined" || !isFirebaseConfigured) return;

    try {
      onAuthStateChanged(auth, (user) => {
        this.sessionUid = user ? user.uid : null;
        this.notifySession();
      });

      // 1. Quotes & Orders
      onSnapshot(
        collection(db, COLLECTIONS.QUOTES),
        (snapshot) => {
          const remoteMap = new Map<string, QuoteItem>();
          snapshot.forEach((docSnap) => {
            const docId = docSnap.id;
            if (LEGACY_MOCK_IDS.has(docId)) {
              deleteDoc(doc(db, COLLECTIONS.QUOTES, docId)).catch(() => {});
              return;
            }
            const data = docSnap.data() as QuoteItem;
            remoteMap.set(data.id || docId, { ...data, id: data.id || docId });
          });
          this.quotes.forEach((localItem) => {
            if (!remoteMap.has(localItem.id)) {
              remoteMap.set(localItem.id, localItem);
            }
          });
          const merged = Array.from(remoteMap.values());
          merged.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
          this.quotes = merged;
          this.notifyQuotes();
        },
        () => {}
      );

      // 2. Contact Messages
      onSnapshot(
        collection(db, COLLECTIONS.MESSAGES),
        (snapshot) => {
          const remoteMap = new Map<string, ContactMessage>();
          snapshot.forEach((docSnap) => {
            const docId = docSnap.id;
            if (LEGACY_MOCK_IDS.has(docId)) {
              deleteDoc(doc(db, COLLECTIONS.MESSAGES, docId)).catch(() => {});
              return;
            }
            const data = docSnap.data() as ContactMessage;
            remoteMap.set(data.id || docId, { ...data, id: data.id || docId });
          });
          this.messages.forEach((localItem) => {
            if (!remoteMap.has(localItem.id)) {
              remoteMap.set(localItem.id, localItem);
            }
          });
          const merged = Array.from(remoteMap.values());
          merged.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
          this.messages = merged;
          this.notifyMessages();
        },
        () => {}
      );

      // 3. Factory Unit Prices
      onSnapshot(
        collection(db, COLLECTIONS.PRICES),
        (snapshot) => {
          if (snapshot.empty) {
            if (!this.pricesSeeded) {
              this.pricesSeeded = true;
              INITIAL_PRICES.forEach((item) => {
                setDoc(doc(db, COLLECTIONS.PRICES, item.id), stripUndefined(item)).catch(() => {});
              });
            }
            return;
          }
          const items: FactoryPriceItem[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data() as FactoryPriceItem;
            items.push({
              category: "Özel Cam",
              stock: "Mevcut",
              version: "2026-Liste-v1",
              ...data,
              id: data.id || docSnap.id,
            });
          });
          const orderMap = new Map(INITIAL_PRICES.map((p, idx) => [p.id, idx]));
          items.sort((a, b) => {
            const idxA = orderMap.has(a.id) ? orderMap.get(a.id)! : 999;
            const idxB = orderMap.has(b.id) ? orderMap.get(b.id)! : 999;
            return idxA - idxB;
          });
          this.prices = items;
          this.notifyPrices();
        },
        () => {}
      );

      // 4. Extra Services
      onSnapshot(
        collection(db, COLLECTIONS.SERVICES),
        (snapshot) => {
          if (snapshot.empty) {
            if (!this.servicesSeeded) {
              this.servicesSeeded = true;
              INITIAL_SERVICES.forEach((item) => {
                setDoc(doc(db, COLLECTIONS.SERVICES, item.id), stripUndefined(item)).catch(() => {});
              });
            }
            return;
          }
          const items: FactoryServiceItem[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data() as FactoryServiceItem;
            items.push({
              birim: "İşlem",
              ...data,
              id: data.id || docSnap.id,
            });
          });
          const orderMap = new Map(INITIAL_SERVICES.map((s, idx) => [s.id, idx]));
          items.sort((a, b) => {
            const idxA = orderMap.has(a.id) ? orderMap.get(a.id)! : 999;
            const idxB = orderMap.has(b.id) ? orderMap.get(b.id)! : 999;
            return idxA - idxB;
          });
          this.services = items;
          this.notifyServices();
        },
        () => {}
      );

      // 5. Customers (CRM 360)
      onSnapshot(
        collection(db, COLLECTIONS.CUSTOMERS),
        (snapshot) => {
          const items: CustomerRecord[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data() as CustomerRecord;
            items.push({ ...data, id: data.id || docSnap.id });
          });
          items.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
          this.customers = items;
          this.notifyCustomers();
        },
        () => {}
      );

      // 6. Opportunities (Sales Funnel)
      onSnapshot(
        collection(db, COLLECTIONS.OPPORTUNITIES),
        (snapshot) => {
          const items: OpportunityItem[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data() as OpportunityItem;
            items.push({ ...data, id: data.id || docSnap.id });
          });
          items.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
          this.opportunities = items;
          this.notifyOpportunities();
        },
        () => {}
      );

      // 7. Activities (CRM Tasks & Follow-ups)
      onSnapshot(
        collection(db, COLLECTIONS.ACTIVITIES),
        (snapshot) => {
          const items: ActivityItem[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data() as ActivityItem;
            items.push({ ...data, id: data.id || docSnap.id });
          });
          items.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
          this.activities = items;
          this.notifyActivities();
        },
        () => {}
      );

      // 8. Inventory (Raw Plates, Lots, Consumables, Racks)
      onSnapshot(
        collection(db, COLLECTIONS.INVENTORY),
        (snapshot) => {
          const items: InventoryItem[] = [];
          snapshot.forEach((docSnap) => {
            const docId = docSnap.id;
            if (LEGACY_MOCK_IDS.has(docId)) {
              deleteDoc(doc(db, COLLECTIONS.INVENTORY, docId)).catch(() => {});
              return;
            }
            const data = docSnap.data() as InventoryItem;
            items.push({ ...data, id: data.id || docId });
          });
          this.inventory = items;
          this.notifyInventory();
        },
        () => {}
      );

      // 9. Purchases (MRP & Supplier Orders)
      onSnapshot(
        collection(db, COLLECTIONS.PURCHASES),
        (snapshot) => {
          const items: PurchaseOrderItem[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data() as PurchaseOrderItem;
            items.push({ ...data, id: data.id || docSnap.id });
          });
          items.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
          this.purchases = items;
          this.notifyPurchases();
        },
        () => {}
      );

      // 10. Quality Inspections
      onSnapshot(
        collection(db, COLLECTIONS.QUALITY),
        (snapshot) => {
          const items: QualityInspectionItem[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data() as QualityInspectionItem;
            items.push({ ...data, id: data.id || docSnap.id });
          });
          items.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
          this.qualityInspections = items;
          this.notifyQuality();
        },
        () => {}
      );

      // 11. Immutable Audit Logs
      onSnapshot(
        collection(db, COLLECTIONS.AUDIT_LOGS),
        (snapshot) => {
          const items: AuditEventItem[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data() as AuditEventItem;
            items.push({ ...data, id: data.id || docSnap.id });
          });
          items.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
          this.auditLogs = items;
          this.notifyAuditLogs();
        },
        () => {}
      );

      // 12. Checks Portfolio (Alınan Çekler & Kesilen Çekler)
      onSnapshot(
        collection(db, COLLECTIONS.CHECKS),
        (snapshot) => {
          const items: CheckInstrumentItem[] = [];
          snapshot.forEach((docSnap) => {
            const docId = docSnap.id;
            if (LEGACY_MOCK_IDS.has(docId)) {
              deleteDoc(doc(db, COLLECTIONS.CHECKS, docId)).catch(() => {});
              return;
            }
            const data = docSnap.data() as CheckInstrumentItem;
            items.push({ ...data, id: data.id || docId });
          });
          items.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
          this.checks = items;
          this.notifyChecks();
        },
        () => {}
      );

      // 13. Cash & Bank Ledger (Kasa & Banka Hareketleri)
      onSnapshot(
        collection(db, COLLECTIONS.CASH_LEDGER),
        (snapshot) => {
          const items: CashLedgerItem[] = [];
          snapshot.forEach((docSnap) => {
            const docId = docSnap.id;
            if (LEGACY_MOCK_IDS.has(docId)) {
              deleteDoc(doc(db, COLLECTIONS.CASH_LEDGER, docId)).catch(() => {});
              return;
            }
            const data = docSnap.data() as CashLedgerItem;
            items.push({ ...data, id: data.id || docId });
          });
          items.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
          this.cashLedger = items;
          this.notifyCashLedger();
        },
        () => {}
      );
    } catch {
      // Fallback to in-memory state
    }
  }

  // --- Session & Active Role Management ---
  public getSession(): string | null {
    return this.sessionUid;
  }

  public setSession(uid: string | null): void {
    this.sessionUid = uid;
    this.notifySession();
  }

  public subscribeSession(callback: (uid: string | null) => void): () => void {
    this.sessionListeners.add(callback);
    callback(this.sessionUid);
    return () => this.sessionListeners.delete(callback);
  }

  private notifySession(): void {
    const current = this.sessionUid;
    this.sessionListeners.forEach((cb) => cb(current));
  }

  public getRole(): UserRole {
    return this.activeRole;
  }

  public setRole(role: UserRole): void {
    this.activeRole = role;
    const current = this.activeRole;
    this.roleListeners.forEach((cb) => cb(current));
  }

  public subscribeRole(callback: (role: UserRole) => void): () => void {
    this.roleListeners.add(callback);
    callback(this.activeRole);
    return () => this.roleListeners.delete(callback);
  }

  // --- Audit Log Recording ---
  public getAuditLogs(): AuditEventItem[] {
    return [...this.auditLogs];
  }

  public logAuditEvent(
    actionType: AuditEventItem["actionType"],
    targetId: string,
    summary: string,
    actorEmail?: string
  ): AuditEventItem {
    const now = Date.now();
    const entry: AuditEventItem = {
      id: `AUD-${now}-${Math.floor(Math.random() * 900 + 100)}`,
      actionType,
      actorEmail: actorEmail || auth.currentUser?.email || "yetkili@acarpen.com.tr",
      actorRole: this.activeRole,
      targetId,
      summary,
      timestamp: formatTrNow(),
      createdAt: now,
    };
    this.auditLogs = [entry, ...this.auditLogs];
    this.notifyAuditLogs();

    if (isFirebaseConfigured) {
      setDoc(doc(db, COLLECTIONS.AUDIT_LOGS, entry.id), stripUndefined(entry)).catch(() => {});
    }
    return entry;
  }

  public subscribeAuditLogs(callback: (items: AuditEventItem[]) => void): () => void {
    this.auditListeners.add(callback);
    callback(this.getAuditLogs());
    return () => this.auditListeners.delete(callback);
  }

  private notifyAuditLogs(): void {
    const current = this.getAuditLogs();
    this.auditListeners.forEach((cb) => cb(current));
  }

  // --- Quotes & Orders Operations ---
  public getQuotes(): QuoteItem[] {
    return [...this.quotes];
  }

  public addQuote(quote: Omit<QuoteItem, "id" | "date"> & { id?: string }): QuoteItem {
    const now = Date.now();
    const generatedId =
      quote.id || `TKF-${new Date().getFullYear()}-${now.toString().slice(-6)}`;
    const estimatedCost =
      quote.estimatedCost ?? Math.round((quote.estimatedPrice || 0) * 0.68);
    const newQuote: QuoteItem = {
      paymentStatus: "unpaid",
      paidAmount: 0,
      discountRate: 0,
      extraCost: 0,
      version: 1,
      priceListVersion: "2026-Liste-v1",
      approvalStatus:
        (quote.discountRate || 0) > ROLE_DEFINITIONS[this.activeRole].maxDiscountPct
          ? "pending_approval"
          : "approved",
      routeSteps: [1, 2, 3, 4, 5, 6],
      productionStage: quote.productionStage || statusToDefaultStage(quote.status),
      stationStatus: "waiting",
      estimatedCost,
      actualCost: estimatedCost,
      ...quote,
      id: generatedId,
      createdAt: now,
      date: formatTrNow(),
    };
    this.quotes = [newQuote, ...this.quotes.filter((q) => q.id !== generatedId)];
    this.notifyQuotes();

    if (isFirebaseConfigured) {
      setDoc(doc(db, COLLECTIONS.QUOTES, newQuote.id), stripUndefined(newQuote)).catch(() => {});
    }
    return newQuote;
  }

  public updateQuoteStatus(id: string, status: QuoteItem["status"]): { ok: boolean; error?: string } {
    const existing = this.quotes.find((q) => q.id === id);
    if (!existing) return { ok: false, error: "Sipariş bulunamadı." };

    // KABUL TESTİ #5: Kalite blokajı olan ürün sevkiyata veya tamamlandıya ayrılamaz!
    if (existing.qualityHold && (status === "completed")) {
      this.logAuditEvent(
        "RBAC_DENIED",
        id,
        `Kalite blokajı (${existing.qualityHoldReason || "Karantina"}) bulunan siparişin teslim/sevk edilmesi engellendi.`
      );
      return {
        ok: false,
        error: `KABUL TESTİ #5 ENGELİ: ${id} siparişinde aktif KALİTE BLOKAJI (${existing.qualityHoldReason || "Uygunsuzluk"}) var! Kalite modülünden serbest bırakılmadan sevkiyata/teslime kapatılamaz.`,
      };
    }

    const nextStage = statusToDefaultStage(status);
    const orderSnapshotAt =
      status === "approved" && !existing.orderSnapshotAt ? formatTrNow() : existing.orderSnapshotAt;

    this.quotes = this.quotes.map((q) =>
      q.id === id
        ? { ...q, status, productionStage: nextStage, orderSnapshotAt }
        : q
    );
    this.notifyQuotes();

    if (isFirebaseConfigured) {
      updateDoc(
        doc(db, COLLECTIONS.QUOTES, id),
        stripUndefined({
          status,
          productionStage: nextStage,
          orderSnapshotAt,
        })
      ).catch(() => {});
    }
    return { ok: true };
  }

  public updateQuote(
    id: string,
    fields: Partial<QuoteItem>,
    revisionReason?: string
  ): { ok: boolean; error?: string } {
    const existing = this.quotes.find((q) => q.id === id);
    if (!existing) return { ok: false, error: "Kayıt bulunamadı." };

    // KABUL TESTİ #5: Kalite blokajı varken istasyon 5 (Sevkiyat) veya 6 (Teslimat) seçilemez!
    const targetStage = fields.productionStage ?? existing.productionStage;
    const isStillHeld = fields.qualityHold !== undefined ? fields.qualityHold : existing.qualityHold;
    if (isStillHeld && targetStage && targetStage >= 5 && fields.qualityHold !== false) {
      this.logAuditEvent(
        "RBAC_DENIED",
        id,
        `Kalite blokajlı ürünün Sevkiyat (Aşama ${targetStage}) adımına ilerletilmesi engellendi.`
      );
      return {
        ok: false,
        error: `KALİTE BLOKAJI ENGELİ: Bu sipariş karantinada olduğu için Sevkiyat / Teslimat aşamasına geçirilemez!`,
      };
    }

    // KABUL TESTİ #2: Teklif tutarı, alanı veya ölçüleri değiştiyse eski sürümü revisions[] dizisinde koru
    let updatedRevisions = existing.revisions ? [...existing.revisions] : [];
    let nextVersion = existing.version || 1;

    const priceChanged =
      fields.estimatedPrice !== undefined && fields.estimatedPrice !== existing.estimatedPrice;
    const areaChanged =
      fields.totalArea !== undefined && fields.totalArea !== existing.totalArea;
    const dimChanged =
      fields.dimensions !== undefined && fields.dimensions !== existing.dimensions;

    if (priceChanged || areaChanged || dimChanged || revisionReason) {
      const revEntry: QuoteRevision = {
        version: nextVersion,
        date: existing.date || formatTrNow(),
        updatedBy: auth.currentUser?.email || ROLE_DEFINITIONS[this.activeRole].label,
        previousTotal: existing.estimatedPrice || 0,
        previousArea: existing.totalArea || 0,
        dimensionsSummary: existing.dimensions || "-",
        discountRate: existing.discountRate || 0,
        priceListVersion: existing.priceListVersion || "2026-Liste-v1",
        reason: revisionReason || "Teklif kalem / fiyat revizyonu",
      };
      updatedRevisions = [revEntry, ...updatedRevisions];
      nextVersion += 1;

      this.logAuditEvent(
        "QUOTE_REVISION",
        id,
        `v${revEntry.version} (₺${revEntry.previousTotal.toLocaleString("tr-TR")}) -> v${nextVersion} (₺${(fields.estimatedPrice ?? existing.estimatedPrice).toLocaleString("tr-TR")}) revize edildi.`
      );
    }

    const merged: QuoteItem = {
      ...existing,
      ...fields,
      version: nextVersion,
      revisions: updatedRevisions,
    };

    this.quotes = this.quotes.map((q) => (q.id === id ? merged : q));
    this.notifyQuotes();

    if (isFirebaseConfigured) {
      updateDoc(
        doc(db, COLLECTIONS.QUOTES, id),
        stripUndefined({
          ...fields,
          version: nextVersion,
          revisions: updatedRevisions,
        })
      ).catch(() => {});
    }
    return { ok: true };
  }

  public cancelQuoteWithReason(id: string, reason: string): void {
    const existing = this.quotes.find((q) => q.id === id);
    if (!existing) return;
    const cancelledBy = auth.currentUser?.email || ROLE_DEFINITIONS[this.activeRole].label;
    this.updateQuote(id, {
      status: "cancelled",
      cancelReason: reason,
      cancelledBy,
    });
    this.logAuditEvent("ORDER_CANCEL", id, `Kayıt gerekçeli olarak iptal edildi: "${reason}"`);
  }

  public deleteQuote(id: string): void {
    this.quotes = this.quotes.filter((q) => q.id !== id);
    this.notifyQuotes();

    if (isFirebaseConfigured) {
      deleteDoc(doc(db, COLLECTIONS.QUOTES, id)).catch(() => {});
    }
  }

  public subscribeQuotes(callback: (quotes: QuoteItem[]) => void): () => void {
    this.quoteListeners.add(callback);
    callback(this.getQuotes());
    return () => this.quoteListeners.delete(callback);
  }

  private notifyQuotes(): void {
    const current = this.getQuotes();
    this.saveLocalKey("acarpen_live_v3_quotes", current);
    this.quoteListeners.forEach((cb) => cb(current));
  }

  // --- Customers (CRM 360) Operations ---
  public getCustomers(): CustomerRecord[] {
    return [...this.customers];
  }

  public saveCustomer(
    record: Omit<CustomerRecord, "id" | "createdAt"> & { id?: string }
  ): CustomerRecord {
    const now = Date.now();
    const id = record.id || `MUS-${now.toString().slice(-6)}`;
    const fullRecord: CustomerRecord = {
      ...record,
      id,
      createdAt: now,
    };
    this.customers = [fullRecord, ...this.customers.filter((c) => c.id !== id)];
    this.notifyCustomers();

    if (isFirebaseConfigured) {
      setDoc(doc(db, COLLECTIONS.CUSTOMERS, id), stripUndefined(fullRecord)).catch(() => {});
    }
    return fullRecord;
  }

  public subscribeCustomers(callback: (customers: CustomerRecord[]) => void): () => void {
    this.customerListeners.add(callback);
    callback(this.getCustomers());
    return () => this.customerListeners.delete(callback);
  }

  private notifyCustomers(): void {
    const current = this.getCustomers();
    this.saveLocalKey("acarpen_live_v3_customers", current);
    this.customerListeners.forEach((cb) => cb(current));
  }

  // --- Opportunities (CRM Funnel) Operations ---
  public getOpportunities(): OpportunityItem[] {
    return [...this.opportunities];
  }

  public addOpportunity(
    item: Omit<OpportunityItem, "id" | "createdAt" | "date"> & { id?: string }
  ): OpportunityItem {
    const now = Date.now();
    const id = item.id || `FRS-${now.toString().slice(-6)}`;
    const created: OpportunityItem = {
      ...item,
      id,
      createdAt: now,
      date: formatTrNow(),
    };
    this.opportunities = [created, ...this.opportunities];
    this.notifyOpportunities();

    if (isFirebaseConfigured) {
      setDoc(doc(db, COLLECTIONS.OPPORTUNITIES, id), stripUndefined(created)).catch(() => {});
    }
    return created;
  }

  public updateOpportunity(id: string, fields: Partial<OpportunityItem>): void {
    this.opportunities = this.opportunities.map((o) => (o.id === id ? { ...o, ...fields } : o));
    this.notifyOpportunities();

    if (isFirebaseConfigured) {
      updateDoc(doc(db, COLLECTIONS.OPPORTUNITIES, id), stripUndefined(fields)).catch(() => {});
    }
  }

  public subscribeOpportunities(callback: (items: OpportunityItem[]) => void): () => void {
    this.opportunityListeners.add(callback);
    callback(this.getOpportunities());
    return () => this.opportunityListeners.delete(callback);
  }

  private notifyOpportunities(): void {
    const current = this.getOpportunities();
    this.saveLocalKey("acarpen_live_v3_opportunities", current);
    this.opportunityListeners.forEach((cb) => cb(current));
  }

  // --- Activities (CRM Follow-up Tasks) Operations ---
  public getActivities(): ActivityItem[] {
    return [...this.activities];
  }

  public addActivity(item: Omit<ActivityItem, "id" | "createdAt">): ActivityItem {
    const now = Date.now();
    const created: ActivityItem = {
      ...item,
      id: `AKT-${now.toString().slice(-6)}`,
      createdAt: now,
    };
    this.activities = [created, ...this.activities];
    this.notifyActivities();

    if (isFirebaseConfigured) {
      setDoc(doc(db, COLLECTIONS.ACTIVITIES, created.id), stripUndefined(created)).catch(() => {});
    }
    return created;
  }

  public toggleActivityCompleted(id: string): void {
    const target = this.activities.find((a) => a.id === id);
    if (!target) return;
    const nextState = !target.completed;
    this.activities = this.activities.map((a) =>
      a.id === id ? { ...a, completed: nextState } : a
    );
    this.notifyActivities();

    if (isFirebaseConfigured) {
      updateDoc(doc(db, COLLECTIONS.ACTIVITIES, id), { completed: nextState }).catch(() => {});
    }
  }

  public subscribeActivities(callback: (items: ActivityItem[]) => void): () => void {
    this.activityListeners.add(callback);
    callback(this.getActivities());
    return () => this.activityListeners.delete(callback);
  }

  private notifyActivities(): void {
    const current = this.getActivities();
    this.saveLocalKey("acarpen_live_v3_activities", current);
    this.activityListeners.forEach((cb) => cb(current));
  }

  // --- Inventory & Stock Operations ---
  public getInventory(): InventoryItem[] {
    return [...this.inventory];
  }

  public updateInventoryItem(
    id: string,
    fields: Partial<InventoryItem>,
    reason = "Stok hareketi / düzeltme"
  ): { ok: boolean; error?: string } {
    if (!ROLE_DEFINITIONS[this.activeRole].permissions.canAdjustStock) {
      this.logAuditEvent(
        "RBAC_DENIED",
        id,
        `${ROLE_DEFINITIONS[this.activeRole].label} rolü ile yetkisiz stok düzeltme denemesi engellendi.`
      );
      return {
        ok: false,
        error: "YETKİ ENGELİ (Kabul Testi #9): Bu rol ile stok düzeltme işlemi yapılamaz.",
      };
    }

    this.inventory = this.inventory.map((item) =>
      item.id === id ? { ...item, ...fields, updatedAt: formatTrNow() } : item
    );
    this.notifyInventory();

    const target = this.inventory.find((i) => i.id === id);
    if (target && isFirebaseConfigured) {
      setDoc(doc(db, COLLECTIONS.INVENTORY, id), stripUndefined(target), { merge: true }).catch(
        () => {}
      );
    }
    this.logAuditEvent("STOCK_ADJUSTMENT", id, `${target?.name || id}: ${reason}`);
    return { ok: true };
  }

  public addInventoryItem(item: Omit<InventoryItem, "id">): InventoryItem {
    const id = `stk-${Date.now().toString().slice(-6)}`;
    const created: InventoryItem = { ...item, id, updatedAt: formatTrNow() };
    this.inventory = [...this.inventory, created];
    this.notifyInventory();

    if (isFirebaseConfigured) {
      setDoc(doc(db, COLLECTIONS.INVENTORY, id), stripUndefined(created)).catch(() => {});
    }
    this.logAuditEvent("STOCK_ADJUSTMENT", id, `Yeni stok kartı açıldı: ${created.name} (${created.lotNo})`);
    return created;
  }

  public subscribeInventory(callback: (items: InventoryItem[]) => void): () => void {
    this.inventoryListeners.add(callback);
    callback(this.getInventory());
    return () => this.inventoryListeners.delete(callback);
  }

  private notifyInventory(): void {
    const current = this.getInventory();
    this.inventoryListeners.forEach((cb) => cb(current));
  }

  // --- Purchase Orders Operations ---
  public getPurchases(): PurchaseOrderItem[] {
    return [...this.purchases];
  }

  public addPurchaseOrder(
    po: Omit<PurchaseOrderItem, "id" | "createdAt" | "date">
  ): PurchaseOrderItem {
    const now = Date.now();
    const created: PurchaseOrderItem = {
      ...po,
      id: `SAT-${now.toString().slice(-6)}`,
      createdAt: now,
      date: formatTrNow(),
    };
    this.purchases = [created, ...this.purchases];
    this.notifyPurchases();

    if (isFirebaseConfigured) {
      setDoc(doc(db, COLLECTIONS.PURCHASES, created.id), stripUndefined(created)).catch(() => {});
    }
    return created;
  }

  public updatePurchaseOrder(id: string, fields: Partial<PurchaseOrderItem>): void {
    this.purchases = this.purchases.map((p) => (p.id === id ? { ...p, ...fields } : p));
    this.notifyPurchases();

    if (isFirebaseConfigured) {
      updateDoc(doc(db, COLLECTIONS.PURCHASES, id), stripUndefined(fields)).catch(() => {});
    }
  }

  public subscribePurchases(callback: (items: PurchaseOrderItem[]) => void): () => void {
    this.purchaseListeners.add(callback);
    callback(this.getPurchases());
    return () => this.purchaseListeners.delete(callback);
  }

  private notifyPurchases(): void {
    const current = this.getPurchases();
    this.purchaseListeners.forEach((cb) => cb(current));
  }

  // --- Quality Control Operations (Kabul Testi #5) ---
  public getQualityInspections(): QualityInspectionItem[] {
    return [...this.qualityInspections];
  }

  public addQualityInspection(
    q: Omit<QualityInspectionItem, "id" | "createdAt" | "date">
  ): QualityInspectionItem {
    const now = Date.now();
    const created: QualityInspectionItem = {
      ...q,
      id: `KAL-${now.toString().slice(-6)}`,
      createdAt: now,
      date: formatTrNow(),
    };
    this.qualityInspections = [created, ...this.qualityInspections];
    this.notifyQuality();

    if (isFirebaseConfigured) {
      setDoc(doc(db, COLLECTIONS.QUALITY, created.id), stripUndefined(created)).catch(() => {});
    }

    // Sipariş üzerinde kalite blokajı oluştur veya kaldır
    if (q.orderId) {
      const shouldHold = q.result === "Karantina (Blokaj)" || q.result === "Hurda / Yeniden İşleme";
      this.updateQuote(q.orderId, {
        qualityHold: shouldHold,
        qualityHoldReason: shouldHold ? q.defectReason || "Kalite uygunsuzluğu" : "",
        qualityDisposition: shouldHold ? "Bekliyor" : "Serbest",
        qualityInspector: q.inspector,
        qualityCheckedAt: created.date,
        stationStatus: shouldHold ? "quality_hold" : "running",
      });
      this.logAuditEvent(
        shouldHold ? "QUALITY_HOLD" : "QUALITY_RELEASE",
        q.orderId,
        `${q.inspectionType} sonucu: ${q.result} (${q.defectReason || "Uygun"})`
      );
    }

    return created;
  }

  public releaseOrderQualityHold(
    orderId: string,
    disposition: "Yeniden İşleme" | "Şartlı Kabul" | "Müşteri Onayı" | "Serbest",
    note: string
  ): { ok: boolean; error?: string } {
    if (!ROLE_DEFINITIONS[this.activeRole].permissions.canReleaseQualityHold) {
      this.logAuditEvent(
        "RBAC_DENIED",
        orderId,
        `${ROLE_DEFINITIONS[this.activeRole].label} rolü ile yetkisiz kalite blokajı kaldırma denemesi engellendi.`
      );
      return {
        ok: false,
        error: "YETKİ ENGELİ (Kabul Testi #9): Kalite blokajını yalnızca Kalite Kontrol Uzmanı veya Yönetici kaldırabilir.",
      };
    }

    this.updateQuote(orderId, {
      qualityHold: false,
      qualityDisposition: disposition,
      qualityHoldReason: note,
      stationStatus: "running",
    });

    this.logAuditEvent(
      "QUALITY_RELEASE",
      orderId,
      `Kalite blokajı "${disposition}" kararıyla serbest bırakıldı: ${note}`
    );
    return { ok: true };
  }

  public subscribeQuality(callback: (items: QualityInspectionItem[]) => void): () => void {
    this.qualityListeners.add(callback);
    callback(this.getQualityInspections());
    return () => this.qualityListeners.delete(callback);
  }

  private notifyQuality(): void {
    const current = this.getQualityInspections();
    this.qualityListeners.forEach((cb) => cb(current));
  }

  // --- Messages Operations ---
  public getMessages(): ContactMessage[] {
    return [...this.messages];
  }

  public addMessage(msg: Omit<ContactMessage, "id" | "date" | "isRead">): ContactMessage {
    const now = Date.now();
    const newMsg: ContactMessage = {
      ...msg,
      id: `MSG-${now.toString().slice(-6)}`,
      createdAt: now,
      date: formatTrNow(),
      isRead: false,
    };
    this.messages = [newMsg, ...this.messages];
    this.notifyMessages();

    if (isFirebaseConfigured) {
      setDoc(doc(db, COLLECTIONS.MESSAGES, newMsg.id), stripUndefined(newMsg)).catch(() => {});
    }
    return newMsg;
  }

  public markMessageAsRead(id: string): void {
    this.messages = this.messages.map((m) => (m.id === id ? { ...m, isRead: true } : m));
    this.notifyMessages();

    if (isFirebaseConfigured) {
      updateDoc(doc(db, COLLECTIONS.MESSAGES, id), { isRead: true }).catch(() => {});
    }
  }

  public deleteMessage(id: string): void {
    this.messages = this.messages.filter((m) => m.id !== id);
    this.notifyMessages();

    if (isFirebaseConfigured) {
      deleteDoc(doc(db, COLLECTIONS.MESSAGES, id)).catch(() => {});
    }
  }

  public subscribeMessages(callback: (messages: ContactMessage[]) => void): () => void {
    this.messageListeners.add(callback);
    callback(this.getMessages());
    return () => this.messageListeners.delete(callback);
  }

  private notifyMessages(): void {
    const current = this.getMessages();
    this.saveLocalKey("acarpen_live_v3_messages", current);
    this.messageListeners.forEach((cb) => cb(current));
  }

  // --- Prices Operations (Kabul Testi #9 Yetki Korumalı) ---
  public getPrices(): FactoryPriceItem[] {
    return [...this.prices];
  }

  public updatePrice(id: string, newPrice: number): { ok: boolean; error?: string } {
    if (!ROLE_DEFINITIONS[this.activeRole].permissions.canEditPrices) {
      this.logAuditEvent(
        "RBAC_DENIED",
        id,
        `${ROLE_DEFINITIONS[this.activeRole].label} rolü ile yetkisiz fiyat değiştirme denemesi engellendi.`
      );
      return {
        ok: false,
        error: "YETKİ ENGELİ (Kabul Testi #9): Mevcut rolünüz fiyat listesini değiştirmeye yetkili değildir.",
      };
    }

    const oldItem = this.prices.find((p) => p.id === id);
    this.prices = this.prices.map((p) => (p.id === id ? { ...p, m2Price: newPrice } : p));
    this.notifyPrices();

    if (isFirebaseConfigured) {
      const target = this.prices.find((p) => p.id === id);
      if (target) {
        setDoc(doc(db, COLLECTIONS.PRICES, id), stripUndefined(target), { merge: true }).catch(() => {});
      }
    }
    this.logAuditEvent(
      "PRICE_CHANGE",
      id,
      `${oldItem?.name || id} birim fiyatı ₺${oldItem?.m2Price || 0} -> ₺${newPrice} olarak güncellendi.`
    );
    return { ok: true };
  }

  public updatePriceItem(id: string, fields: Partial<FactoryPriceItem>): { ok: boolean; error?: string } {
    if (!ROLE_DEFINITIONS[this.activeRole].permissions.canEditPrices) {
      this.logAuditEvent("RBAC_DENIED", id, "Yetkisiz fiyat kartı güncelleme denemesi engellendi.");
      return {
        ok: false,
        error: "YETKİ ENGELİ (Kabul Testi #9): Mevcut rolünüz fiyat kartlarını değiştiremez.",
      };
    }

    this.prices = this.prices.map((p) => (p.id === id ? { ...p, ...fields } : p));
    this.notifyPrices();

    if (isFirebaseConfigured) {
      const target = this.prices.find((p) => p.id === id);
      if (target) {
        setDoc(doc(db, COLLECTIONS.PRICES, id), stripUndefined(target), { merge: true }).catch(() => {});
      }
    }
    return { ok: true };
  }

  public applyBulkPricePercentage(percentChange: number): { ok: boolean; error?: string } {
    if (!ROLE_DEFINITIONS[this.activeRole].permissions.canEditPrices) {
      this.logAuditEvent("RBAC_DENIED", "ALL_PRICES", "Yetkisiz toplu fiyat güncelleme denemesi engellendi.");
      return {
        ok: false,
        error: "YETKİ ENGELİ (Kabul Testi #9): Toplu fiyat güncellemesi için Yönetici veya Satış Yöneticisi yetkisi gereklidir.",
      };
    }

    const factor = 1 + percentChange / 100;
    this.prices = this.prices.map((p) => ({
      ...p,
      m2Price: Math.max(10, Math.round((p.m2Price * factor) / 5) * 5),
    }));
    this.notifyPrices();

    if (isFirebaseConfigured) {
      this.prices.forEach((item) => {
        setDoc(doc(db, COLLECTIONS.PRICES, item.id), stripUndefined(item), { merge: true }).catch(() => {});
      });
    }
    this.logAuditEvent(
      "PRICE_CHANGE",
      "BULK_PRICES",
      `Tüm cam birim fiyatlarına toplu %${percentChange > 0 ? `+${percentChange}` : percentChange} güncelleme uygulandı.`
    );
    return { ok: true };
  }

  public addPriceItem(item: Omit<FactoryPriceItem, "id"> & { id?: string }): FactoryPriceItem | null {
    if (!ROLE_DEFINITIONS[this.activeRole].permissions.canEditPrices) {
      this.logAuditEvent("RBAC_DENIED", "NEW_PRICE", "Yetkisiz yeni fiyat kalemi ekleme denemesi engellendi.");
      return null;
    }

    const slugId =
      item.id ||
      item.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "") +
        "-" +
        Date.now().toString().slice(-4);
    const created: FactoryPriceItem = {
      category: "Özel Cam",
      stock: "Mevcut",
      version: "2026-Liste-v1",
      ...item,
      id: slugId,
    };
    this.prices = [...this.prices, created];
    this.notifyPrices();

    if (isFirebaseConfigured) {
      setDoc(doc(db, COLLECTIONS.PRICES, created.id), stripUndefined(created)).catch(() => {});
    }
    this.logAuditEvent("PRICE_CHANGE", created.id, `Yeni cam fiyat kartı eklendi: ${created.name} (₺${created.m2Price}/m²)`);
    return created;
  }

  public deletePriceItem(id: string): void {
    if (!ROLE_DEFINITIONS[this.activeRole].permissions.canEditPrices) return;
    this.prices = this.prices.filter((p) => p.id !== id);
    this.notifyPrices();

    if (isFirebaseConfigured) {
      deleteDoc(doc(db, COLLECTIONS.PRICES, id)).catch(() => {});
    }
  }

  public subscribePrices(callback: (prices: FactoryPriceItem[]) => void): () => void {
    this.priceListeners.add(callback);
    callback(this.getPrices());
    return () => this.priceListeners.delete(callback);
  }

  private notifyPrices(): void {
    const current = this.getPrices();
    this.priceListeners.forEach((cb) => cb(current));
  }

  // --- Extra Services Operations ---
  public getServices(): FactoryServiceItem[] {
    return [...this.services];
  }

  public updateService(id: string, fields: Partial<FactoryServiceItem>): void {
    if (!ROLE_DEFINITIONS[this.activeRole].permissions.canEditPrices) return;
    this.services = this.services.map((s) => (s.id === id ? { ...s, ...fields } : s));
    this.notifyServices();

    if (isFirebaseConfigured) {
      const target = this.services.find((s) => s.id === id);
      if (target) {
        setDoc(doc(db, COLLECTIONS.SERVICES, id), stripUndefined(target), { merge: true }).catch(() => {});
      }
    }
  }

  public addService(item: Omit<FactoryServiceItem, "id"> & { id?: string }): FactoryServiceItem | null {
    if (!ROLE_DEFINITIONS[this.activeRole].permissions.canEditPrices) return null;
    const slugId =
      item.id ||
      "srv-" +
        item.ad
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "") +
        "-" +
        Date.now().toString().slice(-4);
    const created: FactoryServiceItem = {
      birim: "İşlem",
      ...item,
      id: slugId,
    };
    this.services = [...this.services, created];
    this.notifyServices();

    if (isFirebaseConfigured) {
      setDoc(doc(db, COLLECTIONS.SERVICES, created.id), stripUndefined(created)).catch(() => {});
    }
    return created;
  }

  public deleteService(id: string): void {
    if (!ROLE_DEFINITIONS[this.activeRole].permissions.canEditPrices) return;
    this.services = this.services.filter((s) => s.id !== id);
    this.notifyServices();

    if (isFirebaseConfigured) {
      deleteDoc(doc(db, COLLECTIONS.SERVICES, id)).catch(() => {});
    }
  }

  public subscribeServices(callback: (services: FactoryServiceItem[]) => void): () => void {
    this.serviceListeners.add(callback);
    callback(this.getServices());
    return () => this.serviceListeners.delete(callback);
  }

  private notifyServices(): void {
    const current = this.getServices();
    this.serviceListeners.forEach((cb) => cb(current));
  }

  // --- Checks Portfolio Operations (Alınan Çekler & Kesilen Çekler) ---
  public getChecks(): CheckInstrumentItem[] {
    return [...this.checks];
  }

  public addCheck(
    item: Omit<CheckInstrumentItem, "id" | "createdAt" | "issueDate"> & { issueDate?: string }
  ): CheckInstrumentItem {
    const now = Date.now();
    const prefix = item.direction === "received" ? "CEK-AL" : "CEK-VER";
    const created: CheckInstrumentItem = {
      ...item,
      id: `${prefix}-${now.toString().slice(-6)}`,
      issueDate: item.issueDate || formatTrNow().slice(0, 10),
      createdAt: now,
    };
    this.checks = [created, ...this.checks];
    this.notifyChecks();

    if (isFirebaseConfigured) {
      setDoc(doc(db, COLLECTIONS.CHECKS, created.id), stripUndefined(created)).catch(() => {});
    }
    this.logAuditEvent(
      "INVOICE_ISSUE",
      created.id,
      `${item.direction === "received" ? "Alınan Çek" : "Kesilen Çek"} kaydedildi: ${created.counterparty} — ₺${created.amount.toLocaleString("tr-TR")} (Vade: ${created.dueDate})`
    );
    return created;
  }

  public updateCheck(id: string, fields: Partial<CheckInstrumentItem>): void {
    this.checks = this.checks.map((c) => (c.id === id ? { ...c, ...fields } : c));
    this.notifyChecks();

    if (isFirebaseConfigured) {
      updateDoc(doc(db, COLLECTIONS.CHECKS, id), stripUndefined(fields)).catch(() => {});
    }
  }

  public deleteCheck(id: string): void {
    this.checks = this.checks.filter((c) => c.id !== id);
    this.notifyChecks();

    if (isFirebaseConfigured) {
      deleteDoc(doc(db, COLLECTIONS.CHECKS, id)).catch(() => {});
    }
  }

  public subscribeChecks(callback: (items: CheckInstrumentItem[]) => void): () => void {
    this.checkListeners.add(callback);
    callback(this.getChecks());
    return () => this.checkListeners.delete(callback);
  }

  private notifyChecks(): void {
    const current = this.getChecks();
    this.saveLocalKey("acarpen_live_v3_checks", current);
    this.checkListeners.forEach((cb) => cb(current));
  }

  // --- Cash & Bank Ledger Operations (Kasa & Banka Hareketleri) ---
  public getCashLedger(): CashLedgerItem[] {
    return [...this.cashLedger];
  }

  public addCashLedgerEntry(
    item: Omit<CashLedgerItem, "id" | "createdAt" | "date">
  ): CashLedgerItem {
    const now = Date.now();
    const created: CashLedgerItem = {
      ...item,
      id: `KASA-${now.toString().slice(-6)}`,
      date: formatTrNow(),
      createdAt: now,
    };
    this.cashLedger = [created, ...this.cashLedger];
    this.notifyCashLedger();

    if (isFirebaseConfigured) {
      setDoc(doc(db, COLLECTIONS.CASH_LEDGER, created.id), stripUndefined(created)).catch(() => {});
    }
    this.logAuditEvent(
      "INVOICE_ISSUE",
      created.id,
      `Kasa/Banka (${created.accountName}) ${created.type === "in" ? "GİRİŞ" : "ÇIKIŞ"}: ₺${created.amount.toLocaleString("tr-TR")} — ${created.counterparty}`
    );
    return created;
  }

  public deleteCashLedgerEntry(id: string): void {
    this.cashLedger = this.cashLedger.filter((e) => e.id !== id);
    this.notifyCashLedger();

    if (isFirebaseConfigured) {
      deleteDoc(doc(db, COLLECTIONS.CASH_LEDGER, id)).catch(() => {});
    }
  }

  public subscribeCashLedger(callback: (items: CashLedgerItem[]) => void): () => void {
    this.cashLedgerListeners.add(callback);
    callback(this.getCashLedger());
    return () => this.cashLedgerListeners.delete(callback);
  }

  private notifyCashLedger(): void {
    const current = this.getCashLedger();
    this.saveLocalKey("acarpen_live_v3_cash_ledger", current);
    this.cashLedgerListeners.forEach((cb) => cb(current));
  }

  public purgeAllTransactionalData(): void {
    const quoteIds = this.quotes.map((q) => q.id);
    const msgIds = this.messages.map((m) => m.id);
    const custIds = this.customers.map((c) => c.id);
    const oppIds = this.opportunities.map((o) => o.id);
    const actIds = this.activities.map((a) => a.id);
    const invIds = this.inventory.map((i) => i.id);
    const purIds = this.purchases.map((p) => p.id);
    const qualIds = this.qualityInspections.map((q) => q.id);
    const audIds = this.auditLogs.map((a) => a.id);
    const chkIds = this.checks.map((c) => c.id);
    const cashIds = this.cashLedger.map((c) => c.id);

    this.quotes = [];
    this.messages = [];
    this.customers = [];
    this.opportunities = [];
    this.activities = [];
    this.inventory = [];
    this.purchases = [];
    this.qualityInspections = [];
    this.auditLogs = [];
    this.checks = [];
    this.cashLedger = [];

    this.notifyQuotes();
    this.notifyMessages();
    this.notifyCustomers();
    this.notifyOpportunities();
    this.notifyActivities();
    this.notifyInventory();
    this.notifyPurchases();
    this.notifyQuality();
    this.notifyAuditLogs();
    this.notifyChecks();
    this.notifyCashLedger();
    this.cleanupLegacyFakeCache();

    if (isFirebaseConfigured) {
      quoteIds.forEach((id) => deleteDoc(doc(db, COLLECTIONS.QUOTES, id)).catch(() => {}));
      msgIds.forEach((id) => deleteDoc(doc(db, COLLECTIONS.MESSAGES, id)).catch(() => {}));
      custIds.forEach((id) => deleteDoc(doc(db, COLLECTIONS.CUSTOMERS, id)).catch(() => {}));
      oppIds.forEach((id) => deleteDoc(doc(db, COLLECTIONS.OPPORTUNITIES, id)).catch(() => {}));
      actIds.forEach((id) => deleteDoc(doc(db, COLLECTIONS.ACTIVITIES, id)).catch(() => {}));
      invIds.forEach((id) => deleteDoc(doc(db, COLLECTIONS.INVENTORY, id)).catch(() => {}));
      purIds.forEach((id) => deleteDoc(doc(db, COLLECTIONS.PURCHASES, id)).catch(() => {}));
      qualIds.forEach((id) => deleteDoc(doc(db, COLLECTIONS.QUALITY, id)).catch(() => {}));
      audIds.forEach((id) => deleteDoc(doc(db, COLLECTIONS.AUDIT_LOGS, id)).catch(() => {}));
      chkIds.forEach((id) => deleteDoc(doc(db, COLLECTIONS.CHECKS, id)).catch(() => {}));
      cashIds.forEach((id) => deleteDoc(doc(db, COLLECTIONS.CASH_LEDGER, id)).catch(() => {}));
      LEGACY_MOCK_IDS.forEach((id) => {
        deleteDoc(doc(db, COLLECTIONS.QUOTES, id)).catch(() => {});
        deleteDoc(doc(db, COLLECTIONS.MESSAGES, id)).catch(() => {});
        deleteDoc(doc(db, COLLECTIONS.INVENTORY, id)).catch(() => {});
        deleteDoc(doc(db, COLLECTIONS.CHECKS, id)).catch(() => {});
        deleteDoc(doc(db, COLLECTIONS.CASH_LEDGER, id)).catch(() => {});
      });
    }
  }
}

// Global active store instance
export const liveStore = new ActiveDataStore();
export const purgeAllAdminTransactionalData = () => liveStore.purgeAllTransactionalData();

// Export standard functional API for direct use
export const getAdminChecks = () => liveStore.getChecks();
export const addAdminCheck = (
  item: Omit<CheckInstrumentItem, "id" | "createdAt" | "issueDate"> & { issueDate?: string }
) => liveStore.addCheck(item);
export const updateAdminCheck = (id: string, fields: Partial<CheckInstrumentItem>) =>
  liveStore.updateCheck(id, fields);
export const deleteAdminCheck = (id: string) => liveStore.deleteCheck(id);
export const subscribeAdminChecks = (cb: (items: CheckInstrumentItem[]) => void) =>
  liveStore.subscribeChecks(cb);

export const getAdminCashLedger = () => liveStore.getCashLedger();
export const addAdminCashLedgerEntry = (item: Omit<CashLedgerItem, "id" | "createdAt" | "date">) =>
  liveStore.addCashLedgerEntry(item);
export const deleteAdminCashLedgerEntry = (id: string) => liveStore.deleteCashLedgerEntry(id);
export const subscribeAdminCashLedger = (cb: (items: CashLedgerItem[]) => void) =>
  liveStore.subscribeCashLedger(cb);
export const getAdminQuotes = () => liveStore.getQuotes();
export const addAdminQuote = (q: Omit<QuoteItem, "id" | "date"> & { id?: string }) => liveStore.addQuote(q);
export const updateQuoteStatus = (id: string, status: QuoteItem["status"]) => liveStore.updateQuoteStatus(id, status);
export const updateAdminQuote = (id: string, fields: Partial<QuoteItem>, reason?: string) =>
  liveStore.updateQuote(id, fields, reason);
export const cancelAdminQuoteWithReason = (id: string, reason: string) =>
  liveStore.cancelQuoteWithReason(id, reason);
export const deleteAdminQuote = (id: string) => liveStore.deleteQuote(id);
export const subscribeAdminQuotes = (cb: (quotes: QuoteItem[]) => void) => liveStore.subscribeQuotes(cb);

export const getAdminMessages = () => liveStore.getMessages();
export const addAdminMessage = (m: Omit<ContactMessage, "id" | "date" | "isRead">) => liveStore.addMessage(m);
export const markMessageAsRead = (id: string) => liveStore.markMessageAsRead(id);
export const deleteAdminMessage = (id: string) => liveStore.deleteMessage(id);
export const subscribeAdminMessages = (cb: (messages: ContactMessage[]) => void) => liveStore.subscribeMessages(cb);

export const getAdminPrices = () => liveStore.getPrices();
export const updateAdminPrice = (id: string, price: number) => liveStore.updatePrice(id, price);
export const updateAdminPriceItem = (id: string, fields: Partial<FactoryPriceItem>) => liveStore.updatePriceItem(id, fields);
export const applyBulkAdminPricePercentage = (percent: number) => liveStore.applyBulkPricePercentage(percent);
export const addAdminPrice = (item: Omit<FactoryPriceItem, "id"> & { id?: string }) => liveStore.addPriceItem(item);
export const deleteAdminPrice = (id: string) => liveStore.deletePriceItem(id);
export const subscribeAdminPrices = (cb: (prices: FactoryPriceItem[]) => void) => liveStore.subscribePrices(cb);

export const getAdminServices = () => liveStore.getServices();
export const updateAdminService = (id: string, fields: Partial<FactoryServiceItem>) => liveStore.updateService(id, fields);
export const addAdminService = (item: Omit<FactoryServiceItem, "id"> & { id?: string }) => liveStore.addService(item);
export const deleteAdminService = (id: string) => liveStore.deleteService(id);
export const subscribeAdminServices = (cb: (services: FactoryServiceItem[]) => void) => liveStore.subscribeServices(cb);

export const getAdminCustomers = () => liveStore.getCustomers();
export const saveAdminCustomer = (c: Omit<CustomerRecord, "id" | "createdAt"> & { id?: string }) =>
  liveStore.saveCustomer(c);
export const subscribeAdminCustomers = (cb: (customers: CustomerRecord[]) => void) =>
  liveStore.subscribeCustomers(cb);

export const getAdminOpportunities = () => liveStore.getOpportunities();
export const addAdminOpportunity = (
  o: Omit<OpportunityItem, "id" | "createdAt" | "date"> & { id?: string }
) => liveStore.addOpportunity(o);
export const updateAdminOpportunity = (id: string, fields: Partial<OpportunityItem>) =>
  liveStore.updateOpportunity(id, fields);
export const subscribeAdminOpportunities = (cb: (items: OpportunityItem[]) => void) =>
  liveStore.subscribeOpportunities(cb);

export const getAdminActivities = () => liveStore.getActivities();
export const addAdminActivity = (a: Omit<ActivityItem, "id" | "createdAt">) => liveStore.addActivity(a);
export const toggleAdminActivity = (id: string) => liveStore.toggleActivityCompleted(id);
export const subscribeAdminActivities = (cb: (items: ActivityItem[]) => void) =>
  liveStore.subscribeActivities(cb);

export const getAdminInventory = () => liveStore.getInventory();
export const updateAdminInventory = (id: string, fields: Partial<InventoryItem>, reason?: string) =>
  liveStore.updateInventoryItem(id, fields, reason);
export const addAdminInventory = (item: Omit<InventoryItem, "id">) => liveStore.addInventoryItem(item);
export const subscribeAdminInventory = (cb: (items: InventoryItem[]) => void) =>
  liveStore.subscribeInventory(cb);

export const getAdminPurchases = () => liveStore.getPurchases();
export const addAdminPurchase = (po: Omit<PurchaseOrderItem, "id" | "createdAt" | "date">) =>
  liveStore.addPurchaseOrder(po);
export const updateAdminPurchase = (id: string, fields: Partial<PurchaseOrderItem>) =>
  liveStore.updatePurchaseOrder(id, fields);
export const subscribeAdminPurchases = (cb: (items: PurchaseOrderItem[]) => void) =>
  liveStore.subscribePurchases(cb);

export const getAdminQuality = () => liveStore.getQualityInspections();
export const addAdminQuality = (q: Omit<QualityInspectionItem, "id" | "createdAt" | "date">) =>
  liveStore.addQualityInspection(q);
export const releaseAdminQualityHold = (
  orderId: string,
  disposition: "Yeniden İşleme" | "Şartlı Kabul" | "Müşteri Onayı" | "Serbest",
  note: string
) => liveStore.releaseOrderQualityHold(orderId, disposition, note);
export const subscribeAdminQuality = (cb: (items: QualityInspectionItem[]) => void) =>
  liveStore.subscribeQuality(cb);

export const getAdminAuditLogs = () => liveStore.getAuditLogs();
export const recordAdminAudit = (
  actionType: AuditEventItem["actionType"],
  targetId: string,
  summary: string
) => liveStore.logAuditEvent(actionType, targetId, summary);
export const subscribeAdminAuditLogs = (cb: (items: AuditEventItem[]) => void) =>
  liveStore.subscribeAuditLogs(cb);

export const getActiveUserRole = () => liveStore.getRole();
export const setActiveUserRole = (role: UserRole) => liveStore.setRole(role);
export const subscribeActiveUserRole = (cb: (role: UserRole) => void) => liveStore.subscribeRole(cb);

export const getLiveSession = () => liveStore.getSession();
export const setLiveSession = (uid: string | null) => liveStore.setSession(uid);
export const subscribeLiveSession = (cb: (uid: string | null) => void) => liveStore.subscribeSession(cb);
