import { useState } from "react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/SEO";
import { Palette, Sun, ShieldCheck, Calculator, CheckCircle2, MessageCircle, Sparkles, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import {
  PVC_COLOR_ALTERNATIVES,
  WINDOW_COLOR_FEATURES,
  PVC_COLORED_GLASS_OPTIONS,
} from "@/data/pvcColorAlternatives";

export default function RenkliCamlar() {
  const [activeColor, setActiveColor] = useState(PVC_COLOR_ALTERNATIVES[0]);
  const [activeGlass, setActiveGlass] = useState(PVC_COLORED_GLASS_OPTIONS[0]);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 pt-28">
      <SEO
        title="PVC Pencere Renk Alternatifleri (19 Desen) & PVC İçin Renkli Isıcamlar | Acarpen Adana"
        description="Acarpen Fıratpen 19 farklı PVC profil renk kartelası (Antrasit Gri, Altın Meşe, Vizon, Maun, Kuvars Platin) ve PVC pencereler ile cam balkonlar için Füme, Bronz, Mavi, Yeşil Reflekte ve Buzlu ısıcam seçenekleri."
        canonicalPath="/urunler/renkli-camlar"
        keywords={[
          "pvc pencere renkleri",
          "antrasit gri pvc pencere",
          "altın meşe pimapen",
          "pvc pencere renkli cam",
          "füme camlı pvc pencere",
          "bronz reflekte ısıcam pvc",
          "buzlu cam wc kapısı adana",
        ]}
        schemaType="Product"
        serviceName="PVC Pencere Renk Alternatifleri ve Renkli Isıcam Sistemleri"
        breadcrumbs={[
          { name: "Ürünlerimiz", path: "/hizmetler" },
          { name: "PVC Renk & Renkli Cam Alternatifleri", path: "/urunler/renkli-camlar" },
        ]}
      />
      <Navbar />

      {/* Hero Bölümü */}
      <section className="relative py-16 bg-gradient-to-b from-sky-50 via-white to-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold text-sky-800 bg-sky-50 border border-sky-200 shadow-sm mb-4">
            <Palette className="h-3.5 w-3.5 text-sky-600" /> 19 PVC Profil Deseni + 6 Renkli & Reflekte Isıcam Seçeneği
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl font-bold text-slate-900 tracking-tight">
            PVC Pencere <span className="text-gradient italic">Renk Alternatifleri</span> & Renkli Camlar
          </h1>
          <p className="text-slate-600 text-sm sm:text-base font-normal leading-relaxed max-w-3xl mt-4">
            Fıratpen PVC doğramalarınızda <strong>Antrasit Gri, Altın Meşe, Vizon, Koyu Meşe, Maun, Kuvars Platin</strong> dahil 19 lamine profil rengini; <strong>Füme, Bronz, Mavi Reflekte, Yeşil Reflekte, Satinato Buzlu ve Solar Low-E Konfor</strong> renkli ısıcamlarla kombine ederek hem ısı/güneş kontrolü hem de kusursuz mimari estetik sağlıyoruz.
          </p>
        </div>
      </section>

      {/* Interactive 3-Column Color Previewer */}
      <section className="py-16 max-w-7xl mx-auto px-6 space-y-16">
        <div className="bg-white rounded-3xl p-7 sm:p-10 border border-slate-200 shadow-xl">
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
                19 PVC Profil Renk Kartelası
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
                    `Merhaba Acarpen, ${activeColor.name} (${activeColor.code}) renkli PVC pencere ve ${activeGlass.name} kombinasyonu için fiyat teklifi almak istiyorum.`
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

        {/* NEW SECTION: PVC Pencereler ve Cam Balkonlar İçin Renkli & Reflekte Isıcam Seçenekleri */}
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 border border-slate-800 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
            <div className="max-w-3xl space-y-3">
              <span className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-sky-300 font-bold bg-sky-500/15 px-3.5 py-1.5 rounded-full border border-sky-400/30">
                <Sparkles className="h-3.5 w-3.5" /> PVC Doğrama & Cam Balkon İçin Renkli Cam Çözümleri
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">
                PVC Pencereler İçin <span className="text-sky-400 italic">Renkli & Reflekte Isıcam</span> Seçenekleri
              </h2>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Adana'nın yoğun güneş ışığı ve sıcak ikliminde PVC pencerelerinizde, sürme kapılarınızda ve cam balkonlarınızda yalnızca profil rengini değil, <strong>4+16+4 mm ısıcam veya 8-10 mm temperli cam rengini</strong> de cephenize ve mahremiyet ihtiyacınıza göre seçebilirsiniz.
              </p>
            </div>
            <div className="shrink-0">
              <a
                href={`https://wa.me/905336253611?text=${encodeURIComponent(
                  `Merhaba Acarpen, PVC pencerelerimiz için ${activeGlass.name} (${activeGlass.spec}) hakkında bilgi ve fiyat teklifi almak istiyorum.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-11 px-5">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Seçili Renkli Cam İçin Teklif Al
                </Button>
              </a>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PVC_COLORED_GLASS_OPTIONS.map((glass) => {
              const isSelected = activeGlass.id === glass.id;
              return (
                <div
                  key={glass.id}
                  onClick={() => setActiveGlass(glass)}
                  className={`cursor-pointer rounded-2xl p-6 border transition-all flex flex-col justify-between ${
                    isSelected
                      ? "bg-slate-800/95 border-sky-400 ring-2 ring-sky-400/30 shadow-xl"
                      : "bg-slate-950/70 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <div
                        className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${glass.gradientClass} border border-white/20 shadow-inner flex items-center justify-center`}
                      >
                        <Eye className="h-6 w-6 text-white/85" />
                      </div>
                      <div className="text-right">
                        <span className="inline-block text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/30 font-bold">
                          {glass.solarControl}
                        </span>
                        <div className="text-[11px] text-emerald-300 font-semibold mt-1">
                          {glass.privacyLevel}
                        </div>
                      </div>
                    </div>

                    <h3 className="font-serif text-xl font-bold text-white mb-1">
                      {glass.name}
                    </h3>
                    <div className="text-xs font-mono text-sky-400 font-semibold mb-3">
                      {glass.spec}
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed mb-4">
                      {glass.benefit}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-800 space-y-2 text-xs">
                    <div>
                      <span className="text-slate-400 font-semibold">Önerilen PVC Profil Renkleri: </span>
                      <span className="text-white font-medium">{glass.matchingProfiles}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-semibold">Uygulama Alanı: </span>
                      <span className="text-slate-200">{glass.usage}</span>
                    </div>
                  </div>
                </div>
              );
            })}
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
