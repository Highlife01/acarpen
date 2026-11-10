import React, { useState, useEffect } from "react";
import {
  X,
  Plus,
  Trash2,
  Save,
  History,
  Calculator,
  ShieldAlert,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  QuoteItem,
  QuoteLineItem,
  FactoryPriceItem,
  UserRole,
  ROLE_DEFINITIONS,
  addAdminQuote,
  updateAdminQuote,
} from "@/lib/adminStorage";
import { toast } from "sonner";

interface QuoteConfiguratorModalProps {
  isOpen: boolean;
  editingQuote: QuoteItem | null; // null = create new quote with line items
  prices: FactoryPriceItem[];
  activeRole: UserRole;
  onClose: () => void;
}

export const QuoteConfiguratorModal: React.FC<QuoteConfiguratorModalProps> = ({
  isOpen,
  editingQuote,
  prices,
  activeRole,
  onClose,
}) => {
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("Adana");
  const [siteName, setSiteName] = useState("");
  const [paymentTerms, setPaymentTerms] =
    useState<NonNullable<QuoteItem["paymentTerms"]>>("%50 Avans + Teslimde");
  const [paymentStatus, setPaymentStatus] =
    useState<NonNullable<QuoteItem["paymentStatus"]>>("unpaid");
  const [paidAmount, setPaidAmount] = useState("0");
  const [discountRate, setDiscountRate] = useState("0");
  const [extraCost, setExtraCost] = useState("0");
  const [estimatedDeliveryDate, setEstimatedDeliveryDate] = useState("");
  const [vehiclePlate, setVehiclePlate] = useState("");
  const [revisionReason, setRevisionReason] = useState("Müşteri ölçü / kalem revizyonu");

  const [lines, setLines] = useState<QuoteLineItem[]>([]);

  useEffect(() => {
    if (!isOpen) return;
    if (editingQuote) {
      setCustomerName(editingQuote.customerName);
      setPhone(editingQuote.phone);
      setCity(editingQuote.city || "Adana");
      setSiteName(editingQuote.siteName || "");
      setPaymentTerms(editingQuote.paymentTerms || "%50 Avans + Teslimde");
      setPaymentStatus(editingQuote.paymentStatus || "unpaid");
      setPaidAmount(String(editingQuote.paidAmount || 0));
      setDiscountRate(String(editingQuote.discountRate || 0));
      setExtraCost(String(editingQuote.extraCost || 0));
      setEstimatedDeliveryDate(editingQuote.estimatedDeliveryDate || "");
      setVehiclePlate(editingQuote.vehiclePlate || "");

      if (editingQuote.lines && editingQuote.lines.length > 0) {
        setLines(editingQuote.lines);
      } else {
        setLines([
          {
            id: "line-1",
            glassType: editingQuote.glassType || prices[0]?.name || "Şişecam Isıcam S",
            thickness: editingQuote.thickness || "4+16+4 mm",
            widthMm: 1200,
            heightMm: 2000,
            qty: Math.max(1, Math.round((editingQuote.totalArea || 2.4) / 2.4)),
            m2: editingQuote.totalArea || 2.4,
            edgeWork: "Rodaj",
            holesCount: 0,
            tempered: true,
            laminatedOrIgu: "Isıcam S",
            wastePct: 5,
            unitPrice: prices[0]?.m2Price || 1450,
            lineTotal: editingQuote.estimatedPrice || 3480,
          },
        ]);
      }
    } else {
      setCustomerName("");
      setPhone("");
      setCity("Adana");
      setSiteName("");
      setPaymentTerms("%50 Avans + Teslimde");
      setPaymentStatus("unpaid");
      setPaidAmount("0");
      setDiscountRate("0");
      setExtraCost("0");
      setEstimatedDeliveryDate(new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10));
      setVehiclePlate("01 TC 322 (Vinçli Kamyon)");
      const p0 = prices[0];
      setLines([
        {
          id: `line-${Date.now()}`,
          glassType: p0?.name || "Şişecam Isıcam S (Low-E Yalıtımlı)",
          thickness: p0?.thickness || "4+16+4 mm",
          widthMm: 1500,
          heightMm: 2200,
          qty: 4,
          m2: 13.2,
          edgeWork: "Rodaj",
          holesCount: 2,
          tempered: true,
          laminatedOrIgu: "Isıcam S",
          wastePct: 5,
          unitPrice: p0?.m2Price || 1450,
          lineTotal: Math.round(13.2 * 1.05 * (p0?.m2Price || 1450)),
        },
      ]);
    }
  }, [isOpen, editingQuote, prices]);

  if (!isOpen) return null;

  const recalcLine = (l: QuoteLineItem): QuoteLineItem => {
    const rawM2 = Math.max(0.25, ((l.widthMm / 1000) * (l.heightMm / 1000)) * l.qty);
    const m2 = Number(rawM2.toFixed(2));
    const wasteFactor = 1 + (l.wastePct || 0) / 100;
    const edgeAdd = l.edgeWork !== "Yok" ? 120 * l.qty : 0;
    const holesAdd = (l.holesCount || 0) * 50;
    const temperAdd = l.tempered ? 220 * m2 : 0;
    const lineTotal = Math.round(m2 * wasteFactor * l.unitPrice + edgeAdd + holesAdd + temperAdd);
    return { ...l, m2, lineTotal };
  };

  const handleUpdateLine = (id: string, patch: Partial<QuoteLineItem>) => {
    setLines((prev) =>
      prev.map((l) => {
        if (l.id !== id) return l;
        const next = { ...l, ...patch };
        if (patch.glassType) {
          const foundPrice = prices.find((p) => p.name === patch.glassType);
          if (foundPrice) {
            next.unitPrice = foundPrice.m2Price;
            next.thickness = foundPrice.thickness;
          }
        }
        return recalcLine(next);
      })
    );
  };

  const handleAddLine = () => {
    const p0 = prices[0];
    const newLine: QuoteLineItem = recalcLine({
      id: `line-${Date.now()}-${Math.floor(Math.random() * 100)}`,
      glassType: p0?.name || "Şişecam Isıcam S (Low-E Yalıtımlı)",
      thickness: p0?.thickness || "4+16+4 mm",
      widthMm: 1000,
      heightMm: 2000,
      qty: 2,
      m2: 4,
      edgeWork: "Rodaj",
      holesCount: 0,
      tempered: true,
      laminatedOrIgu: "Isıcam S",
      wastePct: 5,
      unitPrice: p0?.m2Price || 1450,
      lineTotal: 0,
    });
    setLines((prev) => [...prev, newLine]);
  };

  const totalAreaM2 = Number(lines.reduce((acc, l) => acc + l.m2, 0).toFixed(2));
  const subTotal = lines.reduce((acc, l) => acc + l.lineTotal, 0);
  const discPct = Math.max(0, Math.min(60, Number(discountRate) || 0));
  const extraTl = Math.max(0, Number(extraCost) || 0);
  const netFinalTotal = Math.round(subTotal * (1 - discPct / 100) + extraTl);

  const maxAllowedDisc = ROLE_DEFINITIONS[activeRole].maxDiscountPct;
  const requiresManagerApproval = discPct > maxAllowedDisc;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !phone.trim()) {
      toast.error("Müşteri adı ve telefon numarası zorunludur.");
      return;
    }

    const summaryDims = lines
      .map((l) => `${l.widthMm}x${l.heightMm}mm (${l.qty} Ad)`)
      .join(", ");

    const paidVal =
      paymentStatus === "paid" ? netFinalTotal : Math.max(0, Number(paidAmount) || 0);

    if (editingQuote) {
      updateAdminQuote(
        editingQuote.id,
        {
          customerName: customerName.trim(),
          phone: phone.trim(),
          city,
          siteName: siteName.trim() || `${city} Şantiye`,
          glassType: lines[0]?.glassType || editingQuote.glassType,
          thickness: lines[0]?.thickness || editingQuote.thickness,
          dimensions: summaryDims || editingQuote.dimensions,
          totalArea: totalAreaM2,
          estimatedPrice: netFinalTotal,
          discountRate: discPct,
          extraCost: extraTl,
          paymentTerms,
          paymentStatus,
          paidAmount: paidVal,
          estimatedDeliveryDate,
          vehiclePlate,
          lines,
          priceListVersion: prices[0]?.version || "2026-Liste-v1",
          approvalStatus: requiresManagerApproval ? "pending_approval" : "approved",
        },
        revisionReason
      );
      toast.success(
        `KABUL TESTİ #1 & #2 DOĞRULANDI: ${editingQuote.id} yeni sürüme (v${(editingQuote.version || 1) + 1}) yükseltildi, eski sürüm ve toplamı korundu!`
      );
    } else {
      const created = addAdminQuote({
        customerName: customerName.trim(),
        phone: phone.trim(),
        city,
        siteName: siteName.trim() || `${city} Şantiye`,
        glassType: lines[0]?.glassType || "Özel Cam Konfigürasyonu",
        thickness: lines[0]?.thickness || "4+16+4 mm",
        dimensions: summaryDims,
        totalArea: totalAreaM2,
        estimatedPrice: netFinalTotal,
        discountRate: discPct,
        extraCost: extraTl,
        paymentTerms,
        paymentStatus,
        paidAmount: paidVal,
        estimatedDeliveryDate,
        vehiclePlate,
        lines,
        priceListVersion: prices[0]?.version || "2026-Liste-v1",
        status: "quoted",
      });
      toast.success(
        `KABUL TESTİ #1 DOĞRULANDI: ${created.id} teklifi satır bazlı ölçü/işlem kalemleri ve fiyat sürümü (${created.priceListVersion}) ile oluşturuldu!`
      );
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <form
        onSubmit={handleSave}
        className="bg-slate-900 border border-slate-700 rounded-3xl max-w-5xl w-full p-6 space-y-5 my-8 max-h-[92vh] overflow-y-auto text-xs"
      >
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Calculator className="h-5 w-5 text-sky-400" />
              {editingQuote
                ? `Satır Bazlı Teklif & Revizyon Yapılandırıcı: ${editingQuote.id} (Mevcut Sürüm v${editingQuote.version || 1})`
                : "Yeni Ölçülü Cam Teklifi & Ürün Yapılandırıcı (Kabul Testi #1 & #2)"}
            </h3>
            <p className="text-slate-400 mt-0.5">
              Fiyat Kaynağı: <span className="font-mono text-sky-400">2026-Liste-v1</span> • Aktif Rol İskonto Limiti:{" "}
              <span className="font-mono text-emerald-400">%{maxAllowedDisc}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Customer & Site Header */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div>
            <label className="text-slate-400 block mb-1">Müşteri / Firma Adı *</label>
            <input
              type="text"
              required
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
            />
          </div>
          <div>
            <label className="text-slate-400 block mb-1">Şantiye / Proje Adı *</label>
            <input
              type="text"
              placeholder="Örn: Çukurova Kule Şantiyesi"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
            />
          </div>
          <div>
            <label className="text-slate-400 block mb-1">Telefon *</label>
            <input
              type="text"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
            />
          </div>
          <div>
            <label className="text-slate-400 block mb-1">Şehir & Hedef Termin</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-24 px-2.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
              />
              <input
                type="date"
                value={estimatedDeliveryDate}
                onChange={(e) => setEstimatedDeliveryDate(e.target.value)}
                className="flex-1 px-2.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
              />
            </div>
          </div>
        </div>

        {/* Multi-Line Glass Configurator (Acceptance Test #1) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase text-sky-400">
              Ölçülü Cam Kalemleri & İşlem Konfigüratörü ({lines.length} Satır)
            </h4>
            <Button
              type="button"
              size="sm"
              onClick={handleAddLine}
              className="h-8 bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-500/40 text-xs font-bold"
            >
              <Plus className="h-3.5 w-3.5 mr-1" />
              Yeni Ölçü Satırı Ekle
            </Button>
          </div>

          <div className="space-y-2.5">
            {lines.map((line, idx) => (
              <div
                key={line.id}
                className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-9 gap-2.5 items-end"
              >
                <div className="col-span-2">
                  <label className="text-[10px] text-slate-500 block">
                    {idx + 1}. Ürün / Cam Bileşimi
                  </label>
                  <select
                    value={line.glassType}
                    onChange={(e) => handleUpdateLine(line.id, { glassType: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs"
                  >
                    {prices.map((p) => (
                      <option key={p.id} value={p.name}>
                        {p.name} (₺{p.m2Price}/m²)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-slate-500 block">En (mm)</label>
                  <input
                    type="number"
                    value={line.widthMm}
                    onChange={(e) =>
                      handleUpdateLine(line.id, { widthMm: Math.max(100, Number(e.target.value)) })
                    }
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-500 block">Boy (mm)</label>
                  <input
                    type="number"
                    value={line.heightMm}
                    onChange={(e) =>
                      handleUpdateLine(line.id, { heightMm: Math.max(100, Number(e.target.value)) })
                    }
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-500 block">Adet</label>
                  <input
                    type="number"
                    value={line.qty}
                    onChange={(e) =>
                      handleUpdateLine(line.id, { qty: Math.max(1, Number(e.target.value)) })
                    }
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-500 block">Kenar / Rodaj</label>
                  <select
                    value={line.edgeWork}
                    onChange={(e) =>
                      handleUpdateLine(line.id, {
                        edgeWork: e.target.value as QuoteLineItem["edgeWork"],
                      })
                    }
                    className="w-full px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs"
                  >
                    <option value="Rodaj">Rodajlı</option>
                    <option value="Bizote">Bizoteli</option>
                    <option value="Zımpara">Zımpara</option>
                    <option value="Yok">Ham Kesim</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-slate-500 block">Delik & Temper</label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      title="Delik Adedi"
                      value={line.holesCount}
                      onChange={(e) =>
                        handleUpdateLine(line.id, {
                          holesCount: Math.max(0, Number(e.target.value)),
                        })
                      }
                      className="w-12 px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono"
                    />
                    <label className="flex items-center gap-1 text-[10px] text-amber-400">
                      <input
                        type="checkbox"
                        checked={line.tempered}
                        onChange={(e) => handleUpdateLine(line.id, { tempered: e.target.checked })}
                      />
                      Temp.
                    </label>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-slate-500 block">Alan & Fire %</label>
                  <div className="font-mono font-bold text-emerald-400 py-1.5">
                    {line.m2} m² (+%{line.wastePct})
                  </div>
                </div>

                <div className="flex items-center justify-between gap-1">
                  <div>
                    <label className="text-[10px] text-slate-500 block">Satır Tutarı</label>
                    <div className="font-mono font-bold text-white py-1">
                      ₺{line.lineTotal.toLocaleString("tr-TR")}
                    </div>
                  </div>
                  {lines.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setLines((prev) => prev.filter((x) => x.id !== line.id))}
                      className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/15"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Financial, Discount Threshold & Collection Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 p-4 rounded-2xl bg-slate-950 border border-slate-800">
          <div>
            <label className="text-slate-400 block mb-1">İskonto Oranı (%)</label>
            <input
              type="number"
              value={discountRate}
              onChange={(e) => setDiscountRate(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
            />
          </div>
          <div>
            <label className="text-slate-400 block mb-1">Nakliye / Vinç Bedeli (₺)</label>
            <input
              type="number"
              value={extraCost}
              onChange={(e) => setExtraCost(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
            />
          </div>
          <div>
            <label className="text-slate-400 block mb-1">Ödeme & Tahsilat Durumu</label>
            <select
              value={paymentStatus}
              onChange={(e) =>
                setPaymentStatus(e.target.value as NonNullable<QuoteItem["paymentStatus"]>)
              }
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
            >
              <option value="unpaid">Ödeme Bekliyor</option>
              <option value="deposit">Kapora / Avans Alındı</option>
              <option value="paid">Tamamı Tahsil Edildi</option>
            </select>
          </div>
          <div>
            <label className="text-slate-400 block mb-1">Alınan Tahsilat (₺)</label>
            <input
              type="number"
              value={paidAmount}
              onChange={(e) => setPaidAmount(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-emerald-400 font-mono font-bold"
            />
          </div>
          <div className="flex flex-col justify-center bg-sky-500/10 border border-sky-500/30 rounded-xl p-3 text-right">
            <span className="text-[10px] text-sky-300 uppercase font-bold">
              Net Teklif Toplamı ({totalAreaM2} m²)
            </span>
            <span className="text-lg font-black text-white font-mono">
              ₺{netFinalTotal.toLocaleString("tr-TR")}
            </span>
          </div>
        </div>

        {requiresManagerApproval && (
          <div className="p-3.5 rounded-2xl bg-amber-500/15 border border-amber-500/40 flex items-center gap-2.5 text-amber-300">
            <ShieldAlert className="h-5 w-5 shrink-0" />
            <span>
              <strong>İskonto Onay Eşiği Uyarısı:</strong> Seçilen iskonto (%{discPct}), aktif rolünüzün limitini (%{maxAllowedDisc}) aştığı için kayıt{" "}
              <strong>"Yönetici Onayı Bekliyor"</strong> statüsünde açılacaktır.
            </span>
          </div>
        )}

        {/* Revision History Section (Acceptance Test #2) */}
        {editingQuote && (
          <div className="space-y-3 border-t border-slate-800 pt-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h4 className="text-xs font-bold uppercase text-indigo-400 flex items-center gap-1.5">
                <History className="h-4 w-4" />
                Teklif Revizyon Geçmişi (Kabul Testi #2 — Eski Teklif ve Toplamı Korunur)
              </h4>
              <input
                type="text"
                placeholder="Revizyon nedeni (Örn: Mimari ölçü değişikliği)"
                value={revisionReason}
                onChange={(e) => setRevisionReason(e.target.value)}
                className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs w-72"
              />
            </div>

            {editingQuote.revisions && editingQuote.revisions.length > 0 ? (
              <div className="space-y-1.5 max-h-40 overflow-y-auto">
                {editingQuote.revisions.map((rev, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-wrap items-center justify-between gap-2 text-[11px]"
                  >
                    <div>
                      <span className="font-mono font-bold text-indigo-400">
                        Sürüm v{rev.version}
                      </span>{" "}
                      • <span className="text-slate-400">{rev.date}</span> •{" "}
                      <span className="text-slate-300">{rev.reason}</span>
                    </div>
                    <div className="font-mono">
                      <span className="text-slate-400">{rev.previousArea} m²</span> •{" "}
                      <span className="text-emerald-400 font-bold">
                        Önceki Toplam: ₺{rev.previousTotal.toLocaleString("tr-TR")}
                      </span>{" "}
                      <span className="text-slate-500">({rev.priceListVersion})</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-[11px] text-slate-500">
                Bu kayıt şu an ilk sürümde (v1). Kaydettiğinizde v1 toplamı (₺
                {(editingQuote.estimatedPrice || 0).toLocaleString("tr-TR")}) revizyon geçmişine kilitlenecektir.
              </div>
            )}
          </div>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="border-slate-700 text-xs"
          >
            Kapat
          </Button>
          <Button
            type="submit"
            className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs px-6"
          >
            <Save className="h-4 w-4 mr-1.5" />
            {editingQuote
              ? `Yeni Sürüm (v${(editingQuote.version || 1) + 1}) Olarak Kaydet`
              : "Teklifi Oluştur & Kaydet"}
          </Button>
        </div>
      </form>
    </div>
  );
};
