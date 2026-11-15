import React from "react";
import { X, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getQrSvgPath } from "@/lib/qrCode";
import { printThermalLabelDocument } from "@/components/admin/PrintHelpers";
import type { QuoteItem } from "@/lib/adminStorage";

interface QrOrderLabelModalProps {
  order: QuoteItem | null;
  onClose: () => void;
}

export const QrOrderLabelModal: React.FC<QrOrderLabelModalProps> = ({ order, onClose }) => {
  if (!order) return null;

  const pinQuery = order.trackingPin ? `&pin=${encodeURIComponent(order.trackingPin)}` : "";
  const trackingUrl = `https://www.acarpen.com.tr/siparis-takip?id=${encodeURIComponent(order.id)}${pinQuery}`;
  const { totalSize, pathData } = getQrSvgPath(trackingUrl, 2);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white text-slate-900 rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl border-2 border-slate-400">
        <div className="flex items-center justify-between border-b-2 border-slate-200 pb-3">
          <div>
            <div className="text-xs font-black uppercase text-sky-700">
              ACARPEN ÜRETİM & SEVK ETİKETİ
            </div>
            <div className="font-mono text-lg font-black text-slate-950">
              {order.id}
              {order.trackingPin && (
                <span className="ml-2 text-xs bg-sky-100 text-sky-900 px-2 py-0.5 rounded">
                  PIN: {order.trackingPin}
                </span>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Kapat"
            className="p-2 rounded-xl bg-slate-200 text-slate-800 hover:bg-rose-600 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="text-xs space-y-1.5 text-slate-900">
          <div>
            <strong>Müşteri:</strong> {order.customerName} ({order.siteName || order.city})
          </div>
          <div>
            <strong>Ürün:</strong> {order.glassType} • {order.thickness}
          </div>
          <div>
            <strong>Ölçü:</strong> {order.dimensions} ({order.totalArea} m²)
          </div>
          <div>
            <strong>Sehpa / Lot:</strong> {order.rackNo || "SHP-01"} •{" "}
            {order.reservedLotNo || "LOT-STD"}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border-2 border-slate-300 flex flex-col items-center">
          <svg
            viewBox={`0 0 ${totalSize} ${totalSize}`}
            width={164}
            height={164}
            shapeRendering="crispEdges"
          >
            <rect width={totalSize} height={totalSize} fill="#ffffff" />
            <path d={pathData} fill="#0f172a" />
          </svg>
          <span className="text-xs font-mono font-bold text-slate-700 mt-2">
            Telefon kamerasıyla okutun (/siparis-takip)
          </span>
        </div>

        <div className="flex gap-2">
          <Button
            type="button"
            onClick={() => printThermalLabelDocument(order)}
            className="flex-1 h-11 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl"
          >
            <Printer className="h-4 w-4 mr-1.5" />
            10x15cm Etiket Yazdır
          </Button>
        </div>
      </div>
    </div>
  );
};
