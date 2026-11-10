import React, { useState, useEffect } from "react";
import {
  X,
  Plus,
  Trash2,
  Save,
  History,
  Calculator,
  ShieldAlert,
  Printer,
  Sparkles,
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
import { printProposalDocument } from "./PrintHelpers";
import { toast } from "sonner";

export interface PrefillCustomerInfo {
  name: string;
  phone: string;
  siteName?: string;
}

interface QuoteConfiguratorModalProps {
  isOpen: boolean;
  editingQuote: QuoteItem | null; // null = create new quote with line items
  prefillCustomer?: PrefillCustomerInfo | null;
  prices: FactoryPriceItem[];
  activeRole: UserRole;
  onClose: () => void;
}

const QUICK_SIZE_PRESETS = [
  { label: "Salon Pencere (150x150 cm)", w: 1500, h: 1500, qty: 2 },
  { label: "Oda Pencere (120x140 cm)", w: 1200, h: 1400, qty: 3 },
  { label: "Balkon Kapısı (80x210 cm)", w: 800, h: 2100, qty: 1 },
  { label: "Sürme / Fransız (180x220 cm)", w: 1800, h: 2200, qty: 1 },
  { label: "Banyo Vasistas (60x60 cm)", w: 600, h: 600, qty: 1 },
];

export const QuoteConfiguratorModal: React.FC<QuoteConfiguratorModalProps> = ({
  isOpen,
  editingQuote,
  prefillCustomer,
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
            glassType:
              editingQuote.glassType ||
              prices[0]?.name ||
              "Fıratpen Selenit 75 PVC Pencere (4+16+4 Isıcam)",
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
      setCustomerName(prefillCustomer?.name || "");
      setPhone(prefillCustomer?.phone || "");
      setCity("Adana");
      setSiteName(prefillCustomer?.siteName || "");
      setPaymentTerms("%50 Avans + Teslimde");
      setPaymentStatus("unpaid");
      setPaidAmount("0");
      setDiscountRate("0");
      setExtraCost("0");
      setEstimatedDeliveryDate(new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10));
      setVehiclePlate("01 AP 322 (Acarpen Montaj & Sevkiyat Aracı)");
      const p0 = prices[0];
      setLines([
        {
          id: `line-${Date.now()}`,
          glassType: p0?.name || "Fıratpen Selenit 75 PVC Pencere (4+16+4 Isıcam)",
          thickness: p0?.thickness || "4+16+4 mm",
          widthMm: 1500,
          heightMm: 1500,
          qty: 2,
          m2: 4.5,
          edgeWork: "Rodaj",
          holesCount: 0,
          tempered: false,
          laminatedOrIgu: "Isıcam S",
          wastePct: 5,
          unitPrice: p0?.m2Price || 1450,
          lineTotal: Math.round(4.5 * 1.05 * (p0?.m2Price || 1450) + 240),
        },
      ]);
    }
  }, [isOpen, editingQuote, prefillCustomer, prices]);

  if (!isOpen) return null;

  const recalcLine = (l: QuoteLineItem): QuoteLineItem => {
    const rawM2 = Math.max(0.25, (l.widthMm / 1000) * (l.heightMm / 1000) * l.qty);
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

  const handleAddLine = (preset?: { w: number; h: number; qty: number }) => {
    const p0 = prices[0];
    const newLine: QuoteLineItem = recalcLine({
      id: `line-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      glassType: p0?.name || "Fıratpen Selenit 75 PVC Pencere (4+16+4 Isıcam)",
      thickness: p0?.thickness || "4+16+4 mm",
      widthMm: preset?.w || 1200,
      heightMm: preset?.h || 1400,
      qty: preset?.qty || 2,
      m2: 3.36,
      edgeWork: "Rodaj",
      holesCount: 0,
      tempered: false,
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

  const saveQuoteRecord = (shouldPrintAfterSave: boolean) => {
    if (!customerName.trim() || !phone.trim()) {
      toast.error("Lütfen müşteri adı ve telefon numarasını girin.");
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
          siteName: siteName.trim() || `${city} Projesi`,
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
        `${editingQuote.id} teklifi yeni sürüme (v${(editingQuote.version || 1) + 1}) güncellendi.`
      );
      if (shouldPrintAfterSave) {
        printProposalDocument({
          ...editingQuote,
          customerName: customerName.trim(),
          phone: phone.trim(),
          city,
          siteName: siteName.trim() || `${city} Projesi`,
          glassType: lines[0]?.glassType || editingQuote.glassType,
          dimensions: summaryDims || editingQuote.dimensions,
          totalArea: totalAreaM2,
          estimatedPrice: netFinalTotal,
          discountRate: discPct,
          extraCost: extraTl,
          lines,
        });
      }
    } else {
      const created = addAdminQuote({
        customerName: customerName.trim(),
        phone: phone.trim(),
        city,
        siteName: siteName.trim() || `${city} Projesi`,
        glassType: lines[0]?.glassType || "Fıratpen / Winsa / Pimapen PVC & Isıcam",
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
      toast.success(`${created.id} numaralı teklif başarıyla kaydedildi!`);
      if (shouldPrintAfterSave) {
        printProposalDocument(created);
      }
    }
    onClose();
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveQuoteRecord(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <form
        onSubmit={handleSave}
        className="bg-slate-900 border-2 border-slate-700 rounded-3xl max-w-5xl w-full p-6 space-y-5 my-6 max-h-[92vh] overflow-y-auto text-sm shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b-2 border-slate-800 pb-4">
          <div>
            <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
              <Calculator className="h-5 w-5 text-sky-400" />
              {editingQuote
                ? `Teklifi Düzenle / Revize Et: ${editingQuote.id} (Sürüm v${editingQuote.version || 1})`
                : "Yeni Ölçülü Teklif Hazırla (PVC Doğrama & Cam)"}
            </h3>
            <p className="text-xs text-slate-300 mt-1">
              Müşteri bilgilerini girin, pencere/cam ölçü satırlarını ekleyin ve anında net tutarı hesaplayın. Maksimum iskonto yetkiniz:{" "}
              <strong className="font-mono text-emerald-400">%{maxAllowedDisc}</strong>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2.5 rounded-xl bg-slate-800 text-slate-200 hover:bg-rose-600 hover:text-white transition-colors"
            title="Kapat"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Step 1: Customer & Site Header */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
          <div className="text-xs font-extrabold uppercase tracking-wide text-sky-400">
            1. Adım — Müşteri ve Proje Bilgileri
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Müşteri / Firma Adı *
              </label>
              <input
                type="text"
                required
                placeholder="Örn: Ahmet Yılmaz / Yılmaz İnşaat"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Telefon Numarası *
              </label>
              <input
                type="text"
                required
                placeholder="05XX XXX XX XX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Mahalle / Şantiye / Adres Notu
              </label>
              <input
                type="text"
                placeholder="Örn: Çukurova Güzelyalı Mah."
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Şehir & Teslim Tarihi
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-24 px-2.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm"
                />
                <input
                  type="date"
                  value={estimatedDeliveryDate}
                  onChange={(e) => setEstimatedDeliveryDate(e.target.value)}
                  className="flex-1 px-2.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-xs"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Step 2: Multi-Line Product & Glass Configurator */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h4 className="text-xs font-extrabold uppercase tracking-wide text-sky-400">
                2. Adım — Ölçü ve Ürün Kalemleri ({lines.length} Kalem • Toplam {totalAreaM2} m²)
              </h4>
            </div>
            <Button
              type="button"
              size="sm"
              onClick={() => handleAddLine()}
              className="h-9 bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs rounded-xl px-4"
            >
              <Plus className="h-4 w-4 mr-1" />
              Boş Ölçü Satırı Ekle
            </Button>
          </div>

          {/* Quick Size Presets */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-bold text-slate-400 flex items-center gap-1 mr-1">
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              Hazır Ölçü Ekle:
            </span>
            {QUICK_SIZE_PRESETS.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => handleAddLine(preset)}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-sky-500 hover:text-white text-slate-200 text-xs font-bold transition-colors"
              >
                + {preset.label}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {lines.map((line, idx) => (
              <div
                key={line.id}
                className="p-4 rounded-2xl bg-slate-950 border-2 border-slate-800 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-10 gap-3 items-end"
              >
                <div className="col-span-2 lg:col-span-3">
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    {idx + 1}. Marka / Seri / Cam Seçimi
                  </label>
                  <select
                    value={line.glassType}
                    onChange={(e) => handleUpdateLine(line.id, { glassType: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-bold"
                  >
                    {prices.map((p) => (
                      <option key={p.id} value={p.name}>
                        {p.name} — ₺{p.m2Price}/m²
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">En (mm)</label>
                  <input
                    type="number"
                    value={line.widthMm}
                    onChange={(e) =>
                      handleUpdateLine(line.id, { widthMm: Math.max(100, Number(e.target.value)) })
                    }
                    className="w-full px-2.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-sm font-bold"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Boy (mm)</label>
                  <input
                    type="number"
                    value={line.heightMm}
                    onChange={(e) =>
                      handleUpdateLine(line.id, { heightMm: Math.max(100, Number(e.target.value)) })
                    }
                    className="w-full px-2.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-sm font-bold"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Adet</label>
                  <input
                    type="number"
                    value={line.qty}
                    onChange={(e) =>
                      handleUpdateLine(line.id, { qty: Math.max(1, Number(e.target.value)) })
                    }
                    className="w-full px-2.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-sm font-bold"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Kenar İşlem</label>
                  <select
                    value={line.edgeWork}
                    onChange={(e) =>
                      handleUpdateLine(line.id, {
                        edgeWork: e.target.value as QuoteLineItem["edgeWork"],
                      })
                    }
                    className="w-full px-2 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-bold"
                  >
                    <option value="Rodaj">Rodajlı</option>
                    <option value="Bizote">Bizoteli</option>
                    <option value="Zımpara">Zımpara</option>
                    <option value="Yok">Standart</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Temperli Cam</label>
                  <label className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 cursor-pointer text-xs font-bold text-amber-400">
                    <input
                      type="checkbox"
                      checked={line.tempered}
                      onChange={(e) => handleUpdateLine(line.id, { tempered: e.target.checked })}
                      className="h-4 w-4 accent-sky-600"
                    />
                    <span>{line.tempered ? "Evet" : "Hayır"}</span>
                  </label>
                </div>

                <div className="col-span-2 flex items-center justify-between gap-2 bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5">
                  <div>
                    <div className="text-[11px] font-bold text-slate-400">
                      {line.m2} m² (+%{line.wastePct} fire)
                    </div>
                    <div className="font-mono text-base font-black text-emerald-400">
                      ₺{line.lineTotal.toLocaleString("tr-TR")}
                    </div>
                  </div>
                  {lines.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setLines((prev) => prev.filter((x) => x.id !== line.id))}
                      className="p-2 rounded-lg bg-rose-500/15 text-rose-400 hover:bg-rose-600 hover:text-white transition-colors"
                      title="Satırı Sil"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Step 3: Financial, Discount & Collection Summary */}
        <div className="p-4 rounded-2xl bg-slate-950 border-2 border-slate-800 space-y-3">
          <div className="text-xs font-extrabold uppercase tracking-wide text-emerald-400">
            3. Adım — İskonto, Ödeme Durumu ve Net Toplam
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                İskonto Oranı (%)
              </label>
              <input
                type="number"
                value={discountRate}
                onChange={(e) => setDiscountRate(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-sm font-bold"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Montaj / Nakliye Ek Ücreti (₺)
              </label>
              <input
                type="number"
                value={extraCost}
                onChange={(e) => setExtraCost(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-sm font-bold"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Tahsilat Durumu</label>
              <select
                value={paymentStatus}
                onChange={(e) =>
                  setPaymentStatus(e.target.value as NonNullable<QuoteItem["paymentStatus"]>)
                }
                className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-bold"
              >
                <option value="unpaid">Ödeme Bekliyor</option>
                <option value="deposit">Kapora / Avans Alındı</option>
                <option value="paid">Tamamı Tahsil Edildi</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Alınan Kapora / Ödeme (₺)
              </label>
              <input
                type="number"
                value={paidAmount}
                onChange={(e) => setPaidAmount(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-emerald-400 font-mono text-sm font-black"
              />
            </div>
            <div className="flex flex-col justify-center bg-sky-500/15 border-2 border-sky-500/40 rounded-xl p-3 text-right">
              <span className="text-[11px] text-sky-400 uppercase font-extrabold">
                Net Teklif Toplamı ({totalAreaM2} m²)
              </span>
              <span className="text-2xl font-black text-white font-mono">
                ₺{netFinalTotal.toLocaleString("tr-TR")}
              </span>
            </div>
          </div>
        </div>

        {requiresManagerApproval && (
          <div className="p-4 rounded-2xl bg-amber-500/15 border-2 border-amber-500/50 flex items-center gap-3 text-amber-300 text-xs font-bold">
            <ShieldAlert className="h-5 w-5 shrink-0" />
            <span>
              <strong>İskonto Onay Uyarısı:</strong> Girilen iskonto (%{discPct}), rol limitinizi (%{maxAllowedDisc}) aştığı için teklif{" "}
              <strong>"Yönetici Onayı Bekliyor"</strong> olarak kaydedilecektir.
            </span>
          </div>
        )}

        {/* Revision History Section */}
        {editingQuote && (
          <div className="space-y-3 border-t-2 border-slate-800 pt-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h4 className="text-xs font-extrabold uppercase text-indigo-400 flex items-center gap-1.5">
                <History className="h-4 w-4" />
                Revizyon Geçmişi (Önceki Sürümler Otomatik Saklanır)
              </h4>
              <input
                type="text"
                placeholder="Revizyon nedeni (Örn: Ölçü güncellendi)"
                value={revisionReason}
                onChange={(e) => setRevisionReason(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs w-72"
              />
            </div>

            {editingQuote.revisions && editingQuote.revisions.length > 0 ? (
              <div className="space-y-1.5 max-h-40 overflow-y-auto">
                {editingQuote.revisions.map((rev, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs"
                  >
                    <div>
                      <span className="font-mono font-bold text-indigo-400">
                        Sürüm v{rev.version}
                      </span>{" "}
                      • <span className="text-slate-400">{rev.date}</span> •{" "}
                      <span className="text-slate-200 font-semibold">{rev.reason}</span>
                    </div>
                    <div className="font-mono">
                      <span className="text-slate-400">{rev.previousArea} m²</span> •{" "}
                      <span className="text-emerald-400 font-bold">
                        Önceki Tutar: ₺{rev.previousTotal.toLocaleString("tr-TR")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-slate-400">
                Bu teklif ilk sürümde (v1). Kaydettiğinizde v1 tutarı (₺
                {(editingQuote.estimatedPrice || 0).toLocaleString("tr-TR")}) geçmişe kaydedilir.
              </div>
            )}
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex flex-wrap justify-end gap-2.5 pt-2 border-t border-slate-800">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="h-11 border-slate-700 font-bold text-xs px-5 rounded-xl"
          >
            Vazgeç
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => saveQuoteRecord(true)}
            className="h-11 border-sky-500/50 text-sky-400 font-bold text-xs px-5 rounded-xl"
          >
            <Printer className="h-4 w-4 mr-1.5" />
            Kaydet ve A4 Teklif Yazdır
          </Button>
          <Button
            type="submit"
            className="h-11 bg-sky-500 hover:bg-sky-400 text-white font-extrabold text-sm px-7 rounded-xl shadow-lg"
          >
            <Save className="h-4 w-4 mr-1.5" />
            {editingQuote
              ? `Güncelle (v${(editingQuote.version || 1) + 1} Kaydet)`
              : "Teklifi Kaydet"}
          </Button>
        </div>
      </form>
    </div>
  );
};
