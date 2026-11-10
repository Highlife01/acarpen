import { useState } from "react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/SEO";
import { Palette, Sun, ShieldCheck, Calculator, CheckCircle2, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { PVC_COLOR_ALTERNATIVES, WINDOW_COLOR_FEATURES } from "@/data/pvcColorAlternatives";

export default function RenkliCamlar() {
  const [activeColor, setActiveColor] = useState(PVC_COLOR_ALTERNATIVES[0]);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 pt-28">
      <SEO
        title="PVC Pencere & Kapı Renk Alternatifleri (19 Farklı Desen) | Acarpen Adana"
        description="Acarpen Fıratpen PVC pencere ve kapı renk alternatifleri: Antrasit Gri, Metalik Antrasit, Altın Meşe, Eskitme, Vizon, Koyu Meşe, Antik Meşe, Karbon Siyah, Maun, Budaklı Meşe, Kuvars Platin ve Bazalt Gri."
        canonicalPath="/urunler/renkli-camlar"
        keywords={[
          "pvc pencere renkleri",
          "antrasit gri pvc pencere",
          "altın meşe pimapen",
          "metalik antrasit doğrama",
          "vizon pvc pencere",
          "kuvars platin pvc",
          "bazalt gri pencere adana",
        ]}
        schemaType="Product"
        serviceName="PVC Pencere ve Kapı Laminasyon Renk Alternatifleri"
        breadcrumbs={[
          { name: "Ürünlerimiz", path: "/hizmetler" },
          { name: "Renk Alternatifleri", path: "/urunler/renkli-camlar" },
        ]}
      />
      <Navbar />

      {/* Hero Bölümü */}
      <section className="relative py-16 bg-gradient-to-b from-sky-50 via-white to-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold text-sky-800 bg-sky-50 border border-sky-200 shadow-sm mb-4">
            <Palette className="h-3.5 w-3.5 text-sky-600" /> 19 Farklı Lamine Folyo & Renk Kartelası
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl font-bold text-slate-900 tracking-tight">
            PVC Pencere & Kapı <span className="text-gradient italic">Renk Alternatifleri</span>
          </h1>
          <p className="text-slate-600 text-sm sm:text-base font-normal leading-relaxed max-w-3xl mt-4">
            Antrasit Gri, Metalik Antrasit, Altın Meşe, Eskitme, Vizon, Koyu Meşe, Antik Meşe, Karbon Siyah, Gümüş Gri, Alüminyum Efekt, Kristal Beyaz, Maun, Budaklı Meşe, Pirit, Kuvars Platin, Bazalt Gri, Taç Platin ve Parlak Gümüş seçenekleriyle yapılarınıza estetik değer katın.
          </p>
        </div>
      </section>

      {/* Interactive 3-Column Color Previewer */}
      <section className="py-16 max-w-7xl mx-auto px-6">
        <div className="bg-white rounded-3xl p-7 sm:p-10 border border-slate-200 shadow-xl mb-16">
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: 4 Feature Blocks */}
            <div className="lg:col-span-4 space-y-4">
              {WINDOW_COLOR_FEATURES.map((feat, i) => (
                <div
                  key={i}
                  className="p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-sky-300 hover:bg-white transition-all shadow-sm"
                >
                  <h2 className="font-serif text-base font-bold text-slate-900 mb-1.5 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-sky-600 shrink-0" />
                    <span>{feat.title}</span>
                  </h2>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    {feat.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Center Column: Interactive Window Preview */}
            <div className="lg:col-span-4 flex flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 rounded-3xl p-6 border border-slate-200 min-h-[440px]">
              <img
                src={activeColor.previewImage}
                alt={`${activeColor.name} (${activeColor.code}) PVC Pencere Renk Önizleme`}
                className="max-h-[370px] w-auto object-contain drop-shadow-2xl transition-all duration-300"
              />
              <div className="mt-4 text-center">
                <div className="font-serif text-xl font-bold text-slate-900">
                  {activeColor.name}
                </div>
                <div className="text-xs font-mono text-sky-700 font-semibold mt-0.5">
                  Renk Kodu: {activeColor.code} • {activeColor.category}
                </div>
              </div>
            </div>

            {/* Right Column: 19 Swatches */}
            <div className="lg:col-span-4">
              <h2 className="font-serif text-2xl font-bold text-slate-900 mb-2">
                Renk Alternatifleri
              </h2>
              <p className="text-xs text-slate-500 mb-4">
                Pencere üzerinde canlı görmek istediğiniz renk kartelasına tıklayın:
              </p>

              <div className="grid grid-cols-4 gap-3">
                {PVC_COLOR_ALTERNATIVES.map((c) => {
                  const isSelected = activeColor.id === c.id;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setActiveColor(c)}
                      className={`group flex flex-col items-center p-1.5 rounded-2xl border transition-all ${
                        isSelected
                          ? "border-sky-600 bg-sky-50 ring-2 ring-sky-500/30 shadow-md scale-105"
                          : "border-slate-200 bg-slate-50 hover:border-sky-300 hover:bg-white"
                      }`}
                    >
                      <div className="w-12 h-12 rounded-xl overflow-hidden border border-slate-300 shadow-inner mb-1">
                        <img
                          src={c.swatchImage}
                          alt={c.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                        />
                      </div>
                      <span className="text-[10px] font-bold text-slate-800 text-center leading-tight line-clamp-1">
                        {c.name}
                      </span>
                      <span className="text-[9px] font-mono text-slate-500">
                        {c.code}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 flex flex-wrap gap-2.5">
                <Link to="/hesaplama" className="flex-1">
                  <Button className="w-full rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs h-11">
                    <Calculator className="mr-1.5 h-4 w-4" />
                    Ölçü & Renk ile Teklif Al
                  </Button>
                </Link>
                <a
                  href={`https://wa.me/905336253611?text=${encodeURIComponent(
                    `Merhaba Acarpen, ${activeColor.name} (${activeColor.code}) renkli PVC pencere/kapı için fiyat teklifi almak istiyorum.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-11 px-4">
                    <MessageCircle className="mr-1.5 h-4 w-4" />
                    WhatsApp
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* All 19 Colors Full Table */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
                Tüm PVC Profil Renk & Folyo Kod Tablosu
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Tek yön (dış cephe) veya çift yön (iç-dış) laminasyon uygulanabilen 19 renk seçeneği
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-800 bg-sky-50 border border-sky-200 px-3 py-1.5 rounded-full">
              <Sun className="h-4 w-4 text-amber-500" /> UV Güneş Işınlarına & Solmaya Dayanıklı
            </span>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {PVC_COLOR_ALTERNATIVES.map((c) => (
              <div
                key={c.id}
                onClick={() => {
                  setActiveColor(c);
                  window.scrollTo({ top: 220, behavior: "smooth" });
                }}
                className="cursor-pointer rounded-2xl p-4 border border-slate-200 hover:border-sky-400 bg-slate-50/70 hover:bg-white transition-all flex items-center gap-3.5 shadow-sm"
              >
                <img
                  src={c.swatchImage}
                  alt={c.name}
                  className="w-14 h-14 rounded-xl object-cover border border-slate-300 shrink-0"
                />
                <div className="min-w-0">
                  <div className="font-serif font-bold text-sm text-slate-900 truncate">{c.name}</div>
                  <div className="text-xs font-mono text-sky-700 font-bold">Kod: {c.code}</div>
                  <div className="text-[11px] text-slate-500 truncate mt-0.5">{c.category}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
