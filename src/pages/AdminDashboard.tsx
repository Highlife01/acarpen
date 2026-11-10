import React, { useState, useEffect, useRef } from "react";
import {
  LayoutDashboard,
  Users,
  FileText,
  FileCheck,
  Cpu,
  Package,
  ShieldCheck,
  Truck,
  DollarSign,
  BarChart3,
  KeyRound,
  Lock,
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
  Globe,
  Users,
  MousePointerClick,
  Laptop,
  Smartphone,
  Cookie,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { QuoteConfiguratorModal } from "@/components/admin/QuoteConfiguratorModal";
import { SEO } from "@/components/SEO";
import { getVisitorStats, subscribeVisitorStats, VisitorTelemetryStats } from "@/lib/analytics";

const DEFAULT_ADMIN_EMAIL = "admin@acarpen.com.tr";

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

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [emailInput, setEmailInput] = useState(DEFAULT_ADMIN_EMAIL);
  const [passwordInput, setPasswordInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // 11 Modules Navigation State
  const [activeModule, setActiveModule] = useState<string>("control_center");
  const [crmInitialTab, setCrmInitialTab] = useState<
    "c360" | "funnel" | "activities" | "messages"
  >("c360");
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(() =>
    typeof window !== "undefined" ? window.innerWidth >= 768 : true
  );
  const [activeRole, setActiveRole] = useState<UserRole>(() => getActiveUserRole());
  const [soundMuted, setSoundMuted] = useState(false);
  const [maskPii, setMaskPii] = useState(false);
  const [lightTheme, setLightTheme] = useState(true); // Aydınlık Kurumsal Tema (Default)

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

  // Module 3 (Quotes & Pricing) UI States
  const [quotesSubTab, setQuotesSubTab] = useState<"quotes_list" | "pricing_catalog">("quotes_list");
  const [quotesViewMode, setQuotesViewMode] = useState<"table" | "kanban">("table");
  const [searchTerm, setSearchTerm] = useState("");
  const [configuratorOpen, setConfiguratorOpen] = useState(false);
  const [editingQuote, setEditingQuote] = useState<QuoteItem | null>(null);
  const [qrModalOrder, setQrModalOrder] = useState<QuoteItem | null>(null);

  // Price & Service Form States
  const [newGlassName, setNewGlassName] = useState("");
  const [newGlassThickness, setNewGlassThickness] = useState("6+16+6 mm");
  const [newGlassPrice, setNewGlassPrice] = useState("1650");
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
        toast.success("📩 Siteden yeni iletişim mesajı geldi!");
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
          toast.success("Acarpen ERP + CRM Yönetim Sistemine giriş yapıldı.");
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
      "CamTipi",
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
    a.download = `acarpen_erp_rapor_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    recordAdminAudit("DATA_EXPORT", "ALL_QUOTES", "ERP sipariş ve finans verisi CSV olarak dışa aktarıldı.");
    toast.success("ERP raporu CSV olarak indirildi.");
  };

  // 11 Main Menu Definitions (Section 2)
  const MENU_MODULES = [
    { id: "control_center", label: "1. Kontrol Merkezi", icon: LayoutDashboard, badge: null },
    {
      id: "crm",
      label: "2. CRM & Müşteri 360°",
      icon: Users,
      badge: opportunities.length + messages.filter((m) => !m.isRead).length || null,
    },
    { id: "quotes", label: "3. Teklif ve Fiyat", icon: FileText, badge: quotes.length || null },
    {
      id: "orders",
      label: "4. Sipariş Yönetimi",
      icon: FileCheck,
      badge: quotes.filter((q) => q.approvalStatus === "pending_approval").length || null,
    },
    {
      id: "production",
      label: "5. Üretim & İstasyon",
      icon: Cpu,
      badge: quotes.filter((q) => q.status === "approved").length || null,
    },
    {
      id: "inventory",
      label: "6. Stok & Satın Alma",
      icon: Package,
      badge: inventory.filter((i) => i.availableQty < i.minStockLevel).length || null,
    },
    {
      id: "quality",
      label: "7. Kalite Kontrol",
      icon: ShieldCheck,
      badge: quotes.filter((q) => q.qualityHold).length || null,
    },
    { id: "shipment", label: "8. Sevkiyat & POD", icon: Truck, badge: null },
    {
      id: "finance",
      label: "9. Finans, Kasa & Çekler",
      icon: Wallet,
      badge: checks.length || null,
    },
    { id: "reports", label: "10. Raporlama", icon: BarChart3, badge: null },
    { id: "governance", label: "11. Yönetim & Roller", icon: KeyRound, badge: null },
  ];

  const currentRoleDef = ROLE_DEFINITIONS[activeRole];
  const visibleModules = MENU_MODULES.filter(
    (m) => currentRoleDef.allowedModules.includes(m.id) || m.id === "governance"
  );

  // Login Gate
  if (!isAuthenticated) {
    return (
      <div
        className={`min-h-screen bg-slate-950 flex items-center justify-center p-6 text-slate-100 ${
          lightTheme ? "admin-light-theme" : ""
        }`}
      >
        <div className="max-w-md w-full rounded-3xl bg-slate-900 border border-slate-800 p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="h-14 w-14 rounded-2xl bg-sky-500/15 border border-sky-500/30 text-sky-400 grid place-items-center mx-auto">
              <Lock className="h-7 w-7" />
            </div>
            <h1 className="text-xl font-bold text-white">Acarpen — ERP + CRM Sistemi</h1>
            <p className="text-xs text-slate-400">
              11 Modüllü Fabrika Üretim, Kalite, Kasa/Çek Muhasebe ve Müşteri 360° Yönetim Platformu
            </p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="text-slate-400 block mb-1">Kurumsal E-Posta</label>
              <input
                type="email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Yönetici Parolası</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            {loginError && <p className="text-rose-400 text-xs">{loginError}</p>}
            <Button
              type="submit"
              disabled={isAuthenticating}
              className="w-full py-6 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold"
            >
              {isAuthenticating ? "Doğrulanıyor..." : "ERP + CRM Paneline Giriş Yap"}
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
              className="w-full text-center text-slate-400 hover:text-sky-400 underline text-[11px]"
            >
              Parolamı Unuttum (E-Posta ile Sıfırla)
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Control Center KPI & Action Lists (Section 6)
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
  const unreadMessagesCount = messages.filter((m) => !m.isRead).length;

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

  const filteredQuotes = quotes.filter((q) => {
    if (!searchTerm.trim()) return true;
    const s = searchTerm.toLowerCase();
    return (
      q.id.toLowerCase().includes(s) ||
      q.customerName.toLowerCase().includes(s) ||
      (q.siteName || "").toLowerCase().includes(s) ||
      q.glassType.toLowerCase().includes(s)
    );
  });

  return (
    <div
      className={`min-h-screen bg-slate-950 text-slate-100 flex ${
        lightTheme ? "admin-light-theme" : ""
      }`}
    >
      {/* MOBILE SIDEBAR BACKDROP OVERLAY */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-30 md:hidden"
        />
      )}

      {/* LEFT SIDEBAR: 11 ERP+CRM MODULES (COLLAPSIBLE ON ALL SCREENS) */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 shrink-0 bg-slate-900 border-r border-slate-800 flex-col transition-all duration-200 md:sticky md:top-0 md:h-screen ${
          sidebarOpen ? "flex translate-x-0" : "hidden -translate-x-full"
        }`}
      >
        <div className="admin-sidebar-header p-4 border-b border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-sm font-black tracking-wide text-slate-900 dark:text-white">
              ACARPEN ERP
            </div>
            <div className="text-[11px] font-bold text-sky-600 dark:text-sky-400">
              11 Modüllü MES • CRM • Kasa/Çek
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-200 hover:bg-rose-500 hover:text-white transition-colors"
            title="Sol Menüyü Kapat"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
          {visibleModules.map((mod, idx) => {
            const Icon = mod.icon;
            const active = activeModule === mod.id;
            return (
              <button
                key={mod.id}
                onClick={() => {
                  setActiveModule(mod.id);
                  if (typeof window !== "undefined" && window.innerWidth < 768) {
                    setSidebarOpen(false);
                  }
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  active
                    ? "admin-nav-btn-active bg-sky-500 text-white shadow-md"
                    : "admin-nav-btn text-slate-200 hover:bg-slate-800/80 hover:text-white"
                }`}
              >
                <span className="flex items-center gap-2.5 text-left">
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="leading-tight">
                    <span className="opacity-65 mr-1 font-mono text-[10px]">
                      {String(idx + 1).padStart(2, "0")}.
                    </span>
                    {mod.label}
                  </span>
                </span>
                {mod.badge ? (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-mono shrink-0 ml-1 ${
                      active
                        ? "admin-nav-badge-active bg-white text-sky-700 font-bold"
                        : "admin-nav-badge bg-slate-800 text-sky-400"
                    }`}
                  >
                    {mod.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </nav>

        <div className="admin-sidebar-footer p-4 border-t border-slate-800 space-y-2.5">
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400">
            <span>Aktif Rol:</span>
            <strong className="text-sky-600 dark:text-sky-400">{currentRoleDef.label}</strong>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="w-full border-rose-500/40 text-rose-500 hover:bg-rose-500/10 font-bold text-xs"
          >
            <LogOut className="h-3.5 w-3.5 mr-1.5" />
            Güvenli Çıkış
          </Button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* TOP HEADER BAR */}
        <header className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur border-b border-slate-800 px-6 py-3.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center gap-2 text-xs font-bold transition-all shadow-xs"
              title={sidebarOpen ? "Sol Menüyü Kapat / Daralt" : "Sol Menüyü Aç"}
            >
              {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              <span>{sidebarOpen ? "Menüyü Gizle" : "Menüyü Aç"}</span>
            </button>
            <div>
              <h2 className="text-base font-bold text-white">
                {MENU_MODULES.find((m) => m.id === activeModule)?.label || "Kontrol Merkezi"}
              </h2>
              <p className="text-[11px] text-slate-400">
                Canlı Firebase Firestore • Tekil Sipariş, Kasa & Çek/Senet Zinciri
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Quick Web Messages Inbox Button */}
            <button
              onClick={() => {
                setCrmInitialTab("messages");
                setActiveModule("crm");
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold flex items-center gap-1.5 text-sky-400 hover:border-sky-400"
              title="Siteden Gelen İletişim Mesajlarını Aç"
            >
              <MessageSquare className="h-3.5 w-3.5" />
              <span>Gelen Mesajlar ({messages.length})</span>
              {unreadMessagesCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[10px]">
                  {unreadMessagesCount} Yeni
                </span>
              )}
            </button>

            {/* Quick Kasa & Çek Muhasebe Button */}
            <button
              onClick={() => setActiveModule("finance")}
              className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold flex items-center gap-1.5 text-emerald-400 hover:border-emerald-400"
              title="Kasa, Banka, Alınan Çekler ve Kesilen Çekler"
            >
              <Wallet className="h-3.5 w-3.5" />
              <span>Kasa & Çekler</span>
            </button>

            {/* Active RBAC Role Selector (Acceptance Test #9) */}
            <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs">
              <KeyRound className="h-3.5 w-3.5 text-sky-400" />
              <span className="text-slate-400 text-[11px]">Rol:</span>
              <select
                value={activeRole}
                onChange={(e) => {
                  const nextRole = e.target.value as UserRole;
                  setActiveUserRole(nextRole);
                  toast.info(`Aktif rol: ${ROLE_DEFINITIONS[nextRole].label}`);
                }}
                className="bg-transparent text-sky-400 font-bold text-xs focus:outline-none"
              >
                {(Object.keys(ROLE_DEFINITIONS) as UserRole[]).map((rk) => (
                  <option key={rk} value={rk} className="bg-slate-900 text-white">
                    {ROLE_DEFINITIONS[rk].label}
                  </option>
                ))}
              </select>
            </div>

            {/* Light / Dark Theme Toggle */}
            <button
              onClick={() => setLightTheme(!lightTheme)}
              className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold flex items-center gap-1.5 text-slate-300"
              title="Aydınlık / Koyu Tema Değiştir"
            >
              {lightTheme ? (
                <>
                  <Sun className="h-3.5 w-3.5 text-amber-400" />
                  <span>Aydınlık</span>
                </>
              ) : (
                <>
                  <Moon className="h-3.5 w-3.5 text-sky-400" />
                  <span>Koyu</span>
                </>
              )}
            </button>

            {/* PII Privacy Mask Toggle */}
            <button
              onClick={() => setMaskPii(!maskPii)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 ${
                maskPii
                  ? "bg-amber-500/15 border-amber-500/40 text-amber-300"
                  : "bg-slate-950 border-slate-800 text-slate-300"
              }`}
              title="KVKK Telefon/Veri Maskeleme"
            >
              {maskPii ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              <span>{maskPii ? "KVKK Maskeli" : "KVKK Açık"}</span>
            </button>

            {/* Sound Alarm Mute Toggle */}
            <button
              onClick={() => setSoundMuted(!soundMuted)}
              className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-white"
              title={soundMuted ? "Sesli Alarm Kapalı" : "Sesli Alarm Açık"}
            >
              {soundMuted ? (
                <VolumeX className="h-4 w-4 text-rose-400" />
              ) : (
                <Volume2 className="h-4 w-4 text-emerald-400" />
              )}
            </button>

            {/* Purge All Demo / Cache Data Button */}
            <button
              onClick={() => {
                purgeAllAdminTransactionalData();
                toast.success("Tüm test/demo verileri ve tarayıcı önbelleği tamamen temizlendi!");
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-950 border border-rose-500/40 text-xs font-bold flex items-center gap-1.5 text-rose-400 hover:bg-rose-500/10"
              title="Tüm test/demo kayıtlarını ve önbelleği sıfırla"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Verileri Sıfırla</span>
            </button>

            {/* Quick New Quote Button */}
            <Button
              size="sm"
              onClick={() => {
                setEditingQuote(null);
                setConfiguratorOpen(true);
              }}
              className="h-9 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs rounded-xl"
            >
              <Plus className="h-4 w-4 mr-1" />
              Yeni Ölçülü Teklif
            </Button>
          </div>
        </header>

        {/* TOP HORIZONTAL 11-MODULE QUICK NAVIGATION BAR */}
        <div className="admin-quick-nav bg-slate-900/90 border-b border-slate-800 px-4 py-2.5 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {visibleModules.map((mod, idx) => {
            const Icon = mod.icon;
            const active = activeModule === mod.id;
            return (
              <button
                key={mod.id}
                onClick={() => setActiveModule(mod.id)}
                className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                  active
                    ? "admin-quick-pill-active bg-sky-500 text-white shadow-sm"
                    : "admin-quick-pill bg-slate-800/80 text-slate-200 hover:bg-slate-700"
                }`}
              >
                <Icon className="h-3.5 w-3.5 shrink-0" />
                <span>
                  {idx + 1}. {mod.label}
                </span>
                {mod.badge ? (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                      active
                        ? "bg-white text-sky-700 font-bold"
                        : "bg-slate-950/60 text-sky-400"
                    }`}
                  >
                    {mod.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>

        {/* MODULE BODY */}
        <main className="p-6 flex-1 space-y-6 overflow-x-hidden">
          {/* ============================================================== */}
          {/* MODÜL 1: KONTROL MERKEZİ (Bölüm 6 — Yönetici Görünümü & KPI) */}
          {/* ============================================================== */}
          {activeModule === "control_center" && (
            <div className="space-y-6">
              {/* Clickable KPI Cards (Section 6: "kutuya tıklanınca kaynağı oluşturan liste açılır") */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <button
                  onClick={() => {
                    setCrmInitialTab("messages");
                    setActiveModule("crm");
                  }}
                  className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-sky-500/50 text-left transition-all"
                >
                  <div className="text-[11px] text-slate-400 uppercase font-bold flex items-center gap-1">
                    <MessageSquare className="h-3.5 w-3.5 text-sky-400" />
                    Gelen Web Mesajları
                  </div>
                  <div className="text-3xl font-black text-sky-400 font-mono mt-1">
                    {messages.length}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                    <span>
                      {unreadMessagesCount > 0
                        ? `${unreadMessagesCount} Okunmamış • Mesajları aç`
                        : "İletişim formu mesajları"}
                    </span>
                    <ArrowRight className="h-3 w-3" />
                  </div>
                </button>

                <button
                  onClick={() => setActiveModule("orders")}
                  className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-sky-500/50 text-left transition-all"
                >
                  <div className="text-[11px] text-slate-400 uppercase font-bold">
                    Onay Bekleyen Teklifler
                  </div>
                  <div className="text-3xl font-black text-indigo-400 font-mono mt-1">
                    {unapprovedQuotes.length}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                    <span>Sözleşme listesini aç</span>
                    <ArrowRight className="h-3 w-3" />
                  </div>
                </button>

                <button
                  onClick={() => setActiveModule("quality")}
                  className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-rose-500/50 text-left transition-all"
                >
                  <div className="text-[11px] text-slate-400 uppercase font-bold">
                    Aktif Kalite Blokajı
                  </div>
                  <div className="text-3xl font-black text-rose-400 font-mono mt-1">
                    {qualityBlockedQuotes.length}
                  </div>
                  <div className="text-[11px] text-rose-300 mt-1 flex items-center gap-1">
                    <span>Fire: {totalScrapM2.toFixed(1)} m² • Kalite</span>
                    <ArrowRight className="h-3 w-3" />
                  </div>
                </button>

                <button
                  onClick={() => setActiveModule("shipment")}
                  className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-purple-500/50 text-left transition-all"
                >
                  <div className="text-[11px] text-slate-400 uppercase font-bold">
                    Sevk & POD Hazır İşler
                  </div>
                  <div className="text-3xl font-black text-purple-400 font-mono mt-1">
                    {readyForShipmentQuotes.length}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                    <span>Sevkiyat ve POD ekranı</span>
                    <ArrowRight className="h-3 w-3" />
                  </div>
                </button>

                <button
                  onClick={() => setActiveModule("finance")}
                  className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 text-left transition-all"
                >
                  <div className="text-[11px] text-slate-400 uppercase font-bold">
                    Kasa, Çek & Ciro Özeti
                  </div>
                  <div className="text-xl font-black text-emerald-400 font-mono mt-1">
                    ₺{netCashAndBankBalance.toLocaleString("tr-TR")}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                    <span>Alınan Çek: ₺{receivedChecksTotal.toLocaleString("tr-TR")}</span>
                    <ArrowRight className="h-3 w-3" />
                  </div>
                </button>
              </div>

              {/* Kasa, Alınan Çekler & Kesilen Çekler Hızlı Muhasebe Bandı */}
              <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
                <div className="flex flex-wrap items-center gap-6">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">
                      Nakit Kasa + Banka Net
                    </span>
                    <span className="font-mono font-black text-sm text-emerald-400">
                      ₺{netCashAndBankBalance.toLocaleString("tr-TR")}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">
                      Portföydeki Alınan Çekler
                    </span>
                    <span className="font-mono font-black text-sm text-sky-400">
                      ₺{receivedChecksTotal.toLocaleString("tr-TR")}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">
                      Tedavüldeki Kesilen Çeklerimiz
                    </span>
                    <span className="font-mono font-black text-sm text-rose-400">
                      ₺{issuedChecksTotal.toLocaleString("tr-TR")}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">
                      Toplam Sipariş Hacmi
                    </span>
                    <span className="font-mono font-black text-sm text-white">
                      ₺{totalRevenue.toLocaleString("tr-TR")}
                    </span>
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() => setActiveModule("finance")}
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl"
                >
                  <Wallet className="h-4 w-4 mr-1.5" />
                  Kasa, Alınan Çekler & Kesilen Çekler Ekranını Aç
                </Button>
              </div>

              {/* Today's Action Required Board + Incoming Site Messages (Section 6) */}
              <div className="grid lg:grid-cols-2 gap-6">
                {/* 1. Siteden Gelen İletişim & Form Mesajları Kutusu */}
                <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <MessageSquare className="h-4 w-4 text-sky-400" />
                        Siteye Gelen İletişim & Form Mesajları ({messages.length})
                      </h3>
                      <p className="text-[11px] text-slate-400">
                        <strong>/iletisim</strong> ve Ana Sayfa formundan gelen talepler buraya düşer
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setCrmInitialTab("messages");
                        setActiveModule("crm");
                      }}
                      className="h-8 border-slate-700 text-xs"
                    >
                      Tüm Mesajları Gör
                    </Button>
                  </div>

                  <div className="space-y-2.5">
                    {messages.length === 0 ? (
                      <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 text-center text-xs text-slate-500">
                        Henüz iletişim formundan gelen mesaj yok. Ziyaretçiler sitedeki{" "}
                        <strong>Hızlı Teklif & İletişim Formunu</strong> gönderdiğinde sesli uyarı ile anında burada görünür.
                      </div>
                    ) : (
                      messages.slice(0, 5).map((m) => (
                        <div
                          key={m.id}
                          className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3 text-xs"
                        >
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-white">{m.name}</span>
                              {!m.isRead && (
                                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                                  YENİ
                                </span>
                              )}
                              <span className="font-mono text-slate-400">
                                {maskPiiText(m.phone, maskPii)}
                              </span>
                            </div>
                            <div className="text-sky-400 font-semibold truncate">{m.subject}</div>
                            <div className="text-[11px] text-slate-400 truncate">{m.message}</div>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <Button
                              size="sm"
                              onClick={() => {
                                markMessageAsRead(m.id);
                                setCrmInitialTab("messages");
                                setActiveModule("crm");
                              }}
                              className="h-8 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs"
                            >
                              Aç & Yanıtla
                            </Button>
                            <button
                              onClick={() => deleteAdminMessage(m.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-400"
                              title="Sil"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* 2. Bugün Aksiyon Gereken Sipariş & Teklifler (/hesaplama'dan gelenler dahil) */}
                <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-amber-400" />
                        Gelen Ölçülü Teklifler & Aksiyon Gereken Siparişler ({quotes.length})
                      </h3>
                      <p className="text-[11px] text-slate-400">
                        <strong>/hesaplama</strong> sayfasından gelen teklifler ve üretimdeki işler
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setActiveModule("quotes")}
                      className="h-8 border-slate-700 text-xs"
                    >
                      Tüm Teklifler
                    </Button>
                  </div>
                  <div className="space-y-2.5">
                    {quotes.length === 0 ? (
                      <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 text-center text-xs text-slate-500">
                        Henüz kayıtlı sipariş yok. Sağ üstteki <strong>"Yeni Ölçülü Teklif"</strong> butonuyla ilk kaydı oluşturabilirsiniz.
                      </div>
                    ) : (
                      quotes.slice(0, 5).map((q) => (
                        <div
                          key={q.id}
                          className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3 text-xs"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-sky-400">{q.id}</span>
                              <span className="font-bold text-white">{q.customerName}</span>
                              {q.qualityHold && (
                                <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 text-[10px] font-bold">
                                  KALİTE BLOKAJI
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-400 mt-0.5">
                              {q.glassType} • {q.totalArea} m² • ₺
                              {(q.estimatedPrice || 0).toLocaleString("tr-TR")} • Aşama{" "}
                              {q.productionStage || 1}/6
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingQuote(q);
                              setConfiguratorOpen(true);
                            }}
                            className="h-8 border-slate-700 text-xs"
                          >
                            Yönet
                          </Button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* MODÜL 2: CRM & MÜŞTERİ 360° */}
          {/* ============================================================== */}
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

          {/* ============================================================== */}
          {/* MODÜL 3: TEKLİF VE FİYAT (Bölüm 4 & Kabul Testi #1, #2, #9) */}
          {/* ============================================================== */}
          {activeModule === "quotes" && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 p-3 rounded-2xl">
                <div className="flex gap-2">
                  <button
                    onClick={() => setQuotesSubTab("quotes_list")}
                    className={`px-4 py-2 rounded-xl text-xs font-bold ${
                      quotesSubTab === "quotes_list"
                        ? "bg-sky-500 text-slate-950"
                        : "bg-slate-800 text-slate-300"
                    }`}
                  >
                    Teklifler & Revizyonlar ({quotes.length})
                  </button>
                  <button
                    onClick={() => setQuotesSubTab("pricing_catalog")}
                    className={`px-4 py-2 rounded-xl text-xs font-bold ${
                      quotesSubTab === "pricing_catalog"
                        ? "bg-sky-500 text-slate-950"
                        : "bg-slate-800 text-slate-300"
                    }`}
                  >
                    Fiyat Listesi & Ek İşlem Tarifeleri ({prices.length})
                  </button>
                </div>

                {quotesSubTab === "quotes_list" && (
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Teklif, müşteri, şantiye ara..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                      />
                    </div>
                    <button
                      onClick={() =>
                        setQuotesViewMode(quotesViewMode === "table" ? "kanban" : "table")
                      }
                      className="px-3 py-1.5 rounded-xl bg-slate-800 text-xs font-bold text-slate-200 flex items-center gap-1.5"
                    >
                      {quotesViewMode === "table" ? (
                        <>
                          <Columns className="h-3.5 w-3.5 text-sky-400" />
                          <span>Kanban Pano</span>
                        </>
                      ) : (
                        <>
                          <List className="h-3.5 w-3.5 text-sky-400" />
                          <span>Tablo Görünümü</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

              {quotesSubTab === "quotes_list" ? (
                quotesViewMode === "table" ? (
                  <div className="rounded-3xl bg-slate-900/90 border border-slate-800 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-slate-800 text-[10px] font-mono uppercase text-slate-400 bg-slate-950/60">
                            <th className="py-3.5 px-4">Teklif No & Sürüm</th>
                            <th className="py-3.5 px-4">Müşteri / Şantiye</th>
                            <th className="py-3.5 px-4">Cam & Ölçü Kalemleri</th>
                            <th className="py-3.5 px-4">Fiyat Kaynağı & Tutar</th>
                            <th className="py-3.5 px-4">Durum / İstasyon</th>
                            <th className="py-3.5 px-4 text-right">İşlemler</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60 text-xs">
                          {filteredQuotes.length === 0 ? (
                            <tr>
                              <td colSpan={6} className="py-10 text-center text-slate-500">
                                Teklif kaydı bulunamadı. Sağ üstteki <strong>"Yeni Ölçülü Teklif"</strong> butonuyla satır bazlı teklif hazırlayabilirsiniz.
                              </td>
                            </tr>
                          ) : (
                            filteredQuotes.map((q) => (
                              <tr key={q.id} className="hover:bg-slate-800/40">
                                <td className="py-3.5 px-4 font-mono">
                                  <div className="font-bold text-sky-400">{q.id}</div>
                                  <div className="text-[10px] text-indigo-400 font-bold">
                                    Sürüm v{q.version || 1}{" "}
                                    {q.revisions && q.revisions.length > 0
                                      ? `(Önceki: ₺${q.revisions[0].previousTotal.toLocaleString("tr-TR")})`
                                      : ""}
                                  </div>
                                </td>
                                <td className="py-3.5 px-4">
                                  <div className="font-bold text-white">{q.customerName}</div>
                                  <div className="text-[11px] text-slate-400">
                                    📍 {q.siteName || q.city} • 📞 {maskPiiText(q.phone, maskPii)}
                                  </div>
                                </td>
                                <td className="py-3.5 px-4">
                                  <div className="font-semibold text-slate-200">{q.glassType}</div>
                                  <div className="text-[11px] text-slate-400">
                                    {q.dimensions} ({q.totalArea} m²)
                                  </div>
                                </td>
                                <td className="py-3.5 px-4 font-mono">
                                  <div className="font-bold text-emerald-400">
                                    ₺{(q.estimatedPrice || 0).toLocaleString("tr-TR")}
                                  </div>
                                  <div className="text-[10px] text-slate-400">
                                    {q.priceListVersion || "2026-Liste-v1"} • İsk:%
                                    {q.discountRate || 0}
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
                                    }}
                                    className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                                  >
                                    <option value="new">Yeni Talep</option>
                                    <option value="in_review">Teknik İncelemede</option>
                                    <option value="quoted">Teklif Gönderildi</option>
                                    <option value="approved">Sipariş Onaylandı (Üretimde)</option>
                                    <option value="completed">Teslim Edildi</option>
                                    <option value="cancelled">İptal</option>
                                  </select>
                                </td>
                                <td className="py-3.5 px-4 text-right">
                                  <div className="flex items-center justify-end gap-1.5">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => {
                                        setEditingQuote(q);
                                        setConfiguratorOpen(true);
                                      }}
                                      className="h-8 border-slate-700 text-sky-400 text-xs"
                                    >
                                      <Edit2 className="h-3.5 w-3.5 mr-1" />
                                      Yapılandır / Revize
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => printProposalDocument(q)}
                                      className="h-8 border-slate-700 text-xs"
                                      title="A4 Teklif PDF Yazdır"
                                    >
                                      <Printer className="h-3.5 w-3.5" />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => setQrModalOrder(q)}
                                      className="h-8 border-slate-700 text-xs"
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
                        { id: "quoted", title: "Teklif Gönderildi" },
                        { id: "approved", title: "Üretimde" },
                        { id: "completed", title: "Teslim Edildi" },
                      ] as const
                    ).map((col) => {
                      const colItems = filteredQuotes.filter((q) => q.status === col.id);
                      return (
                        <div
                          key={col.id}
                          className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3"
                        >
                          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                            <span className="text-xs font-bold text-white">{col.title}</span>
                            <span className="font-mono text-xs text-sky-400">{colItems.length}</span>
                          </div>
                          <div className="space-y-2.5">
                            {colItems.map((q) => (
                              <div
                                key={q.id}
                                onClick={() => {
                                  setEditingQuote(q);
                                  setConfiguratorOpen(true);
                                }}
                                className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-sky-500/40 cursor-pointer space-y-1 text-xs"
                              >
                                <div className="flex items-center justify-between font-mono">
                                  <span className="font-bold text-sky-400">{q.id}</span>
                                  <span className="text-[10px] text-indigo-400">
                                    v{q.version || 1}
                                  </span>
                                </div>
                                <div className="font-bold text-white truncate">
                                  {q.customerName}
                                </div>
                                <div className="text-[11px] text-slate-400 truncate">
                                  {q.glassType} ({q.totalArea} m²)
                                </div>
                                <div className="font-mono font-bold text-emerald-400">
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
                /* Pricing & Extra Services Catalog (Acceptance Test #9 Protected) */
                <div className="space-y-6">
                  <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        <Percent className="h-4 w-4 text-sky-400" />
                        Toplu Fiyat Listesi Güncelleme (Kabul Testi #9 — Yetki Korumalı)
                      </h4>
                      <p className="text-xs text-slate-400">
                        Aktif Sürüm: <strong className="text-sky-400">2026-Liste-v1</strong> • Canlı site hesaplayıcısı ile anlık senkronize çalışır.
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
                                `Tüm cam birim fiyatlarına %${pct > 0 ? `+${pct}` : pct} uygulandı.`
                              );
                          }}
                          className="h-8 border-slate-700 font-mono text-xs"
                        >
                          {pct > 0 ? `+%${pct} Zam` : `%%${pct} İndirim`}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Glass Unit Prices */}
                  <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-5 space-y-4">
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (!newGlassName.trim()) return;
                        const created = addAdminPrice({
                          name: newGlassName.trim(),
                          thickness: newGlassThickness,
                          m2Price: Number(newGlassPrice) || 1200,
                        });
                        if (!created) {
                          toast.error(
                            "YETKİ ENGELİ (Kabul Testi #9): Bu rol yeni fiyat kartı ekleyemez."
                          );
                          return;
                        }
                        toast.success(`${created.name} fiyat listesine eklendi.`);
                        setNewGlassName("");
                      }}
                      className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs"
                    >
                      <input
                        type="text"
                        placeholder="Yeni Cam Kalemi Adı *"
                        value={newGlassName}
                        onChange={(e) => setNewGlassName(e.target.value)}
                        className="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white sm:col-span-2"
                      />
                      <input
                        type="number"
                        placeholder="m² Fiyatı (₺)"
                        value={newGlassPrice}
                        onChange={(e) => setNewGlassPrice(e.target.value)}
                        className="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
                      />
                      <Button
                        type="submit"
                        className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded-xl"
                      >
                        Cam Fiyat Kartı Ekle
                      </Button>
                    </form>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      {prices.map((p) => (
                        <div
                          key={p.id}
                          className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="font-bold text-white">{p.name}</div>
                            <button
                              onClick={() => deleteAdminPrice(p.id)}
                              className="text-slate-500 hover:text-rose-400"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono">{p.thickness}</div>
                          <div className="flex items-center gap-2 pt-1">
                            <input
                              type="number"
                              value={p.m2Price}
                              onChange={(e) => {
                                const res = updateAdminPrice(p.id, Number(e.target.value) || 0);
                                if (!res.ok) toast.error(res.error);
                              }}
                              className="w-28 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-emerald-400 font-mono font-bold"
                            />
                            <select
                              value={p.stock || "Mevcut"}
                              onChange={(e) => {
                                const res = updateAdminPriceItem(p.id, { stock: e.target.value });
                                if (!res.ok) toast.error(res.error);
                              }}
                              className="flex-1 px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-[11px]"
                            >
                              <option value="Mevcut">Mevcut</option>
                              <option value="Sipariş Üzeri">Sipariş Üzeri</option>
                              <option value="Tükendi">Tükendi</option>
                            </select>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Extra Services Catalog */}
                  <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-5 space-y-4">
                    <h4 className="text-sm font-bold text-white">
                      Ek İşlem & Montaj Hizmet Tarifeleri (/hesaplama ile Canlı Senkron)
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
                          toast.error("YETKİ ENGELİ: Bu rol ek hizmet ekleyemez.");
                          return;
                        }
                        toast.success(`${s.ad} eklendi.`);
                        setNewServiceName("");
                      }}
                      className="flex flex-wrap gap-2 text-xs"
                    >
                      <input
                        type="text"
                        placeholder="Yeni İşlem / Hizmet Adı"
                        value={newServiceName}
                        onChange={(e) => setNewServiceName(e.target.value)}
                        className="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white flex-1"
                      />
                      <input
                        type="number"
                        placeholder="Birim Ücret (₺)"
                        value={newServicePrice}
                        onChange={(e) => setNewServicePrice(e.target.value)}
                        className="w-32 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
                      />
                      <Button
                        type="submit"
                        className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl"
                      >
                        Ek Hizmet Ekle
                      </Button>
                    </form>
                    <div className="grid sm:grid-cols-3 gap-3">
                      {services.map((srv) => (
                        <div
                          key={srv.id}
                          className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-2 text-xs"
                        >
                          <span className="font-bold text-white">{srv.ad}</span>
                          <div className="flex items-center gap-1.5">
                            <input
                              type="number"
                              value={srv.fiyat}
                              onChange={(e) =>
                                updateAdminService(srv.id, { fiyat: Number(e.target.value) || 0 })
                              }
                              className="w-20 px-2 py-1 rounded bg-slate-900 border border-slate-700 text-sky-400 font-mono font-bold"
                            />
                            <button
                              onClick={() => deleteAdminService(srv.id)}
                              className="text-slate-500 hover:text-rose-400"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
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

          {/* ============================================================== */}
          {/* MODÜL 4: SİPARİŞ VE SÖZLEŞME YÖNETİMİ */}
          {/* ============================================================== */}
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

          {/* ============================================================== */}
          {/* MODÜL 5: ÜRETİM PLANLAMA VE OPERATÖR İSTASYON EKRANI */}
          {/* ============================================================== */}
          {activeModule === "production" && (
            <ProductionModuleView
              quotes={quotes}
              inventory={inventory}
              onShowQrModal={(q) => setQrModalOrder(q)}
            />
          )}

          {/* ============================================================== */}
          {/* MODÜL 6: STOK, DEPO VE SATIN ALMA */}
          {/* ============================================================== */}
          {activeModule === "inventory" && (
            <InventoryPurchasingModuleView
              inventory={inventory}
              purchases={purchases}
              activeRole={activeRole}
            />
          )}

          {/* ============================================================== */}
          {/* MODÜL 7: KALİTE KONTROL VE BLOKAJ */}
          {/* ============================================================== */}
          {activeModule === "quality" && (
            <QualityModuleView
              quotes={quotes}
              qualityInspections={qualityInspections}
              activeRole={activeRole}
            />
          )}

          {/* ============================================================== */}
          {/* MODÜL 8: SEVKİYAT, MONTAJ VE TESLİM KANITI (POD) */}
          {/* ============================================================== */}
          {activeModule === "shipment" && <ShipmentModuleView quotes={quotes} />}

          {/* ============================================================== */}
          {/* MODÜL 9: FİNANS, CARİ, KASA, ALINAN & KESİLEN ÇEKLER */}
          {/* ============================================================== */}
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

          {/* ============================================================== */}
          {/* MODÜL 10: RAPORLAMA VE ANALİTİK */}
          {/* ============================================================== */}
          {activeModule === "reports" && (
            <ReportsModuleView
              quotes={quotes}
              opportunities={opportunities}
              inventory={inventory}
              onExportCsv={handleExportCsv}
            />
          )}

          {/* ============================================================== */}
          {/* MODÜL 11: YÖNETİM, ROLLER (RBAC), DENETİM İZİ & 10 KABUL TESTİ */}
          {/* ============================================================== */}
          {activeModule === "governance" && (
            <GovernanceModuleView
              activeRole={activeRole}
              auditLogs={auditLogs}
              onNavigateModule={(modId) => setActiveModule(modId)}
            />
          )}
        </main>
      </div>

      {/* LINE-BASED QUOTE CONFIGURATOR & REVISION MODAL (Kabul Testi #1 & #2) */}
      <QuoteConfiguratorModal
        isOpen={configuratorOpen}
        editingQuote={editingQuote}
        prices={prices}
        activeRole={activeRole}
        onClose={() => setConfiguratorOpen(false)}
      />

      {/* PURE REACT SVG QR CODE LABEL MODAL (No dangerouslySetInnerHTML) */}
      {qrModalOrder &&
        (() => {
          const trackingUrl = `https://www.acarpen.com.tr/siparis-takip?id=${encodeURIComponent(
            qrModalOrder.id
          )}`;
          const { totalSize, pathData } = getQrSvgPath(trackingUrl, 2);
          return (
            <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white text-slate-900 rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div>
                    <div className="text-xs font-black uppercase text-sky-700">
                      ACARPEN FABRİKA ETİKETİ
                    </div>
                    <div className="font-mono text-lg font-black">{qrModalOrder.id}</div>
                  </div>
                  <button
                    onClick={() => setQrModalOrder(null)}
                    className="p-1.5 rounded-lg bg-slate-100 text-slate-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="text-xs space-y-1">
                  <div>
                    <strong>Müşteri:</strong> {qrModalOrder.customerName} (
                    {qrModalOrder.siteName || qrModalOrder.city})
                  </div>
                  <div>
                    <strong>Cam:</strong> {qrModalOrder.glassType} • {qrModalOrder.thickness}
                  </div>
                  <div>
                    <strong>Ölçü:</strong> {qrModalOrder.dimensions} ({qrModalOrder.totalArea} m²)
                  </div>
                  <div>
                    <strong>Sehpa / Lot:</strong> {qrModalOrder.rackNo || "SHP-01"} •{" "}
                    {qrModalOrder.reservedLotNo || "LOT-STD"}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col items-center">
                  <svg
                    viewBox={`0 0 ${totalSize} ${totalSize}`}
                    width={160}
                    height={160}
                    shapeRendering="crispEdges"
                  >
                    <rect width={totalSize} height={totalSize} fill="#ffffff" />
                    <path d={pathData} fill="#0f172a" />
                  </svg>
                  <span className="text-[10px] font-mono text-slate-500 mt-2">
                    Telefon kamerasıyla okutun (/siparis-takip)
                  </span>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => printThermalLabelDocument(qrModalOrder)}
                    className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs"
                  >
                    <Printer className="h-3.5 w-3.5 mr-1.5" />
                    10x15cm Termal Yazdır
                  </Button>
                </div>
              </div>
            </div>
          );
        })()}
    </div>
  );
}
