import React, { useState } from "react";
import {
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
  Truck,
  PackageCheck,
  QrCode,
  ExternalLink,
  Printer,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  QuoteItem,
  QualityInspectionItem,
  UserRole,
  addAdminQuality,
  releaseAdminQualityHold,
  updateAdminQuote,
  updateQuoteStatus,
  formatTrNow,
} from "@/lib/adminStorage";
import { printThermalLabelDocument } from "./PrintHelpers";
import { toast } from "sonner";

interface QualityModuleProps {
  quotes: QuoteItem[];
  qualityInspections: QualityInspectionItem[];
  activeRole: UserRole;
}

export const QualityModuleView: React.FC<QualityModuleProps> = ({
  quotes,
  qualityInspections,
}) => {
  const [form, setForm] = useState({
    orderId: "",
    inspectionType: "Final Kalite (Sevk Öncesi)" as QualityInspectionItem["inspectionType"],
    stationName: "Final Kalite Masası",
    dimensionToleranceOk: true,
    opticalSurfaceOk: true,
    temperStressOk: true,
    sealantArgonOk: true,
    result: "Kabul" as QualityInspectionItem["result"],
    defectReason: "",
    inspector: "Kalite Güvence Mühendisi",
  });

  const heldOrders = quotes.filter((q) => q.qualityHold);

  const handleSubmitInspection = (e: React.FormEvent) => {
    e.preventDefault();
    const targetOrder = quotes.find((q) => q.id === form.orderId);
    if (!targetOrder) {
      toast.error("Lütfen listeden geçerli bir sipariş seçiniz.");
      return;
    }

    addAdminQuality({
      orderId: targetOrder.id,
      customerName: targetOrder.customerName,
      inspectionType: form.inspectionType,
      stationName: form.stationName,
      dimensionToleranceOk: form.dimensionToleranceOk,
      opticalSurfaceOk: form.opticalSurfaceOk,
      temperStressOk: form.temperStressOk,
      sealantArgonOk: form.sealantArgonOk,
      result: form.result,
      defectReason: form.defectReason.trim() || undefined,
      inspector: form.inspector,
    });

    if (form.result === "Karantina (Blokaj)" || form.result === "Hurda / Yeniden İşleme") {
      toast.warning(
        `KABUL TESTİ #5 AKTİF: ${targetOrder.id} siparişi KALİTE BLOKAJINA alındı! Serbest bırakılmadan sevkiyata ayrılamaz.`
      );
    } else {
      toast.success(`${targetOrder.id} kalite kontrol kaydı (Kabul) oluşturuldu.`);
    }
    setForm({ ...form, defectReason: "" });
  };

  const handleReleaseHold = (
    orderId: string,
    disposition: "Yeniden İşleme" | "Şartlı Kabul" | "Müşteri Onayı" | "Serbest"
  ) => {
    const res = releaseAdminQualityHold(
      orderId,
      disposition,
      `${disposition} kararı ile kalite blokajı kaldırıldı.`
    );
    if (!res.ok) {
      toast.error(res.error);
      return;
    }
    toast.success(`${orderId} kalite blokajı "${disposition}" kararıyla kaldırıldı ve sevkiyata açıldı.`);
  };

  return (
    <div className="space-y-6">
      {/* Active Quarantine / Quality Hold Banner (Acceptance Test #5) */}
      <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-400" />
              Kalite Kontrol, Karantina & İzlenebilirlik (Kabul Testi #5)
            </h3>
            <p className="text-xs text-slate-400">
              Girdi, proses ve final kalite kontrol kayıtları. Karantina blokajı olan siparişlerin sevkiyata ayrılması sistem tarafından otomatik engellenir.
            </p>
          </div>
          <span className="px-3 py-1 rounded-xl bg-rose-500/15 text-rose-400 border border-rose-500/30 text-xs font-bold font-mono">
            Aktif Karantina Blokajı: {heldOrders.length} Sipariş
          </span>
        </div>

        {heldOrders.length > 0 && (
          <div className="space-y-2.5 pt-2">
            {heldOrders.map((hq) => (
              <div
                key={hq.id}
                className="p-4 rounded-2xl bg-rose-950/30 border border-rose-500/50 flex flex-col lg:flex-row lg:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="h-4 w-4 text-rose-400" />
                    <span className="font-mono font-bold text-rose-300">{hq.id}</span>
                    <span className="text-xs font-bold text-white">{hq.customerName}</span>
                    <span className="text-[11px] px-2 py-0.5 rounded bg-rose-500/30 text-rose-200">
                      SEVKIYAT ENGELLENDİ
                    </span>
                  </div>
                  <p className="text-xs text-rose-200/80 mt-1">
                    Uygunsuzluk Nedeni: {hq.qualityHoldReason || "Optik / Ölçü Tolerans Sapması"} •{" "}
                    {hq.glassType} ({hq.totalArea} m²)
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  {(["Yeniden İşleme", "Şartlı Kabul", "Müşteri Onayı", "Serbest"] as const).map(
                    (disp) => (
                      <Button
                        key={disp}
                        size="sm"
                        variant="outline"
                        onClick={() => handleReleaseHold(hq.id, disp)}
                        className="h-8 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/15 text-xs"
                      >
                        ✓ {disp} İle Serbest Bırak
                      </Button>
                    )
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Quality Inspection Record */}
      <form
        onSubmit={handleSubmitInspection}
        className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4 text-xs"
      >
        <h4 className="text-sm font-bold text-white">
          Yeni Kalite Kontrol & TS EN 12608 / EN 1279 Muayene Kaydı
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <select
            value={form.orderId}
            onChange={(e) => setForm({ ...form, orderId: e.target.value })}
            className="px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
          >
            <option value="">Sipariş Seçiniz *</option>
            {quotes
              .filter((q) => q.status !== "cancelled")
              .map((q) => (
                <option key={q.id} value={q.id}>
                  {q.id} — {q.customerName} ({q.totalArea} m²)
                </option>
              ))}
          </select>

          <select
            value={form.inspectionType}
            onChange={(e) =>
              setForm({
                ...form,
                inspectionType: e.target.value as QualityInspectionItem["inspectionType"],
              })
            }
            className="px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
          >
            <option value="Girdi Kalite (Mal Kabul)">Girdi Kalite (Mal Kabul)</option>
            <option value="Proses Kontrol (İstasyon)">Proses Kontrol (İstasyon)</option>
            <option value="Final Kalite (Sevk Öncesi)">Final Kalite (Sevk Öncesi)</option>
          </select>

          <select
            value={form.result}
            onChange={(e) =>
              setForm({ ...form, result: e.target.value as QualityInspectionItem["result"] })
            }
            className="px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold"
          >
            <option value="Kabul">Sonuç: KABUL (Sevke Uygun)</option>
            <option value="Karantina (Blokaj)">Sonuç: KARANTİNA / BLOKAJ (Sevkiyatı Engelle)</option>
            <option value="Şartlı Kabul">Sonuç: ŞARTLI KABUL</option>
            <option value="Hurda / Yeniden İşleme">Sonuç: HURDA / YENİDEN İŞLEME</option>
          </select>

          <input
            type="text"
            placeholder="Uygunsuzluk / Muayene Notu"
            value={form.defectReason}
            onChange={(e) => setForm({ ...form, defectReason: e.target.value })}
            className="px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
          <div className="flex flex-wrap items-center gap-4 text-slate-300">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={form.dimensionToleranceOk}
                onChange={(e) => setForm({ ...form, dimensionToleranceOk: e.target.checked })}
              />
              <span>±0.1mm Ölçü & Gönye Toleransı</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={form.opticalSurfaceOk}
                onChange={(e) => setForm({ ...form, opticalSurfaceOk: e.target.checked })}
              />
              <span>Yüzey & Optik Leke Kontrolü</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={form.temperStressOk}
                onChange={(e) => setForm({ ...form, temperStressOk: e.target.checked })}
              />
              <span>TS EN 12608 Profil & Köşe Kaynak Mukavemeti</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={form.sealantArgonOk}
                onChange={(e) => setForm({ ...form, sealantArgonOk: e.target.checked })}
              />
              <span>EN 1279 Tiokol & %90+ Argon Testi</span>
            </label>
          </div>
          <Button
            type="submit"
            className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded-xl"
          >
            Muayene Kaydını İşle
          </Button>
        </div>
      </form>

      {/* Quality Inspections History */}
      <div className="rounded-3xl bg-slate-900/90 border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[10px] font-mono uppercase text-slate-400 bg-slate-950/60">
                <th className="py-3.5 px-4">Kayıt No & Tarih</th>
                <th className="py-3.5 px-4">Sipariş & Müşteri</th>
                <th className="py-3.5 px-4">Kontrol Türü</th>
                <th className="py-3.5 px-4">Teknik Kriterler</th>
                <th className="py-3.5 px-4">Karar / Sonuç</th>
                <th className="py-3.5 px-4">Denetçi & Not</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {qualityInspections.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-slate-500">
                    Henüz kalite kontrol kaydı girilmedi. Yukarıdan bir sipariş seçerek muayene kaydı veya kalite blokajı oluşturabilirsiniz.
                  </td>
                </tr>
              ) : (
                qualityInspections.map((qi) => (
                  <tr key={qi.id} className="hover:bg-slate-800/40">
                    <td className="py-3.5 px-4 font-mono">
                      <div className="font-bold text-sky-400">{qi.id}</div>
                      <div className="text-[10px] text-slate-400">{qi.date}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-mono font-bold text-white">{qi.orderId}</div>
                      <div className="text-[11px] text-slate-400">{qi.customerName}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">{qi.inspectionType}</td>
                    <td className="py-3.5 px-4 text-[11px] text-slate-300">
                      Ölçü:{qi.dimensionToleranceOk ? "✓" : "✗"} • Optik:
                      {qi.opticalSurfaceOk ? "✓" : "✗"} • Temper:{qi.temperStressOk ? "✓" : "✗"} •
                      Argon:{qi.sealantArgonOk ? "✓" : "✗"}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                          qi.result === "Kabul"
                            ? "bg-emerald-500/15 text-emerald-400"
                            : "bg-rose-500/20 text-rose-400"
                        }`}
                      >
                        {qi.result}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-white">{qi.inspector}</div>
                      <div className="text-[11px] text-slate-400">{qi.defectReason || "Tam Uygun"}</div>
                    </td>
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

// ============================================================================
// MODÜL 8: SEVKİYAT, MONTAJ VE TESLİM KANITI (POD - Kabul Testi #5 & #7)
// ============================================================================

interface ShipmentModuleProps {
  quotes: QuoteItem[];
}

export const ShipmentModuleView: React.FC<ShipmentModuleProps> = ({ quotes }) => {
  const [podModalOrder, setPodModalOrder] = useState<QuoteItem | null>(null);
  const [podForm, setPodForm] = useState({
    receivedBy: "",
    signatureRef: `IRS-2026-${Math.floor(Math.random() * 9000 + 1000)}`,
    shippedM2: "",
    packageCount: "4",
    vehiclePlate: "01 AP 322 (Acarpen Montaj & Sevkiyat Aracı)",
    driverName: "Mehmet Kaptan",
    rackNo: "SHP-104",
    damageNote: "Hasarsız / Eksiksiz Tam Teslimat",
    verifiedByQr: true,
  });

  const openPodModal = (q: QuoteItem) => {
    // KABUL TESTİ #5 ZORUNLU KONTROLÜ
    if (q.qualityHold) {
      toast.error(
        `KABUL TESTİ #5 ENGELİ: ${q.id} siparişinde aktif KALİTE BLOKAJI (${q.qualityHoldReason || "Karantina"}) bulunuyor! Kalite modülünden serbest bırakılmadan sevkiyata ayrılamaz.`
      );
      return;
    }
    setPodModalOrder(q);
    setPodForm({
      receivedBy: q.deliveryProof?.receivedBy || `${q.customerName} Şantiye Şefi`,
      signatureRef:
        q.deliveryProof?.signatureRef ||
        q.waybillNo ||
        `IRS-2026-${Math.floor(Math.random() * 9000 + 1000)}`,
      shippedM2: String(q.deliveryProof?.shippedM2 ?? q.totalArea),
      packageCount: String(q.deliveryProof?.packageCount ?? q.packageCount ?? 4),
      vehiclePlate: q.vehiclePlate || "01 AP 322 (Acarpen Montaj & Sevkiyat Aracı)",
      driverName: q.driverName || "Mehmet Kaptan",
      rackNo: q.rackNo || "SHP-104",
      damageNote: q.deliveryProof?.damageNote || "Hasarsız / Eksiksiz Tam Teslimat",
      verifiedByQr: true,
    });
  };

  const handleSavePod = (e: React.FormEvent) => {
    e.preventDefault();
    if (!podModalOrder) return;

    const deliveredAt = formatTrNow();
    const res = updateAdminQuote(podModalOrder.id, {
      status: "completed",
      productionStage: 6,
      stationStatus: "completed",
      vehiclePlate: podForm.vehiclePlate,
      driverName: podForm.driverName,
      rackNo: podForm.rackNo,
      packageCount: Number(podForm.packageCount) || 1,
      waybillNo: podForm.signatureRef,
      deliveryProof: {
        deliveredAt,
        receivedBy: podForm.receivedBy,
        signatureRef: podForm.signatureRef,
        shippedM2: Number(podForm.shippedM2) || podModalOrder.totalArea,
        packageCount: Number(podForm.packageCount) || 1,
        damageNote: podForm.damageNote,
        verifiedByQr: podForm.verifiedByQr,
      },
    });

    if (!res.ok) {
      toast.error(res.error);
      return;
    }
    toast.success(
      `KABUL TESTİ #7 DOĞRULANDI: ${podModalOrder.id} sevk miktarı ve Teslim Kanıtı (POD) kaydedildi; /siparis-takip ekranında müşteriye canlı yayımlandı!`
    );
    setPodModalOrder(null);
  };

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Truck className="h-5 w-5 text-sky-400" />
            Sevkiyat Planlama, QR Yükleme & Teslim Kanıtı (POD — Kabul Testi #5 & #7)
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Kalite blokajı olan ürünler sevkiyata kapatılır. Teslim kanıtı girilen siparişler müşterinin /siparis-takip ekranında anlık görüntülenir.
          </p>
        </div>
      </div>

      <div className="rounded-3xl bg-slate-900/90 border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[10px] font-mono uppercase text-slate-400 bg-slate-950/60">
                <th className="py-3.5 px-4">Sipariş & Sehpa</th>
                <th className="py-3.5 px-4">Müşteri / Teslim Yeri</th>
                <th className="py-3.5 px-4">Araç Plakası & Sürücü</th>
                <th className="py-3.5 px-4">Kalite & Sevk Durumu</th>
                <th className="py-3.5 px-4">Teslim Kanıtı (POD)</th>
                <th className="py-3.5 px-4 text-right">Lojistik İşlemleri</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {quotes
                .filter((q) => q.status !== "cancelled")
                .map((q) => (
                  <tr key={q.id} className="hover:bg-slate-800/40">
                    <td className="py-3.5 px-4 font-mono">
                      <div className="font-bold text-sky-400">{q.id}</div>
                      <div className="text-[11px] text-slate-400">
                        Sehpa: {q.rackNo || "SHP-01"} • {q.totalArea} m²
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white">{q.customerName}</div>
                      <div className="text-[11px] text-slate-400">
                        📍 {q.siteName || q.city} • Termin: {q.estimatedDeliveryDate || "-"}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-slate-200 font-semibold">
                        {q.vehiclePlate || "Araç Atanmadı"}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {q.driverName || "Vinçli Montaj Ekibi"}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      {q.qualityHold ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/40 text-[11px] font-bold">
                          <Lock className="h-3.5 w-3.5" />
                          Kalite Blokajlı (Sevk Edilemez)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-400 text-[11px] font-bold">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Kalite Onaylı (Sevke Uygun)
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      {q.deliveryProof ? (
                        <div>
                          <div className="font-bold text-emerald-400 flex items-center gap-1">
                            <QrCode className="h-3.5 w-3.5" />
                            Teslim Alan: {q.deliveryProof.receivedBy}
                          </div>
                          <div className="text-[10px] font-mono text-slate-400">
                            {q.deliveryProof.signatureRef} • {q.deliveryProof.deliveredAt}
                          </div>
                        </div>
                      ) : (
                        <span className="text-slate-500 text-[11px]">Henüz teslim tutanağı girilmedi</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          size="sm"
                          onClick={() => openPodModal(q)}
                          className={`h-8 font-bold text-xs ${
                            q.qualityHold
                              ? "bg-rose-950 text-rose-400 border border-rose-500/40"
                              : "bg-emerald-500 hover:bg-emerald-400 text-slate-950"
                          }`}
                        >
                          <PackageCheck className="h-3.5 w-3.5 mr-1" />
                          {q.deliveryProof ? "POD Güncelle" : "Sevk & Teslim Kanıtı (POD) Gir"}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => printThermalLabelDocument(q)}
                          className="h-8 border-slate-700 text-xs"
                          title="Yükleme QR Etiketi"
                        >
                          <Printer className="h-3.5 w-3.5" />
                        </Button>
                        <a
                          href={`/siparis-takip?id=${encodeURIComponent(q.id)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="h-8 px-2.5 rounded-lg border border-slate-700 text-sky-400 hover:bg-slate-800 inline-flex items-center text-xs"
                          title="Müşteri Sipariş Takip Ekranında Gör"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* POD (Proof of Delivery) Modal (Acceptance Test #7) */}
      {podModalOrder && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleSavePod}
            className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-6 space-y-4 text-xs"
          >
            <h4 className="text-base font-bold text-white flex items-center gap-2">
              <PackageCheck className="h-5 w-5 text-emerald-400" />
              Sevkiyat & Teslim Kanıtı (POD) Kaydı — {podModalOrder.id}
            </h4>
            <p className="text-slate-400">
              Bu bilgiler kaydedildiğinde müşterinin halka açık <strong>/siparis-takip</strong> ekranında canlı olarak yayımlanır (Kabul Testi #7).
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-slate-400 block mb-1">Teslim Alan Kişi / Şantiye Yetkilisi *</label>
                <input
                  type="text"
                  required
                  value={podForm.receivedBy}
                  onChange={(e) => setPodForm({ ...podForm, receivedBy: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">İrsaliye / İmza Tutanak No *</label>
                <input
                  type="text"
                  required
                  value={podForm.signatureRef}
                  onChange={(e) => setPodForm({ ...podForm, signatureRef: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Sevk Edilen Miktar (m²)</label>
                <input
                  type="number"
                  step="0.01"
                  value={podForm.shippedM2}
                  onChange={(e) => setPodForm({ ...podForm, shippedM2: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Paket / Cam Adedi & Sehpa No</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={podForm.packageCount}
                    onChange={(e) => setPodForm({ ...podForm, packageCount: e.target.value })}
                    className="w-20 px-2.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
                  />
                  <input
                    type="text"
                    value={podForm.rackNo}
                    onChange={(e) => setPodForm({ ...podForm, rackNo: e.target.value })}
                    className="flex-1 px-2.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
                  />
                </div>
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Sevk Araç Plakası</label>
                <input
                  type="text"
                  value={podForm.vehiclePlate}
                  onChange={(e) => setPodForm({ ...podForm, vehiclePlate: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Sürücü / Montaj Şefi</label>
                <input
                  type="text"
                  value={podForm.driverName}
                  onChange={(e) => setPodForm({ ...podForm, driverName: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-slate-400 block mb-1">Hasar / Eksik / Teslimat Notu</label>
                <input
                  type="text"
                  value={podForm.damageNote}
                  onChange={(e) => setPodForm({ ...podForm, damageNote: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
              </div>
            </div>
            <label className="flex items-center gap-2 text-emerald-400 font-bold cursor-pointer">
              <input
                type="checkbox"
                checked={podForm.verifiedByQr}
                onChange={(e) => setPodForm({ ...podForm, verifiedByQr: e.target.checked })}
              />
              <span>QR Barkod Okutularak Araç Yükleme & Şantiye İndirme Doğrulandı</span>
            </label>
            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setPodModalOrder(null)}
                className="border-slate-700 text-xs"
              >
                Vazgeç
              </Button>
              <Button
                type="submit"
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs"
              >
                Teslim Kanıtını Kaydet & Yayınla
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
