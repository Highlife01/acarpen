import { useState } from "react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/SEO";
import { Calculator, Plus, Trash2, CheckCircle2, Send, ShieldCheck, Printer, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { addAdminQuote } from "@/lib/adminStorage";
import { PVC_COLOR_ALTERNATIVES } from "@/data/pvcColorAlternatives";
import { trackEvent } from "@/lib/analytics";

interface CalcRow {
  id: number;
  widthCm: number;
  heightCm: number;
  qty: number;
  productType: string;
  color: string;
  direction: string;
  accessory: string;
}

const PRODUCT_TYPES = [
  "70'lik / 75'lik Fıratpen Standart PVC Pencere (4+16+4 Isıcam)",
  "Ortadan Kanatlı PVC Pencere (4+16+4 Isıcam)",
  "Bir Sabit Bir Açılır PVC Pencere (4+16+4 Isıcam)",
  "Çift Kanat PVC Sürme Pencere & Kapı",
  "Fıratpen Hebeschiebe (Kaldır-Sür) Sürme Sistem",
  "PVC Pencere Balkon Kapısı (85×198 / 85×210)",
  "PVC WC & Banyo Kapısı (85×200)",
  "Düz / L / U Katlanır Cam Balkon (8mm / 10mm Temperli)",
  "Motorlu Giyotin Cam Balkon Sistemi",
  "Motorlu Alüminyum Panjur & Plise Sineklik",
];

export default function Hesaplama() {
  const [rows, setRows] = useState<CalcRow[]>([
    {
      id: 1,
      widthCm: 120,
      heightCm: 120,
      qty: 2,
      productType: PRODUCT_TYPES[0],
      color: "Kristal Beyaz",
      direction: "Sağ Açılım",
      accessory: "Çift Açılım",
    },
    {
      id: 2,
      widthCm: 150,
      heightCm: 140,
      qty: 2,
      productType: PRODUCT_TYPES[0],
      color: "Antrasit Gri",
      direction: "Sol Açılım",
      accessory: "Çift Açılım",
    },
  ]);

  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("Adana - Seyhan");

  const addRow = () => {
    setRows((prev) => [
      ...prev,
      {
        id: Date.now(),
        widthCm: 100,
        heightCm: 100,
        qty: 1,
        productType: PRODUCT_TYPES[0],
        color: "Kristal Beyaz",
        direction: "Sağ Açılım",
        accessory: "Çift Açılım",
      },
    ]);
  };

  const removeRow = (id: number) => {
    if (rows.length <= 1) return;
    setRows((prev) => prev.filter((r) => r.id !== id));
  };

  const updateRow = (id: number, field: keyof CalcRow, value: string | number) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  };

  const calculatedRows = rows.map((r) => {
    const singleArea = Math.max(0.25, (r.widthCm / 100) * (r.heightCm / 100));
    const totalArea = singleArea * Math.max(1, r.qty);
    return {
      ...r,
      totalArea: Number(totalArea.toFixed(2)),
    };
  });

  const grandTotalArea = Number(
    calculatedRows.reduce((sum, r) => sum + r.totalArea, 0).toFixed(2)
  );
  const totalPieceCount = calculatedRows.reduce((sum, r) => sum + Number(r.qty || 1), 0);

  const handleRequestOfficialQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !phone.trim()) {
      toast.error("Lütfen adınızı ve telefon numaranızı giriniz.");
      return;
    }

    const summaryDims = calculatedRows
      .map((r) => `${r.widthCm}x${r.heightCm}cm (${r.qty} Adet - ${r.color})`)
      .join(", ");

    const created = addAdminQuote({
      customerName: customerName.trim(),
      phone: phone.trim(),
      city,
      glassType: calculatedRows[0]?.productType || "Fıratpen PVC Pencere & Kapı",
      thickness: `${calculatedRows[0]?.color || "Beyaz"} • ${calculatedRows[0]?.accessory || "Çift Açılım"}`,
      dimensions: summaryDims,
      totalArea: grandTotalArea,
      estimatedPrice: 0,
      status: "new",
    });

    trackEvent("quote_calculated", {
      quote_id: created.id,
      city,
      total_area_m2: grandTotalArea,
    });

    toast.success(
      `Ölçü listeniz (#${created.id}) Acarpen sistemine kaydedildi! WhatsApp üzerinden müşteri temsilcimize yönlendiriliyorsunuz.`
    );

    const wpLines = calculatedRows
      .map(
        (r, i) =>
          `${i + 1}) ${r.productType} — ${r.widthCm}x${r.heightCm} cm x ${r.qty} Adet (${r.totalArea} m²) | Renk: ${r.color} | ${r.direction} | ${r.accessory}`
      )
      .join("\n");

    const wpMessage = encodeURIComponent(
      `Merhaba Acarpen (Fıratpen Yetkili Bayi),\nWeb sitenizdeki Çoklu Pencere & Cam Balkon Ölçü Robotundan fiyat teklifi rica ediyorum:\n\n` +
        `• Talep No: ${created.id}\n` +
        `• Müşteri / Firma: ${customerName}\n` +
        `• Telefon: ${phone}\n` +
        `• Bölge: ${city}\n\n` +
        `ÖLÇÜ VE KALEM LİSTESİ:\n${wpLines}\n\n` +
        `• Toplam Adet: ${totalPieceCount} Doğrama\n` +
        `• Toplam Alan: ${grandTotalArea} m²\n\n` +
        `Fiyat teklifi ve ücretsiz keşif için dönüşünüzü rica ederim.`
    );

    window.open(`https://wa.me/905336253611?text=${wpMessage}`, "_blank");
    setCustomerName("");
    setPhone("");
  };

  const handlePrintPdf = () => {
    const printWin = window.open("", "_blank", "width=900,height=750");
    if (!printWin) {
      toast.error("Lütfen tarayıcınızda açılır pencerelere izin verin.");
      return;
    }

    const doc = printWin.document;
    doc.title = "Acarpen - PVC Pencere & Cam Balkon Ölçü Listesi";

    const style = doc.createElement("style");
    style.textContent = `
      body { font-family: Arial, sans-serif; padding: 32px; color: #0f172a; }
      .header { display: flex; justify-content: space-between; border-bottom: 3px solid #0284c7; padding-bottom: 16px; margin-bottom: 24px; }
      .brand { font-size: 24px; font-weight: 800; color: #0b4f9c; }
      .sub { font-size: 12px; color: #64748b; margin-top: 4px; }
      table { width: 100%; border-collapse: collapse; margin-top: 16px; }
      th, td { border: 1px solid #cbd5e1; padding: 10px 12px; text-align: left; font-size: 12px; }
      th { background: #f1f5f9; font-weight: 700; }
      .total-box { margin-top: 24px; text-align: right; font-size: 15px; font-weight: 800; color: #0284c7; }
      .footer { margin-top: 36px; font-size: 11px; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 12px; }
    `;
    doc.head.appendChild(style);

    const body = doc.body;
    body.replaceChildren();

    const header = doc.createElement("div");
    header.className = "header";

    const leftHeader = doc.createElement("div");
    const brand = doc.createElement("div");
    brand.className = "brand";
    brand.textContent = "acar | pen — Fıratpen Yetkili Üretici Bayi";
    const sub1 = doc.createElement("div");
    sub1.className = "sub";
    sub1.textContent = "Acar Pen İnşaat Sanayi ve Ticaret Ltd. Şti. • Gülbahçesi Mah. 13428 Sok. No:16/17 Seyhan / Adana";
    leftHeader.appendChild(brand);
    leftHeader.appendChild(sub1);

    const rightHeader = doc.createElement("div");
    rightHeader.style.textAlign = "right";
    const titleRight = doc.createElement("div");
    titleRight.style.fontWeight = "700";
    titleRight.textContent = "PENCERE, KAPI & CAM BALKON METRAJ FORMU";
    const dateSub = doc.createElement("div");
    dateSub.className = "sub";
    dateSub.textContent = `Tarih: ${new Date().toLocaleDateString("tr-TR")} | Müşteri: ${customerName || "Belirtilmedi"}`;
    const phoneSub = doc.createElement("div");
    phoneSub.className = "sub";
    phoneSub.textContent = `Tel: ${phone || "-"} | Bölge: ${city}`;
    rightHeader.appendChild(titleRight);
    rightHeader.appendChild(dateSub);
    rightHeader.appendChild(phoneSub);

    header.appendChild(leftHeader);
    header.appendChild(rightHeader);
    body.appendChild(header);

    const table = doc.createElement("table");
    const thead = doc.createElement("thead");
    const headRow = doc.createElement("tr");
    ["#", "Ürün / Sistem", "Renk", "Açılım & Aksesuar", "En x Boy (cm)", "Adet", "Toplam Alan (m²)"].forEach((h) => {
      const th = doc.createElement("th");
      th.textContent = h;
      headRow.appendChild(th);
    });
    thead.appendChild(headRow);
    table.appendChild(thead);

    const tbody = doc.createElement("tbody");
    calculatedRows.forEach((r, idx) => {
      const tr = doc.createElement("tr");
      const cells = [
        String(idx + 1),
        r.productType,
        r.color,
        `${r.direction} / ${r.accessory}`,
        `${r.widthCm} x ${r.heightCm} cm`,
        String(r.qty),
        `${r.totalArea} m²`,
      ];
      cells.forEach((val) => {
        const td = doc.createElement("td");
        td.textContent = val;
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    body.appendChild(table);

    const totalBox = doc.createElement("div");
    totalBox.className = "total-box";
    totalBox.textContent = `Toplam Adet: ${totalPieceCount} Doğrama | Genel Toplam Metraj: ${grandTotalArea} m²`;
    body.appendChild(totalBox);

    const footer = doc.createElement("div");
    footer.className = "footer";
    footer.textContent =
      "Teknik Standart: 70mm/75mm Fıratpen Sistem, Galvanizli Çelik Destek Sacı, 4+16+4 Isıcam. İletişim & WhatsApp: 0533 625 36 11 — www.acarpen.com.tr";
    body.appendChild(footer);

    printWin.focus();
    setTimeout(() => printWin.print(), 250);
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 pt-28">
      <SEO
        title="PVC Pencere, Kapı & Cam Balkon Ölçü ve Teklif Robotu | Acarpen Adana"
        description="Adana Acarpen Fıratpen Yetkili Bayi online PVC pencere, balkon kapısı, sürme pencere ve cam balkon ölçü yapılandırıcı. Ölçü, renk (19 alternatif) ve açılım yönü seçerek anında teklif alın."
        canonicalPath="/hesaplama"
        keywords={[
          "pvc pencere hesaplama",
          "adana fıratpen fiyat teklifi",
          "cam balkon ölçü hesaplama",
          "pimapen ölçü listesi oluştur",
          "acarpen teklif al",
        ]}
        breadcrumbs={[{ name: "Pencere & Cam Balkon Ölçü Robotu", path: "/hesaplama" }]}
      />
      <Navbar />

      <section className="py-12 border-b border-slate-200 bg-gradient-to-b from-sky-50 via-white to-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sky-100 border border-sky-200 text-xs font-mono uppercase tracking-wider text-sky-800 mb-3 font-bold">
            <Calculator className="h-3.5 w-3.5 text-sky-600" />
            Çoklu Pencere, Kapı & Cam Balkon Yapılandırıcı
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-slate-900">
            Ölçü, Renk ve Açılım <span className="text-gradient italic">Listesi Oluşturun</span>
          </h1>
          <p className="text-slate-600 text-sm sm:text-base mt-2 max-w-2xl font-normal">
            Standart hazır ölçülerde veya özel ölçülerinizde PVC pencere, balkon kapısı, WC kapısı, sürme sistem ve cam balkon kalemlerinizi ekleyin; tek tıkla PDF metraj çıktısı alın veya WhatsApp'tan fiyat isteyin.
          </p>
        </div>
      </section>

      <section className="py-12 max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Left: Measurement Rows */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 space-y-5 border border-slate-200 shadow-lg">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-4">
                <div>
                  <h2 className="font-serif text-xl font-bold text-slate-900">Doğrama & Cam Balkon Kalemleri</h2>
                  <p className="text-xs text-slate-500">
                    70 mm / 75 mm Fıratpen sistem, destek sacı ve 4+16+4 ısıcam standardı
                  </p>
                </div>
                <Button
                  type="button"
                  onClick={addRow}
                  size="sm"
                  className="rounded-full bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 font-bold"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Yeni Ölçü Satırı Ekle
                </Button>
              </div>

              <div className="space-y-4">
                {calculatedRows.map((row, index) => (
                  <div
                    key={row.id}
                    className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 hover:border-sky-300 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-sky-700 uppercase">
                        #{index + 1}. Doğrama / Sistem Kalemi
                      </span>
                      {rows.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeRow(row.id)}
                          className="text-xs text-rose-600 hover:text-rose-700 flex items-center gap-1 font-semibold"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Sil
                        </button>
                      )}
                    </div>

                    <div className="grid sm:grid-cols-12 gap-3 items-end">
                      <div className="sm:col-span-6">
                        <label className="text-[11px] font-bold text-slate-700 block mb-1">
                          Ürün Kategorisi / Model
                        </label>
                        <select
                          value={row.productType}
                          onChange={(e) => updateRow(row.id, "productType", e.target.value)}
                          className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs font-semibold focus:outline-none focus:border-sky-600"
                        >
                          {PRODUCT_TYPES.map((pt) => (
                            <option key={pt} value={pt}>
                              {pt}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="text-[11px] font-bold text-slate-700 block mb-1">
                          En (cm)
                        </label>
                        <input
                          type="number"
                          min={20}
                          max={600}
                          value={row.widthCm}
                          onChange={(e) => updateRow(row.id, "widthCm", Number(e.target.value) || 0)}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm font-mono font-bold focus:outline-none focus:border-sky-600"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="text-[11px] font-bold text-slate-700 block mb-1">
                          Boy (cm)
                        </label>
                        <input
                          type="number"
                          min={20}
                          max={600}
                          value={row.heightCm}
                          onChange={(e) => updateRow(row.id, "heightCm", Number(e.target.value) || 0)}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm font-mono font-bold focus:outline-none focus:border-sky-600"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="text-[11px] font-bold text-slate-700 block mb-1">
                          Adet
                        </label>
                        <input
                          type="number"
                          min={1}
                          max={500}
                          value={row.qty}
                          onChange={(e) => updateRow(row.id, "qty", Number(e.target.value) || 1)}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm font-mono font-bold focus:outline-none focus:border-sky-600"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-3 gap-3 pt-1">
                      <div>
                        <label className="text-[11px] font-bold text-slate-700 block mb-1">
                          Renk Alternatifi (19 Desen)
                        </label>
                        <select
                          value={row.color}
                          onChange={(e) => updateRow(row.id, "color", e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs font-semibold"
                        >
                          {PVC_COLOR_ALTERNATIVES.map((c) => (
                            <option key={c.id} value={c.name}>
                              {c.name} ({c.code})
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-700 block mb-1">
                          Açılım Yönü
                        </label>
                        <select
                          value={row.direction}
                          onChange={(e) => updateRow(row.id, "direction", e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs font-semibold"
                        >
                          <option value="Sağ Açılım">Sağ Açılım</option>
                          <option value="Sol Açılım">Sol Açılım</option>
                          <option value="Çift Kanat / Sürme">Çift Kanat / Sürme</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-700 block mb-1">
                          Aksesuar Tipi
                        </label>
                        <select
                          value={row.accessory}
                          onChange={(e) => updateRow(row.id, "accessory", e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 text-xs font-semibold"
                        >
                          <option value="Çift Açılım">Çift Açılım</option>
                          <option value="Tek Açılım">Tek Açılım</option>
                          <option value="Vasistas">Vasistas</option>
                        </select>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-2 text-xs">
                      <span className="text-slate-600 font-medium">
                        Kalem Alanı: <strong className="text-slate-900 font-mono">{row.totalArea} m²</strong> ({row.qty} Adet)
                      </span>
                      <span className="font-mono font-bold text-emerald-700">
                        {row.color} • {row.direction} • {row.accessory}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Summary & Official Quote Request */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6">
              <div className="border-b border-slate-200 pb-4">
                <span className="text-[11px] font-mono uppercase tracking-widest text-sky-700 font-bold">
                  // Metraj & Teklif Özeti
                </span>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="text-sm text-slate-600 font-medium">Toplam Alan ({totalPieceCount} Adet):</span>
                  <span className="font-mono text-2xl font-bold text-slate-900">{grandTotalArea} m²</span>
                </div>
              </div>

              <div className="space-y-2.5 text-xs text-slate-700 font-medium">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>70 mm / 75 mm Fıratpen profil & destek sacı</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>4+16+4 mm Isıcam ile ısı ve ses yalıtımı</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-sky-600 shrink-0" />
                  <span>Adana & Çukurova ücretsiz lazer keşif desteği</span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={handlePrintPdf}
                className="w-full rounded-xl border-sky-300 bg-sky-50 hover:bg-sky-100 text-sky-800 font-bold h-11 text-xs"
              >
                <Printer className="mr-2 h-4 w-4" />
                Ölçü Listesini PDF Olarak İndir / Yazdır
              </Button>

              <form onSubmit={handleRequestOfficialQuote} className="space-y-3.5 pt-2 border-t border-slate-200">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Fiyat Teklifi İçin Bilgileriniz
                </div>
                <input
                  required
                  type="text"
                  placeholder="Adınız Soyadınız / Firma Adı *"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs font-medium focus:outline-none focus:border-sky-600 focus:bg-white"
                />
                <input
                  required
                  type="tel"
                  placeholder="Telefon Numaranız (05XX...) *"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs font-medium focus:outline-none focus:border-sky-600 focus:bg-white"
                />
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs font-semibold focus:outline-none focus:border-sky-600 focus:bg-white"
                >
                  <option className="bg-white">Adana - Seyhan</option>
                  <option className="bg-white">Adana - Çukurova</option>
                  <option className="bg-white">Adana - Yüreğir / Sarıçam</option>
                  <option className="bg-white">Mersin / Tarsus</option>
                  <option className="bg-white">Osmaniye</option>
                  <option className="bg-white">Hatay / İskenderun</option>
                  <option className="bg-white">Gaziantep / Diğer</option>
                </select>

                <Button
                  type="submit"
                  className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-12 shadow-md text-xs sm:text-sm"
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  WhatsApp'tan Net Fiyat Teklifi Al
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
