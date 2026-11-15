import { useState } from "react";
import {
  Activity,
  ArrowRight,
  Cpu,
  Download,
  Edit2,
  FileText,
  MessageSquare,
  PhoneCall,
  Plus,
  Printer,
  QrCode,
  Sparkles,
  Trash2,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  CashLedgerItem,
  CheckInstrumentItem,
  ContactMessage,
  QuoteItem,
  deleteAdminMessage,
  markMessageAsRead,
} from "@/lib/adminStorage";
import type { VisitorTelemetryStats } from "@/lib/analytics";
import { maskPiiText, printProposalDocument } from "./PrintHelpers";
import type { PrefillCustomerInfo } from "./QuoteConfiguratorModal";
import { STATUS_LABELS, formatWhatsAppUrl } from "./adminUiHelpers";

interface ControlCenterModuleViewProps {
  quotes: QuoteItem[];
  messages: ContactMessage[];
  checks: CheckInstrumentItem[];
  cashLedger: CashLedgerItem[];
  telemetry: VisitorTelemetryStats;
  maskPii: boolean;
  onOpenNewQuote: (prefill?: PrefillCustomerInfo) => void;
  onOpenQuoteEdit: (quote: QuoteItem) => void;
  onOpenQrModal: (quote: QuoteItem) => void;
  onNavigateModule: (moduleId: string) => void;
  onNavigateCrmMessages: () => void;
  onNavigateQuotesWithFilter: (statusFilter: string) => void;
  onExportCsv: () => void;
}

/**
 * Module 1: Practical high-contrast factory & sales control center overview.
 */
export function ControlCenterModuleView({
  quotes,
  messages,
  checks,
  cashLedger,
  telemetry,
  maskPii,
  onOpenNewQuote,
  onOpenQuoteEdit,
  onOpenQrModal,
  onNavigateModule,
  onNavigateCrmMessages,
  onNavigateQuotesWithFilter,
  onExportCsv,
}: ControlCenterModuleViewProps) {
  const [dashboardQuoteFilter, setDashboardQuoteFilter] = useState<
    "all" | "pending" | "production" | "done"
  >("all");

  const unreadMessagesCount = messages.filter((m) => !m.isRead).length;
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

  return (
    <div className="space-y-6">
      {/* 1. HIZLI İŞLEM KISAYOLLARI (4 BÜYÜK ANLAŞILIR AKSİYON BUTONU) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3.5">
        <button
          type="button"
          onClick={() => onOpenNewQuote()}
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
          onClick={onNavigateCrmMessages}
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
          onClick={() => onNavigateModule("production")}
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
          onClick={() => onNavigateModule("finance")}
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
              onClick: () => onNavigateQuotesWithFilter("new"),
            },
            {
              step: "2. Teklif Verildi",
              count: quotedWaitingQuotes.length,
              accent: "border-t-4 border-t-amber-500",
              numColor: "text-amber-400",
              onClick: () => onNavigateQuotesWithFilter("quoted"),
            },
            {
              step: "3. Üretimde",
              count: inProductionQuotes.length,
              accent: "border-t-4 border-t-emerald-500",
              numColor: "text-emerald-400",
              onClick: () => onNavigateModule("production"),
            },
            {
              step: "4. Kalite Blokaj",
              count: qualityBlockedQuotes.length,
              accent: "border-t-4 border-t-rose-500",
              numColor: "text-rose-400",
              onClick: () => onNavigateModule("quality"),
            },
            {
              step: "5. Sevke Hazır",
              count: readyForShipmentQuotes.length,
              accent: "border-t-4 border-t-purple-500",
              numColor: "text-purple-400",
              onClick: () => onNavigateModule("shipment"),
            },
            {
              step: "6. Teslim Edildi",
              count: completedQuotes.length,
              accent: "border-t-4 border-t-indigo-500",
              numColor: "text-indigo-400",
              onClick: () => onNavigateQuotesWithFilter("completed"),
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
          onClick={onNavigateCrmMessages}
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
          onClick={() => onNavigateModule("orders")}
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
          onClick={() => onNavigateModule("quality")}
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
          onClick={() => onNavigateModule("shipment")}
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
          onClick={() => onNavigateModule("finance")}
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
        {/* SOL KUTU: SİTEDEN GELEN MESAJLAR */}
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
              onClick={onNavigateCrmMessages}
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
                          onOpenNewQuote({
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

        {/* SAĞ KUTU: SON TEKLİFLER & SİPARİŞLER */}
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
              onClick={() => onNavigateModule("quotes")}
              className="h-9 border-slate-700 font-bold text-xs rounded-xl"
            >
              Tüm Teklifler
            </Button>
          </div>

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
                  onClick={() => onOpenNewQuote()}
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
                          onClick={() => onOpenQuoteEdit(q)}
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
                        onClick={() => onOpenQrModal(q)}
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
            onClick={onExportCsv}
            className="bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold text-xs rounded-xl h-10 px-4"
          >
            <Download className="h-4 w-4 mr-1.5" />
            Excel / CSV İndir
          </Button>
        </div>

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
  );
}
