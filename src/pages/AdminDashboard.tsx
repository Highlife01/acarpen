import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  FileText,
  FileCheck,
  Cpu,
  Package,
  ShieldCheck,
  Truck,
  BarChart3,
  KeyRound,
  Eye,
  EyeOff,
  LogOut,
  Menu,
  X,
  Plus,
  Search,
  Printer,
  Edit2,
  QrCode,
  Volume2,
  VolumeX,
  Columns,
  List,
  Percent,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Trash2,
  Sun,
  Moon,
  MessageSquare,
  Wallet,
  ExternalLink,
  SlidersHorizontal,
  Download,
  PhoneCall,
  Sparkles,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/site/Logo";
import {
  QuoteItem,
  ContactMessage,
  FactoryPriceItem,
  FactoryServiceItem,
  CustomerRecord,
  OpportunityItem,
  ActivityItem,
  InventoryItem,
  PurchaseOrderItem,
  QualityInspectionItem,
  AuditEventItem,
  CheckInstrumentItem,
  CashLedgerItem,
  UserRole,
  ROLE_DEFINITIONS,
  getAdminQuotes,
  subscribeAdminQuotes,
  updateQuoteStatus,
  getAdminMessages,
  subscribeAdminMessages,
  markMessageAsRead,
  deleteAdminMessage,
  getAdminPrices,
  subscribeAdminPrices,
  updateAdminPrice,
  updateAdminPriceItem,
  applyBulkAdminPricePercentage,
  addAdminPrice,
  deleteAdminPrice,
  getAdminServices,
  subscribeAdminServices,
  updateAdminService,
  addAdminService,
  deleteAdminService,
  getAdminCustomers,
  subscribeAdminCustomers,
  getAdminOpportunities,
  subscribeAdminOpportunities,
  getAdminActivities,
  subscribeAdminActivities,
  getAdminInventory,
  subscribeAdminInventory,
  getAdminPurchases,
  subscribeAdminPurchases,
  getAdminQuality,
  subscribeAdminQuality,
  getAdminAuditLogs,
  subscribeAdminAuditLogs,
  getAdminChecks,
  subscribeAdminChecks,
  getAdminCashLedger,
  subscribeAdminCashLedger,
  getActiveUserRole,
  setActiveUserRole,
  subscribeActiveUserRole,
  recordAdminAudit,
  getLiveSession,
  setLiveSession,
  subscribeLiveSession,
  purgeAllAdminTransactionalData,
} from "@/lib/adminStorage";
import { getQrSvgPath } from "@/lib/qrCode";
import { auth, isFirebaseConfigured } from "@/lib/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
} from "firebase/auth";
import { toast } from "sonner";
import {
  maskPiiText,
  printProposalDocument,
  printThermalLabelDocument,
} from "@/components/admin/PrintHelpers";
import { CrmModuleView, OrderManagementModuleView } from "@/components/admin/ErpModulesPart1";
import {
  ProductionModuleView,
  InventoryPurchasingModuleView,
} from "@/components/admin/ErpModulesPart2";
import { QualityModuleView, ShipmentModuleView } from "@/components/admin/ErpModulesPart3";
import {
  FinanceModuleView,
  ReportsModuleView,
  GovernanceModuleView,
} from "@/components/admin/ErpModulesPart4";
import {
  QuoteConfiguratorModal,
  PrefillCustomerInfo,
} from "@/components/admin/QuoteConfiguratorModal";
import { SEO } from "@/components/SEO";
import { getVisitorStats, subscribeVisitorStats, VisitorTelemetryStats } from "@/lib/analytics";

const DEFAULT_ADMIN_EMAIL = "admin@acarpen.com.tr";

function formatWhatsAppUrl(phone: string, text: string): string {
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

const STATUS_LABELS: Record<QuoteItem["status"], { label: string; badge: string }> = {
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

function playNotificationChime(muted: boolean) {
  if (muted || typeof window === "undefined") return;
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(587.33, now);
    osc1.frequency.setValueAtTime(880, now + 0.12);
    gain1.gain.setValueAtTime(0.14, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.45);
  } catch {
    // Ignore audio context autoplay restriction
  }
}

type ModuleGroupKey = "genel" | "satis" | "uretim" | "finans";

const MODULE_GROUPS: { key: ModuleGroupKey; title: string }[] = [
  { key: "genel", title: "GENEL BAKIŞ" },
  { key: "satis", title: "MÜŞTERİ & SATIŞ" },
  { key: "uretim", title: "ÜRETİM & SEVKİYAT" },
  { key: "finans", title: "FİNANS & SİSTEM" },
];

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [emailInput, setEmailInput] = useState(DEFAULT_ADMIN_EMAIL);
  const [passwordInput, setPasswordInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Navigation & Toolbar UI States
  const [activeModule, setActiveModule] = useState<string>("control_center");
  const [crmInitialTab, setCrmInitialTab] = useState<
    "c360" | "funnel" | "activities" | "messages"
  >("c360");
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(() =>
    typeof window !== "undefined" ? window.innerWidth >= 1024 : true
  );
  const [toolsMenuOpen, setToolsMenuOpen] = useState(false);
  const [confirmPurge, setConfirmPurge] = useState(false);
  const [globalSearch, setGlobalSearch] = useState("");

  const [activeRole, setActiveRole] = useState<UserRole>(() => getActiveUserRole());
  const [soundMuted, setSoundMuted] = useState(false);
  const [maskPii, setMaskPii] = useState(false);
  const [lightTheme, setLightTheme] = useState(true); // Yüksek Kontrastlı Aydınlık Tema (Varsayılan)

  // Real-time Firestore State
  const [quotes, setQuotes] = useState<QuoteItem[]>(() => getAdminQuotes());
  const [messages, setMessages] = useState<ContactMessage[]>(() => getAdminMessages());
  const [prices, setPrices] = useState<FactoryPriceItem[]>(() => getAdminPrices());
  const [services, setServices] = useState<FactoryServiceItem[]>(() => getAdminServices());
  const [customers, setCustomers] = useState<CustomerRecord[]>(() => getAdminCustomers());
  const [opportunities, setOpportunities] = useState<OpportunityItem[]>(() =>
    getAdminOpportunities()
  );
  const [activities, setActivities] = useState<ActivityItem[]>(() => getAdminActivities());
  const [inventory, setInventory] = useState<InventoryItem[]>(() => getAdminInventory());
  const [purchases, setPurchases] = useState<PurchaseOrderItem[]>(() => getAdminPurchases());
  const [qualityInspections, setQualityInspections] = useState<QualityInspectionItem[]>(() =>
    getAdminQuality()
  );
  const [auditLogs, setAuditLogs] = useState<AuditEventItem[]>(() => getAdminAuditLogs());
  const [checks, setChecks] = useState<CheckInstrumentItem[]>(() => getAdminChecks());
  const [cashLedger, setCashLedger] = useState<CashLedgerItem[]>(() => getAdminCashLedger());
  const [telemetry, setTelemetry] = useState<VisitorTelemetryStats>(() => getVisitorStats());

  // Module 1 & Module 3 UI States
  const [dashboardQuoteFilter, setDashboardQuoteFilter] = useState<
    "all" | "pending" | "production" | "done"
  >("all");
  const [quotesSubTab, setQuotesSubTab] = useState<"quotes_list" | "pricing_catalog">("quotes_list");
  const [quotesViewMode, setQuotesViewMode] = useState<"table" | "kanban">("table");
  const [quotesStatusFilter, setQuotesStatusFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [configuratorOpen, setConfiguratorOpen] = useState(false);
  const [editingQuote, setEditingQuote] = useState<QuoteItem | null>(null);
  const [prefillCustomer, setPrefillCustomer] = useState<PrefillCustomerInfo | null>(null);
  const [qrModalOrder, setQrModalOrder] = useState<QuoteItem | null>(null);

  // Price & Service Form States
  const [newGlassName, setNewGlassName] = useState("");
  const [newGlassThickness, setNewGlassThickness] = useState("4+16+4 mm");
  const [newGlassPrice, setNewGlassPrice] = useState("1550");
  const [newServiceName, setNewServiceName] = useState("");
  const [newServicePrice, setNewServicePrice] = useState("250");

  const prevQuoteCountRef = useRef<number | null>(null);
  const prevMsgCountRef = useRef<number | null>(null);

  useEffect(() => {
    if (getLiveSession()) setIsAuthenticated(true);
    const unsubSession = subscribeLiveSession((uid) => setIsAuthenticated(Boolean(uid)));
    const unsubRole = subscribeActiveUserRole((r) => setActiveRole(r));
    const unsubQuotes = subscribeAdminQuotes((items) => {
      if (prevQuoteCountRef.current !== null && items.length > prevQuoteCountRef.current) {
        playNotificationChime(soundMuted);
        toast.success("Yeni sipariş / teklif kaydı sisteme düştü!");
      }
      prevQuoteCountRef.current = items.length;
      setQuotes(items);
    });
    const unsubMsgs = subscribeAdminMessages((items) => {
      if (prevMsgCountRef.current !== null && items.length > prevMsgCountRef.current) {
        playNotificationChime(soundMuted);
        toast.success("Siteden yeni müşteri mesajı geldi!");
      }
      prevMsgCountRef.current = items.length;
      setMessages(items);
    });
    const unsubPrices = subscribeAdminPrices(setPrices);
    const unsubServices = subscribeAdminServices(setServices);
    const unsubCust = subscribeAdminCustomers(setCustomers);
    const unsubOpp = subscribeAdminOpportunities(setOpportunities);
    const unsubAct = subscribeAdminActivities(setActivities);
    const unsubInv = subscribeAdminInventory(setInventory);
    const unsubPur = subscribeAdminPurchases(setPurchases);
    const unsubQual = subscribeAdminQuality(setQualityInspections);
    const unsubAud = subscribeAdminAuditLogs(setAuditLogs);
    const unsubChk = subscribeAdminChecks(setChecks);
    const unsubCash = subscribeAdminCashLedger(setCashLedger);
    const unsubTelemetry = subscribeVisitorStats((updated) => setTelemetry(updated));

    return () => {
      unsubSession();
      unsubRole();
      unsubQuotes();
      unsubMsgs();
      unsubPrices();
      unsubServices();
      unsubCust();
      unsubOpp();
      unsubAct();
      unsubInv();
      unsubPur();
      unsubQual();
      unsubAud();
      unsubChk();
      unsubCash();
      unsubTelemetry();
    };
  }, [soundMuted]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setIsAuthenticating(true);
    const email = emailInput.trim() || DEFAULT_ADMIN_EMAIL;
    const pass = passwordInput.trim();
    try {
      if (isFirebaseConfigured) {
        try {
          const cred = await signInWithEmailAndPassword(auth, email, pass);
          setLiveSession(cred.user.uid);
          setIsAuthenticated(true);
          toast.success("Acarpen Yönetim Paneline hoş geldiniz.");
          return;
        } catch (err: unknown) {
          const code = (err as { code?: string })?.code || "";
          if (
            (code === "auth/user-not-found" || code === "auth/invalid-credential") &&
            email.toLowerCase() === DEFAULT_ADMIN_EMAIL &&
            pass === "acarpen2026"
          ) {
            const created = await createUserWithEmailAndPassword(auth, email, pass);
            setLiveSession(created.user.uid);
            setIsAuthenticated(true);
            toast.success("Yönetici hesabı etkinleştirildi ve giriş yapıldı.");
            return;
          }
          throw err;
        }
      }
    } catch {
      setLoginError("E-posta veya parola hatalı. Lütfen bilgilerinizi kontrol edin.");
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleLogout = async () => {
    try {
      if (isFirebaseConfigured) await signOut(auth);
    } catch {
      // Ignore signout error
    }
    setLiveSession(null);
    setIsAuthenticated(false);
  };

  const handleExportCsv = () => {
    const headers = [
      "SiparisNo",
      "Surum",
      "Musteri",
      "Santiye",
      "Telefon",
      "Sehir",
      "UrunCamTipi",
      "AlanM2",
      "NetTutarTL",
      "TahsilatTL",
      "Istasyon",
      "KaliteBlokaj",
      "FaturaNo",
    ];
    const rows = quotes.map((q) =>
      [
        q.id,
        `v${q.version || 1}`,
        `"${q.customerName}"`,
        `"${q.siteName || q.city}"`,
        q.phone,
        q.city,
        `"${q.glassType}"`,
        q.totalArea,
        q.estimatedPrice,
        q.paidAmount || 0,
        q.productionStage || 1,
        q.qualityHold ? "BLOKAJLI" : "UYGUN",
        q.invoiceNo || "-",
      ].join(",")
    );
    const csv = "\uFEFF" + [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `acarpen_rapor_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    recordAdminAudit(
      "DATA_EXPORT",
      "ALL_QUOTES",
      "Sipariş ve finans verisi Excel/CSV olarak dışa aktarıldı."
    );
    toast.success("Tüm sipariş ve finans tablosu Excel/CSV olarak indirildi.");
  };

  const openNewQuoteModal = (customer?: PrefillCustomerInfo) => {
    setEditingQuote(null);
    setPrefillCustomer(customer || null);
    setConfiguratorOpen(true);
  };

  const unreadMessagesCount = messages.filter((m) => !m.isRead).length;

  // 11 Clear, Plain-Turkish Module Definitions Grouped into 4 Categories
  const MENU_MODULES: {
    id: string;
    group: ModuleGroupKey;
    label: string;
    subtitle: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    badge: number | null;
  }[] = [
    {
      id: "control_center",
      group: "genel",
      label: "Genel Özet & Bugün",
      subtitle: "Hızlı işlemler & canlı özet",
      description: "Bugünkü mesajlar, teklifler, atölye durumu ve kasa özetini tek ekrandan yönetin.",
      icon: LayoutDashboard,
      badge: unreadMessagesCount > 0 ? unreadMessagesCount : null,
    },
    {
      id: "crm",
      group: "satis",
      label: "Mesajlar & Müşteriler",
      subtitle: "Web formları & müşteri kartları",
      description: "Web sitesinden gelen mesajları yanıtlayın, müşteri kayıtlarını ve satış fırsatlarını takip edin.",
      icon: Users,
      badge: unreadMessagesCount + opportunities.length || null,
    },
    {
      id: "quotes",
      group: "satis",
      label: "Teklifler & Fiyat Listesi",
      subtitle: "Ölçülü teklif & m² fiyatları",
      description: "Fıratpen, Winsa, Pimapen ve Isıcam teklifleri oluşturun, revize edin ve birim fiyatları güncelleyin.",
      icon: FileText,
      badge: quotes.length || null,
    },
    {
      id: "orders",
      group: "satis",
      label: "Sipariş & Onaylar",
      subtitle: "İskonto onayı & sözleşme",
      description: "Onay bekleyen teklifleri inceleyin, sözleşmeyi onaylayıp üretime aktarın.",
      icon: FileCheck,
      badge: quotes.filter((q) => q.approvalStatus === "pending_approval").length || null,
    },
    {
      id: "production",
      group: "uretim",
      label: "Üretim Takibi (Atölye)",
      subtitle: "Kesim, kaynak, cam & QR etiket",
      description: "6 aşamalı imalat istasyonlarını ilerletin, fire kaydı girin ve QR etiket yazdırın.",
      icon: Cpu,
      badge: quotes.filter((q) => q.status === "approved").length || null,
    },
    {
      id: "inventory",
      group: "uretim",
      label: "Stok & Satın Alma",
      subtitle: "Profil, cam depo & tedarik",
      description: "Depodaki profil ve plaka cam miktarlarını izleyin, kritik stoklar için sipariş açın.",
      icon: Package,
      badge: inventory.filter((i) => i.availableQty < i.minStockLevel).length || null,
    },
    {
      id: "quality",
      group: "uretim",
      label: "Kalite Kontrol",
      subtitle: "Denetim & karantina blokajı",
      description: "Üretim ve sevkiyat öncesi ölçü/yüzey kontrolü yapın, hatalı işleri blokaja alın.",
      icon: ShieldCheck,
      badge: quotes.filter((q) => q.qualityHold).length || null,
    },
    {
      id: "shipment",
      group: "uretim",
      label: "Sevkiyat & Teslimat",
      subtitle: "Montaj planı & teslim fişi",
      description: "Sevkiyata hazır doğrama ve camların araç yükleme ve şantiye teslim tutanaklarını kaydedin.",
      icon: Truck,
      badge:
        quotes.filter(
          (q) => (q.productionStage || 1) === 5 && !q.qualityHold && q.status !== "cancelled"
        ).length || null,
    },
    {
      id: "finance",
      group: "finans",
      label: "Kasa, Banka & Çekler",
      subtitle: "Tahsilat, ödeme & çek portföyü",
      description: "Nakit kasa giriş-çıkışlarını, banka hareketlerini, alınan ve kesilen çekleri takip edin.",
      icon: Wallet,
      badge: checks.length || null,
    },
    {
      id: "reports",
      group: "finans",
      label: "Raporlar & Çıktılar",
      subtitle: "Ciro, kârlılık & Excel indir",
      description: "Dönemsel satış, üretim performansı ve kârlılık analizlerini inceleyin veya Excel'e aktarın.",
      icon: BarChart3,
      badge: null,
    },
    {
      id: "governance",
      group: "finans",
      label: "Yetkiler & Ayarlar",
      subtitle: "Personel rolleri & işlem kaydı",
      description: "Kullanıcı rollerini, iskonto limitlerini ve sistem güvenlik kayıtlarını yönetin.",
      icon: KeyRound,
      badge: null,
    },
  ];

  const currentRoleDef = ROLE_DEFINITIONS[activeRole];
  const visibleModules = MENU_MODULES.filter(
    (m) => currentRoleDef.allowedModules.includes(m.id) || m.id === "governance"
  );
  const currentModuleMeta =
    MENU_MODULES.find((m) => m.id === activeModule) || MENU_MODULES[0];

  const themeClass = lightTheme ? "admin-light-theme" : "admin-dark-theme";

  // ============================================================================
  // LOGIN GATE (HIGH CONTRAST IN BOTH LIGHT & DARK MODES)
  // ============================================================================
  if (!isAuthenticated) {
    return (
      <div
        className={`admin-shell min-h-screen bg-slate-950 flex items-center justify-center p-6 text-slate-100 ${themeClass}`}
      >
        <SEO
          title="Yönetim Paneli Girişi | Acarpen"
          description="Acarpen yetkili personel ERP ve CRM yönetim paneli giriş ekranı."
          noindex
        />
        <div className="admin-login-card max-w-md w-full rounded-3xl bg-slate-900 border-2 border-slate-700 p-8 shadow-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <Link
              to="/"
              className="text-xs font-bold text-sky-500 hover:underline flex items-center gap-1"
            >
              ← Web Sitesine Dön
            </Link>
            <button
              type="button"
              onClick={() => setLightTheme(!lightTheme)}
              className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-200 text-xs font-bold flex items-center gap-1.5"
            >
              {lightTheme ? (
                <>
                  <Sun className="h-3.5 w-3.5 text-amber-500" />
                  <span>Aydınlık Mod</span>
                </>
              ) : (
                <>
                  <Moon className="h-3.5 w-3.5 text-sky-400" />
                  <span>Koyu Mod</span>
                </>
              )}
            </button>
          </div>

          <div className="text-center space-y-2.5">
            <Logo
              size="lg"
              layout="stacked"
              theme={lightTheme ? "light" : "dark"}
              showSubtitle={true}
              className="mx-auto"
            />
            <h1 className="text-xl font-extrabold text-white pt-1">
              Acarpen Yönetim Paneli
            </h1>
            <p className="text-xs text-slate-300 leading-relaxed">
              Teklif, Sipariş, Atölye Üretim, Kasa/Çek ve Müşteri Mesajları Yönetim Ekranı
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-sm">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5">
                Yönetici E-Posta Adresi
              </label>
              <input
                type="email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border-2 border-slate-700 text-white text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5">
                Parola
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Parolanızı girin"
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border-2 border-slate-700 text-white pr-11 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-sky-500"
                  title={showPassword ? "Parolayı Gizle" : "Parolayı Göster"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            {loginError && (
              <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500 text-rose-400 text-xs font-bold">
                {loginError}
              </div>
            )}
            <Button
              type="submit"
              disabled={isAuthenticating}
              className="w-full h-12 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-sm shadow-lg"
            >
              {isAuthenticating ? "Giriş Yapılıyor..." : "Panele Giriş Yap"}
            </Button>
            <button
              type="button"
              onClick={async () => {
                try {
                  await sendPasswordResetEmail(auth, emailInput.trim() || DEFAULT_ADMIN_EMAIL);
                  toast.success("Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.");
                } catch {
                  toast.error("Şifre sıfırlama e-postası gönderilemedi.");
                }
              }}
              className="w-full text-center text-slate-400 hover:text-sky-500 underline text-xs font-semibold pt-1"
            >
              Parolamı Unuttum (E-Posta ile Sıfırla)
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ============================================================================
  // COMPUTED METRICS & SEARCH RESULTS
  // ============================================================================
  const newLeadQuotes = quotes.filter((q) => q.status === "new" || q.status === "in_review");
  const quotedWaitingQuotes = quotes.filter((q) => q.status === "quoted");
  const inProductionQuotes = quotes.filter((q) => q.status === "approved");
  const completedQuotes = quotes.filter((q) => q.status === "completed");
  const unapprovedQuotes = quotes.filter(
    (q) =>
      q.status === "new" ||
      q.status === "in_review" ||
      q.approvalStatus === "pending_approval"
  );
  const qualityBlockedQuotes = quotes.filter((q) => q.qualityHold);
  const readyForShipmentQuotes = quotes.filter(
    (q) => (q.productionStage || 1) === 5 && !q.qualityHold && q.status !== "cancelled"
  );
  const totalRevenue = quotes
    .filter((q) => q.status !== "cancelled")
    .reduce((acc, q) => acc + (q.estimatedPrice || 0), 0);
  const totalScrapM2 = quotes.reduce((acc, q) => acc + (q.scrapM2 || 0), 0);

  // Kasa & Çek Hızlı Özetleri
  const totalCashIn = cashLedger
    .filter((e) => e.type === "in")
    .reduce((acc, e) => acc + (e.amount || 0), 0);
  const totalCashOut = cashLedger
    .filter((e) => e.type === "out")
    .reduce((acc, e) => acc + (e.amount || 0), 0);
  const netCashAndBankBalance = totalCashIn - totalCashOut;
  const receivedChecksTotal = checks
    .filter(
      (c) =>
        c.direction === "received" &&
        (c.status === "Portföyde (Kasada)" || c.status === "Bankada Tahsilde")
    )
    .reduce((acc, c) => acc + (c.amount || 0), 0);
  const issuedChecksTotal = checks
    .filter((c) => c.direction === "issued" && c.status === "Tedavülde (Ödeme Bekliyor)")
    .reduce((acc, c) => acc + (c.amount || 0), 0);

  // Module 3 Filtered Quotes
  const filteredQuotes = quotes.filter((q) => {
    if (quotesStatusFilter !== "all" && q.status !== quotesStatusFilter) return false;
    if (!searchTerm.trim()) return true;
    const s = searchTerm.toLowerCase();
    return (
      q.id.toLowerCase().includes(s) ||
      q.customerName.toLowerCase().includes(s) ||
      (q.phone || "").toLowerCase().includes(s) ||
      (q.siteName || "").toLowerCase().includes(s) ||
      q.glassType.toLowerCase().includes(s)
    );
  });

  // Control Center Filtered Quotes
  const controlCenterQuotes = quotes.filter((q) => {
    if (dashboardQuoteFilter === "pending") {
      return q.status === "new" || q.status === "in_review" || q.status === "quoted";
    }
    if (dashboardQuoteFilter === "production") {
      return q.status === "approved";
    }
    if (dashboardQuoteFilter === "done") {
      return q.status === "completed";
    }
    return true;
  });

  // Global Instant Search Matches
  const globalQuery = globalSearch.trim().toLowerCase();
  const globalQuoteMatches = globalQuery
    ? quotes
        .filter(
          (q) =>
            q.id.toLowerCase().includes(globalQuery) ||
            q.customerName.toLowerCase().includes(globalQuery) ||
            (q.phone || "").toLowerCase().includes(globalQuery) ||
            (q.siteName || "").toLowerCase().includes(globalQuery)
        )
        .slice(0, 5)
    : [];
  const globalMessageMatches = globalQuery
    ? messages
        .filter(
          (m) =>
            m.name.toLowerCase().includes(globalQuery) ||
            (m.phone || "").toLowerCase().includes(globalQuery) ||
            m.subject.toLowerCase().includes(globalQuery)
        )
        .slice(0, 4)
    : [];

  return (
    <div
      className={`admin-shell min-h-screen bg-slate-950 text-slate-100 flex ${themeClass}`}
    >
      <SEO
        title="Acarpen Yönetim Paneli | ERP + CRM"
        description="Acarpen üretim, teklif, sipariş, stok, çek/kasa finans ve CRM yönetim konsolu."
        noindex
      />

      {/* MOBILE SIDEBAR BACKDROP OVERLAY */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-slate-950/65 backdrop-blur-xs z-30 lg:hidden"
        />
      )}

      {/* ==================================================================== */}
      {/* CATEGORIZED LEFT SIDEBAR (4 CLEAR GROUPS, ZERO DOUBLE-NUMBERING)     */}
      {/* ==================================================================== */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 shrink-0 bg-slate-900 border-r border-slate-800 flex-col transition-all duration-200 lg:sticky lg:top-0 lg:h-screen ${
          sidebarOpen ? "flex translate-x-0" : "hidden -translate-x-full"
        }`}
      >
        <div className="admin-sidebar-header p-4 border-b border-slate-800 flex items-center justify-between gap-2">
          <div>
            <Logo size="sm" theme={lightTheme ? "light" : "dark"} />
            <div className="text-[11px] font-extrabold text-sky-500 mt-1">
              Yönetim & Üretim Paneli
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 rounded-xl bg-slate-800 text-slate-200 hover:bg-rose-600 hover:text-white transition-colors"
            title="Menüyü Kapat"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Quick Primary CTA inside Sidebar */}
        <div className="px-3 pt-3">
          <Button
            onClick={() => openNewQuoteModal()}
            className="w-full h-11 bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-xs rounded-xl shadow-md"
          >
            <Plus className="h-4 w-4 mr-1.5" />
            Yeni Ölçülü Teklif Oluştur
          </Button>
        </div>

        <nav className="flex-1 p-3 space-y-4 overflow-y-auto">
          {MODULE_GROUPS.map((grp) => {
            const groupItems = visibleModules.filter((m) => m.group === grp.key);
            if (groupItems.length === 0) return null;
            return (
              <div key={grp.key} className="space-y-1.5">
                <div className="admin-group-label px-2 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  {grp.title}
                </div>
                {groupItems.map((mod) => {
                  const Icon = mod.icon;
                  const active = activeModule === mod.id;
                  return (
                    <button
                      key={mod.id}
                      onClick={() => {
                        setActiveModule(mod.id);
                        if (typeof window !== "undefined" && window.innerWidth < 1024) {
                          setSidebarOpen(false);
                        }
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all ${
                        active
                          ? "admin-nav-btn-active bg-sky-600 text-white shadow-md"
                          : "admin-nav-btn text-slate-200 hover:bg-slate-800"
                      }`}
                    >
                      <span className="flex items-center gap-2.5 min-w-0">
                        <Icon className="h-4 w-4 shrink-0" />
                        <span className="min-w-0">
                          <span className="block text-xs font-extrabold truncate">
                            {mod.label}
                          </span>
                          <span className="admin-nav-sub block text-[10px] text-slate-400 truncate">
                            {mod.subtitle}
                          </span>
                        </span>
                      </span>
                      {mod.badge ? (
                        <span
                          className={`px-2 py-0.5 rounded-full text-[11px] font-mono shrink-0 ml-1.5 ${
                            active
                              ? "admin-nav-badge-active bg-white text-sky-700 font-black"
                              : "admin-nav-badge bg-slate-800 text-sky-400 font-bold"
                          }`}
                        >
                          {mod.badge}
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </nav>

        <div className="admin-sidebar-footer p-3.5 border-t border-slate-800 space-y-2.5">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-slate-400">Yetki:</span>
            <span className="text-sky-500 truncate ml-2">{currentRoleDef.label}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Link
              to="/"
              className="px-3 py-2 rounded-xl bg-slate-800 text-slate-200 hover:bg-sky-600 hover:text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span>Siteyi Aç</span>
            </Link>
            <button
              onClick={handleLogout}
              className="px-3 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Çıkış Yap</span>
            </button>
          </div>
        </div>
      </aside>

      {/* ==================================================================== */}
      {/* MAIN CONTENT SHELL                                                   */}
      {/* ==================================================================== */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* TOP HEADER BAR: CLEAN, PRACTICAL, HIGH CONTRAST */}
        <header className="sticky top-0 z-30 bg-slate-900 border-b border-slate-800 px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
          {/* Left: Sidebar Toggle + Clear Module Title & Plain Description */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center gap-2 text-xs font-extrabold transition-all shrink-0"
              title={sidebarOpen ? "Menüyü Daralt" : "Menüyü Göster"}
            >
              {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              <span className="hidden sm:inline">{sidebarOpen ? "Menü Gizle" : "Menü Aç"}</span>
            </button>
            <div className="min-w-0">
              <h1 className="text-base sm:text-lg font-extrabold text-white truncate">
                {currentModuleMeta.label}
              </h1>
              <p className="text-xs text-slate-400 truncate hidden md:block">
                {currentModuleMeta.description}
              </p>
            </div>
          </div>

          {/* Center: Global Instant Search Input */}
          <div className="relative flex-1 max-w-md min-w-[210px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              placeholder="Hızlı ara: Müşteri, telefon, sipariş no..."
              className="w-full pl-9 pr-8 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
            />
            {globalSearch && (
              <button
                type="button"
                onClick={() => setGlobalSearch("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-rose-500"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}

            {/* Instant Search Dropdown Results */}
            {globalQuery && (
              <div className="admin-tools-popover absolute left-0 right-0 top-full mt-2 rounded-2xl bg-slate-900 border-2 border-slate-700 p-3 shadow-2xl z-50 space-y-3 max-h-80 overflow-y-auto">
                {globalQuoteMatches.length === 0 && globalMessageMatches.length === 0 ? (
                  <div className="text-xs text-slate-400 text-center py-3">
                    "{globalSearch}" için eşleşen teklif veya mesaj bulunamadı.
                  </div>
                ) : (
                  <>
                    {globalQuoteMatches.length > 0 && (
                      <div className="space-y-1.5">
                        <div className="text-[10px] font-extrabold uppercase text-sky-400 px-1">
                          Teklifler & Siparişler ({globalQuoteMatches.length})
                        </div>
                        {globalQuoteMatches.map((q) => (
                          <button
                            key={q.id}
                            type="button"
                            onClick={() => {
                              setGlobalSearch("");
                              setEditingQuote(q);
                              setConfiguratorOpen(true);
                            }}
                            className="w-full p-2.5 rounded-xl bg-slate-950 hover:bg-sky-500/15 border border-slate-800 flex items-center justify-between text-left text-xs"
                          >
                            <div>
                              <span className="font-mono font-bold text-sky-400 mr-2">{q.id}</span>
                              <span className="font-bold text-white">{q.customerName}</span>
                              <span className="block text-[11px] text-slate-400">
                                {q.glassType} • {q.phone}
                              </span>
                            </div>
                            <span className="font-mono font-extrabold text-emerald-400">
                              ₺{(q.estimatedPrice || 0).toLocaleString("tr-TR")}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                    {globalMessageMatches.length > 0 && (
                      <div className="space-y-1.5">
                        <div className="text-[10px] font-extrabold uppercase text-emerald-400 px-1">
                          Gelen Web Mesajları ({globalMessageMatches.length})
                        </div>
                        {globalMessageMatches.map((m) => (
                          <button
                            key={m.id}
                            type="button"
                            onClick={() => {
                              setGlobalSearch("");
                              markMessageAsRead(m.id);
                              setCrmInitialTab("messages");
                              setActiveModule("crm");
                            }}
                            className="w-full p-2.5 rounded-xl bg-slate-950 hover:bg-emerald-500/15 border border-slate-800 flex items-center justify-between text-left text-xs"
                          >
                            <div className="min-w-0">
                              <span className="font-bold text-white">{m.name}</span>
                              <span className="block text-[11px] text-slate-400 truncate">
                                {m.subject} • {m.phone}
                              </span>
                            </div>
                            <ArrowRight className="h-3.5 w-3.5 text-sky-400 shrink-0" />
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>

          {/* Right: Essential Action Buttons + Clean Tools Menu */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Messages Quick Button */}
            <button
              onClick={() => {
                setCrmInitialTab("messages");
                setActiveModule("crm");
              }}
              className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs font-extrabold flex items-center gap-1.5 text-sky-400 hover:border-sky-500"
              title="Gelen İletişim Mesajları"
            >
              <MessageSquare className="h-4 w-4" />
              <span className="hidden sm:inline">Mesajlar ({messages.length})</span>
              {unreadMessagesCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-black">
                  {unreadMessagesCount} Yeni
                </span>
              )}
            </button>

            {/* Finance Quick Button */}
            <button
              onClick={() => setActiveModule("finance")}
              className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs font-extrabold flex items-center gap-1.5 text-emerald-400 hover:border-emerald-500"
              title="Kasa, Banka ve Çekler"
            >
              <Wallet className="h-4 w-4" />
              <span className="hidden sm:inline">Kasa & Çek</span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={() => setLightTheme(!lightTheme)}
              className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs font-extrabold flex items-center gap-1.5 text-slate-200"
              title="Aydınlık / Koyu Görünüm Değiştir"
            >
              {lightTheme ? (
                <>
                  <Sun className="h-4 w-4 text-amber-500" />
                  <span className="hidden xl:inline">Aydınlık</span>
                </>
              ) : (
                <>
                  <Moon className="h-4 w-4 text-sky-400" />
                  <span className="hidden xl:inline">Koyu</span>
                </>
              )}
            </button>

            {/* Grouped Settings & Tools Popover */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setToolsMenuOpen(!toolsMenuOpen);
                  setConfirmPurge(false);
                }}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-extrabold flex items-center gap-1.5"
                title="Rol, KVKK, Rapor ve Sistem Araçları"
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span className="hidden sm:inline">Araçlar</span>
              </button>

              {toolsMenuOpen && (
                <div className="admin-tools-popover absolute right-0 top-full mt-2 w-80 rounded-2xl bg-slate-900 border-2 border-slate-700 p-4 shadow-2xl z-50 space-y-3 text-xs">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="font-extrabold text-white">Hızlı Sistem Araçları</span>
                    <button
                      type="button"
                      onClick={() => setToolsMenuOpen(false)}
                      className="text-slate-400 hover:text-rose-500"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Role Switcher */}
                  <div>
                    <label className="text-[11px] font-bold text-slate-400 block mb-1">
                      Aktif Kullanıcı Rolü (Yetki Testi)
                    </label>
                    <select
                      value={activeRole}
                      onChange={(e) => {
                        const nextRole = e.target.value as UserRole;
                        setActiveUserRole(nextRole);
                        toast.info(`Aktif rol değiştirildi: ${ROLE_DEFINITIONS[nextRole].label}`);
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-bold text-xs"
                    >
                      {(Object.keys(ROLE_DEFINITIONS) as UserRole[]).map((rk) => (
                        <option key={rk} value={rk}>
                          {ROLE_DEFINITIONS[rk].label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* KVKK & Sound Toggles */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setMaskPii(!maskPii)}
                      className={`px-3 py-2 rounded-xl border font-bold flex items-center justify-center gap-1.5 ${
                        maskPii
                          ? "bg-amber-500 text-white border-amber-600"
                          : "bg-slate-950 border-slate-700 text-slate-200"
                      }`}
                    >
                      {maskPii ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                      <span>{maskPii ? "KVKK Gizli" : "KVKK Açık"}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSoundMuted(!soundMuted)}
                      className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 font-bold flex items-center justify-center gap-1.5 text-slate-200"
                    >
                      {soundMuted ? (
                        <>
                          <VolumeX className="h-3.5 w-3.5 text-rose-500" />
                          <span>Ses Kapalı</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="h-3.5 w-3.5 text-emerald-500" />
                          <span>Ses Açık</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* CSV Export */}
                  <button
                    type="button"
                    onClick={() => {
                      handleExportCsv();
                      setToolsMenuOpen(false);
                    }}
                    className="w-full px-3 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold flex items-center justify-center gap-1.5"
                  >
                    <Download className="h-4 w-4" />
                    <span>Tüm Verileri Excel / CSV İndir</span>
                  </button>

                  {/* Safe 2-Step Confirmation Reset */}
                  <div className="pt-2 border-t border-slate-800">
                    {!confirmPurge ? (
                      <button
                        type="button"
                        onClick={() => setConfirmPurge(true)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-rose-500/50 text-rose-400 font-bold flex items-center justify-center gap-1.5 hover:bg-rose-500/10"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Test / Önbellek Verilerini Sıfırla</span>
                      </button>
                    ) : (
                      <div className="p-2.5 rounded-xl bg-rose-950 border border-rose-500 space-y-2">
                        <p className="text-[11px] font-bold text-rose-200">
                          Tüm yerel test kayıtları sıfırlanacak. Emin misiniz?
                        </p>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => setConfirmPurge(false)}
                            className="flex-1 py-1.5 rounded-lg bg-slate-800 text-slate-200 font-bold"
                          >
                            Vazgeç
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              purgeAllAdminTransactionalData();
                              setConfirmPurge(false);
                              setToolsMenuOpen(false);
                              toast.success("Tüm test ve önbellek verileri temizlendi.");
                            }}
                            className="flex-1 py-1.5 rounded-lg bg-rose-600 text-white font-extrabold"
                          >
                            Evet, Sıfırla
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Primary CTA: New Quote */}
            <Button
              size="sm"
              onClick={() => openNewQuoteModal()}
              className="h-9 bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-xs rounded-xl px-4 shadow-md"
            >
              <Plus className="h-4 w-4 mr-1" />
              Yeni Teklif
            </Button>
          </div>
        </header>

        {/* COMPACT HORIZONTAL MODULE BAR — SHOWN ONLY WHEN SIDEBAR IS COLLAPSED */}
        {!sidebarOpen && (
          <div className="admin-quick-nav bg-slate-900 border-b border-slate-800 px-4 py-2 flex items-center gap-2 overflow-x-auto no-scrollbar">
            {visibleModules.map((mod) => {
              const Icon = mod.icon;
              const active = activeModule === mod.id;
              return (
                <button
                  key={mod.id}
                  onClick={() => setActiveModule(mod.id)}
                  className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                    active
                      ? "admin-quick-pill-active bg-sky-600 text-white shadow-sm"
                      : "admin-quick-pill bg-slate-800 text-slate-200 hover:bg-slate-700"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5 shrink-0" />
                  <span>{mod.label}</span>
                  {mod.badge ? (
                    <span
                      className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                        active ? "bg-white text-sky-700 font-black" : "bg-slate-950 text-sky-400"
                      }`}
                    >
                      {mod.badge}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        )}

        {/* ================================================================== */}
        {/* ACTIVE MODULE BODY                                                 */}
        {/* ================================================================== */}
        <main className="p-4 sm:p-6 flex-1 space-y-6 overflow-x-hidden">
          {/* ================================================================ */}
          {/* MODÜL 1: GENEL ÖZET & BUGÜN (PRATİK HIZLI KONTROL MERKEZİ)       */}
          {/* ================================================================ */}
          {activeModule === "control_center" && (
            <div className="space-y-6">
              {/* 1. HIZLI İŞLEM KISAYOLLARI (4 BÜYÜK ANLAŞILIR AKSİYON BUTONU) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3.5">
                <button
                  type="button"
                  onClick={() => openNewQuoteModal()}
                  className="p-4 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white text-left flex items-center justify-between gap-3 shadow-lg transition-transform hover:-translate-y-0.5"
                >
                  <div>
                    <div className="text-sm font-extrabold flex items-center gap-1.5">
                      <Plus className="h-4 w-4" />
                      Yeni Ölçülü Teklif Hazırla
                    </div>
                    <div className="text-xs opacity-95 mt-0.5">
                      Fıratpen, Winsa, Pimapen & Isıcam hesapla
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 shrink-0" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setCrmInitialTab("messages");
                    setActiveModule("crm");
                  }}
                  className="p-4 rounded-2xl bg-slate-900 border-2 border-slate-700 hover:border-sky-500 text-left flex items-center justify-between gap-3 transition-all"
                >
                  <div>
                    <div className="text-sm font-extrabold text-white flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-sky-400" />
                      <span>Gelen Mesajları Yanıtla</span>
                      {unreadMessagesCount > 0 && (
                        <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-black">
                          {unreadMessagesCount} Yeni
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      Web iletişim ve keşif taleplerini gör
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-sky-400 shrink-0" />
                </button>

                <button
                  type="button"
                  onClick={() => setActiveModule("production")}
                  className="p-4 rounded-2xl bg-slate-900 border-2 border-slate-700 hover:border-amber-500 text-left flex items-center justify-between gap-3 transition-all"
                >
                  <div>
                    <div className="text-sm font-extrabold text-white flex items-center gap-2">
                      <Cpu className="h-4 w-4 text-amber-400" />
                      <span>Atölye & Üretim Takibi</span>
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      {inProductionQuotes.length} aktif iş emri • QR etiket yazdır
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-amber-400 shrink-0" />
                </button>

                <button
                  type="button"
                  onClick={() => setActiveModule("finance")}
                  className="p-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-left flex items-center justify-between gap-3 shadow-lg transition-transform hover:-translate-y-0.5"
                >
                  <div>
                    <div className="text-sm font-extrabold flex items-center gap-1.5">
                      <Wallet className="h-4 w-4" />
                      Kasa Giriş & Çek Kaydı
                    </div>
                    <div className="text-xs opacity-95 mt-0.5">
                      Net Kasa: ₺{netCashAndBankBalance.toLocaleString("tr-TR")}
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 shrink-0" />
                </button>
              </div>

              {/* 2. ADIM ADIM CANLI İŞ AKIŞI ÖZETİ (FABRİKA DURUM HARİTASI) */}
              <div className="p-5 rounded-3xl bg-slate-900 border-2 border-slate-800 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h2 className="text-sm font-extrabold text-white flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-sky-400" />
                      Canlı İş Akışı Özeti (Talepten Teslimata Tüm Süreç)
                    </h2>
                    <p className="text-xs text-slate-400">
                      İlgili aşamadaki işleri açmak için kutunun üzerine tıklayın
                    </p>
                  </div>
                  <span className="text-xs font-bold text-sky-400 font-mono">
                    Toplam Kayıt: {quotes.length} Sipariş/Teklif
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  {[
                    {
                      step: "1. Yeni Talep",
                      count: newLeadQuotes.length,
                      accent: "border-t-4 border-t-sky-500",
                      numColor: "text-sky-400",
                      onClick: () => {
                        setQuotesStatusFilter("new");
                        setQuotesSubTab("quotes_list");
                        setActiveModule("quotes");
                      },
                    },
                    {
                      step: "2. Teklif Verildi",
                      count: quotedWaitingQuotes.length,
                      accent: "border-t-4 border-t-amber-500",
                      numColor: "text-amber-400",
                      onClick: () => {
                        setQuotesStatusFilter("quoted");
                        setQuotesSubTab("quotes_list");
                        setActiveModule("quotes");
                      },
                    },
                    {
                      step: "3. Üretimde",
                      count: inProductionQuotes.length,
                      accent: "border-t-4 border-t-emerald-500",
                      numColor: "text-emerald-400",
                      onClick: () => setActiveModule("production"),
                    },
                    {
                      step: "4. Kalite Blokaj",
                      count: qualityBlockedQuotes.length,
                      accent: "border-t-4 border-t-rose-500",
                      numColor: "text-rose-400",
                      onClick: () => setActiveModule("quality"),
                    },
                    {
                      step: "5. Sevke Hazır",
                      count: readyForShipmentQuotes.length,
                      accent: "border-t-4 border-t-purple-500",
                      numColor: "text-purple-400",
                      onClick: () => setActiveModule("shipment"),
                    },
                    {
                      step: "6. Teslim Edildi",
                      count: completedQuotes.length,
                      accent: "border-t-4 border-t-indigo-500",
                      numColor: "text-indigo-400",
                      onClick: () => {
                        setQuotesStatusFilter("completed");
                        setQuotesSubTab("quotes_list");
                        setActiveModule("quotes");
                      },
                    },
                  ].map((item) => (
                    <button
                      key={item.step}
                      type="button"
                      onClick={item.onClick}
                      className={`p-3.5 rounded-2xl bg-slate-950 border border-slate-800 ${item.accent} text-left hover:scale-[1.02] transition-transform`}
                    >
                      <div className="text-xs font-extrabold text-slate-300">{item.step}</div>
                      <div className={`text-2xl font-black font-mono mt-1 ${item.numColor}`}>
                        {item.count}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. YÜKSEK KONTRASTLI 5 ANA GÖSTERGE KARTI (KPI) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <button
                  onClick={() => {
                    setCrmInitialTab("messages");
                    setActiveModule("crm");
                  }}
                  className="p-5 rounded-2xl bg-slate-900 border-2 border-slate-800 border-l-4 border-l-sky-500 text-left transition-all hover:border-sky-500"
                >
                  <div className="text-xs text-slate-400 uppercase font-extrabold">
                    Web Mesajları
                  </div>
                  <div className="text-3xl font-black text-sky-400 font-mono mt-1">
                    {messages.length}
                  </div>
                  <div className="text-xs text-slate-300 mt-1.5 flex items-center justify-between">
                    <span>
                      {unreadMessagesCount > 0
                        ? `${unreadMessagesCount} okunmamış mesaj`
                        : "Tümü okundu"}
                    </span>
                    <ArrowRight className="h-3.5 w-3.5 text-sky-400" />
                  </div>
                </button>

                <button
                  onClick={() => setActiveModule("orders")}
                  className="p-5 rounded-2xl bg-slate-900 border-2 border-slate-800 border-l-4 border-l-indigo-500 text-left transition-all hover:border-indigo-500"
                >
                  <div className="text-xs text-slate-400 uppercase font-extrabold">
                    Onay Bekleyenler
                  </div>
                  <div className="text-3xl font-black text-indigo-400 font-mono mt-1">
                    {unapprovedQuotes.length}
                  </div>
                  <div className="text-xs text-slate-300 mt-1.5 flex items-center justify-between">
                    <span>Sözleşme & onay ekranı</span>
                    <ArrowRight className="h-3.5 w-3.5 text-indigo-400" />
                  </div>
                </button>

                <button
                  onClick={() => setActiveModule("quality")}
                  className="p-5 rounded-2xl bg-slate-900 border-2 border-slate-800 border-l-4 border-l-rose-500 text-left transition-all hover:border-rose-500"
                >
                  <div className="text-xs text-slate-400 uppercase font-extrabold">
                    Kalite & Fire
                  </div>
                  <div className="text-3xl font-black text-rose-400 font-mono mt-1">
                    {qualityBlockedQuotes.length}
                  </div>
                  <div className="text-xs text-rose-400 mt-1.5 flex items-center justify-between font-bold">
                    <span>Toplam Fire: {totalScrapM2.toFixed(1)} m²</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </button>

                <button
                  onClick={() => setActiveModule("shipment")}
                  className="p-5 rounded-2xl bg-slate-900 border-2 border-slate-800 border-l-4 border-l-purple-500 text-left transition-all hover:border-purple-500"
                >
                  <div className="text-xs text-slate-400 uppercase font-extrabold">
                    Sevkiyata Hazır
                  </div>
                  <div className="text-3xl font-black text-purple-400 font-mono mt-1">
                    {readyForShipmentQuotes.length}
                  </div>
                  <div className="text-xs text-slate-300 mt-1.5 flex items-center justify-between">
                    <span>Montaj & teslim listesi</span>
                    <ArrowRight className="h-3.5 w-3.5 text-purple-400" />
                  </div>
                </button>

                <button
                  onClick={() => setActiveModule("finance")}
                  className="p-5 rounded-2xl bg-slate-900 border-2 border-slate-800 border-l-4 border-l-emerald-500 text-left transition-all hover:border-emerald-500"
                >
                  <div className="text-xs text-slate-400 uppercase font-extrabold">
                    Kasa + Banka Net
                  </div>
                  <div className="text-2xl font-black text-emerald-400 font-mono mt-1">
                    ₺{netCashAndBankBalance.toLocaleString("tr-TR")}
                  </div>
                  <div className="text-xs text-slate-300 mt-1.5 flex items-center justify-between">
                    <span>Çek: ₺{receivedChecksTotal.toLocaleString("tr-TR")}</span>
                    <ArrowRight className="h-3.5 w-3.5 text-emerald-400" />
                  </div>
                </button>
              </div>

              {/* 4. GÜNLÜK PRATİK İŞLEM LİSTELERİ (MESAJLAR & SİPARİŞLER YAN YANA) */}
              <div className="grid lg:grid-cols-2 gap-6">
                {/* SOL KUTU: SİTEDEN GELEN MESAJLAR (TEK TIKLA WHATSAPP + TEKLİFE DÖNÜŞTÜR) */}
                <div className="p-5 rounded-3xl bg-slate-900 border-2 border-slate-800 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                    <div>
                      <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                        <MessageSquare className="h-4 w-4 text-sky-400" />
                        Gelen Müşteri Mesajları ({messages.length})
                      </h3>
                      <p className="text-xs text-slate-400">
                        Tek tıkla WhatsApp'tan yanıtlayın veya doğrudan teklif hazırlayın
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setCrmInitialTab("messages");
                        setActiveModule("crm");
                      }}
                      className="h-9 border-slate-700 font-bold text-xs rounded-xl"
                    >
                      Tümünü Gör
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {messages.length === 0 ? (
                      <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 text-center text-xs text-slate-400">
                        Henüz iletişim formundan gelen mesaj bulunmuyor. Ziyaretçiler siteden form gönderdiğinde sesli uyarı ile anında burada listelenir.
                      </div>
                    ) : (
                      messages.slice(0, 5).map((m) => (
                        <div
                          key={m.id}
                          className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5 text-xs"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="text-sm font-extrabold text-white">{m.name}</span>
                                {!m.isRead && (
                                  <span className="px-2 py-0.5 rounded-md bg-emerald-600 text-white text-[10px] font-black">
                                    YENİ
                                  </span>
                                )}
                                <span className="font-mono font-bold text-sky-400">
                                  {maskPiiText(m.phone, maskPii)}
                                </span>
                              </div>
                              <div className="font-bold text-slate-200 mt-0.5">{m.subject}</div>
                            </div>
                            <span className="text-[11px] text-slate-400 shrink-0">{m.date}</span>
                          </div>

                          <p className="text-xs text-slate-300 line-clamp-2">{m.message}</p>

                          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                            <div className="flex flex-wrap items-center gap-1.5">
                              <a
                                href={formatWhatsAppUrl(
                                  m.phone,
                                  `Merhaba ${m.name}, Acarpen'e gönderdiğiniz "${m.subject}" talebiniz için size ulaşıyoruz.`
                                )}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => markMessageAsRead(m.id)}
                                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs inline-flex items-center gap-1.5"
                              >
                                <PhoneCall className="h-3.5 w-3.5" />
                                <span>WhatsApp Yanıtla</span>
                              </a>
                              <button
                                type="button"
                                onClick={() => {
                                  markMessageAsRead(m.id);
                                  openNewQuoteModal({
                                    name: m.name,
                                    phone: m.phone,
                                    siteName: m.subject,
                                  });
                                }}
                                className="px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs inline-flex items-center gap-1"
                              >
                                <Plus className="h-3.5 w-3.5" />
                                <span>Teklif Hazırla</span>
                              </button>
                            </div>
                            <button
                              type="button"
                              onClick={() => deleteAdminMessage(m.id)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500"
                              title="Mesajı Sil"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* SAĞ KUTU: SON TEKLİFLER & SİPARİŞLER (HIZLI FİLTRE + DÜZENLE / YAZDIR) */}
                <div className="p-5 rounded-3xl bg-slate-900 border-2 border-slate-800 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                    <div>
                      <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                        <FileText className="h-4 w-4 text-amber-400" />
                        Son Teklifler & Siparişler ({quotes.length})
                      </h3>
                      <p className="text-xs text-slate-400">
                        Düzenlemek, yazdırmak veya WhatsApp ile iletmek için seçin
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setActiveModule("quotes")}
                      className="h-9 border-slate-700 font-bold text-xs rounded-xl"
                    >
                      Tüm Teklifler
                    </Button>
                  </div>

                  {/* Quick Filter Pills */}
                  <div className="flex flex-wrap gap-1.5">
                    {(
                      [
                        { id: "all", label: `Tümü (${quotes.length})` },
                        {
                          id: "pending",
                          label: `Bekleyen (${newLeadQuotes.length + quotedWaitingQuotes.length})`,
                        },
                        { id: "production", label: `Üretimde (${inProductionQuotes.length})` },
                        { id: "done", label: `Teslim (${completedQuotes.length})` },
                      ] as const
                    ).map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setDashboardQuoteFilter(tab.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-colors ${
                          dashboardQuoteFilter === tab.id
                            ? "bg-sky-600 text-white"
                            : "bg-slate-800 text-slate-200 hover:bg-slate-700"
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  <div className="space-y-3">
                    {controlCenterQuotes.length === 0 ? (
                      <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-3">
                        <p className="text-xs text-slate-400">
                          Bu filtrede kayıtlı teklif bulunmuyor.
                        </p>
                        <Button
                          size="sm"
                          onClick={() => openNewQuoteModal()}
                          className="bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl"
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          İlk Teklifi Şimdi Oluştur
                        </Button>
                      </div>
                    ) : (
                      controlCenterQuotes.slice(0, 5).map((q) => {
                        const stInfo = STATUS_LABELS[q.status] || STATUS_LABELS.new;
                        return (
                          <div
                            key={q.id}
                            className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5 text-xs"
                          >
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="font-mono font-extrabold text-sky-400">
                                  {q.id}
                                </span>
                                <span className="text-sm font-extrabold text-white">
                                  {q.customerName}
                                </span>
                                <span
                                  className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold ${stInfo.badge}`}
                                >
                                  {stInfo.label}
                                </span>
                                {q.qualityHold && (
                                  <span className="px-2 py-0.5 rounded-md bg-rose-600 text-white text-[10px] font-black">
                                    BLOKAJLI
                                  </span>
                                )}
                              </div>
                              <span className="font-mono text-base font-black text-emerald-400">
                                ₺{(q.estimatedPrice || 0).toLocaleString("tr-TR")}
                              </span>
                            </div>

                            <div className="text-xs text-slate-300">
                              {q.glassType} • <strong>{q.totalArea} m²</strong> • İstasyon{" "}
                              {q.productionStage || 1}/6
                            </div>

                            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                              <div className="flex flex-wrap items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingQuote(q);
                                    setConfiguratorOpen(true);
                                  }}
                                  className="px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs inline-flex items-center gap-1"
                                >
                                  <Edit2 className="h-3.5 w-3.5" />
                                  <span>Düzenle</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => printProposalDocument(q)}
                                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs inline-flex items-center gap-1"
                                >
                                  <Printer className="h-3.5 w-3.5" />
                                  <span>A4 Yazdır</span>
                                </button>
                                <a
                                  href={formatWhatsAppUrl(
                                    q.phone,
                                    `Sayın ${q.customerName}, ${q.id} numaralı Acarpen teklifiniz (${q.glassType} - ${q.totalArea} m²) toplam ₺${(q.estimatedPrice || 0).toLocaleString("tr-TR")} olarak hazırlanmıştır.`
                                  )}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs inline-flex items-center gap-1"
                                >
                                  <PhoneCall className="h-3.5 w-3.5" />
                                  <span>WhatsApp</span>
                                </a>
                              </div>
                              <button
                                type="button"
                                onClick={() => setQrModalOrder(q)}
                                className="p-1.5 rounded-lg bg-slate-800 text-slate-200 hover:text-sky-400"
                                title="QR Etiket Göster"
                              >
                                <QrCode className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>

              {/* 5. FİNANS ÖZETİ & CANLI WEB SİTESİ ZİYARETÇİ İSTATİSTİKLERİ */}
              <div className="grid lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2 p-5 rounded-3xl bg-slate-900 border-2 border-slate-800 flex flex-wrap items-center justify-between gap-4">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 flex-1">
                    <div>
                      <span className="text-slate-400 block text-[11px] uppercase font-extrabold">
                        Nakit + Banka Net
                      </span>
                      <span className="font-mono font-black text-base text-emerald-400">
                        ₺{netCashAndBankBalance.toLocaleString("tr-TR")}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px] uppercase font-extrabold">
                        Alınan Çekler
                      </span>
                      <span className="font-mono font-black text-base text-sky-400">
                        ₺{receivedChecksTotal.toLocaleString("tr-TR")}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px] uppercase font-extrabold">
                        Kesilen Çekler
                      </span>
                      <span className="font-mono font-black text-base text-rose-400">
                        ₺{issuedChecksTotal.toLocaleString("tr-TR")}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px] uppercase font-extrabold">
                        Sipariş Hacmi
                      </span>
                      <span className="font-mono font-black text-base text-white">
                        ₺{totalRevenue.toLocaleString("tr-TR")}
                      </span>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={handleExportCsv}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold text-xs rounded-xl h-10 px-4"
                  >
                    <Download className="h-4 w-4 mr-1.5" />
                    Excel / CSV İndir
                  </Button>
                </div>

                {/* Live Site Visitor Telemetry Summary */}
                <div className="p-5 rounded-3xl bg-slate-900 border-2 border-slate-800 flex items-center justify-between gap-4">
                  <div>
                    <div className="text-xs font-extrabold uppercase text-sky-400 flex items-center gap-1.5">
                      <Activity className="h-4 w-4" />
                      Site Ziyaretçi Trafiği
                    </div>
                    <div className="flex items-center gap-4 mt-2">
                      <div>
                        <span className="block text-[10px] font-bold text-slate-400">
                          Sayfa Gösterimi
                        </span>
                        <span className="font-mono text-lg font-black text-white">
                          {telemetry.totalPageviews}
                        </span>
                      </div>
                      <div>
                        <span className="block text-[10px] font-bold text-slate-400">
                          Tekil Ziyaretçi
                        </span>
                        <span className="font-mono text-lg font-black text-emerald-400">
                          {telemetry.uniqueVisitors}
                        </span>
                      </div>
                      <div>
                        <span className="block text-[10px] font-bold text-slate-400">Bugün</span>
                        <span className="font-mono text-lg font-black text-sky-400">
                          {telemetry.todayVisitors}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================ */}
          {/* MODÜL 2: MESAJLAR & MÜŞTERİLER (CRM 360°)                        */}
          {/* ================================================================ */}
          {activeModule === "crm" && (
            <CrmModuleView
              quotes={quotes}
              customers={customers}
              opportunities={opportunities}
              activities={activities}
              messages={messages}
              maskPii={maskPii}
              initialSubTab={crmInitialTab}
              onSelectCustomerFilter={(name) => {
                setSearchTerm(name);
                setActiveModule("quotes");
              }}
              onOpenQuoteEdit={(q) => {
                setEditingQuote(q);
                setConfiguratorOpen(true);
              }}
            />
          )}

          {/* ================================================================ */}
          {/* MODÜL 3: TEKLİFLER & FİYAT LİSTESİ                               */}
          {/* ================================================================ */}
          {activeModule === "quotes" && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 border-2 border-slate-800 p-4 rounded-2xl">
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setQuotesSubTab("quotes_list")}
                    className={`px-4 py-2.5 rounded-xl text-xs font-extrabold ${
                      quotesSubTab === "quotes_list"
                        ? "bg-sky-600 text-white"
                        : "bg-slate-800 text-slate-200"
                    }`}
                  >
                    Teklifler & Revizyonlar ({quotes.length})
                  </button>
                  <button
                    onClick={() => setQuotesSubTab("pricing_catalog")}
                    className={`px-4 py-2.5 rounded-xl text-xs font-extrabold ${
                      quotesSubTab === "pricing_catalog"
                        ? "bg-sky-600 text-white"
                        : "bg-slate-800 text-slate-200"
                    }`}
                  >
                    Birim Fiyat Listesi & Ek İşlemler ({prices.length})
                  </button>
                </div>

                {quotesSubTab === "quotes_list" && (
                  <div className="flex flex-wrap items-center gap-2">
                    <select
                      value={quotesStatusFilter}
                      onChange={(e) => setQuotesStatusFilter(e.target.value)}
                      className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs font-bold text-white"
                    >
                      <option value="all">Tüm Durumlar ({quotes.length})</option>
                      <option value="new">Yeni Talep</option>
                      <option value="in_review">Teknik İncelemede</option>
                      <option value="quoted">Teklif Gönderildi</option>
                      <option value="approved">Üretimde (Onaylı)</option>
                      <option value="completed">Teslim Edildi</option>
                      <option value="cancelled">İptal Edilenler</option>
                    </select>

                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Müşteri, telefon, şantiye ara..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                      />
                    </div>
                    <button
                      onClick={() =>
                        setQuotesViewMode(quotesViewMode === "table" ? "kanban" : "table")
                      }
                      className="px-3.5 py-2 rounded-xl bg-slate-800 text-xs font-extrabold text-slate-200 flex items-center gap-1.5"
                    >
                      {quotesViewMode === "table" ? (
                        <>
                          <Columns className="h-4 w-4 text-sky-400" />
                          <span>Pano Görünümü</span>
                        </>
                      ) : (
                        <>
                          <List className="h-4 w-4 text-sky-400" />
                          <span>Tablo Görünümü</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

              {quotesSubTab === "quotes_list" ? (
                quotesViewMode === "table" ? (
                  <div className="rounded-3xl bg-slate-900 border-2 border-slate-800 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b-2 border-slate-700 text-xs uppercase text-slate-200 bg-slate-950">
                            <th className="py-3.5 px-4">Teklif No</th>
                            <th className="py-3.5 px-4">Müşteri & Telefon</th>
                            <th className="py-3.5 px-4">Ürün / Seri & Ölçü</th>
                            <th className="py-3.5 px-4">Net Tutar</th>
                            <th className="py-3.5 px-4">Durum Değiştir</th>
                            <th className="py-3.5 px-4 text-right">Hızlı İşlemler</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800 text-xs">
                          {filteredQuotes.length === 0 ? (
                            <tr>
                              <td colSpan={6} className="py-12 text-center text-slate-400">
                                Eşleşen teklif kaydı bulunamadı. Sağ üstteki{" "}
                                <strong>"+ Yeni Teklif"</strong> butonuyla yeni teklif oluşturabilirsiniz.
                              </td>
                            </tr>
                          ) : (
                            filteredQuotes.map((q) => (
                              <tr key={q.id} className="hover:bg-slate-800/40">
                                <td className="py-3.5 px-4 font-mono">
                                  <div className="font-extrabold text-sky-400">{q.id}</div>
                                  <div className="text-[11px] text-indigo-400 font-bold">
                                    Sürüm v{q.version || 1}
                                  </div>
                                </td>
                                <td className="py-3.5 px-4">
                                  <div className="font-extrabold text-white">{q.customerName}</div>
                                  <div className="text-xs text-slate-400">
                                    {q.siteName || q.city} • {maskPiiText(q.phone, maskPii)}
                                  </div>
                                </td>
                                <td className="py-3.5 px-4">
                                  <div className="font-bold text-slate-200">{q.glassType}</div>
                                  <div className="text-xs text-slate-400">
                                    {q.dimensions} (<strong>{q.totalArea} m²</strong>)
                                  </div>
                                </td>
                                <td className="py-3.5 px-4 font-mono">
                                  <div className="text-sm font-black text-emerald-400">
                                    ₺{(q.estimatedPrice || 0).toLocaleString("tr-TR")}
                                  </div>
                                  <div className="text-[11px] text-slate-400">
                                    İskonto: %{q.discountRate || 0}
                                  </div>
                                </td>
                                <td className="py-3.5 px-4">
                                  <select
                                    value={q.status}
                                    onChange={(e) => {
                                      const res = updateQuoteStatus(
                                        q.id,
                                        e.target.value as QuoteItem["status"]
                                      );
                                      if (!res.ok) toast.error(res.error);
                                      else toast.success(`${q.id} durumu güncellendi.`);
                                    }}
                                    className="px-2.5 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-xs font-bold text-white"
                                  >
                                    <option value="new">Yeni Talep</option>
                                    <option value="in_review">Teknik İncelemede</option>
                                    <option value="quoted">Teklif Gönderildi</option>
                                    <option value="approved">Üretimde (Onaylı)</option>
                                    <option value="completed">Teslim Edildi</option>
                                    <option value="cancelled">İptal</option>
                                  </select>
                                </td>
                                <td className="py-3.5 px-4 text-right">
                                  <div className="flex items-center justify-end gap-1.5">
                                    <Button
                                      size="sm"
                                      onClick={() => {
                                        setEditingQuote(q);
                                        setConfiguratorOpen(true);
                                      }}
                                      className="h-8 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-lg"
                                    >
                                      <Edit2 className="h-3.5 w-3.5 mr-1" />
                                      Düzenle
                                    </Button>
                                    <a
                                      href={formatWhatsAppUrl(
                                        q.phone,
                                        `Sayın ${q.customerName}, ${q.id} numaralı Acarpen teklifiniz (${q.glassType} - ${q.totalArea} m²) toplam ₺${(q.estimatedPrice || 0).toLocaleString("tr-TR")} olarak hazırlanmıştır.`
                                      )}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="h-8 px-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs inline-flex items-center"
                                      title="WhatsApp ile Gönder"
                                    >
                                      <PhoneCall className="h-3.5 w-3.5" />
                                    </a>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => printProposalDocument(q)}
                                      className="h-8 border-slate-700 text-xs rounded-lg"
                                      title="A4 Teklif Yazdır"
                                    >
                                      <Printer className="h-3.5 w-3.5" />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => setQrModalOrder(q)}
                                      className="h-8 border-slate-700 text-xs rounded-lg"
                                      title="QR Etiket"
                                    >
                                      <QrCode className="h-3.5 w-3.5" />
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  /* Kanban Board View */
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {(
                      [
                        { id: "new", title: "Yeni Talep" },
                        { id: "in_review", title: "Teknik İnceleme" },
                        { id: "quoted", title: "Teklif Verildi" },
                        { id: "approved", title: "Üretimde" },
                        { id: "completed", title: "Teslim Edildi" },
                      ] as const
                    ).map((col) => {
                      const colItems = filteredQuotes.filter((q) => q.status === col.id);
                      return (
                        <div
                          key={col.id}
                          className="p-4 rounded-2xl bg-slate-900 border-2 border-slate-800 space-y-3"
                        >
                          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                            <span className="text-xs font-extrabold text-white">{col.title}</span>
                            <span className="px-2 py-0.5 rounded-full bg-slate-800 font-mono text-xs font-bold text-sky-400">
                              {colItems.length}
                            </span>
                          </div>
                          <div className="space-y-2.5">
                            {colItems.map((q) => (
                              <div
                                key={q.id}
                                onClick={() => {
                                  setEditingQuote(q);
                                  setConfiguratorOpen(true);
                                }}
                                className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-sky-500 cursor-pointer space-y-1 text-xs"
                              >
                                <div className="flex items-center justify-between font-mono">
                                  <span className="font-extrabold text-sky-400">{q.id}</span>
                                  <span className="text-[11px] text-indigo-400 font-bold">
                                    v{q.version || 1}
                                  </span>
                                </div>
                                <div className="font-extrabold text-white truncate">
                                  {q.customerName}
                                </div>
                                <div className="text-xs text-slate-400 truncate">
                                  {q.glassType} ({q.totalArea} m²)
                                </div>
                                <div className="font-mono font-black text-emerald-400 pt-0.5">
                                  ₺{(q.estimatedPrice || 0).toLocaleString("tr-TR")}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )
              ) : (
                /* Pricing & Extra Services Catalog */
                <div className="space-y-6">
                  <div className="p-5 rounded-3xl bg-slate-900 border-2 border-slate-800 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h4 className="text-sm font-extrabold text-white flex items-center gap-2">
                        <Percent className="h-4 w-4 text-sky-400" />
                        Toplu m² Birim Fiyat Güncelleme
                      </h4>
                      <p className="text-xs text-slate-400">
                        Buradaki birim fiyatlar hem yeni teklif ekranında hem de sitedeki hesaplama aracında kullanılır.
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {[5, 10, -5].map((pct) => (
                        <Button
                          key={pct}
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            const res = applyBulkAdminPricePercentage(pct);
                            if (!res.ok) toast.error(res.error);
                            else
                              toast.success(
                                `Tüm birim fiyatlara %${pct > 0 ? `+${pct}` : pct} uygulandı.`
                              );
                          }}
                          className="h-9 border-slate-700 font-mono font-bold text-xs rounded-xl"
                        >
                          {pct > 0 ? `+%${pct} Artır` : `%${pct} İndir`}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Product & Glass Unit Prices */}
                  <div className="rounded-3xl bg-slate-900 border-2 border-slate-800 p-5 space-y-4">
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (!newGlassName.trim()) return;
                        const created = addAdminPrice({
                          name: newGlassName.trim(),
                          thickness: newGlassThickness,
                          m2Price: Number(newGlassPrice) || 1450,
                        });
                        if (!created) {
                          toast.error("Yetkiniz yeni fiyat kalemi eklemeye uygun değil.");
                          return;
                        }
                        toast.success(`${created.name} fiyat listesine eklendi.`);
                        setNewGlassName("");
                      }}
                      className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs"
                    >
                      <input
                        type="text"
                        placeholder="Yeni Seri / Cam Kalemi Adı *"
                        value={newGlassName}
                        onChange={(e) => setNewGlassName(e.target.value)}
                        className="px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white sm:col-span-2"
                      />
                      <input
                        type="text"
                        placeholder="Kalınlık (Örn: 4+16+4 mm)"
                        value={newGlassThickness}
                        onChange={(e) => setNewGlassThickness(e.target.value)}
                        className="px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                      />
                      <input
                        type="number"
                        placeholder="m² Fiyatı (₺)"
                        value={newGlassPrice}
                        onChange={(e) => setNewGlassPrice(e.target.value)}
                        className="px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                      />
                      <Button
                        type="submit"
                        className="h-10 bg-sky-600 hover:bg-sky-500 text-white font-extrabold rounded-xl"
                      >
                        + Fiyat Kartı Ekle
                      </Button>
                    </form>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                      {prices.map((p) => (
                        <div
                          key={p.id}
                          className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5 text-xs"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="font-extrabold text-white leading-snug">{p.name}</div>
                            <button
                              onClick={() => deleteAdminPrice(p.id)}
                              className="text-slate-400 hover:text-rose-500 shrink-0"
                              title="Kalemi Sil"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                          <div className="text-xs text-slate-400 font-mono">{p.thickness}</div>
                          <div className="flex items-center gap-2 pt-1">
                            <input
                              type="number"
                              value={p.m2Price}
                              onChange={(e) => {
                                const res = updateAdminPrice(p.id, Number(e.target.value) || 0);
                                if (!res.ok) toast.error(res.error);
                              }}
                              className="w-28 px-2.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-emerald-400 font-mono font-black"
                            />
                            <select
                              value={p.stock || "Mevcut"}
                              onChange={(e) => {
                                const res = updateAdminPriceItem(p.id, { stock: e.target.value });
                                if (!res.ok) toast.error(res.error);
                              }}
                              className="flex-1 px-2 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-bold"
                            >
                              <option value="Mevcut">Stokta Var</option>
                              <option value="Sipariş Üzeri">Sipariş Üzeri</option>
                              <option value="Tükendi">Tükendi</option>
                            </select>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Extra Services Catalog */}
                  <div className="rounded-3xl bg-slate-900 border-2 border-slate-800 p-5 space-y-4">
                    <h4 className="text-sm font-extrabold text-white">
                      Ek İşçilik & Montaj Hizmet Tarifeleri
                    </h4>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (!newServiceName.trim()) return;
                        const s = addAdminService({
                          ad: newServiceName.trim(),
                          fiyat: Number(newServicePrice) || 150,
                        });
                        if (!s) {
                          toast.error("Yetkiniz ek hizmet eklemeye uygun değil.");
                          return;
                        }
                        toast.success(`${s.ad} eklendi.`);
                        setNewServiceName("");
                      }}
                      className="flex flex-wrap gap-2.5 text-xs"
                    >
                      <input
                        type="text"
                        placeholder="Yeni İşlem / Montaj Hizmeti Adı"
                        value={newServiceName}
                        onChange={(e) => setNewServiceName(e.target.value)}
                        className="px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white flex-1 min-w-[200px]"
                      />
                      <input
                        type="number"
                        placeholder="Ücret (₺)"
                        value={newServicePrice}
                        onChange={(e) => setNewServicePrice(e.target.value)}
                        className="w-32 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                      />
                      <Button
                        type="submit"
                        className="h-10 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-xl"
                      >
                        + Hizmet Ekle
                      </Button>
                    </form>
                    <div className="grid sm:grid-cols-3 gap-3">
                      {services.map((srv) => (
                        <div
                          key={srv.id}
                          className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-2 text-xs"
                        >
                          <span className="font-extrabold text-white">{srv.ad}</span>
                          <div className="flex items-center gap-1.5">
                            <input
                              type="number"
                              value={srv.fiyat}
                              onChange={(e) =>
                                updateAdminService(srv.id, { fiyat: Number(e.target.value) || 0 })
                              }
                              className="w-24 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-sky-400 font-mono font-black"
                            />
                            <button
                              onClick={() => deleteAdminService(srv.id)}
                              className="text-slate-400 hover:text-rose-500"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* MODÜL 4: SİPARİŞ VE SÖZLEŞME ONAYLARI */}
          {activeModule === "orders" && (
            <OrderManagementModuleView
              quotes={quotes}
              activeRole={activeRole}
              onOpenQuoteEdit={(q) => {
                setEditingQuote(q);
                setConfiguratorOpen(true);
              }}
            />
          )}

          {/* MODÜL 5: ÜRETİM TAKİBİ (ATÖLYE İSTASYON EKRANI) */}
          {activeModule === "production" && (
            <ProductionModuleView
              quotes={quotes}
              inventory={inventory}
              onShowQrModal={(q) => setQrModalOrder(q)}
            />
          )}

          {/* MODÜL 6: STOK, DEPO VE SATIN ALMA */}
          {activeModule === "inventory" && (
            <InventoryPurchasingModuleView
              inventory={inventory}
              purchases={purchases}
              activeRole={activeRole}
            />
          )}

          {/* MODÜL 7: KALİTE KONTROL VE BLOKAJ */}
          {activeModule === "quality" && (
            <QualityModuleView
              quotes={quotes}
              qualityInspections={qualityInspections}
              activeRole={activeRole}
            />
          )}

          {/* MODÜL 8: SEVKİYAT, MONTAJ VE TESLİMAT */}
          {activeModule === "shipment" && <ShipmentModuleView quotes={quotes} />}

          {/* MODÜL 9: KASA, BANKA, ALINAN & KESİLEN ÇEKLER */}
          {activeModule === "finance" && (
            <FinanceModuleView
              quotes={quotes}
              checks={checks}
              cashLedger={cashLedger}
              onOpenQuoteEdit={(q) => {
                setEditingQuote(q);
                setConfiguratorOpen(true);
              }}
            />
          )}

          {/* MODÜL 10: RAPORLAR VE ANALİTİK */}
          {activeModule === "reports" && (
            <ReportsModuleView
              quotes={quotes}
              opportunities={opportunities}
              inventory={inventory}
              onExportCsv={handleExportCsv}
            />
          )}

          {/* MODÜL 11: YETKİLER, ROLLER VE DENETİM İZİ */}
          {activeModule === "governance" && (
            <GovernanceModuleView
              activeRole={activeRole}
              auditLogs={auditLogs}
              onNavigateModule={(modId) => setActiveModule(modId)}
            />
          )}
        </main>
      </div>

      {/* LINE-BASED QUOTE CONFIGURATOR & REVISION MODAL */}
      <QuoteConfiguratorModal
        isOpen={configuratorOpen}
        editingQuote={editingQuote}
        prefillCustomer={prefillCustomer}
        prices={prices}
        activeRole={activeRole}
        onClose={() => {
          setConfiguratorOpen(false);
          setPrefillCustomer(null);
        }}
      />

      {/* QR CODE FACTORY LABEL MODAL */}
      {qrModalOrder &&
        (() => {
          const trackingUrl = `https://www.acarpen.com.tr/siparis-takip?id=${encodeURIComponent(
            qrModalOrder.id
          )}`;
          const { totalSize, pathData } = getQrSvgPath(trackingUrl, 2);
          return (
            <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white text-slate-900 rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl border-2 border-slate-400">
                <div className="flex items-center justify-between border-b-2 border-slate-200 pb-3">
                  <div>
                    <div className="text-xs font-black uppercase text-sky-700">
                      ACARPEN ÜRETİM & SEVK ETİKETİ
                    </div>
                    <div className="font-mono text-lg font-black text-slate-950">
                      {qrModalOrder.id}
                    </div>
                  </div>
                  <button
                    onClick={() => setQrModalOrder(null)}
                    className="p-2 rounded-xl bg-slate-200 text-slate-800 hover:bg-rose-600 hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="text-xs space-y-1.5 text-slate-900">
                  <div>
                    <strong>Müşteri:</strong> {qrModalOrder.customerName} (
                    {qrModalOrder.siteName || qrModalOrder.city})
                  </div>
                  <div>
                    <strong>Ürün:</strong> {qrModalOrder.glassType} • {qrModalOrder.thickness}
                  </div>
                  <div>
                    <strong>Ölçü:</strong> {qrModalOrder.dimensions} ({qrModalOrder.totalArea} m²)
                  </div>
                  <div>
                    <strong>Sehpa / Lot:</strong> {qrModalOrder.rackNo || "SHP-01"} •{" "}
                    {qrModalOrder.reservedLotNo || "LOT-STD"}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border-2 border-slate-300 flex flex-col items-center">
                  <svg
                    viewBox={`0 0 ${totalSize} ${totalSize}`}
                    width={164}
                    height={164}
                    shapeRendering="crispEdges"
                  >
                    <rect width={totalSize} height={totalSize} fill="#ffffff" />
                    <path d={pathData} fill="#0f172a" />
                  </svg>
                  <span className="text-xs font-mono font-bold text-slate-700 mt-2">
                    Telefon kamerasıyla okutun (/siparis-takip)
                  </span>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => printThermalLabelDocument(qrModalOrder)}
                    className="flex-1 h-11 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl"
                  >
                    <Printer className="h-4 w-4 mr-1.5" />
                    10x15cm Etiket Yazdır
                  </Button>
                </div>
              </div>
            </div>
          );
        })()}
    </div>
  );
}
