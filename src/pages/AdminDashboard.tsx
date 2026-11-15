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
  Volume2,
  VolumeX,
  ArrowRight,
  Trash2,
  Sun,
  Moon,
  MessageSquare,
  Wallet,
  ExternalLink,
  SlidersHorizontal,
  Download,
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
  getAdminMessages,
  subscribeAdminMessages,
  markMessageAsRead,
  getAdminPrices,
  subscribeAdminPrices,
  getAdminServices,
  subscribeAdminServices,
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
  setLiveSession,
  getAdminAuthState,
  subscribeAdminAuthState,
  getStaffUsers,
  subscribeStaffUsers,
  getAdminSyncState,
  clearAdminSyncError,
  subscribeAdminSyncState,
  purgeAllAdminTransactionalData,
  type AdminAuthState,
  type AdminSyncState,
  type StaffUserRecord,
} from "@/lib/adminStorage";
import { auth, isFirebaseConfigured } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { toast } from "sonner";
import { buildQuotesCsv } from "@/lib/csvExport";
import { AdminLoginGate } from "@/components/admin/AdminLoginGate";
import { QrOrderLabelModal } from "@/components/admin/QrOrderLabelModal";
import { ControlCenterModuleView } from "@/components/admin/ControlCenterModuleView";
import { QuotesPricingModuleView } from "@/components/admin/QuotesPricingModuleView";
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
  const [authState, setAuthState] = useState<AdminAuthState>(() => getAdminAuthState());
  const [syncState, setSyncState] = useState<AdminSyncState>(() => getAdminSyncState());
  const [staffUsers, setStaffUsers] = useState<StaffUserRecord[]>(() => getStaffUsers());
  const isAuthenticated = Boolean(
    authState.sessionUid && authState.authResolved && authState.isAuthorizedStaff
  );

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

  // Module 3 Navigation Filter States
  const [quotesSubTab, setQuotesSubTab] = useState<"quotes_list" | "pricing_catalog">("quotes_list");
  const [quotesStatusFilter, setQuotesStatusFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [configuratorOpen, setConfiguratorOpen] = useState(false);
  const [editingQuote, setEditingQuote] = useState<QuoteItem | null>(null);
  const [prefillCustomer, setPrefillCustomer] = useState<PrefillCustomerInfo | null>(null);
  const [qrModalOrder, setQrModalOrder] = useState<QuoteItem | null>(null);

  const prevQuoteCountRef = useRef<number | null>(null);
  const prevMsgCountRef = useRef<number | null>(null);

  useEffect(() => {
    const unsubAuthState = subscribeAdminAuthState(setAuthState);
    const unsubSync = subscribeAdminSyncState(setSyncState);
    const unsubStaff = subscribeStaffUsers(setStaffUsers);
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
      unsubAuthState();
      unsubSync();
      unsubStaff();
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

  const handleLogout = async () => {
    try {
      if (isFirebaseConfigured) await signOut(auth);
    } catch {
      // Ignore signout error
    }
    setLiveSession(null);
  };

  const handleExportCsv = () => {
    const csv = buildQuotesCsv(quotes);
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
      "Sipariş ve finans verisi RFC 4180 güvenli Excel/CSV olarak dışa aktarıldı."
    );
    toast.success("Tüm sipariş ve finans tablosu güvenli Excel/CSV olarak indirildi.");
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
      <AdminLoginGate
        authState={authState}
        lightTheme={lightTheme}
        onToggleTheme={() => setLightTheme(!lightTheme)}
      />
    );
  }

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
                      {authState.canSimulateRoles
                        ? "Arayüz Rol Simülasyonu (Backend: Yönetici)"
                        : "Atanmış Backend Rolü (Kilitli)"}
                    </label>
                    <select
                      value={activeRole}
                      disabled={!authState.canSimulateRoles}
                      onChange={(e) => {
                        const nextRole = e.target.value as UserRole;
                        const res = setActiveUserRole(nextRole);
                        if (!res.ok) {
                          toast.error(res.error || "Rol değiştirme yetkiniz yok.");
                          return;
                        }
                        toast.info(`Simülasyon rolü: ${ROLE_DEFINITIONS[nextRole].label}`);
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-bold text-xs disabled:opacity-60"
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
          {syncState.status === "error" && syncState.lastError && (
            <div
              role="alert"
              className="rounded-2xl bg-rose-950/90 border-2 border-rose-500 text-rose-100 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg"
            >
              <div className="space-y-1">
                <div className="text-xs font-black uppercase tracking-wider text-rose-300">
                  Firestore Sunucu Eşitleme Hatası ({syncState.failedCount} başarısız işlem)
                </div>
                <p className="text-xs sm:text-sm font-medium text-white">{syncState.lastError}</p>
              </div>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={clearAdminSyncError}
                className="shrink-0 rounded-xl border-rose-400 text-rose-100 hover:bg-rose-800 text-xs font-bold"
              >
                Uyarıyı Kapat
              </Button>
            </div>
          )}
          {/* ================================================================ */}
          {/* ================================================================ */}
          {/* MODÜL 1: GENEL ÖZET & BUGÜN (PRATİK HIZLI KONTROL MERKEZİ)       */}
          {/* ================================================================ */}
          {activeModule === "control_center" && (
            <ControlCenterModuleView
              quotes={quotes}
              messages={messages}
              checks={checks}
              cashLedger={cashLedger}
              telemetry={telemetry}
              maskPii={maskPii}
              onOpenNewQuote={openNewQuoteModal}
              onOpenQuoteEdit={(q) => {
                setEditingQuote(q);
                setConfiguratorOpen(true);
              }}
              onOpenQrModal={setQrModalOrder}
              onNavigateModule={setActiveModule}
              onNavigateCrmMessages={() => {
                setCrmInitialTab("messages");
                setActiveModule("crm");
              }}
              onNavigateQuotesWithFilter={(status) => {
                setQuotesStatusFilter(status);
                setQuotesSubTab("quotes_list");
                setActiveModule("quotes");
              }}
              onExportCsv={handleExportCsv}
            />
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
                setQuotesSubTab("quotes_list");
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
            <QuotesPricingModuleView
              quotes={quotes}
              prices={prices}
              services={services}
              maskPii={maskPii}
              subTab={quotesSubTab}
              statusFilter={quotesStatusFilter}
              searchTerm={searchTerm}
              onSubTabChange={setQuotesSubTab}
              onStatusFilterChange={setQuotesStatusFilter}
              onSearchTermChange={setSearchTerm}
              onOpenQuoteEdit={(q) => {
                setEditingQuote(q);
                setConfiguratorOpen(true);
              }}
              onOpenQrModal={setQrModalOrder}
            />
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
              assignedBackendRole={authState.assignedBackendRole}
              canSimulateRoles={authState.canSimulateRoles}
              staffUsers={staffUsers}
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
      <QrOrderLabelModal order={qrModalOrder} onClose={() => setQrModalOrder(null)} />
    </div>
  );
}
