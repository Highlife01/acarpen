import React, { useState, useMemo } from "react";
import {
  DollarSign,
  FileText,
  CheckCircle2,
  AlertTriangle,
  BarChart3,
  Download,
  ShieldCheck,
  KeyRound,
  History,
  ArrowRight,
  RefreshCw,
  Wallet,
  Landmark,
  ArrowDownLeft,
  ArrowUpRight,
  Plus,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  QuoteItem,
  OpportunityItem,
  InventoryItem,
  AuditEventItem,
  CheckInstrumentItem,
  CashLedgerItem,
  UserRole,
  ROLE_DEFINITIONS,
  updateAdminQuote,
  recordAdminAudit,
  setActiveUserRole,
  addAdminCheck,
  updateAdminCheck,
  deleteAdminCheck,
  addAdminCashLedgerEntry,
  deleteAdminCashLedgerEntry,
} from "@/lib/adminStorage";
import { toast } from "sonner";

// ============================================================================
// MODÜL 9: FİNANS, ÖN MUHASEBE, KASA/BANKA, ALINAN & KESİLEN ÇEKLER
// (Bölüm 5.7, 7 & Kabul Testi #8, #10)
// ============================================================================

interface FinanceModuleProps {
  quotes: QuoteItem[];
  checks: CheckInstrumentItem[];
  cashLedger: CashLedgerItem[];
  onOpenQuoteEdit: (q: QuoteItem) => void;
}

export const FinanceModuleView: React.FC<FinanceModuleProps> = ({
  quotes,
  checks,
  cashLedger,
  onOpenQuoteEdit,
}) => {
  const [subTab, setSubTab] = useState<
    "cash_bank" | "received_checks" | "issued_checks" | "ledger" | "reconciliation"
  >("cash_bank");

  // Kasa & Banka Filter + Form State
  const [ledgerFilter, setLedgerFilter] = useState<"all" | "cash" | "bank" | "in" | "out">("all");
  const [cashForm, setCashForm] = useState({
    type: "in" as CashLedgerItem["type"],
    accountName: "Merkez Nakit Kasa" as CashLedgerItem["accountName"],
    category: "Müşteri Sipariş Tahsilatı" as CashLedgerItem["category"],
    counterparty: "",
    amount: "",
    referenceNo: "",
    description: "",
  });

  // Alınan Çek (Received Check) Form State
  const [recCheckForm, setRecCheckForm] = useState({
    serialNo: "",
    counterparty: "",
    bankName: "İş Bankası — Adana Şb.",
    amount: "",
    dueDate: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
    relatedOrderId: "",
    notes: "",
  });

  // Kesilen Çek (Issued Check) Form State
  const [issCheckForm, setIssCheckForm] = useState({
    serialNo: "",
    counterparty: "Şişecam Düzcam (Mersin Fabrikası)",
    bankName: "İş Bankası Ticari Hesap (Kendi Çekimiz)",
    amount: "",
    dueDate: new Date(Date.now() + 45 * 86400000).toISOString().slice(0, 10),
    relatedOrderId: "",
    notes: "",
  });

  const activeQuotes = quotes.filter((q) => q.status !== "cancelled");

  const totalRevenue = activeQuotes.reduce((acc, q) => acc + (q.estimatedPrice || 0), 0);
  const totalCollected = activeQuotes.reduce((acc, q) => {
    const rev = q.estimatedPrice || 0;
    const paid = q.paymentStatus === "paid" ? rev : Math.min(rev, Number(q.paidAmount) || 0);
    return acc + paid;
  }, 0);
  const totalOpenReceivables = Math.max(0, totalRevenue - totalCollected);

  // Kasa & Banka Bakiye Hesaplamaları
  const cashAndBankStats = useMemo(() => {
    let merkezKasa = 0;
    let santiyeKasa = 0;
    let bankaToplam = 0;
    let totalIn = 0;
    let totalOut = 0;

    cashLedger.forEach((entry) => {
      const sign = entry.type === "in" ? 1 : -1;
      const val = (Number(entry.amount) || 0) * sign;
      if (entry.type === "in") totalIn += Number(entry.amount) || 0;
      else totalOut += Number(entry.amount) || 0;

      if (entry.accountName === "Merkez Nakit Kasa") merkezKasa += val;
      else if (entry.accountName === "Şantiye Nakit Kasa") santiyeKasa += val;
      else bankaToplam += val;
    });

    return {
      merkezKasa,
      santiyeKasa,
      nakitToplam: merkezKasa + santiyeKasa,
      bankaToplam,
      genelToplam: merkezKasa + santiyeKasa + bankaToplam,
      totalIn,
      totalOut,
    };
  }, [cashLedger]);

  // Çek Portföyü Hesaplamaları
  const receivedChecks = useMemo(
    () => checks.filter((c) => c.direction === "received"),
    [checks]
  );
  const issuedChecks = useMemo(
    () => checks.filter((c) => c.direction === "issued"),
    [checks]
  );

  const portfolioReceivedTotal = receivedChecks
    .filter((c) => c.status === "Portföyde (Kasada)" || c.status === "Bankada Tahsilde")
    .reduce((acc, c) => acc + (c.amount || 0), 0);

  const endorsedChecksTotal = receivedChecks
    .filter((c) => c.status === "Ciro Edildi (Tedarikçiye)")
    .reduce((acc, c) => acc + (c.amount || 0), 0);

  const collectedChecksTotal = receivedChecks
    .filter((c) => c.status === "Tahsil Edildi")
    .reduce((acc, c) => acc + (c.amount || 0), 0);

  const pendingIssuedTotal = issuedChecks
    .filter((c) => c.status === "Tedavülde (Ödeme Bekliyor)")
    .reduce((acc, c) => acc + (c.amount || 0), 0);

  const paidIssuedTotal = issuedChecks
    .filter((c) => c.status === "Ödendi (Bankadan Çıktı)")
    .reduce((acc, c) => acc + (c.amount || 0), 0);

  const getDaysUntilDue = (dueDateStr: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDateStr);
    due.setHours(0, 0, 0, 0);
    return Math.round((due.getTime() - today.getTime()) / 86400000);
  };

  // Kasa / Banka İşlemi Kaydet
  const handleAddCashEntry = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = Number(cashForm.amount);
    if (!cashForm.counterparty.trim() || !amt || amt <= 0) {
      toast.error("Lütfen cari/kişi adını ve geçerli bir tutar giriniz.");
      return;
    }
    const created = addAdminCashLedgerEntry({
      type: cashForm.type,
      accountName: cashForm.accountName,
      category: cashForm.category,
      counterparty: cashForm.counterparty.trim(),
      amount: amt,
      referenceNo: cashForm.referenceNo.trim() || `MKB-${Date.now().toString().slice(-4)}`,
      description:
        cashForm.description.trim() ||
        `${cashForm.category} (${cashForm.type === "in" ? "Tahsilat" : "Ödeme"})`,
    });
    toast.success(
      `${created.accountName} hesabına ₺${amt.toLocaleString("tr-TR")} ${
        created.type === "in" ? "GİRİŞ (Tahsilat)" : "ÇIKIŞ (Ödeme)"
      } işlendi!`
    );
    setCashForm({ ...cashForm, counterparty: "", amount: "", referenceNo: "", description: "" });
  };

  // Alınan Çek Kaydet
  const handleAddReceivedCheck = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = Number(recCheckForm.amount);
    if (!recCheckForm.serialNo.trim() || !recCheckForm.counterparty.trim() || !amt || amt <= 0) {
      toast.error("Çek seri no, keşideci müşteri adı ve çek tutarı zorunludur.");
      return;
    }
    const created = addAdminCheck({
      direction: "received",
      serialNo: recCheckForm.serialNo.trim(),
      counterparty: recCheckForm.counterparty.trim(),
      bankName: recCheckForm.bankName.trim(),
      amount: amt,
      dueDate: recCheckForm.dueDate,
      relatedOrderId: recCheckForm.relatedOrderId.trim() || undefined,
      status: "Portföyde (Kasada)",
      notes: recCheckForm.notes.trim() || "Müşteriden alınan vadeli çek",
    });
    toast.success(
      `Alınan Çek (${created.serialNo} — ₺${amt.toLocaleString("tr-TR")}) portföye/kasaya eklendi!`
    );
    setRecCheckForm({
      ...recCheckForm,
      serialNo: "",
      counterparty: "",
      amount: "",
      relatedOrderId: "",
      notes: "",
    });
  };

  // Alınan Çeki Tahsil Et ve Otomatik Kasaya/Bankaya İşle
  const handleCollectReceivedCheck = (chk: CheckInstrumentItem) => {
    if (chk.status === "Tahsil Edildi") {
      toast.info("Bu çek zaten tahsil edilmiş ve kasaya/bankaya işlenmiş.");
      return;
    }
    updateAdminCheck(chk.id, { status: "Tahsil Edildi" });
    addAdminCashLedgerEntry({
      type: "in",
      accountName: "İş Bankası Ticari Hesap",
      category: "Alınan Çek Tahsilatı",
      counterparty: chk.counterparty,
      amount: chk.amount,
      referenceNo: chk.serialNo,
      description: `${chk.serialNo} seri nolu müşteri çekinin tahsilatı (${chk.bankName})`,
    });
    toast.success(
      `${chk.serialNo} nolu çek TAHSİL EDİLDİ ve ₺${chk.amount.toLocaleString("tr-TR")} otomatik olarak Banka/Kasa defterine GİRİŞ işlendi!`
    );
  };

  // Alınan Çeki Tedarikçiye Ciro Et
  const handleEndorseReceivedCheck = (chk: CheckInstrumentItem) => {
    const supplier = chk.endorsedTo || "Şişecam Düzcam / Hammadde Tedarikçisi";
    updateAdminCheck(chk.id, {
      status: "Ciro Edildi (Tedarikçiye)",
      endorsedTo: supplier,
    });
    toast.success(`${chk.serialNo} nolu müşteri çeki "${supplier}" firmasına ciro edildi.`);
  };

  // Kesilen Çek Kaydet
  const handleAddIssuedCheck = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = Number(issCheckForm.amount);
    if (!issCheckForm.serialNo.trim() || !issCheckForm.counterparty.trim() || !amt || amt <= 0) {
      toast.error("Çek koçan/seri no, alacaklı tedarikçi adı ve tutar zorunludur.");
      return;
    }
    const created = addAdminCheck({
      direction: "issued",
      serialNo: issCheckForm.serialNo.trim(),
      counterparty: issCheckForm.counterparty.trim(),
      bankName: issCheckForm.bankName.trim(),
      amount: amt,
      dueDate: issCheckForm.dueDate,
      relatedOrderId: issCheckForm.relatedOrderId.trim() || undefined,
      status: "Tedavülde (Ödeme Bekliyor)",
      notes: issCheckForm.notes.trim() || "Tedarikçiye kesilen firma çekimiz",
    });
    toast.success(
      `Kesilen Çek (${created.serialNo} — ₺${amt.toLocaleString("tr-TR")}) tedavüle kaydedildi!`
    );
    setIssCheckForm({
      ...issCheckForm,
      serialNo: "",
      amount: "",
      relatedOrderId: "",
      notes: "",
    });
  };

  // Kesilen Çeki Öde ve Bankadan Otomatik Düş
  const handlePayIssuedCheck = (chk: CheckInstrumentItem) => {
    if (chk.status === "Ödendi (Bankadan Çıktı)") {
      toast.info("Bu çek zaten ödenmiş ve banka hesabından düşülmüş.");
      return;
    }
    updateAdminCheck(chk.id, { status: "Ödendi (Bankadan Çıktı)" });
    addAdminCashLedgerEntry({
      type: "out",
      accountName: "İş Bankası Ticari Hesap",
      category: "Kesilen Çek Ödemesi",
      counterparty: chk.counterparty,
      amount: chk.amount,
      referenceNo: chk.serialNo,
      description: `${chk.serialNo} seri nolu kesilen çekimizin vade ödemesi (${chk.counterparty})`,
    });
    toast.success(
      `${chk.serialNo} nolu kesilen çek ÖDENDİ ve ₺${chk.amount.toLocaleString("tr-TR")} banka hesabından otomatik ÇIKIŞ düşüldü!`
    );
  };

  // KABUL TESTİ #8: Tekil fatura referansı ve Idempotency kimliği üretimi
  const handleCreateUniqueInvoice = (q: QuoteItem) => {
    if (q.invoiceNo && q.syncId) {
      toast.info(
        `KABUL TESTİ #8 KORUMASI: ${q.id} için zaten tekil fatura (${q.invoiceNo} / İşlem: ${q.syncId}) mevcut. Çift fatura oluşturulmadı.`
      );
      return;
    }
    const invoiceNo = `FTR-2026-${
      q.id.replace(/[^0-9]/g, "").slice(-6) || Math.floor(Math.random() * 900000 + 100000)
    }`;
    const syncId = `IDEMP-${q.id}-V${q.version || 1}`;
    updateAdminQuote(q.id, {
      invoiceNo,
      syncId,
      dueDate: q.dueDate || new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
    });
    recordAdminAudit(
      "INVOICE_ISSUE",
      q.id,
      `Tekil fatura referansı (${invoiceNo}) ve idempotency anahtarı (${syncId}) oluşturuldu.`
    );
    toast.success(
      `KABUL TESTİ #8 DOĞRULANDI: ${invoiceNo} tekil fatura referansı (${syncId}) oluşturuldu.`
    );
  };

  // KABUL TESTİ #10: Günlük Mutabakat Raporu
  const reconciliationDiscrepancies = activeQuotes.filter((q) => {
    const rev = q.estimatedPrice || 0;
    const paid = q.paymentStatus === "paid" ? rev : Math.min(rev, Number(q.paidAmount) || 0);
    const isCompletedWithoutInvoice = q.status === "completed" && !q.invoiceNo;
    const isInvoicedButUnpaid = Boolean(q.invoiceNo) && paid < rev;
    const hasCostOverrun = (q.actualCost || 0) > (q.estimatedCost || Math.round(rev * 0.68));
    return isCompletedWithoutInvoice || isInvoicedButUnpaid || hasCostOverrun || !q.invoiceNo;
  });

  const filteredCashLedger = cashLedger.filter((item) => {
    if (ledgerFilter === "cash") return item.accountName.includes("Nakit Kasa");
    if (ledgerFilter === "bank") return !item.accountName.includes("Nakit Kasa");
    if (ledgerFilter === "in") return item.type === "in";
    if (ledgerFilter === "out") return item.type === "out";
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top 5 Executive Accounting & Treasury KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <button
          onClick={() => setSubTab("cash_bank")}
          className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 text-left transition-all"
        >
          <div className="text-[11px] text-slate-400 uppercase font-bold flex items-center gap-1.5">
            <Wallet className="h-3.5 w-3.5 text-emerald-400" />
            Nakit Kasa Bakiyesi
          </div>
          <div className="text-2xl font-black text-emerald-400 font-mono mt-1">
            ₺{cashAndBankStats.nakitToplam.toLocaleString("tr-TR")}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Merkez: ₺{cashAndBankStats.merkezKasa.toLocaleString("tr-TR")}
          </div>
        </button>

        <button
          onClick={() => setSubTab("cash_bank")}
          className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-sky-500/50 text-left transition-all"
        >
          <div className="text-[11px] text-slate-400 uppercase font-bold flex items-center gap-1.5">
            <Landmark className="h-3.5 w-3.5 text-sky-400" />
            Banka Hesapları Toplamı
          </div>
          <div className="text-2xl font-black text-sky-400 font-mono mt-1">
            ₺{cashAndBankStats.bankaToplam.toLocaleString("tr-TR")}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Toplam Likidite: ₺{cashAndBankStats.genelToplam.toLocaleString("tr-TR")}
          </div>
        </button>

        <button
          onClick={() => setSubTab("received_checks")}
          className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/50 text-left transition-all"
        >
          <div className="text-[11px] text-slate-400 uppercase font-bold flex items-center gap-1.5">
            <ArrowDownLeft className="h-3.5 w-3.5 text-indigo-400" />
            Alınan Çekler (Portföy)
          </div>
          <div className="text-2xl font-black text-indigo-400 font-mono mt-1">
            ₺{portfolioReceivedTotal.toLocaleString("tr-TR")}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {receivedChecks.length} Müşteri Çeki • Ciro: ₺{endorsedChecksTotal.toLocaleString("tr-TR")}
          </div>
        </button>

        <button
          onClick={() => setSubTab("issued_checks")}
          className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-rose-500/50 text-left transition-all"
        >
          <div className="text-[11px] text-slate-400 uppercase font-bold flex items-center gap-1.5">
            <ArrowUpRight className="h-3.5 w-3.5 text-rose-400" />
            Kesilen Çekler (Tedavül)
          </div>
          <div className="text-2xl font-black text-rose-400 font-mono mt-1">
            ₺{pendingIssuedTotal.toLocaleString("tr-TR")}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {issuedChecks.length} Firma Çeki • Ödenen: ₺{paidIssuedTotal.toLocaleString("tr-TR")}
          </div>
        </button>

        <button
          onClick={() => setSubTab("ledger")}
          className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 text-left transition-all"
        >
          <div className="text-[11px] text-slate-400 uppercase font-bold flex items-center gap-1.5">
            <DollarSign className="h-3.5 w-3.5 text-amber-400" />
            Açık Müşteri Cari Alacak
          </div>
          <div className="text-2xl font-black text-amber-400 font-mono mt-1">
            ₺{totalOpenReceivables.toLocaleString("tr-TR")}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Toplam Ciro: ₺{totalRevenue.toLocaleString("tr-TR")}
          </div>
        </button>
      </div>

      {/* Accounting Module Sub-Navigation */}
      <div className="flex flex-wrap gap-2 bg-slate-900/90 border border-slate-800 p-3 rounded-2xl">
        <button
          onClick={() => setSubTab("cash_bank")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            subTab === "cash_bank"
              ? "bg-emerald-500 text-slate-950 shadow-md"
              : "bg-slate-800 text-slate-300"
          }`}
        >
          🏦 1. Kasa & Banka Defteri ({cashLedger.length})
        </button>
        <button
          onClick={() => setSubTab("received_checks")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            subTab === "received_checks"
              ? "bg-sky-500 text-slate-950 shadow-md"
              : "bg-slate-800 text-slate-300"
          }`}
        >
          📥 2. Alınan Çekler Portföyü ({receivedChecks.length})
        </button>
        <button
          onClick={() => setSubTab("issued_checks")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            subTab === "issued_checks"
              ? "bg-rose-500 text-white shadow-md"
              : "bg-slate-800 text-slate-300"
          }`}
        >
          📤 3. Kesilen / Verilen Çekler ({issuedChecks.length})
        </button>
        <button
          onClick={() => setSubTab("ledger")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            subTab === "ledger"
              ? "bg-indigo-500 text-white shadow-md"
              : "bg-slate-800 text-slate-300"
          }`}
        >
          🧾 4. Sipariş Faturalama & Maliyet ({activeQuotes.length})
        </button>
        <button
          onClick={() => setSubTab("reconciliation")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            subTab === "reconciliation"
              ? "bg-amber-500 text-slate-950 shadow-md"
              : "bg-slate-800 text-slate-300"
          }`}
        >
          🔄 5. Günlük Mutabakat Raporu ({reconciliationDiscrepancies.length})
        </button>
      </div>

      {/* ===================================================================== */}
      {/* 1. KASA & BANKA HAREKETLERİ DEFTERİ */}
      {/* ===================================================================== */}
      {subTab === "cash_bank" && (
        <div className="space-y-6">
          <form
            onSubmit={handleAddCashEntry}
            className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Wallet className="h-4 w-4 text-emerald-400" />
                Yeni Kasa / Banka Giriş — Çıkış Fişi İşle
              </h3>
              <span className="text-xs text-slate-400">
                Toplam Giriş: <strong className="text-emerald-400">₺{cashAndBankStats.totalIn.toLocaleString("tr-TR")}</strong> • Toplam Çıkış:{" "}
                <strong className="text-rose-400">₺{cashAndBankStats.totalOut.toLocaleString("tr-TR")}</strong>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <select
                value={cashForm.type}
                onChange={(e) =>
                  setCashForm({ ...cashForm, type: e.target.value as CashLedgerItem["type"] })
                }
                className="px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold"
              >
                <option value="in">➕ KASA / BANKA GİRİŞİ (Tahsilat)</option>
                <option value="out">➖ KASA / BANKA ÇIKIŞI (Ödeme / Gider)</option>
              </select>

              <select
                value={cashForm.accountName}
                onChange={(e) =>
                  setCashForm({
                    ...cashForm,
                    accountName: e.target.value as CashLedgerItem["accountName"],
                  })
                }
                className="px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
              >
                <option value="Merkez Nakit Kasa">Merkez Nakit Kasa</option>
                <option value="Şantiye Nakit Kasa">Şantiye Nakit Kasa</option>
                <option value="İş Bankası Ticari Hesap">İş Bankası Ticari Hesap</option>
                <option value="Garanti BBVA POS / Ticari">Garanti BBVA POS / Ticari</option>
                <option value="Ziraat Bankası Kurumsal">Ziraat Bankası Kurumsal</option>
              </select>

              <select
                value={cashForm.category}
                onChange={(e) =>
                  setCashForm({
                    ...cashForm,
                    category: e.target.value as CashLedgerItem["category"],
                  })
                }
                className="px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
              >
                <option value="Müşteri Sipariş Tahsilatı">Müşteri Sipariş Tahsilatı</option>
                <option value="Alınan Çek Tahsilatı">Alınan Çek Tahsilatı</option>
                <option value="Kesilen Çek Ödemesi">Kesilen Çek Ödemesi</option>
                <option value="Şişecam / Hammadde Ödemesi">Şişecam / Hammadde Ödemesi</option>
                <option value="Nakliye / Yakıt / Vinç Gideri">Nakliye / Yakıt / Vinç Gideri</option>
                <option value="Personel / İşçilik Ödemesi">Personel / İşçilik Ödemesi</option>
                <option value="Fabrika Genel Gider / Enerji">Fabrika Genel Gider / Enerji</option>
                <option value="Diğer İşlem">Diğer İşlem</option>
              </select>

              <input
                type="text"
                placeholder="Cari / Müşteri / Tedarikçi Adı *"
                value={cashForm.counterparty}
                onChange={(e) => setCashForm({ ...cashForm, counterparty: e.target.value })}
                className="px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
              />

              <input
                type="number"
                placeholder="Tutar (₺) *"
                value={cashForm.amount}
                onChange={(e) => setCashForm({ ...cashForm, amount: e.target.value })}
                className="px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono font-bold"
              />

              <input
                type="text"
                placeholder="Makbuz / Dekont / Sipariş No"
                value={cashForm.referenceNo}
                onChange={(e) => setCashForm({ ...cashForm, referenceNo: e.target.value })}
                className="px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
              />

              <input
                type="text"
                placeholder="Açıklama (Örn: Ziyapaşa şantiye nakit avans)"
                value={cashForm.description}
                onChange={(e) => setCashForm({ ...cashForm, description: e.target.value })}
                className="px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
              />

              <Button
                type="submit"
                className={`font-bold rounded-xl ${
                  cashForm.type === "in"
                    ? "bg-emerald-500 hover:bg-emerald-400 text-slate-950"
                    : "bg-rose-600 hover:bg-rose-500 text-white"
                }`}
              >
                <Plus className="h-4 w-4 mr-1.5" />
                {cashForm.type === "in" ? "Kasa / Banka Girişi Kaydet" : "Kasa / Banka Çıkışı Kaydet"}
              </Button>
            </div>
          </form>

          {/* Kasa & Banka Hareket Tablosu */}
          <div className="rounded-3xl bg-slate-900/90 border border-slate-800 overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
              <h4 className="text-sm font-bold text-white">Kasa & Banka Hareketleri Defteri</h4>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: "all", label: "Tüm Hareketler" },
                  { id: "cash", label: "Sadece Nakit Kasa" },
                  { id: "bank", label: "Sadece Banka Hesapları" },
                  { id: "in", label: "Girişler (Tahsilat)" },
                  { id: "out", label: "Çıkışlar (Ödeme/Gider)" },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setLedgerFilter(f.id as typeof ledgerFilter)}
                    className={`px-3 py-1 rounded-lg text-[11px] font-bold ${
                      ledgerFilter === f.id
                        ? "bg-sky-500 text-slate-950"
                        : "bg-slate-800 text-slate-300"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-[10px] font-mono uppercase text-slate-400 bg-slate-950/60">
                    <th className="py-3.5 px-4">Fiş No & Tarih</th>
                    <th className="py-3.5 px-4">Kasa / Banka Hesabı</th>
                    <th className="py-3.5 px-4">İşlem Türü & Kategori</th>
                    <th className="py-3.5 px-4">İlgili Cari & Açıklama</th>
                    <th className="py-3.5 px-4">Tutar (₺)</th>
                    <th className="py-3.5 px-4 text-right">İşlem</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredCashLedger.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-500">
                        Seçili filtreye uygun kasa veya banka hareketi bulunamadı.
                      </td>
                    </tr>
                  ) : (
                    filteredCashLedger.map((entry) => (
                      <tr key={entry.id} className="hover:bg-slate-800/40">
                        <td className="py-3.5 px-4 font-mono">
                          <div className="font-bold text-sky-400">{entry.id}</div>
                          <div className="text-[10px] text-slate-400">
                            {entry.date} • Belge: {entry.referenceNo || "-"}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-bold text-white">{entry.accountName}</td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold ${
                              entry.type === "in"
                                ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                                : "bg-rose-500/15 text-rose-400 border border-rose-500/30"
                            }`}
                          >
                            {entry.type === "in" ? "➕ GİRİŞ (TAHSİLAT)" : "➖ ÇIKIŞ (ÖDEME)"}
                          </span>
                          <div className="text-[11px] text-slate-400 mt-1">{entry.category}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-white">{entry.counterparty}</div>
                          <div className="text-[11px] text-slate-400">{entry.description}</div>
                        </td>
                        <td
                          className={`py-3.5 px-4 font-mono font-black text-sm ${
                            entry.type === "in" ? "text-emerald-400" : "text-rose-400"
                          }`}
                        >
                          {entry.type === "in" ? "+" : "-"}₺
                          {entry.amount.toLocaleString("tr-TR")}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => deleteAdminCashLedgerEntry(entry.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400"
                            title="Fişi Kaldır"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 2. ALINAN ÇEKLER PORTFÖYÜ (MÜŞTERİDEN ALINAN ÇEKLER) */}
      {/* ===================================================================== */}
      {subTab === "received_checks" && (
        <div className="space-y-6">
          <form
            onSubmit={handleAddReceivedCheck}
            className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ArrowDownLeft className="h-4 w-4 text-sky-400" />
                Müşteriden Alınan Çek / Senet Kaydı (Portföy Girişi)
              </h3>
              <span className="text-xs text-slate-400">
                Portföydeki Bekleyen: <strong className="text-sky-400">₺{portfolioReceivedTotal.toLocaleString("tr-TR")}</strong> • Tahsil Edilen:{" "}
                <strong className="text-emerald-400">₺{collectedChecksTotal.toLocaleString("tr-TR")}</strong>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <input
                type="text"
                placeholder="Çek Seri / Yaprak No (Örn: TR-849201) *"
                value={recCheckForm.serialNo}
                onChange={(e) => setRecCheckForm({ ...recCheckForm, serialNo: e.target.value })}
                className="px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
              />
              <input
                type="text"
                placeholder="Keşideci Müşteri / Cari Adı *"
                value={recCheckForm.counterparty}
                onChange={(e) => setRecCheckForm({ ...recCheckForm, counterparty: e.target.value })}
                className="px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
              />
              <input
                type="text"
                placeholder="Banka & Şube Adı *"
                value={recCheckForm.bankName}
                onChange={(e) => setRecCheckForm({ ...recCheckForm, bankName: e.target.value })}
                className="px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
              />
              <input
                type="number"
                placeholder="Çek Tutarı (₺) *"
                value={recCheckForm.amount}
                onChange={(e) => setRecCheckForm({ ...recCheckForm, amount: e.target.value })}
                className="px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono font-bold"
              />
              <div>
                <label className="text-[10px] text-slate-400 block mb-0.5">Çek Vade Tarihi *</label>
                <input
                  type="date"
                  value={recCheckForm.dueDate}
                  onChange={(e) => setRecCheckForm({ ...recCheckForm, dueDate: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block mb-0.5">İlgili Sipariş No</label>
                <input
                  type="text"
                  placeholder="Örn: TKF-2026-001"
                  value={recCheckForm.relatedOrderId}
                  onChange={(e) =>
                    setRecCheckForm({ ...recCheckForm, relatedOrderId: e.target.value })
                  }
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block mb-0.5">Açıklama / Şantiye</label>
                <input
                  type="text"
                  placeholder="Şantiye / Proje notu"
                  value={recCheckForm.notes}
                  onChange={(e) => setRecCheckForm({ ...recCheckForm, notes: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
              </div>
              <div className="flex items-end">
                <Button
                  type="submit"
                  className="w-full bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded-xl"
                >
                  <Plus className="h-4 w-4 mr-1.5" />
                  Alınan Çeki Portföye Ekle
                </Button>
              </div>
            </div>
          </form>

          <div className="rounded-3xl bg-slate-900/90 border border-slate-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-[10px] font-mono uppercase text-slate-400 bg-slate-950/60">
                    <th className="py-3.5 px-4">Çek No & Seri</th>
                    <th className="py-3.5 px-4">Keşideci (Müşteri) & Banka</th>
                    <th className="py-3.5 px-4">Vade Tarihi & Kalan Gün</th>
                    <th className="py-3.5 px-4">Tutar (₺)</th>
                    <th className="py-3.5 px-4">Portföy Durumu</th>
                    <th className="py-3.5 px-4 text-right">Muhasebe / Tahsilat Aksiyonu</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {receivedChecks.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-500">
                        Portföyde kayıtlı alınan çek bulunmuyor.
                      </td>
                    </tr>
                  ) : (
                    receivedChecks.map((chk) => {
                      const daysLeft = getDaysUntilDue(chk.dueDate);
                      return (
                        <tr key={chk.id} className="hover:bg-slate-800/40">
                          <td className="py-3.5 px-4 font-mono">
                            <div className="font-bold text-sky-400">{chk.serialNo}</div>
                            <div className="text-[10px] text-slate-400">{chk.id}</div>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-white">{chk.counterparty}</div>
                            <div className="text-[11px] text-slate-400">
                              {chk.bankName} {chk.notes ? `• ${chk.notes}` : ""}
                            </div>
                          </td>
                          <td className="py-3.5 px-4 font-mono">
                            <div className="font-bold text-white">{chk.dueDate}</div>
                            {chk.status !== "Tahsil Edildi" && (
                              <span
                                className={`text-[10px] font-bold ${
                                  daysLeft < 0
                                    ? "text-rose-400"
                                    : daysLeft <= 7
                                    ? "text-amber-400"
                                    : "text-emerald-400"
                                }`}
                              >
                                {daysLeft < 0
                                  ? `${Math.abs(daysLeft)} gün vadesi geçti!`
                                  : daysLeft === 0
                                  ? "Bugün Vadeli!"
                                  : `${daysLeft} gün kaldı`}
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 font-mono font-black text-emerald-400 text-sm">
                            ₺{chk.amount.toLocaleString("tr-TR")}
                          </td>
                          <td className="py-3.5 px-4">
                            <select
                              value={chk.status}
                              onChange={(e) =>
                                updateAdminCheck(chk.id, {
                                  status: e.target.value as CheckInstrumentItem["status"],
                                })
                              }
                              className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                            >
                              <option value="Portföyde (Kasada)">Portföyde (Kasada)</option>
                              <option value="Bankada Tahsilde">Bankada Tahsilde</option>
                              <option value="Ciro Edildi (Tedarikçiye)">
                                Ciro Edildi (Tedarikçiye)
                              </option>
                              <option value="Tahsil Edildi">Tahsil Edildi</option>
                              <option value="Karşılıksız / Protestolu">
                                Karşılıksız / Protestolu
                              </option>
                            </select>
                            {chk.endorsedTo && (
                              <div className="text-[10px] text-indigo-400 mt-0.5">
                                Ciro: {chk.endorsedTo}
                              </div>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {chk.status !== "Tahsil Edildi" && (
                                <>
                                  <Button
                                    size="sm"
                                    onClick={() => handleCollectReceivedCheck(chk)}
                                    className="h-8 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs"
                                  >
                                    Tahsil Et & Kasaya İşle
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleEndorseReceivedCheck(chk)}
                                    className="h-8 border-slate-700 text-xs"
                                  >
                                    Tedarikçiye Ciro Et
                                  </Button>
                                </>
                              )}
                              <button
                                onClick={() => deleteAdminCheck(chk.id)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400"
                                title="Sil"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 3. KESİLEN / VERİLEN ÇEKLER (TEDARİKÇİYE VERİLEN KENDİ ÇEKLERİMİZ) */}
      {/* ===================================================================== */}
      {subTab === "issued_checks" && (
        <div className="space-y-6">
          <form
            onSubmit={handleAddIssuedCheck}
            className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ArrowUpRight className="h-4 w-4 text-rose-400" />
                Tedarikçiye Kesilen / Verilen Çek Kaydı (Borç Çeklerimiz)
              </h3>
              <span className="text-xs text-slate-400">
                Tedavüldeki Ödeme Bekleyen:{" "}
                <strong className="text-rose-400">₺{pendingIssuedTotal.toLocaleString("tr-TR")}</strong> • Ödenen:{" "}
                <strong className="text-emerald-400">₺{paidIssuedTotal.toLocaleString("tr-TR")}</strong>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <input
                type="text"
                placeholder="Çek Koçan / Seri No (Örn: TC-990145) *"
                value={issCheckForm.serialNo}
                onChange={(e) => setIssCheckForm({ ...issCheckForm, serialNo: e.target.value })}
                className="px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
              />
              <input
                type="text"
                placeholder="Alacaklı Tedarikçi Firma Adı *"
                value={issCheckForm.counterparty}
                onChange={(e) => setIssCheckForm({ ...issCheckForm, counterparty: e.target.value })}
                className="px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
              />
              <input
                type="text"
                placeholder="Çekin Çekildiği Banka Hesabımız *"
                value={issCheckForm.bankName}
                onChange={(e) => setIssCheckForm({ ...issCheckForm, bankName: e.target.value })}
                className="px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
              />
              <input
                type="number"
                placeholder="Çek Tutarı (₺) *"
                value={issCheckForm.amount}
                onChange={(e) => setIssCheckForm({ ...issCheckForm, amount: e.target.value })}
                className="px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono font-bold"
              />
              <div>
                <label className="text-[10px] text-slate-400 block mb-0.5">Çek Vade Tarihi *</label>
                <input
                  type="date"
                  value={issCheckForm.dueDate}
                  onChange={(e) => setIssCheckForm({ ...issCheckForm, dueDate: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block mb-0.5">
                  İlgili Satın Alma / Fatura No
                </label>
                <input
                  type="text"
                  placeholder="Örn: SAT-2026-01"
                  value={issCheckForm.relatedOrderId}
                  onChange={(e) =>
                    setIssCheckForm({ ...issCheckForm, relatedOrderId: e.target.value })
                  }
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block mb-0.5">Ödeme Açıklaması</label>
                <input
                  type="text"
                  placeholder="Örn: Jumbo plaka cam alımı"
                  value={issCheckForm.notes}
                  onChange={(e) => setIssCheckForm({ ...issCheckForm, notes: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
              </div>
              <div className="flex items-end">
                <Button
                  type="submit"
                  className="w-full bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl"
                >
                  <Plus className="h-4 w-4 mr-1.5" />
                  Kesilen Çeki Kaydet
                </Button>
              </div>
            </div>
          </form>

          <div className="rounded-3xl bg-slate-900/90 border border-slate-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-[10px] font-mono uppercase text-slate-400 bg-slate-950/60">
                    <th className="py-3.5 px-4">Çek Seri No</th>
                    <th className="py-3.5 px-4">Alacaklı Tedarikçi & Bankamız</th>
                    <th className="py-3.5 px-4">Vade Tarihi & Kalan Gün</th>
                    <th className="py-3.5 px-4">Tutar (₺)</th>
                    <th className="py-3.5 px-4">Ödeme Durumu</th>
                    <th className="py-3.5 px-4 text-right">Banka Ödeme İşlemi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {issuedChecks.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-500">
                        Kayıtlı kesilen çek bulunmuyor.
                      </td>
                    </tr>
                  ) : (
                    issuedChecks.map((chk) => {
                      const daysLeft = getDaysUntilDue(chk.dueDate);
                      return (
                        <tr key={chk.id} className="hover:bg-slate-800/40">
                          <td className="py-3.5 px-4 font-mono">
                            <div className="font-bold text-rose-400">{chk.serialNo}</div>
                            <div className="text-[10px] text-slate-400">{chk.id}</div>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-white">{chk.counterparty}</div>
                            <div className="text-[11px] text-slate-400">
                              {chk.bankName} {chk.notes ? `• ${chk.notes}` : ""}
                            </div>
                          </td>
                          <td className="py-3.5 px-4 font-mono">
                            <div className="font-bold text-white">{chk.dueDate}</div>
                            {chk.status !== "Ödendi (Bankadan Çıktı)" && (
                              <span
                                className={`text-[10px] font-bold ${
                                  daysLeft <= 5 ? "text-rose-400" : "text-amber-400"
                                }`}
                              >
                                {daysLeft < 0
                                  ? `${Math.abs(daysLeft)} gün vadesi geçti!`
                                  : daysLeft === 0
                                  ? "Bugün Ödenecek!"
                                  : `${daysLeft} gün kaldı`}
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 font-mono font-black text-rose-400 text-sm">
                            ₺{chk.amount.toLocaleString("tr-TR")}
                          </td>
                          <td className="py-3.5 px-4">
                            <select
                              value={chk.status}
                              onChange={(e) =>
                                updateAdminCheck(chk.id, {
                                  status: e.target.value as CheckInstrumentItem["status"],
                                })
                              }
                              className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                            >
                              <option value="Tedavülde (Ödeme Bekliyor)">
                                Tedavülde (Ödeme Bekliyor)
                              </option>
                              <option value="Ödendi (Bankadan Çıktı)">
                                Ödendi (Bankadan Çıktı)
                              </option>
                              <option value="İade / İptal">İade / İptal</option>
                            </select>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {chk.status !== "Ödendi (Bankadan Çıktı)" && (
                                <Button
                                  size="sm"
                                  onClick={() => handlePayIssuedCheck(chk)}
                                  className="h-8 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs"
                                >
                                  Ödendi İşaretle & Bankadan Düş
                                </Button>
                              )}
                              <button
                                onClick={() => deleteAdminCheck(chk.id)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400"
                                title="Sil"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 4. SİPARİŞ FATURALAMA, MALİYET & TAHSİLAT TABLOSU (Kabul Testi #8) */}
      {/* ===================================================================== */}
      {subTab === "ledger" && (
        <div className="rounded-3xl bg-slate-900/90 border border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-[10px] font-mono uppercase text-slate-400 bg-slate-950/60">
                  <th className="py-3.5 px-4">Sipariş & Müşteri</th>
                  <th className="py-3.5 px-4">Tekil Fatura & Sync ID</th>
                  <th className="py-3.5 px-4">Tutar & Tahsilat</th>
                  <th className="py-3.5 px-4">Planlanan vs Gerçek Maliyet</th>
                  <th className="py-3.5 px-4">Kâr Marjı</th>
                  <th className="py-3.5 px-4 text-right">Finans İşlemi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {activeQuotes.map((q) => {
                  const rev = q.estimatedPrice || 0;
                  const paid =
                    q.paymentStatus === "paid" ? rev : Math.min(rev, Number(q.paidAmount) || 0);
                  const estCost = q.estimatedCost || Math.round(rev * 0.68);
                  const actCost = q.actualCost || estCost;
                  const profit = rev - actCost;
                  return (
                    <tr key={q.id} className="hover:bg-slate-800/40">
                      <td className="py-3.5 px-4">
                        <div className="font-mono font-bold text-sky-400">{q.id}</div>
                        <div className="font-bold text-white">{q.customerName}</div>
                      </td>
                      <td className="py-3.5 px-4 font-mono">
                        {q.invoiceNo ? (
                          <div>
                            <div className="text-emerald-400 font-bold">{q.invoiceNo}</div>
                            <div className="text-[10px] text-slate-400">{q.syncId}</div>
                          </div>
                        ) : (
                          <span className="text-amber-400 text-[11px]">Fatura Kesilmedi</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 font-mono">
                        <div className="text-white font-bold">₺{rev.toLocaleString("tr-TR")}</div>
                        <div className="text-[11px] text-emerald-400">
                          Tahsilat: ₺{paid.toLocaleString("tr-TR")}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[11px]">
                        <div className="text-slate-300">Plan: ₺{estCost.toLocaleString("tr-TR")}</div>
                        <div className="text-rose-300">
                          Gerçek: ₺{actCost.toLocaleString("tr-TR")}{" "}
                          {q.scrapM2 ? `(Fire: ${q.scrapM2}m²)` : ""}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">
                        ₺{profit.toLocaleString("tr-TR")} (%
                        {rev > 0 ? Math.round((profit / rev) * 100) : 0})
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            size="sm"
                            onClick={() => handleCreateUniqueInvoice(q)}
                            className="h-8 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs"
                          >
                            {q.invoiceNo ? "Tekil Fatura Doğrula" : "Tekil Fatura Kes"}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onOpenQuoteEdit(q)}
                            className="h-8 border-slate-700 text-xs"
                          >
                            Tahsilat Gir
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 5. KABUL TESTİ #10: GÜNLÜK MUTABAKAT RAPORU */}
      {/* ===================================================================== */}
      {subTab === "reconciliation" && (
        <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <RefreshCw className="h-4 w-4 text-amber-400" />
                Günlük Sipariş — Fatura — Tahsilat Mutabakat Raporu (Kabul Testi #10)
              </h4>
              <p className="text-xs text-slate-400">
                Siparişi tamamlanıp faturası kesilmeyen, faturası kesilip tahsilatı açık kalan veya üretim fire maliyeti sapması olan kayıtları otomatik listeler.
              </p>
            </div>
          </div>

          <div className="space-y-2.5">
            {reconciliationDiscrepancies.length === 0 ? (
              <div className="p-8 text-center text-xs text-emerald-400 font-bold">
                ✓ Tüm sipariş, fatura ve tahsilat kayıtları tam mutabakat halinde!
              </div>
            ) : (
              reconciliationDiscrepancies.map((q) => {
                const rev = q.estimatedPrice || 0;
                const paid =
                  q.paymentStatus === "paid" ? rev : Math.min(rev, Number(q.paidAmount) || 0);
                const issues: string[] = [];
                if (!q.invoiceNo) issues.push("Fatura Referansı Eksik");
                if (paid < rev)
                  issues.push(`Açık Tahsilat Farkı: ₺${(rev - paid).toLocaleString("tr-TR")}`);
                if ((q.actualCost || 0) > (q.estimatedCost || Math.round(rev * 0.68))) {
                  issues.push(`Üretim Fire Maliyet Sapması (${q.scrapM2 || 0} m²)`);
                }

                return (
                  <div
                    key={q.id}
                    className="p-4 rounded-2xl bg-slate-950 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sky-400">{q.id}</span>
                        <span className="font-bold text-white">{q.customerName}</span>
                        <span className="font-mono text-slate-400">
                          Fatura: {q.invoiceNo || "YOK"}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {issues.map((iss, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30 text-[11px]"
                          >
                            ⚠ {iss}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {!q.invoiceNo && (
                        <Button
                          size="sm"
                          onClick={() => handleCreateUniqueInvoice(q)}
                          className="h-8 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs"
                        >
                          Fatura Referansı Ata
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onOpenQuoteEdit(q)}
                        className="h-8 border-slate-700 text-xs"
                      >
                        Mutabakat Düzelt
                      </Button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// MODÜL 10: RAPORLAMA VE ANALİTİK (Bölüm 6 & Kabul Testi #6)
// ============================================================================

interface ReportsModuleProps {
  quotes: QuoteItem[];
  opportunities: OpportunityItem[];
  inventory: InventoryItem[];
  onExportCsv: () => void;
}

export const ReportsModuleView: React.FC<ReportsModuleProps> = ({
  quotes,
  opportunities,
  inventory,
  onExportCsv,
}) => {
  const totalQuotes = quotes.length;
  const wonQuotes = quotes.filter((q) => q.status === "approved" || q.status === "completed").length;
  const conversionRate = totalQuotes > 0 ? Math.round((wonQuotes / totalQuotes) * 100) : 0;

  const totalScrapM2 = quotes.reduce((acc, q) => acc + (q.scrapM2 || 0), 0);
  const totalDowntimeMin = quotes.reduce((acc, q) => acc + (q.downtimeMinutes || 0), 0);
  const qualityHoldCount = quotes.filter((q) => q.qualityHold).length;
  const criticalStockCount = inventory.filter((i) => i.availableQty < i.minStockLevel).length;

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-sky-400" />
            Yönetim Raporlama & KPI Analitik Merkezi (Bölüm 6 & Kabul Testi #6)
          </h3>
          <p className="text-xs text-slate-400">
            Teklif dönüşüm oranı, kayıp nedenleri (% {opportunities.length} fırsat), üretim fire/kırık maliyeti, istasyon duruşları ve stok doğruluğu.
          </p>
        </div>
        <Button
          onClick={onExportCsv}
          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl"
        >
          <Download className="h-4 w-4 mr-1.5" />
          Tüm ERP Verisini CSV / Excel İndir
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800">
          <div className="text-[11px] text-slate-400 uppercase font-bold">
            Tekliften Siparişe Dönüşüm
          </div>
          <div className="text-3xl font-black text-emerald-400 font-mono mt-1">
            %{conversionRate}
          </div>
          <div className="text-xs text-slate-400 mt-1">
            {wonQuotes} Kazanılan / {totalQuotes} Toplam Teklif
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800">
          <div className="text-[11px] text-slate-400 uppercase font-bold">
            Üretim Fire & Kırık (Kabul Testi #6)
          </div>
          <div className="text-3xl font-black text-amber-400 font-mono mt-1">
            {totalScrapM2.toFixed(2)} m²
          </div>
          <div className="text-xs text-slate-400 mt-1">
            Fire Maliyet Etkisi: ₺{Math.round(totalScrapM2 * 650).toLocaleString("tr-TR")}
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800">
          <div className="text-[11px] text-slate-400 uppercase font-bold">
            İstasyon Duruş & Kalite Blokaj
          </div>
          <div className="text-3xl font-black text-rose-400 font-mono mt-1">
            {totalDowntimeMin} dk
          </div>
          <div className="text-xs text-slate-400 mt-1">
            Aktif Kalite Karantinası: {qualityHoldCount} Sipariş
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800">
          <div className="text-[11px] text-slate-400 uppercase font-bold">
            Kritik Stok & Satın Alma İhtiyacı
          </div>
          <div className="text-3xl font-black text-sky-400 font-mono mt-1">
            {criticalStockCount} Kalem
          </div>
          <div className="text-xs text-slate-400 mt-1">
            Toplam {inventory.length} stok/lot kartı izleniyor
          </div>
        </div>
      </div>

      {/* Scrap & Material Consumption Breakdown Table (Acceptance Test #6) */}
      <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-5 space-y-4">
        <h4 className="text-sm font-bold text-white">
          Sipariş Bazlı Fire / Kırık, Lot Tüketimi ve Planlanan vs Gerçekleşen Maliyet Raporu (Kabul Testi #6)
        </h4>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-[10px] font-mono uppercase text-slate-400">
                <th className="py-3 px-3">Sipariş No</th>
                <th className="py-3 px-3">Müşteri & Cam</th>
                <th className="py-3 px-3">Kullanılan Lot</th>
                <th className="py-3 px-3">Fire Miktarı & Nedeni</th>
                <th className="py-3 px-3">Planlanan Maliyet</th>
                <th className="py-3 px-3">Gerçekleşen Maliyet</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {quotes.map((q) => {
                const est = q.estimatedCost || Math.round((q.estimatedPrice || 0) * 0.68);
                const act = q.actualCost || est;
                return (
                  <tr key={q.id}>
                    <td className="py-3 px-3 font-mono font-bold text-sky-400">{q.id}</td>
                    <td className="py-3 px-3 text-white">
                      {q.customerName} — {q.glassType} ({q.totalArea} m²)
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-300">
                      {q.reservedLotNo || "LOT-2026-SC04"}
                    </td>
                    <td className="py-3 px-3">
                      {q.scrapM2 ? (
                        <span className="text-amber-400 font-bold">
                          {q.scrapM2} m² ({q.scrapReason} - {q.scrapStation})
                        </span>
                      ) : (
                        <span className="text-emerald-400">0 m² (Firesiz)</span>
                      )}
                    </td>
                    <td className="py-3 px-3 font-mono">₺{est.toLocaleString("tr-TR")}</td>
                    <td className="py-3 px-3 font-mono font-bold text-rose-300">
                      ₺{act.toLocaleString("tr-TR")}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// MODÜL 11: YÖNETİM, ROLLER (RBAC), DENETİM İZİ & 10 KABUL TESTİ (Bölüm 8, 9, 11)
// ============================================================================

interface GovernanceModuleProps {
  activeRole: UserRole;
  auditLogs: AuditEventItem[];
  onNavigateModule: (modId: string) => void;
}

export const GovernanceModuleView: React.FC<GovernanceModuleProps> = ({
  activeRole,
  auditLogs,
  onNavigateModule,
}) => {
  const ACCEPTANCE_TESTS = [
    {
      no: 1,
      title: "Müşteri ve şantiye için ölçü/işlem kalemleriyle teklif hazırlanabilmeli; fiyat kaynağı ve sürüm görülebilmeli",
      module: "quotes",
      moduleLabel: "Teklif & Fiyat Modülü",
    },
    {
      no: 2,
      title: "Teklif revize edildiğinde eski teklif sürümü (v1, v2) ve önceki toplamı korunmalı",
      module: "quotes",
      moduleLabel: "Teklif & Fiyat Modülü",
    },
    {
      no: 3,
      title: "Teklif siparişe çevrildiğinde müşteri, teknik detay, termin ve belgeler eksiksiz taşınmalı",
      module: "orders",
      moduleLabel: "Sipariş Yönetimi",
    },
    {
      no: 4,
      title: "Sipariş üretim adımlarında ilerlerken bekleyen aşama ve sorumlu görülebilmeli; QR ile sipariş bulunabilmeli",
      module: "production",
      moduleLabel: "Üretim & İstasyon",
    },
    {
      no: 5,
      title: "Kalite blokajı (karantina) olan ürün kesinlikle sevkiyata ayrılamamalı",
      module: "quality",
      moduleLabel: "Kalite Kontrol",
    },
    {
      no: 6,
      title: "Üretim fire/kırık ve malzeme tüketimi stok ve gerçekleşen maliyet raporunda görünmeli",
      module: "reports",
      moduleLabel: "Raporlama & Üretim",
    },
    {
      no: 7,
      title: "Sevk edilen miktar ve teslim kanıtı (POD) müşteri sipariş takip ekranında (/siparis-takip) görünmeli",
      module: "shipment",
      moduleLabel: "Sevkiyat & POD",
    },
    {
      no: 8,
      title: "Fatura/sipariş referansı tekil (idempotent) olmalı; çift fatura kaydı engellenmeli",
      module: "finance",
      moduleLabel: "Finans & Muhasebe",
    },
    {
      no: 9,
      title: "Yetkisiz rol fiyat değiştirememeli, stok düzeltmemeli veya onay adımını atlayamamalı",
      module: "governance",
      moduleLabel: "Rol & Yetki (RBAC)",
    },
    {
      no: 10,
      title: "Günlük mutabakat raporu sipariş, fatura ve tahsilat arasında eşleşmeyen kayıtları listelemeli",
      module: "finance",
      moduleLabel: "Günlük Mutabakat",
    },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Role-Based Access Control (RBAC) Simulator (Acceptance Test #9) */}
      <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <KeyRound className="h-5 w-5 text-sky-400" />
              Rol Bazlı Yetki Kontrolü (RBAC) & Onay Eşikleri (Bölüm 8 & Kabul Testi #9)
            </h3>
            <p className="text-xs text-slate-400">
              Aktif rolü değiştirerek menülerin sadeleşmesini ve yetkisiz fiyat/stok/kalite işlemlerinin engellenmesini canlı test edebilirsiniz.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {(Object.keys(ROLE_DEFINITIONS) as UserRole[]).map((rKey) => {
            const def = ROLE_DEFINITIONS[rKey];
            const isSelected = activeRole === rKey;
            return (
              <button
                key={rKey}
                onClick={() => {
                  setActiveUserRole(rKey);
                  toast.success(`Aktif kullanıcı rolü "${def.label}" olarak değiştirildi.`);
                }}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  isSelected
                    ? "bg-sky-500/20 border-sky-400 shadow-lg"
                    : "bg-slate-950 border-slate-800 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{def.label}</span>
                  {isSelected && (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-sky-500 text-slate-950 font-black">
                      AKTİF
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 mt-1.5 leading-snug">{def.description}</p>
                <div className="mt-2 pt-2 border-t border-slate-800/80 text-[10px] font-mono text-sky-300">
                  Maks. İskonto: %{def.maxDiscountPct} • Fiyat:{def.permissions.canEditPrices ? "✓" : "✗"} • Stok:{def.permissions.canAdjustStock ? "✓" : "✗"}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. 10 Acceptance Tests Interactive Verification Checklist (Bölüm 11) */}
      <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
        <h4 className="text-sm font-bold text-white flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          Bölüm 11 — İlk 10 Kabul Testi (UAT) Canlı Doğrulama Merkezi
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {ACCEPTANCE_TESTS.map((t) => (
            <div
              key={t.no}
              className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono text-[10px] font-bold">
                    TEST #{t.no} AKTİF
                  </span>
                  <span className="text-[11px] text-sky-400 font-semibold">{t.moduleLabel}</span>
                </div>
                <p className="text-xs text-slate-200">{t.title}</p>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onNavigateModule(t.module)}
                className="h-8 border-slate-700 text-xs shrink-0"
              >
                <span>Git</span>
                <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Immutable Audit Trail (Bölüm 9) */}
      <div className="rounded-3xl bg-slate-900/90 border border-slate-800 overflow-hidden">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <History className="h-4 w-4 text-sky-400" />
            Güvenlik & Denetim Kayıtları (AuditEvent — Bölüm 9)
          </h4>
          <span className="text-xs text-slate-400 font-mono">
            Toplam {auditLogs.length} Denetim Kaydı
          </span>
        </div>
        <div className="overflow-x-auto max-h-96">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-[10px] font-mono uppercase text-slate-400 bg-slate-950/60">
                <th className="py-3 px-4">Zaman Damgası</th>
                <th className="py-3 px-4">Olay Türü</th>
                <th className="py-3 px-4">Kullanıcı & Rol</th>
                <th className="py-3 px-4">Hedef Kayıt</th>
                <th className="py-3 px-4">İşlem Detayı</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {auditLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500">
                    Henüz denetim kaydı oluşmadı. Fiyat değişikliği, revizyon, stok hareketi, kalite blokajı veya yetkisiz işlem denemeleri otomatik kaydedilir.
                  </td>
                </tr>
              ) : (
                auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/40">
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-400">
                      {log.timestamp}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold ${
                          log.actionType === "RBAC_DENIED" || log.actionType === "QUALITY_HOLD"
                            ? "bg-rose-500/20 text-rose-400"
                            : "bg-sky-500/15 text-sky-400"
                        }`}
                      >
                        {log.actionType}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-white">{log.actorEmail}</div>
                      <div className="text-[10px] text-slate-400">
                        {ROLE_DEFINITIONS[log.actorRole]?.label || log.actorRole}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-white">{log.targetId}</td>
                    <td className="py-3 px-4 text-slate-300">{log.summary}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
