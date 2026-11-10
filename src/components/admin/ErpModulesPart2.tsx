import React, { useState } from "react";
import {
  Cpu,
  Flame,
  Layers,
  Truck,
  FileCheck,
  PackageCheck,
  Play,
  Pause,
  ArrowRight,
  ShieldAlert,
  AlertTriangle,
  QrCode,
  Printer,
  Package,
  ShoppingCart,
  Plus,
  CheckCircle2,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  QuoteItem,
  InventoryItem,
  PurchaseOrderItem,
  UserRole,
  updateAdminQuote,
  updateAdminInventory,
  addAdminInventory,
  addAdminPurchase,
  updateAdminPurchase,
  addAdminQuality,
} from "@/lib/adminStorage";
import { printThermalLabelDocument } from "./PrintHelpers";
import { toast } from "sonner";

const STATIONS = [
  { id: 1, name: "1. Sipariş & Kesim Planı", icon: FileCheck },
  { id: 2, name: "2. CNC Kesim & Rodaj", icon: Cpu },
  { id: 3, name: "3. Convection Temper", icon: Flame },
  { id: 4, name: "4. Robotik Isıcam & Lamine", icon: Layers },
  { id: 5, name: "5. Sevkiyat & Kasalama", icon: Truck },
  { id: 6, name: "6. Şantiye Teslimat", icon: PackageCheck },
] as const;

interface ProductionModuleProps {
  quotes: QuoteItem[];
  inventory: InventoryItem[];
  onShowQrModal: (q: QuoteItem) => void;
}

export const ProductionModuleView: React.FC<ProductionModuleProps> = ({
  quotes,
  inventory,
  onShowQrModal,
}) => {
  const [stationFilter, setStationFilter] = useState<number | "all">("all");
  const [qrSearch, setQrSearch] = useState("");
  const [scrapModalOrder, setScrapModalOrder] = useState<QuoteItem | null>(null);
  const [scrapM2Input, setScrapM2Input] = useState("1.5");
  const [scrapReasonInput, setScrapReasonInput] = useState("Temper fırını spontan patlama / ısıl şok");
  const [scrapStationInput, setScrapStationInput] = useState("3. Convection Temper");

  const activeOrders = quotes.filter((q) => {
    if (q.status === "cancelled") return false;
    const st = q.productionStage || 1;
    if (stationFilter !== "all" && st !== stationFilter) return false;
    if (qrSearch.trim()) {
      const s = qrSearch.trim().toLowerCase();
      return (
        q.id.toLowerCase().includes(s) ||
        q.customerName.toLowerCase().includes(s) ||
        (q.rackNo || "").toLowerCase().includes(s) ||
        (q.reservedLotNo || "").toLowerCase().includes(s)
      );
    }
    return true;
  });

  const handleAdvanceStation = (q: QuoteItem) => {
    const current = q.productionStage || 1;
    const next = Math.min(6, current + 1) as 1 | 2 | 3 | 4 | 5 | 6;
    const res = updateAdminQuote(q.id, {
      productionStage: next,
      stationStatus: next === 6 ? "completed" : "running",
      status: next === 6 ? "completed" : "approved",
    });
    if (!res.ok) {
      toast.error(res.error);
      return;
    }
    toast.success(`${q.id} iş emri Aşama ${next}/6 istasyonuna ilerletildi.`);
  };

  const handleRecordScrap = () => {
    if (!scrapModalOrder) return;
    const addedScrap = Math.max(0.1, Number(scrapM2Input) || 0);
    const prevScrap = scrapModalOrder.scrapM2 || 0;
    const totalScrap = Number((prevScrap + addedScrap).toFixed(2));
    const scrapCostAdd = Math.round(addedScrap * 650);
    const baseEstimatedCost =
      scrapModalOrder.estimatedCost || Math.round((scrapModalOrder.estimatedPrice || 0) * 0.68);
    const nextActualCost = (scrapModalOrder.actualCost || baseEstimatedCost) + scrapCostAdd;

    updateAdminQuote(scrapModalOrder.id, {
      scrapM2: totalScrap,
      scrapReason: scrapReasonInput,
      scrapStation: scrapStationInput,
      actualCost: nextActualCost,
    });

    toast.success(
      `KABUL TESTİ #6: ${scrapModalOrder.id} için ${addedScrap} m² fire/kırık ve +₺${scrapCostAdd.toLocaleString("tr-TR")} gerçekleşen maliyet kaydedildi.`
    );
    setScrapModalOrder(null);
  };

  return (
    <div className="space-y-6">
      {/* Station Queue Counters & QR Lookup Bar (Acceptance Test #4) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {STATIONS.map((st) => {
          const count = quotes.filter(
            (q) => q.status !== "cancelled" && (q.productionStage || 1) === st.id
          ).length;
          const Icon = st.icon;
          const active = stationFilter === st.id;
          return (
            <button
              key={st.id}
              onClick={() => setStationFilter(active ? "all" : st.id)}
              className={`p-3.5 rounded-2xl border text-left transition-all ${
                active
                  ? "bg-sky-500/20 border-sky-400 text-white shadow-lg"
                  : "bg-slate-900/90 border-slate-800 text-slate-300 hover:border-slate-700"
              }`}
            >
              <div className="flex items-center justify-between">
                <Icon className="h-4 w-4 text-sky-400" />
                <span className="font-mono text-sm font-black text-white">{count} İş</span>
              </div>
              <div className="text-[11px] font-bold mt-2 leading-tight">{st.name}</div>
            </button>
          );
        })}
      </div>

      {/* Barcode / QR Quick Search */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Barkod / QR Okutun veya İş Emri No (TKF-...), Sehpa No (SHP-...), Lot No ara..."
            value={qrSearch}
            onChange={(e) => setQrSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-mono"
          />
        </div>
        {stationFilter !== "all" && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => setStationFilter("all")}
            className="border-slate-700 text-xs"
          >
            Tüm İstasyonları Göster
          </Button>
        )}
      </div>

      {/* Tablet-Friendly Operator Station Cards */}
      <div className="space-y-4">
        {activeOrders.length === 0 ? (
          <div className="p-12 rounded-3xl bg-slate-900/80 border border-slate-800 text-center text-xs text-slate-500">
            Bu istasyon kuyruğunda bekleyen iş emri bulunmuyor.
          </div>
        ) : (
          activeOrders.map((q) => {
            const st = q.productionStage || 1;
            return (
              <div
                key={q.id}
                className={`p-5 rounded-3xl border transition-all space-y-4 ${
                  q.qualityHold
                    ? "bg-rose-950/25 border-rose-500/50"
                    : "bg-slate-900/90 border-slate-800"
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="font-mono text-base font-black text-sky-400">{q.id}</span>
                    <span className="px-2.5 py-1 rounded-lg bg-sky-500/15 text-sky-300 border border-sky-500/30 text-xs font-bold">
                      İstasyon {st}/6: {STATIONS.find((s) => s.id === st)?.name}
                    </span>
                    {q.qualityHold && (
                      <span className="px-2.5 py-1 rounded-lg bg-rose-500 text-white text-xs font-bold flex items-center gap-1">
                        <ShieldAlert className="h-3.5 w-3.5" />
                        KALİTE BLOKAJI ({q.qualityHoldReason || "Karantina"})
                      </span>
                    )}
                    {q.scrapM2 && q.scrapM2 > 0 ? (
                      <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-mono font-bold">
                        Fire: {q.scrapM2} m² ({q.scrapReason})
                      </span>
                    ) : null}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onShowQrModal(q)}
                      className="h-8 border-slate-700 text-sky-400 text-xs"
                    >
                      <QrCode className="h-3.5 w-3.5 mr-1" />
                      QR Etiket
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => printThermalLabelDocument(q)}
                      className="h-8 border-slate-700 text-slate-300 text-xs"
                    >
                      <Printer className="h-3.5 w-3.5 mr-1" />
                      10x15 Termal Yazdır
                    </Button>
                  </div>
                </div>

                {/* Technical & Assignment Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="text-[10px] text-slate-500 uppercase font-bold">Müşteri & Cam</div>
                    <div className="font-bold text-white truncate">{q.customerName}</div>
                    <div className="text-slate-400 truncate">
                      {q.glassType} ({q.totalArea} m²)
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <label className="text-[10px] text-slate-500 uppercase font-bold block mb-1">
                      Atanan Operatör / Usta
                    </label>
                    <input
                      type="text"
                      placeholder="Örn: Mustafa Usta (CNC-1)"
                      value={q.assignedOperator || ""}
                      onChange={(e) => updateAdminQuote(q.id, { assignedOperator: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-white text-xs"
                    />
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <label className="text-[10px] text-slate-500 uppercase font-bold block mb-1">
                      Hammadde Plaka Lot No
                    </label>
                    <select
                      value={q.reservedLotNo || ""}
                      onChange={(e) => updateAdminQuote(q.id, { reservedLotNo: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-white text-xs font-mono"
                    >
                      <option value="">Lot Seçiniz...</option>
                      {inventory
                        .filter((i) => i.category === "Hammadde (Plaka Cam)")
                        .map((i) => (
                          <option key={i.id} value={i.lotNo}>
                            {i.lotNo} ({i.name.slice(0, 22)})
                          </option>
                        ))}
                    </select>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <label className="text-[10px] text-slate-500 uppercase font-bold block mb-1">
                      Taşıma Sehpası (Rack)
                    </label>
                    <input
                      type="text"
                      placeholder="Örn: SHP-104"
                      value={q.rackNo || ""}
                      onChange={(e) => updateAdminQuote(q.id, { rackNo: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-white text-xs font-mono"
                    />
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <label className="text-[10px] text-slate-500 uppercase font-bold block mb-1">
                      Doğrudan İstasyon Seç
                    </label>
                    <select
                      value={st}
                      onChange={(e) => {
                        const res = updateAdminQuote(q.id, {
                          productionStage: Number(e.target.value) as 1 | 2 | 3 | 4 | 5 | 6,
                        });
                        if (!res.ok) toast.error(res.error);
                      }}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-sky-400 font-bold text-xs"
                    >
                      {STATIONS.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Operator Large Action Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      size="sm"
                      onClick={() => {
                        updateAdminQuote(q.id, { stationStatus: "running" });
                        toast.success(`${q.id} istasyonda başlatıldı.`);
                      }}
                      className="h-9 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                    >
                      <Play className="h-3.5 w-3.5 mr-1.5" />
                      İstasyonda Başlat
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        updateAdminQuote(q.id, {
                          stationStatus: "paused",
                          downtimeMinutes: (q.downtimeMinutes || 0) + 15,
                        });
                        toast.info(`${q.id} için duruş (+15 dk) kaydedildi.`);
                      }}
                      className="h-9 border-slate-700 text-amber-300 text-xs"
                    >
                      <Pause className="h-3.5 w-3.5 mr-1.5" />
                      Duruş Kaydet ({q.downtimeMinutes || 0} dk)
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setScrapModalOrder(q)}
                      className="h-9 border-amber-500/40 text-amber-400 hover:bg-amber-500/10 text-xs"
                    >
                      <AlertTriangle className="h-3.5 w-3.5 mr-1.5" />
                      Fire / Kırık Gir
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        addAdminQuality({
                          orderId: q.id,
                          customerName: q.customerName,
                          inspectionType: "Proses Kontrol (İstasyon)",
                          stationName: STATIONS.find((s) => s.id === st)?.name || "Üretim Hattı",
                          dimensionToleranceOk: true,
                          opticalSurfaceOk: false,
                          temperStressOk: true,
                          sealantArgonOk: true,
                          result: "Karantina (Blokaj)",
                          defectReason: "İstasyon operatörü yüzey çizik/kabarcık uyarısı",
                          inspector: q.assignedOperator || "Hat Operatörü",
                        });
                        toast.warning(`${q.id} kalite karantinasına (blokaja) alındı!`);
                      }}
                      className="h-9 border-rose-500/40 text-rose-400 hover:bg-rose-500/10 text-xs"
                    >
                      <ShieldAlert className="h-3.5 w-3.5 mr-1.5" />
                      Kalite Beklet (Blokaj)
                    </Button>
                  </div>

                  {st < 6 && (
                    <Button
                      size="sm"
                      onClick={() => handleAdvanceStation(q)}
                      className="h-9 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs"
                    >
                      <span>Tamamla & Sonraki İstasyon ({st + 1}/6)</span>
                      <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                    </Button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Scrap / Fire Recording Modal (Acceptance Test #6) */}
      {scrapModalOrder && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full p-6 space-y-4">
            <h4 className="text-base font-bold text-white flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-400" />
              Üretim Fire & Kırık Kaydı ({scrapModalOrder.id})
            </h4>
            <p className="text-xs text-slate-400">
              Girilen fire miktarı sorumlu istasyonla kaydedilir ve siparişin gerçekleşen üretim maliyetine otomatik yansıtılır (Kabul Testi #6).
            </p>
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Kırık / Fire Alanı (m²)</label>
                <input
                  type="number"
                  step="0.1"
                  value={scrapM2Input}
                  onChange={(e) => setScrapM2Input(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Sorumlu İstasyon</label>
                <select
                  value={scrapStationInput}
                  onChange={(e) => setScrapStationInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                >
                  {STATIONS.map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Fire / Kırık Nedeni</label>
                <input
                  type="text"
                  value={scrapReasonInput}
                  onChange={(e) => setScrapReasonInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setScrapModalOrder(null)}
                className="border-slate-700 text-xs"
              >
                İptal
              </Button>
              <Button
                onClick={handleRecordScrap}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs"
              >
                Fire & Maliyet Kaydet
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// MODÜL 6: STOK, DEPO VE SATIN ALMA (Bölüm 5.2, 5.3 & Kabul Testi #6, #9)
// ============================================================================

interface InventoryModuleProps {
  inventory: InventoryItem[];
  purchases: PurchaseOrderItem[];
  activeRole: UserRole;
}

export const InventoryPurchasingModuleView: React.FC<InventoryModuleProps> = ({
  inventory,
  purchases,
}) => {
  const [subTab, setSubTab] = useState<"stock" | "purchasing">("stock");
  const [newStock, setNewStock] = useState({
    code: "",
    name: "",
    category: "Hammadde (Plaka Cam)" as InventoryItem["category"],
    thickness: "6 mm",
    dimensions: "3210 x 2250 mm",
    supplier: "Şişecam Düzcam",
    warehouseLocation: "Depo-A / Sehpa-09",
    lotNo: `LOT-2026-${Math.floor(Math.random() * 900 + 100)}`,
    unit: "m²" as InventoryItem["unit"],
    availableQty: "500",
    minStockLevel: "200",
    unitCost: "520",
  });

  const handleQuickPurchaseFromCritical = (item: InventoryItem) => {
    const orderQty = Math.max(200, item.minStockLevel * 2 - item.availableQty);
    const po = addAdminPurchase({
      materialName: item.name,
      category: item.category,
      supplier: item.supplier,
      qty: orderQty,
      unit: item.unit,
      unitPrice: item.unitCost,
      totalAmount: orderQty * item.unitCost,
      expectedDate: new Date(Date.now() + 5 * 86400000).toISOString().slice(0, 10),
      status: "Talep Açıldı",
      lotNo: `LOT-PO-${Date.now().toString().slice(-4)}`,
      supplierRating: 96,
      requestedBy: "MRP Kritik Stok Otomasyonu",
    });
    toast.success(`${po.id} satın alma talebi (${orderQty} ${item.unit}) açıldı!`);
    setSubTab("purchasing");
  };

  const handleReceivePurchase = (po: PurchaseOrderItem) => {
    updateAdminPurchase(po.id, { status: "Mal Kabul Yapıldı", invoiceMatched: true });
    const matchStock = inventory.find((i) => i.name === po.materialName);
    if (matchStock) {
      updateAdminInventory(
        matchStock.id,
        { availableQty: matchStock.availableQty + po.qty },
        `Satın alma mal kabulü (${po.id}: +${po.qty} ${po.unit})`
      );
    }
    toast.success(`${po.id} mal kabulü yapıldı ve kullanılabilir stok artırıldı!`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 p-3 rounded-2xl">
        <div className="flex gap-2">
          <button
            onClick={() => setSubTab("stock")}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 ${
              subTab === "stock"
                ? "bg-sky-500 text-slate-950"
                : "bg-slate-800 text-slate-300"
            }`}
          >
            <Package className="h-3.5 w-3.5" />
            Plaka / Lot Stok & Depo ({inventory.length})
          </button>
          <button
            onClick={() => setSubTab("purchasing")}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 ${
              subTab === "purchasing"
                ? "bg-sky-500 text-slate-950"
                : "bg-slate-800 text-slate-300"
            }`}
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            Satın Alma & Tedarikçi Yönetimi ({purchases.length})
          </button>
        </div>
      </div>

      {subTab === "stock" && (
        <div className="space-y-6">
          {/* Add Stock Card */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!newStock.name.trim()) return;
              addAdminInventory({
                code: newStock.code || `CAM-${Date.now().toString().slice(-3)}`,
                name: newStock.name.trim(),
                category: newStock.category,
                thickness: newStock.thickness,
                dimensions: newStock.dimensions,
                supplier: newStock.supplier,
                warehouseLocation: newStock.warehouseLocation,
                lotNo: newStock.lotNo,
                unit: newStock.unit,
                availableQty: Number(newStock.availableQty) || 0,
                reservedQty: 0,
                quarantineQty: 0,
                damagedQty: 0,
                minStockLevel: Number(newStock.minStockLevel) || 100,
                unitCost: Number(newStock.unitCost) || 400,
              });
              toast.success("Yeni plaka/lot stok kartı eklendi.");
              setNewStock({ ...newStock, name: "" });
            }}
            className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs"
          >
            <input
              type="text"
              placeholder="Malzeme / Plaka Cam Adı *"
              value={newStock.name}
              onChange={(e) => setNewStock({ ...newStock, name: e.target.value })}
              className="px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white lg:col-span-2"
            />
            <input
              type="text"
              placeholder="Lot / Parti No"
              value={newStock.lotNo}
              onChange={(e) => setNewStock({ ...newStock, lotNo: e.target.value })}
              className="px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
            />
            <input
              type="number"
              placeholder="Kullanılabilir Miktar"
              value={newStock.availableQty}
              onChange={(e) => setNewStock({ ...newStock, availableQty: e.target.value })}
              className="px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
            />
            <Button
              type="submit"
              className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded-xl"
            >
              <Plus className="h-4 w-4 mr-1" />
              Stok Kartı Aç
            </Button>
          </form>

          {/* Inventory Table */}
          <div className="rounded-3xl bg-slate-900/90 border border-slate-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-[10px] font-mono uppercase text-slate-400 bg-slate-950/60">
                    <th className="py-3.5 px-4">Kod & Lot / Parti</th>
                    <th className="py-3.5 px-4">Stok Kartı & Ebat</th>
                    <th className="py-3.5 px-4">Kullanılabilir</th>
                    <th className="py-3.5 px-4">Rezerve</th>
                    <th className="py-3.5 px-4">Karantina / Fire</th>
                    <th className="py-3.5 px-4">Kritik Stok Durumu</th>
                    <th className="py-3.5 px-4 text-right">Yetkili Stok Düzeltme</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-xs">
                  {inventory.map((item) => {
                    const isCritical = item.availableQty < item.minStockLevel;
                    return (
                      <tr key={item.id} className="hover:bg-slate-800/40">
                        <td className="py-3.5 px-4">
                          <div className="font-mono font-bold text-sky-400">{item.code}</div>
                          <div className="font-mono text-[11px] text-slate-400">{item.lotNo}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-white">{item.name}</div>
                          <div className="text-[11px] text-slate-400">
                            {item.dimensions} • {item.warehouseLocation}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">
                          {item.availableQty} {item.unit}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-sky-300">
                          {item.reservedQty} {item.unit}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-xs">
                          <span className="text-amber-400">K:{item.quarantineQty}</span> /{" "}
                          <span className="text-rose-400">F:{item.damagedQty}</span>
                        </td>
                        <td className="py-3.5 px-4">
                          {isCritical ? (
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/40 text-[10px] font-bold">
                                Kritik Stok (&lt;{item.minStockLevel})
                              </span>
                              <button
                                onClick={() => handleQuickPurchaseFromCritical(item)}
                                className="text-[10px] underline text-sky-400 font-bold"
                              >
                                + Satın Alma Aç
                              </button>
                            </div>
                          ) : (
                            <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 text-[10px] font-bold">
                              Yeterli (Min: {item.minStockLevel})
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="inline-flex items-center gap-1">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                const res = updateAdminInventory(
                                  item.id,
                                  { availableQty: item.availableQty + 50 },
                                  "+50 m²/birim sayım fazlası girişi"
                                );
                                if (!res.ok) toast.error(res.error);
                                else toast.success(`${item.name} stoğu +50 artırıldı.`);
                              }}
                              className="h-7 px-2 border-slate-700 text-xs"
                            >
                              +50
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                const res = updateAdminInventory(
                                  item.id,
                                  {
                                    availableQty: Math.max(0, item.availableQty - 10),
                                    reservedQty: item.reservedQty + 10,
                                  },
                                  "Siparişe 10 birim stok rezervasyonu"
                                );
                                if (!res.ok) toast.error(res.error);
                                else toast.success(`${item.name} için 10 ${item.unit} rezerve edildi.`);
                              }}
                              className="h-7 px-2 border-slate-700 text-sky-400 text-xs"
                            >
                              Rezerve Et (+10)
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
        </div>
      )}

      {subTab === "purchasing" && (
        <div className="rounded-3xl bg-slate-900/90 border border-slate-800 overflow-hidden">
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <h4 className="text-sm font-bold text-white">
              Açık Satın Alma Siparişleri, Mal Kabul & Tedarikçi Performansı
            </h4>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-[10px] font-mono uppercase text-slate-400 bg-slate-950/60">
                  <th className="py-3.5 px-4">Sipariş No & Lot</th>
                  <th className="py-3.5 px-4">Malzeme & Tedarikçi</th>
                  <th className="py-3.5 px-4">Miktar & Tutar</th>
                  <th className="py-3.5 px-4">Termin & Puan</th>
                  <th className="py-3.5 px-4">Durum</th>
                  <th className="py-3.5 px-4 text-right">Mal Kabul</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {purchases.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-slate-500">
                      Henüz satın alma siparişi yok. Stok sekmesindeki kritik kalemlerden tek tıkla talep açabilirsiniz.
                    </td>
                  </tr>
                ) : (
                  purchases.map((po) => (
                    <tr key={po.id} className="hover:bg-slate-800/40">
                      <td className="py-3.5 px-4 font-mono">
                        <div className="font-bold text-sky-400">{po.id}</div>
                        <div className="text-[10px] text-slate-400">{po.lotNo}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-white">{po.materialName}</div>
                        <div className="text-[11px] text-slate-400">{po.supplier}</div>
                      </td>
                      <td className="py-3.5 px-4 font-mono">
                        <div>
                          {po.qty} {po.unit}
                        </div>
                        <div className="font-bold text-emerald-400">
                          ₺{po.totalAmount.toLocaleString("tr-TR")}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-mono">{po.expectedDate}</div>
                        <div className="text-[10px] text-emerald-400">
                          Tedarikçi Puanı: %{po.supplierRating || 95}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-200 text-[11px] font-bold">
                          {po.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {po.status !== "Mal Kabul Yapıldı" ? (
                          <Button
                            size="sm"
                            onClick={() => handleReceivePurchase(po)}
                            className="h-8 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs"
                          >
                            <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                            Mal Kabul & Stoğa Al
                          </Button>
                        ) : (
                          <span className="text-emerald-400 font-bold text-xs">✓ Stoğa İşlendi</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
