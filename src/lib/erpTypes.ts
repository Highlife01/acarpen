export type UserRole =
  | "yonetici"
  | "satis_yoneticisi"
  | "satis"
  | "uretim_planlama"
  | "operator"
  | "kalite"
  | "depo_satinalma"
  | "finans";

export const VALID_USER_ROLES: ReadonlySet<UserRole> = new Set<UserRole>([
  "yonetici",
  "satis_yoneticisi",
  "satis",
  "uretim_planlama",
  "operator",
  "kalite",
  "depo_satinalma",
  "finans",
]);

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

export interface StaffUserRecord {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  active: boolean;
  tenantId?: string;
  updatedAt: number;
}

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
  siteName?: string;
  customerType?: "Kurumsal / Müteahhit" | "Bayi / Camcı" | "Mimari Ofis" | "Bireysel";
  salesRep?: string;
  leadSource?: string;
  glassType: string;
  thickness: string;
  dimensions: string;
  totalArea: number;
  estimatedPrice: number;
  discountRate?: number;
  extraCost?: number;
  lines?: QuoteLineItem[];
  priceListVersion?: string;
  validUntil?: string;
  version?: number;
  revisions?: QuoteRevision[];
  approvalStatus?: "approved" | "pending_approval" | "rejected";
  approvedBy?: string;
  technicalApproved?: boolean;
  paymentTerms?: "Peşin" | "%50 Avans + Teslimde" | "30 Gün Vadeli" | "60 Gün Vadeli";
  orderSnapshotAt?: string;
  cancelReason?: string;
  cancelledBy?: string;
  paymentStatus?: "unpaid" | "deposit" | "paid";
  paidAmount?: number;
  estimatedCost?: number;
  actualCost?: number;
  invoiceNo?: string;
  waybillNo?: string;
  syncId?: string;
  dueDate?: string;
  routeSteps?: number[];
  productionStage?: 1 | 2 | 3 | 4 | 5 | 6;
  stationStatus?: "waiting" | "running" | "paused" | "completed" | "quality_hold";
  assignedOperator?: string;
  machineName?: string;
  downtimeMinutes?: number;
  downtimeReason?: string;
  scrapM2?: number;
  scrapReason?: string;
  scrapStation?: string;
  reservedLotNo?: string;
  qualityHold?: boolean;
  qualityHoldReason?: string;
  qualityDisposition?:
    | "Bekliyor"
    | "Yeniden İşleme"
    | "Şartlı Kabul"
    | "Hurda"
    | "Müşteri Onayı"
    | "Serbest";
  qualityInspector?: string;
  qualityCheckedAt?: string;
  estimatedDeliveryDate?: string;
  vehiclePlate?: string;
  driverName?: string;
  rackNo?: string;
  packageCount?: number;
  craneRequired?: boolean;
  deliveryAddress?: string;
  deliveryProof?: DeliveryProof;
  notes?: string;
  date: string;
  createdAt?: number;
  status: "new" | "in_review" | "quoted" | "approved" | "completed" | "cancelled";
  urgency?: "high" | "normal" | "low";
  trackingPin?: string;
  tenantId?: string;
  createdByUid?: string;
  assignedToUid?: string;
}

export interface ProductionOrderItem {
  id: string;
  trackingPin?: string;
  glassType: string;
  thickness: string;
  dimensions: string;
  totalArea: number;
  routeSteps?: number[];
  productionStage: 1 | 2 | 3 | 4 | 5 | 6;
  stationStatus?: QuoteItem["stationStatus"];
  assignedOperator?: string;
  machineName?: string;
  downtimeMinutes?: number;
  downtimeReason?: string;
  scrapM2?: number;
  scrapReason?: string;
  scrapStation?: string;
  reservedLotNo?: string;
  qualityHold?: boolean;
  qualityHoldReason?: string;
  qualityDisposition?: QuoteItem["qualityDisposition"];
  qualityInspector?: string;
  qualityCheckedAt?: string;
  estimatedDeliveryDate?: string;
  vehiclePlate?: string;
  driverName?: string;
  rackNo?: string;
  packageCount?: number;
  craneRequired?: boolean;
  dueDate?: string;
  notes?: string;
  date: string;
  createdAt?: number;
  updatedAt?: number;
  status: QuoteItem["status"];
}

export interface PublicOrderTrackingItem {
  orderId: string;
  status: QuoteItem["status"];
  productionStage: 1 | 2 | 3 | 4 | 5 | 6;
  stationStatus?: QuoteItem["stationStatus"];
  qualityHold?: boolean;
  systemCategory?: string;
  estimatedDeliveryDate?: string;
  date: string;
  updatedAt: number;
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
  tenantId?: string;
  createdByUid?: string;
  assignedToUid?: string;
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
  tenantId?: string;
  createdByUid?: string;
  assignedToUid?: string;
}

export interface ActivityItem {
  id: string;
  type:
    | "Telefon Görüşmesi"
    | "Toplantı"
    | "Saha Keşfi"
    | "E-Posta"
    | "WhatsApp Notu"
    | "Takip Görevi";
  customerName: string;
  relatedId?: string;
  summary: string;
  dueDate: string;
  assignedTo: string;
  completed: boolean;
  createdAt: number;
  tenantId?: string;
  createdByUid?: string;
  assignedToUid?: string;
}

export interface InventoryItem {
  id: string;
  code: string;
  name: string;
  category: "Hammadde (Plaka Cam)" | "Yarı Mamul" | "Mamul" | "Sarf Malzeme" | "Ambalaj / Sehpa";
  thickness: string;
  dimensions: string;
  supplier: string;
  warehouseLocation: string;
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
  supplierRating?: number;
  requestedBy: string;
  createdAt: number;
  date: string;
  tenantId?: string;
  createdByUid?: string;
  assignedToUid?: string;
}

export interface QualityInspectionItem {
  id: string;
  orderId: string;
  customerName: string;
  inspectionType:
    | "Girdi Kalite (Mal Kabul)"
    | "Proses Kontrol (İstasyon)"
    | "Final Kalite (Sevk Öncesi)";
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
    | "INVOICE_ISSUE"
    | "RBAC_DENIED"
    | "DATA_EXPORT"
    | "STAFF_ROLE_CHANGE";
  actorUid?: string;
  actorEmail: string;
  actorRole: UserRole;
  tenantId?: string;
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
  tenantId?: string;
  assignedToUid?: string;
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

export interface CheckInstrumentItem {
  id: string;
  direction: "received" | "issued";
  serialNo: string;
  counterparty: string;
  bankName: string;
  amount: number;
  issueDate: string;
  dueDate: string;
  relatedOrderId?: string;
  endorsedTo?: string;
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
  tenantId?: string;
  createdByUid?: string;
  assignedToUid?: string;
}

export interface CashLedgerItem {
  id: string;
  type: "in" | "out";
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
