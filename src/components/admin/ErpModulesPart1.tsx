import React, { useState, useMemo } from "react";
import {
  Users,
  Plus,
  Building2,
  Phone,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Calendar,
  MessageSquare,
  FileCheck,
  ShieldAlert,
  Ban,
  History,
  Printer,
  Edit2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  QuoteItem,
  CustomerRecord,
  OpportunityItem,
  OpportunityStage,
  ActivityItem,
  ContactMessage,
  UserRole,
  ROLE_DEFINITIONS,
  saveAdminCustomer,
  addAdminOpportunity,
  updateAdminOpportunity,
  addAdminActivity,
  toggleAdminActivity,
  addAdminQuote,
  updateAdminQuote,
  updateQuoteStatus,
  cancelAdminQuoteWithReason,
  markMessageAsRead,
  deleteAdminMessage,
} from "@/lib/adminStorage";
import { maskPiiText, printProposalDocument } from "./PrintHelpers";
import { toast } from "sonner";

const FUNNEL_STAGES: { id: OpportunityStage; label: string; color: string }[] = [
  { id: "new_lead", label: "1. Yeni Talep", color: "bg-sky-500/15 text-sky-400 border-sky-500/30" },
  { id: "measurement", label: "2. Ölçü Toplama", color: "bg-indigo-500/15 text-indigo-400 border-indigo-500/30" },
  { id: "technical_review", label: "3. Teknik İnceleme", color: "bg-purple-500/15 text-purple-400 border-purple-500/30" },
  { id: "quote_prepared", label: "4. Teklif Hazırlandı", color: "bg-amber-500/15 text-amber-400 border-amber-500/30" },
  { id: "quote_sent", label: "5. Teklif Gönderildi", color: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30" },
  { id: "negotiation", label: "6. Revizyon / Pazarlık", color: "bg-orange-500/15 text-orange-400 border-orange-500/30" },
  { id: "won", label: "7. Kazanıldı (Sipariş)", color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" },
  { id: "lost", label: "Kaybedildi", color: "bg-rose-500/15 text-rose-400 border-rose-500/30" },
];

interface CrmModuleProps {
  quotes: QuoteItem[];
  customers: CustomerRecord[];
  opportunities: OpportunityItem[];
  activities: ActivityItem[];
  messages: ContactMessage[];
  maskPii: boolean;
  initialSubTab?: "c360" | "funnel" | "activities" | "messages";
  onSelectCustomerFilter: (name: string) => void;
  onOpenQuoteEdit: (q: QuoteItem) => void;
}

export const CrmModuleView: React.FC<CrmModuleProps> = ({
  quotes,
  customers,
  opportunities,
  activities,
  messages,
  maskPii,
  initialSubTab = "c360",
  onSelectCustomerFilter,
  onOpenQuoteEdit,
}) => {
  const [subTab, setSubTab] = useState<"c360" | "funnel" | "activities" | "messages">(initialSubTab);
  const [selectedCustomer360, setSelectedCustomer360] = useState<string | null>(null);

  React.useEffect(() => {
    if (initialSubTab) setSubTab(initialSubTab);
  }, [initialSubTab]);

  // New Customer Form
  const [custForm, setCustForm] = useState({
    companyName: "",
    contactPerson: "",
    phone: "",
    email: "",
    taxNumber: "",
    city: "Adana",
    siteName: "",
    customerType: "Kurumsal / Müteahhit" as CustomerRecord["customerType"],
    salesRep: "Merkez Satış Ekibi",
    paymentTerms: "%50 Avans + Teslimde" as CustomerRecord["paymentTerms"],
    creditLimit: "250000",
    kvkkConsent: true,
  });

  // New Opportunity Form
  const [oppForm, setOppForm] = useState({
    customerName: "",
    phone: "",
    city: "Adana",
    siteName: "",
    source: "Web Formu" as OpportunityItem["source"],
    productGroup: "Fıratpen Selenit 75 PVC Pencere (4+16+4 Isıcam)",
    estimatedAreaM2: "45",
    estimatedAmount: "65000",
    targetDecisionDate: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10),
    competitor: "",
    nextAction: "Saha rölöve ve teknik detay onayı",
    assignedRep: "Satış Temsilcisi - Çukurova",
  });

  // New Activity Form
  const [actForm, setActForm] = useState({
    type: "Telefon Görüşmesi" as ActivityItem["type"],
    customerName: "",
    relatedId: "",
    summary: "",
    dueDate: new Date().toISOString().slice(0, 10),
    assignedTo: "Satış Ekibi",
  });

  // Unified Customer 360 List combining saved CustomerRecords + Quote customers
  const unifiedCustomers = useMemo(() => {
    const map = new Map<
      string,
      {
        key: string;
        companyName: string;
        phone: string;
        city: string;
        siteName: string;
        customerType: string;
        paymentTerms: string;
        creditLimit: number;
        totalOrders: number;
        totalM2: number;
        totalRevenue: number;
        totalPaid: number;
        openBalance: number;
        quotes: QuoteItem[];
      }
    >();

    customers.forEach((c) => {
      const k = c.phone.replace(/[^0-9]/g, "").slice(-10) || c.companyName.toLowerCase();
      map.set(k, {
        key: k,
        companyName: c.companyName,
        phone: c.phone,
        city: c.city,
        siteName: c.siteName || "-",
        customerType: c.customerType,
        paymentTerms: c.paymentTerms,
        creditLimit: c.creditLimit || 250000,
        totalOrders: 0,
        totalM2: 0,
        totalRevenue: 0,
        totalPaid: 0,
        openBalance: 0,
        quotes: [],
      });
    });

    quotes.forEach((q) => {
      if (q.status === "cancelled") return;
      const k = q.phone.replace(/[^0-9]/g, "").slice(-10) || q.customerName.toLowerCase();
      const existing = map.get(k);
      const rev = q.estimatedPrice || 0;
      const paid =
        q.paymentStatus === "paid" ? rev : Math.min(rev, Number(q.paidAmount) || 0);
      if (existing) {
        existing.totalOrders += 1;
        existing.totalM2 = Number((existing.totalM2 + (Number(q.totalArea) || 0)).toFixed(2));
        existing.totalRevenue += rev;
        existing.totalPaid += paid;
        existing.openBalance = Math.max(0, existing.totalRevenue - existing.totalPaid);
        existing.quotes.push(q);
      } else {
        map.set(k, {
          key: k,
          companyName: q.customerName,
          phone: q.phone,
          city: q.city || "Adana",
          siteName: q.siteName || "-",
          customerType: q.customerType || "Kurumsal / Müteahhit",
          paymentTerms: q.paymentTerms || "%50 Avans + Teslimde",
          creditLimit: 250000,
          totalOrders: 1,
          totalM2: Number(q.totalArea) || 0,
          totalRevenue: rev,
          totalPaid: paid,
          openBalance: Math.max(0, rev - paid),
          quotes: [q],
        });
      }
    });

    return Array.from(map.values()).sort((a, b) => b.totalRevenue - a.totalRevenue);
  }, [customers, quotes]);

  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!custForm.companyName.trim() || !custForm.phone.trim()) {
      toast.error("Firma adı ve telefon numarası zorunludur.");
      return;
    }
    saveAdminCustomer({
      companyName: custForm.companyName.trim(),
      contactPerson: custForm.contactPerson.trim() || custForm.companyName.trim(),
      phone: custForm.phone.trim(),
      email: custForm.email.trim() || undefined,
      taxNumber: custForm.taxNumber.trim() || undefined,
      city: custForm.city,
      siteName: custForm.siteName.trim() || undefined,
      customerType: custForm.customerType,
      salesRep: custForm.salesRep,
      paymentTerms: custForm.paymentTerms,
      creditLimit: Number(custForm.creditLimit) || 250000,
      kvkkConsent: custForm.kvkkConsent,
    });
    toast.success("Müşteri / Şantiye 360° kartı kaydedildi.");
    setCustForm({ ...custForm, companyName: "", contactPerson: "", phone: "", siteName: "" });
  };

  const handleCreateOpportunity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!oppForm.customerName.trim() || !oppForm.phone.trim()) {
      toast.error("Müşteri adı ve telefon zorunludur.");
      return;
    }
    const created = addAdminOpportunity({
      customerName: oppForm.customerName.trim(),
      phone: oppForm.phone.trim(),
      city: oppForm.city,
      siteName: oppForm.siteName.trim() || `${oppForm.city} Şantiye`,
      source: oppForm.source,
      stage: "new_lead",
      productGroup: oppForm.productGroup,
      estimatedAreaM2: Number(oppForm.estimatedAreaM2) || 10,
      estimatedAmount: Number(oppForm.estimatedAmount) || 15000,
      targetDecisionDate: oppForm.targetDecisionDate,
      competitor: oppForm.competitor.trim() || undefined,
      nextAction: oppForm.nextAction,
      assignedRep: oppForm.assignedRep,
    });
    // CRM Otomasyonu: Otomatik takip görevi aç
    addAdminActivity({
      type: "Takip Görevi",
      customerName: created.customerName,
      relatedId: created.id,
      summary: `Otomatik CRM Görevi: ${created.siteName} fırsatı için ilk ölçü ve teklif takibi`,
      dueDate: oppForm.targetDecisionDate,
      assignedTo: created.assignedRep,
      completed: false,
    });
    toast.success(`${created.id} fırsatı açıldı ve otomatik takip görevi atandı!`);
    setOppForm({ ...oppForm, customerName: "", phone: "", siteName: "" });
  };

  // CRM Otomasyonu: Kazanılan fırsatı kayıpsız Teklif/Siparişe dönüştür
  const handleConvertOpportunityToQuote = (opp: OpportunityItem) => {
    const newQuote = addAdminQuote({
      customerName: opp.customerName,
      phone: opp.phone,
      city: opp.city,
      siteName: opp.siteName,
      leadSource: opp.source,
      salesRep: opp.assignedRep,
      glassType: opp.productGroup,
      thickness: "6+16+6 mm Temperli",
      dimensions: `${opp.siteName} Projesi (${opp.estimatedAreaM2} m²)`,
      totalArea: opp.estimatedAreaM2,
      estimatedPrice: opp.estimatedAmount,
      status: "quoted",
      notes: `CRM Fırsatından (${opp.id}) dönüştürüldü. Sonraki aksiyon: ${opp.nextAction}`,
    });
    updateAdminOpportunity(opp.id, { stage: "won", convertedQuoteId: newQuote.id });
    toast.success(`${opp.id} fırsatı ${newQuote.id} kodlu resmi teklife/siparişe dönüştürüldü!`);
    onOpenQuoteEdit(newQuote);
  };

  const handleConvertMessageToOpportunity = (m: ContactMessage) => {
    markMessageAsRead(m.id);
    const opp = addAdminOpportunity({
      customerName: m.name,
      phone: m.phone,
      email: m.email,
      city: "Adana",
      siteName: m.subject || "Web Talep Projesi",
      source: "Web Formu",
      stage: "new_lead",
      productGroup: "Fıratpen Selenit 75 PVC Pencere (4+16+4 Isıcam)",
      estimatedAreaM2: 25,
      estimatedAmount: 36250,
      targetDecisionDate: new Date(Date.now() + 5 * 86400000).toISOString().slice(0, 10),
      nextAction: m.message.slice(0, 120),
      assignedRep: "Web Satış Masası",
    });
    toast.success(`Web mesajı ${opp.id} kodlu CRM Fırsatına dönüştürüldü!`);
    setSubTab("funnel");
  };

  const activeCustomerDetail = unifiedCustomers.find((c) => c.key === selectedCustomer360);

  return (
    <div className="space-y-6">
      {/* Sub-navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 p-3 rounded-2xl">
        <div className="flex flex-wrap gap-2">
          {[
            { id: "c360", label: `Müşteri 360° & Şantiyeler (${unifiedCustomers.length})` },
            { id: "funnel", label: `Satış Hunisi & Fırsatlar (${opportunities.length})` },
            { id: "activities", label: `Aktivite & Takip Görevleri (${activities.length})` },
            { id: "messages", label: `Web İletişim Talepleri (${messages.length})` },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setSubTab(t.id as typeof subTab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                subTab === t.id
                  ? "bg-sky-500 text-slate-950 shadow-md"
                  : "bg-slate-800/70 text-slate-300 hover:bg-slate-800"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3.1 MÜŞTERİ 360 & ŞANTİYE KARTLARI */}
      {subTab === "c360" && (
        <div className="space-y-6">
          <form
            onSubmit={handleCreateCustomer}
            className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Building2 className="h-4 w-4 text-sky-400" />
                Yeni Müşteri / Şantiye 360° Kartı Aç
              </h3>
              <span className="text-[11px] text-slate-400">
                Şantiyeler ana müşteri altında proje hesabı olarak izlenir
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <input
                type="text"
                placeholder="Firma / Müşteri Adı *"
                value={custForm.companyName}
                onChange={(e) => setCustForm({ ...custForm, companyName: e.target.value })}
                className="px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
              />
              <input
                type="text"
                placeholder="Şantiye / Proje Adı (Örn: Ziyapaşa Rezidans)"
                value={custForm.siteName}
                onChange={(e) => setCustForm({ ...custForm, siteName: e.target.value })}
                className="px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
              />
              <input
                type="text"
                placeholder="Telefon *"
                value={custForm.phone}
                onChange={(e) => setCustForm({ ...custForm, phone: e.target.value })}
                className="px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
              />
              <input
                type="text"
                placeholder="Vergi No / TCKN"
                value={custForm.taxNumber}
                onChange={(e) => setCustForm({ ...custForm, taxNumber: e.target.value })}
                className="px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
              />
              <select
                value={custForm.customerType}
                onChange={(e) =>
                  setCustForm({
                    ...custForm,
                    customerType: e.target.value as CustomerRecord["customerType"],
                  })
                }
                className="px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
              >
                <option value="Kurumsal / Müteahhit">Kurumsal / Müteahhit</option>
                <option value="Bayi / Camcı">Bayi / Camcı</option>
                <option value="Mimari Ofis">Mimari Ofis</option>
                <option value="Bireysel">Bireysel</option>
              </select>
              <select
                value={custForm.paymentTerms}
                onChange={(e) =>
                  setCustForm({
                    ...custForm,
                    paymentTerms: e.target.value as CustomerRecord["paymentTerms"],
                  })
                }
                className="px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
              >
                <option value="%50 Avans + Teslimde">%50 Avans + Teslimde</option>
                <option value="Peşin">Peşin</option>
                <option value="30 Gün Vadeli">30 Gün Vadeli</option>
                <option value="60 Gün Vadeli">60 Gün Vadeli</option>
              </select>
              <input
                type="number"
                placeholder="Risk / Kredi Limiti (₺)"
                value={custForm.creditLimit}
                onChange={(e) => setCustForm({ ...custForm, creditLimit: e.target.value })}
                className="px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
              />
              <Button
                type="submit"
                className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded-xl"
              >
                <Plus className="h-4 w-4 mr-1.5" />
                Müşteri Kartı Kaydet
              </Button>
            </div>
          </form>

          {/* Customer 360 Table */}
          <div className="rounded-3xl bg-slate-900/90 border border-slate-800 overflow-hidden">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <h4 className="text-sm font-bold text-white">
                Müşteri 360° Cari, Risk Limiti ve Şantiye Listesi
              </h4>
              <span className="text-xs text-slate-400">
                Satıra tıklayarak 360° kronolojik müşteri geçmişini açabilirsiniz
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-[10px] font-mono uppercase text-slate-400 bg-slate-950/60">
                    <th className="py-3.5 px-4">Müşteri / Şantiye</th>
                    <th className="py-3.5 px-4">Tip & Ödeme Koşulu</th>
                    <th className="py-3.5 px-4">Sipariş / m²</th>
                    <th className="py-3.5 px-4">Toplam Ciro</th>
                    <th className="py-3.5 px-4">Açık Bakiye</th>
                    <th className="py-3.5 px-4">Risk Limiti Durumu</th>
                    <th className="py-3.5 px-4 text-right">360° Detay</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-xs">
                  {unifiedCustomers.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-10 text-center text-slate-500">
                        Henüz müşteri veya sipariş kaydı bulunmuyor.
                      </td>
                    </tr>
                  ) : (
                    unifiedCustomers.map((c) => {
                      const riskExceeded = c.openBalance > c.creditLimit;
                      return (
                        <tr
                          key={c.key}
                          className="hover:bg-slate-800/40 transition-colors cursor-pointer"
                          onClick={() => setSelectedCustomer360(c.key)}
                        >
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-white">{c.companyName}</div>
                            <div className="text-[11px] text-slate-400">
                              📍 {c.city} ({c.siteName}) • 📞 {maskPiiText(c.phone, maskPii)}
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[11px]">
                              {c.customerType}
                            </span>
                            <div className="text-[11px] text-slate-500 mt-1">{c.paymentTerms}</div>
                          </td>
                          <td className="py-3.5 px-4 font-mono">
                            <span className="text-white font-bold">{c.totalOrders} İş</span> •{" "}
                            <span className="text-sky-400">{c.totalM2} m²</span>
                          </td>
                          <td className="py-3.5 px-4 font-mono font-bold text-white">
                            ₺{c.totalRevenue.toLocaleString("tr-TR")}
                          </td>
                          <td className="py-3.5 px-4 font-mono font-bold text-amber-400">
                            ₺{c.openBalance.toLocaleString("tr-TR")}
                          </td>
                          <td className="py-3.5 px-4">
                            {riskExceeded ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-500/15 text-rose-400 border border-rose-500/30 text-[11px] font-bold">
                                <AlertTriangle className="h-3.5 w-3.5" />
                                Limit Aşıldı (₺{c.creditLimit.toLocaleString("tr-TR")})
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold">
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                Limit Uygun (₺{c.creditLimit.toLocaleString("tr-TR")})
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                onSelectCustomerFilter(c.companyName);
                              }}
                              className="h-8 text-xs border-slate-700 text-sky-400 hover:bg-sky-500/10"
                            >
                              Siparişleri Gör
                            </Button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* 360 Customer Detail Drawer */}
          {activeCustomerDetail && (
            <div className="p-6 rounded-3xl bg-slate-950 border-2 border-sky-500/40 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h4 className="text-base font-bold text-white">
                    Müşteri 360° Kronolojik Akış: {activeCustomerDetail.companyName}
                  </h4>
                  <p className="text-xs text-slate-400">
                    Şantiye: {activeCustomerDetail.siteName} • Ödeme Koşulu:{" "}
                    {activeCustomerDetail.paymentTerms} • Açık Risk: ₺
                    {activeCustomerDetail.openBalance.toLocaleString("tr-TR")}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSelectedCustomer360(null)}
                  className="border-slate-700 text-slate-300"
                >
                  Kapat
                </Button>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="text-xs font-bold text-sky-400 uppercase">
                    Teklifler, Revizyonlar & Siparişler ({activeCustomerDetail.quotes.length})
                  </div>
                  {activeCustomerDetail.quotes.map((q) => (
                    <div
                      key={q.id}
                      className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-mono font-bold text-sky-400">{q.id}</span> (v
                        {q.version || 1}) — {q.glassType}
                        <div className="text-[11px] text-slate-400">
                          {q.totalArea} m² • ₺{(q.estimatedPrice || 0).toLocaleString("tr-TR")} • Aşama{" "}
                          {q.productionStage || 1}/6
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onOpenQuoteEdit(q)}
                        className="h-7 text-[11px] border-slate-700"
                      >
                        Aç
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  <div className="text-xs font-bold text-emerald-400 uppercase">
                    İletişim & Takip Aktiviteleri
                  </div>
                  {activities
                    .filter((a) =>
                      a.customerName.toLowerCase().includes(activeCustomerDetail.companyName.toLowerCase())
                    )
                    .map((a) => (
                      <div
                        key={a.id}
                        className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs"
                      >
                        <div className="font-bold text-white">
                          {a.type} — {a.dueDate}
                        </div>
                        <div className="text-slate-400 text-[11px]">{a.summary}</div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3.2 ADAY, FIRSAT VE SATIŞ HUNİSİ */}
      {subTab === "funnel" && (
        <div className="space-y-6">
          <form
            onSubmit={handleCreateOpportunity}
            className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4"
          >
            <h3 className="text-sm font-bold text-white">
              Yeni Aday / Satış Fırsatı Kaydı (7 Aşamalı Satış Hunisi)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <input
                type="text"
                placeholder="Müşteri / Firma Adı *"
                value={oppForm.customerName}
                onChange={(e) => setOppForm({ ...oppForm, customerName: e.target.value })}
                className="px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
              />
              <input
                type="text"
                placeholder="Telefon *"
                value={oppForm.phone}
                onChange={(e) => setOppForm({ ...oppForm, phone: e.target.value })}
                className="px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
              />
              <input
                type="text"
                placeholder="Proje / Şantiye Adı"
                value={oppForm.siteName}
                onChange={(e) => setOppForm({ ...oppForm, siteName: e.target.value })}
                className="px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
              />
              <select
                value={oppForm.source}
                onChange={(e) =>
                  setOppForm({ ...oppForm, source: e.target.value as OpportunityItem["source"] })
                }
                className="px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
              >
                <option value="Web Formu">Kaynak: Web Formu</option>
                <option value="Telefon">Kaynak: Telefon</option>
                <option value="WhatsApp">Kaynak: WhatsApp</option>
                <option value="Bayi Yönlendirmesi">Kaynak: Bayi Yönlendirmesi</option>
                <option value="Fuar">Kaynak: Fuar</option>
                <option value="Mevcut Müşteri Tavsiyesi">Kaynak: Müşteri Tavsiyesi</option>
              </select>
              <input
                type="number"
                placeholder="Tahmini Alan (m²)"
                value={oppForm.estimatedAreaM2}
                onChange={(e) => setOppForm({ ...oppForm, estimatedAreaM2: e.target.value })}
                className="px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
              />
              <input
                type="number"
                placeholder="Tahmini Tutar (₺)"
                value={oppForm.estimatedAmount}
                onChange={(e) => setOppForm({ ...oppForm, estimatedAmount: e.target.value })}
                className="px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
              />
              <input
                type="date"
                value={oppForm.targetDecisionDate}
                onChange={(e) => setOppForm({ ...oppForm, targetDecisionDate: e.target.value })}
                className="px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
              />
              <Button
                type="submit"
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl"
              >
                <Plus className="h-4 w-4 mr-1.5" />
                Fırsat & Görev Oluştur
              </Button>
            </div>
          </form>

          <div className="rounded-3xl bg-slate-900/90 border border-slate-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-[10px] font-mono uppercase text-slate-400 bg-slate-950/60">
                    <th className="py-3.5 px-4">Fırsat No & Kaynak</th>
                    <th className="py-3.5 px-4">Müşteri / Şantiye</th>
                    <th className="py-3.5 px-4">Ürün & Tahmini Tutar</th>
                    <th className="py-3.5 px-4">Satış Hunisi Aşaması</th>
                    <th className="py-3.5 px-4">Kaybedilme Nedeni</th>
                    <th className="py-3.5 px-4 text-right">Siparişe Dönüştür</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-xs">
                  {opportunities.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-10 text-center text-slate-500">
                        Henüz kayıtlı satış fırsatı bulunmuyor. Yukarıdan yeni fırsat ekleyebilirsiniz.
                      </td>
                    </tr>
                  ) : (
                    opportunities.map((opp) => (
                      <tr key={opp.id} className="hover:bg-slate-800/40">
                        <td className="py-3.5 px-4">
                          <div className="font-mono font-bold text-sky-400">{opp.id}</div>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                            {opp.source}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-white">{opp.customerName}</div>
                          <div className="text-[11px] text-slate-400">
                            {opp.siteName} • Karar: {opp.targetDecisionDate}
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="text-slate-200">{opp.productGroup}</div>
                          <div className="font-mono font-bold text-emerald-400">
                            {opp.estimatedAreaM2} m² • ₺{opp.estimatedAmount.toLocaleString("tr-TR")}
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <select
                            value={opp.stage}
                            onChange={(e) =>
                              updateAdminOpportunity(opp.id, {
                                stage: e.target.value as OpportunityStage,
                              })
                            }
                            className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                          >
                            {FUNNEL_STAGES.map((st) => (
                              <option key={st.id} value={st.id}>
                                {st.label}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="py-3.5 px-4">
                          {opp.stage === "lost" ? (
                            <select
                              value={opp.lossReason || "Fiyat"}
                              onChange={(e) =>
                                updateAdminOpportunity(opp.id, {
                                  lossReason: e.target.value as OpportunityItem["lossReason"],
                                })
                              }
                              className="px-2.5 py-1.5 rounded-lg bg-rose-950/60 border border-rose-500/40 text-xs text-rose-300"
                            >
                              <option value="Fiyat">Fiyat Yüksek</option>
                              <option value="Termin">Termin Uyuşmazlığı</option>
                              <option value="Teknik Uyumsuzluk">Teknik Uyumsuzluk</option>
                              <option value="Proje İptali">Proje İptali</option>
                              <option value="Rakip">Rakip Tercih Edildi</option>
                              <option value="Ulaşılamama">Müşteriye Ulaşılamadı</option>
                            </select>
                          ) : (
                            <span className="text-slate-500 text-[11px]">-</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          {opp.convertedQuoteId ? (
                            <span className="font-mono text-[11px] text-emerald-400 font-bold">
                              ✓ {opp.convertedQuoteId}
                            </span>
                          ) : (
                            <Button
                              size="sm"
                              onClick={() => handleConvertOpportunityToQuote(opp)}
                              className="h-8 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs"
                            >
                              <span>Teklife / Siparişe Taşı</span>
                              <ArrowRight className="h-3.5 w-3.5 ml-1" />
                            </Button>
                          )}
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

      {/* 3.3 AKTİVİTE VE GÖREV TAKİBİ */}
      {subTab === "activities" && (
        <div className="space-y-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!actForm.customerName.trim() || !actForm.summary.trim()) {
                toast.error("Müşteri adı ve görüşme/görev özeti zorunludur.");
                return;
              }
              addAdminActivity({
                type: actForm.type,
                customerName: actForm.customerName.trim(),
                relatedId: actForm.relatedId.trim() || undefined,
                summary: actForm.summary.trim(),
                dueDate: actForm.dueDate,
                assignedTo: actForm.assignedTo,
                completed: false,
              });
              toast.success("CRM Aktivite / Takip görevi kaydedildi.");
              setActForm({ ...actForm, customerName: "", summary: "" });
            }}
            className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs"
          >
            <select
              value={actForm.type}
              onChange={(e) =>
                setActForm({ ...actForm, type: e.target.value as ActivityItem["type"] })
              }
              className="px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
            >
              <option value="Telefon Görüşmesi">Telefon Görüşmesi</option>
              <option value="Toplantı">Toplantı</option>
              <option value="Saha Keşfi">Saha Keşfi / Rölöve</option>
              <option value="WhatsApp Notu">WhatsApp Görüşme Notu</option>
              <option value="Takip Görevi">Takip Görevi</option>
            </select>
            <input
              type="text"
              placeholder="Müşteri / Şantiye Adı *"
              value={actForm.customerName}
              onChange={(e) => setActForm({ ...actForm, customerName: e.target.value })}
              className="px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
            />
            <input
              type="text"
              placeholder="Görüşme Özeti / Sonraki Aksiyon *"
              value={actForm.summary}
              onChange={(e) => setActForm({ ...actForm, summary: e.target.value })}
              className="px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white sm:col-span-2"
            />
            <Button
              type="submit"
              className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded-xl"
            >
              Aktivite Ekle
            </Button>
          </form>

          <div className="space-y-2.5">
            {activities.length === 0 ? (
              <div className="p-10 rounded-3xl bg-slate-900/80 border border-slate-800 text-center text-xs text-slate-500">
                Henüz kayıtlı aktivite veya takip görevi yok.
              </div>
            ) : (
              activities.map((a) => (
                <div
                  key={a.id}
                  className={`p-4 rounded-2xl border flex items-center justify-between gap-4 ${
                    a.completed
                      ? "bg-slate-900/40 border-slate-800/60 opacity-60"
                      : "bg-slate-900 border-slate-800"
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="px-2.5 py-0.5 rounded-md bg-sky-500/15 text-sky-400 font-bold">
                        {a.type}
                      </span>
                      <span className="font-bold text-white">{a.customerName}</span>
                      {a.relatedId && (
                        <span className="font-mono text-slate-400">({a.relatedId})</span>
                      )}
                      <span className="text-slate-400 flex items-center gap-1">
                        <Calendar className="h-3 w-3" /> {a.dueDate}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300">{a.summary}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toggleAdminActivity(a.id)}
                    className="border-slate-700 text-xs"
                  >
                    {a.completed ? "Tamamlandı ✓" : "Tamamla"}
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* WEB İLETİŞİM TALEPLERİ -> FIRSATA / TEKLİFE DÖNÜŞTÜRME */}
      {subTab === "messages" && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div>
              <h4 className="font-bold text-white flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-sky-400" />
                Web Sitesi İletişim & Hızlı Form Mesaj Kutusu (acarpen_messages)
              </h4>
              <p className="text-slate-400 text-[11px] mt-0.5">
                Sitedeki <strong>/iletisim</strong> sayfası ve Ana Sayfadaki <strong>"Hızlı Teklif & İletişim Formu"</strong> üzerinden gönderilen tüm müşteri mesajları canlı olarak buraya düşer.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-sky-500/15 text-sky-400 font-mono font-bold text-xs">
              Toplam: {messages.length} Mesaj ({messages.filter((m) => !m.isRead).length} Okunmamış)
            </span>
          </div>

          {messages.length === 0 ? (
            <div className="p-10 rounded-3xl bg-slate-900/80 border border-slate-800 text-center text-xs text-slate-500">
              İletişim formundan gelen yeni mesaj bulunmuyor. Sitedeki form doldurulduğunda sesli bildirimle anında burada listelenir.
            </div>
          ) : (
            messages.map((m) => {
              const cleanPhone = m.phone.replace(/[^0-9]/g, "");
              const waPhone = cleanPhone.startsWith("0")
                ? `9${cleanPhone}`
                : cleanPhone.startsWith("90")
                ? cleanPhone
                : `90${cleanPhone}`;
              return (
                <div
                  key={m.id}
                  className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-sky-400" />
                      <span className="font-bold text-sm text-white">{m.name}</span>
                      {!m.isRead && (
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                          YENİ MESAJ
                        </span>
                      )}
                      <span className="text-xs font-mono text-slate-400">
                        📞 {maskPiiText(m.phone, maskPii)}
                      </span>
                      {m.email && (
                        <span className="text-xs font-mono text-slate-400">✉️ {m.email}</span>
                      )}
                      <span className="text-[11px] text-slate-500">{m.date}</span>
                    </div>
                    <div className="text-xs font-semibold text-sky-400">{m.subject}</div>
                    <p className="text-xs text-slate-300">{m.message}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <a
                      href={`https://wa.me/${waPhone}?text=${encodeURIComponent(
                        `Merhaba Sayın ${m.name}, Acarpen web sitemiz üzerinden ilettiğiniz "${m.subject}" talebiniz için dönüş yapıyoruz.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => markMessageAsRead(m.id)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs inline-flex items-center gap-1.5"
                    >
                      <Phone className="h-3.5 w-3.5" />
                      WhatsApp Yanıtla
                    </a>
                    <Button
                      size="sm"
                      onClick={() => handleConvertMessageToOpportunity(m)}
                      className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs"
                    >
                      CRM Fırsatına Dönüştür
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        markMessageAsRead(m.id);
                        const created = addAdminQuote({
                          customerName: m.name,
                          phone: m.phone,
                          email: m.email,
                          city: "Adana",
                          siteName: m.subject || "Web İletişim Talebi",
                          leadSource: "Web Formu",
                          glassType: "Fıratpen Selenit 75 PVC Pencere (4+16+4 Isıcam)",
                          thickness: "4+16+4 mm",
                          dimensions: "Web Form Talebi (Ölçü Girilecek)",
                          totalArea: 15,
                          estimatedPrice: 21750,
                          status: "new",
                          notes: m.message,
                        });
                        toast.success(`Mesaj ${created.id} kodlu teklife dönüştürüldü!`);
                        onOpenQuoteEdit(created);
                      }}
                      className="border-slate-700 text-xs"
                    >
                      Teklife Dönüştür
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => deleteAdminMessage(m.id)}
                      className="border-rose-500/30 text-rose-400 hover:bg-rose-500/10 text-xs"
                    >
                      Kaldır
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

// ============================================================================
// MODÜL 4: SİPARİŞ VE SÖZLEŞME YÖNETİMİ (Bölüm 5.1 & Kabul Testi #3)
// ============================================================================

interface OrderModuleProps {
  quotes: QuoteItem[];
  activeRole: UserRole;
  onOpenQuoteEdit: (q: QuoteItem) => void;
}

export const OrderManagementModuleView: React.FC<OrderModuleProps> = ({
  quotes,
  activeRole,
  onOpenQuoteEdit,
}) => {
  const [cancelModalOrder, setCancelModalOrder] = useState<QuoteItem | null>(null);
  const [cancelReasonText, setCancelReasonText] = useState("Müşteri proje revizyonu / siparişi durdurdu");

  const handleReleaseToProduction = (q: QuoteItem) => {
    if (q.approvalStatus === "pending_approval") {
      toast.error(
        "ONAY KAPISI ENGELİ: Bu siparişte iskonto limiti aşıldığı için önce Yönetici / Satış Yöneticisi onayı gereklidir!"
      );
      return;
    }
    const res = updateQuoteStatus(q.id, "approved");
    if (!res.ok) {
      toast.error(res.error);
      return;
    }
    updateAdminQuote(q.id, {
      technicalApproved: true,
      orderSnapshotAt: new Date().toLocaleString("tr-TR"),
      productionStage: 2,
    });
    toast.success(
      `KABUL TESTİ #3 DOĞRULANDI: ${q.id} siparişi teknik detay, termin ve sözleşme anlık görüntüsü korunarak üretime bırakıldı!`
    );
  };

  const handleApproveDiscount = (q: QuoteItem) => {
    if (!ROLE_DEFINITIONS[activeRole].permissions.canApproveDiscount) {
      toast.error("YETKİ ENGELİ (Kabul Testi #9): İskonto onaylama yetkiniz bulunmuyor.");
      return;
    }
    updateAdminQuote(q.id, {
      approvalStatus: "approved",
      approvedBy: ROLE_DEFINITIONS[activeRole].label,
    });
    toast.success(`${q.id} için özel iskonto (%${q.discountRate || 0}) onaylandı.`);
  };

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <FileCheck className="h-5 w-5 text-sky-400" />
            Sipariş & Sözleşme Yönetimi (Kabul Testi #3 — Üretime Bırakma Kapıları)
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Sipariş kabul edilmiş teklifin değiştirilemez anlık görüntüsünü taşır. Kayıtlar silinmez; gerekçeli iptal/ters kayıt ile kapatılır.
          </p>
        </div>
      </div>

      <div className="rounded-3xl bg-slate-900/90 border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[10px] font-mono uppercase text-slate-400 bg-slate-950/60">
                <th className="py-3.5 px-4">Sipariş No & Sürüm</th>
                <th className="py-3.5 px-4">Müşteri / Şantiye</th>
                <th className="py-3.5 px-4">Teknik & Avans Kapısı</th>
                <th className="py-3.5 px-4">Hedef Termin</th>
                <th className="py-3.5 px-4">Sözleşme Tutarı</th>
                <th className="py-3.5 px-4">Durum</th>
                <th className="py-3.5 px-4 text-right">Sözleşme İşlemleri</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {quotes.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-500">
                    Henüz teklif veya sipariş kaydı bulunmuyor.
                  </td>
                </tr>
              ) : (
                quotes.map((q) => (
                  <tr key={q.id} className="hover:bg-slate-800/40">
                    <td className="py-3.5 px-4">
                      <div className="font-mono font-bold text-sky-400">{q.id}</div>
                      <div className="text-[10px] text-slate-400">
                        Revizyon: v{q.version || 1} ({q.revisions?.length || 0} geçmiş)
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white">{q.customerName}</div>
                      <div className="text-[11px] text-slate-400">
                        {q.siteName || q.city} • {q.glassType} ({q.totalArea} m²)
                      </div>
                    </td>
                    <td className="py-3.5 px-4 space-y-1">
                      {q.approvalStatus === "pending_approval" ? (
                        <div className="flex items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold">
                            İskonto Onayı Bekliyor (%{q.discountRate})
                          </span>
                          <button
                            onClick={() => handleApproveDiscount(q)}
                            className="text-[10px] underline text-sky-400 font-bold"
                          >
                            Onayla
                          </button>
                        </div>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 text-[10px] font-bold">
                          ✓ Fiyat & İskonto Onaylı
                        </span>
                      )}
                      <div className="text-[11px] text-slate-400">
                        {q.technicalApproved ? "✓ CAD Teknik Onaylı" : "⏳ Teknik Onay Bekliyor"} •{" "}
                        {q.paymentStatus === "paid"
                          ? "✓ Tam Tahsilat"
                          : q.paymentStatus === "deposit"
                          ? `✓ Avans Alındı (₺${(q.paidAmount || 0).toLocaleString("tr-TR")})`
                          : "Ödeme Bekliyor"}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-xs text-slate-200">
                      {q.estimatedDeliveryDate || "Planlanmadı"}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-white">
                      ₺{(q.estimatedPrice || 0).toLocaleString("tr-TR")}
                    </td>
                    <td className="py-3.5 px-4">
                      {q.status === "cancelled" ? (
                        <div>
                          <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 text-[10px] font-bold">
                            İptal Edildi
                          </span>
                          <div className="text-[10px] text-rose-300 mt-0.5">{q.cancelReason}</div>
                        </div>
                      ) : (
                        <span className="px-2.5 py-1 rounded-lg bg-sky-500/15 text-sky-400 text-[11px] font-bold">
                          {q.status === "approved"
                            ? "Üretimde (Aktif Sipariş)"
                            : q.status === "completed"
                            ? "Teslim Edildi"
                            : "Teklif / Sözleşme Aşamasında"}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {q.status !== "approved" &&
                          q.status !== "completed" &&
                          q.status !== "cancelled" && (
                            <Button
                              size="sm"
                              onClick={() => handleReleaseToProduction(q)}
                              className="h-8 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs"
                            >
                              Siparişe Çevir & Üretime Bırak
                            </Button>
                          )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onOpenQuoteEdit(q)}
                          className="h-8 border-slate-700 text-xs"
                          title="Değişiklik Emri / Revizyon"
                        >
                          <Edit2 className="h-3.5 w-3.5 mr-1" />
                          Revize Et
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => printProposalDocument(q)}
                          className="h-8 border-slate-700 text-xs"
                        >
                          <Printer className="h-3.5 w-3.5" />
                        </Button>
                        {q.status !== "cancelled" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setCancelModalOrder(q)}
                            className="h-8 border-rose-500/30 text-rose-400 hover:bg-rose-500/10 text-xs"
                            title="Silmek yerine gerekçeli iptal"
                          >
                            <Ban className="h-3.5 w-3.5" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Gerekçeli İptal Modalı (Bölüm 7: Kayıtlar silinmez, gerekçe ile kapatılır) */}
      {cancelModalOrder && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full p-6 space-y-4">
            <h4 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-rose-400" />
              Gerekçeli Sipariş / Teklif İptali ({cancelModalOrder.id})
            </h4>
            <p className="text-xs text-slate-400">
              ERP denetim ilkeleri gereği kayıtlar veritabanından silinmez; iptal gerekçesi ve denetim kaydı (AuditEvent) ile kapatılır.
            </p>
            <textarea
              rows={3}
              value={cancelReasonText}
              onChange={(e) => setCancelReasonText(e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
              placeholder="İptal gerekçesini yazınız..."
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setCancelModalOrder(null)}
                className="border-slate-700 text-xs"
              >
                Vazgeç
              </Button>
              <Button
                onClick={() => {
                  if (!ROLE_DEFINITIONS[activeRole].permissions.canCancelOrder) {
                    toast.error(
                      "YETKİ ENGELİ (Kabul Testi #9): Sipariş iptali için Yönetici veya Satış Yöneticisi yetkisi gereklidir."
                    );
                    return;
                  }
                  cancelAdminQuoteWithReason(cancelModalOrder.id, cancelReasonText);
                  toast.success(`${cancelModalOrder.id} gerekçeli olarak iptal edildi ve denetim izine işlendi.`);
                  setCancelModalOrder(null);
                }}
                className="bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs"
              >
                Gerekçeli İptali Onayla
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
