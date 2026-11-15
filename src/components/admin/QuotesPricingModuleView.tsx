import { useState } from "react";
import {
  Columns,
  Edit2,
  List,
  Percent,
  PhoneCall,
  Printer,
  QrCode,
  Search,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  FactoryPriceItem,
  FactoryServiceItem,
  QuoteItem,
  addAdminPrice,
  addAdminService,
  applyBulkAdminPricePercentage,
  deleteAdminPrice,
  deleteAdminService,
  updateAdminPrice,
  updateAdminPriceItem,
  updateAdminService,
  updateQuoteStatus,
} from "@/lib/adminStorage";
import { maskPiiText, printProposalDocument } from "./PrintHelpers";
import { formatWhatsAppUrl } from "./adminUiHelpers";

interface QuotesPricingModuleViewProps {
  quotes: QuoteItem[];
  prices: FactoryPriceItem[];
  services: FactoryServiceItem[];
  maskPii: boolean;
  subTab: "quotes_list" | "pricing_catalog";
  statusFilter: string;
  searchTerm: string;
  onSubTabChange: (tab: "quotes_list" | "pricing_catalog") => void;
  onStatusFilterChange: (status: string) => void;
  onSearchTermChange: (term: string) => void;
  onOpenQuoteEdit: (quote: QuoteItem) => void;
  onOpenQrModal: (quote: QuoteItem) => void;
}

/**
 * Module 3: Quote revisions (table/Kanban) and live PVC/glass unit pricing catalog.
 */
export function QuotesPricingModuleView({
  quotes,
  prices,
  services,
  maskPii,
  subTab,
  statusFilter,
  searchTerm,
  onSubTabChange,
  onStatusFilterChange,
  onSearchTermChange,
  onOpenQuoteEdit,
  onOpenQrModal,
}: QuotesPricingModuleViewProps) {
  const [quotesViewMode, setQuotesViewMode] = useState<"table" | "kanban">("table");
  const [newGlassName, setNewGlassName] = useState("");
  const [newGlassThickness, setNewGlassThickness] = useState("4+16+4 mm");
  const [newGlassPrice, setNewGlassPrice] = useState("1550");
  const [newServiceName, setNewServiceName] = useState("");
  const [newServicePrice, setNewServicePrice] = useState("250");

  const filteredQuotes = quotes.filter((q) => {
    if (statusFilter !== "all" && q.status !== statusFilter) return false;
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

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 border-2 border-slate-800 p-4 rounded-2xl">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onSubTabChange("quotes_list")}
            className={`px-4 py-2.5 rounded-xl text-xs font-extrabold ${
              subTab === "quotes_list"
                ? "bg-sky-600 text-white"
                : "bg-slate-800 text-slate-200"
            }`}
          >
            Teklifler & Revizyonlar ({quotes.length})
          </button>
          <button
            onClick={() => onSubTabChange("pricing_catalog")}
            className={`px-4 py-2.5 rounded-xl text-xs font-extrabold ${
              subTab === "pricing_catalog"
                ? "bg-sky-600 text-white"
                : "bg-slate-800 text-slate-200"
            }`}
          >
            Birim Fiyat Listesi & Ek İşlemler ({prices.length})
          </button>
        </div>

        {subTab === "quotes_list" && (
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value)}
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
                onChange={(e) => onSearchTermChange(e.target.value)}
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

      {subTab === "quotes_list" ? (
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
                              onClick={() => onOpenQuoteEdit(q)}
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
                              onClick={() => onOpenQrModal(q)}
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
                        onClick={() => onOpenQuoteEdit(q)}
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
  );
}
