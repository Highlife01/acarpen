import { useState } from "react";
import { Layers, Shield, Sun, Building2, Sparkles, Blinds, ArrowUpRight, Palette, CheckCircle2, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import { PVC_COLOR_ALTERNATIVES, WINDOW_COLOR_FEATURES } from "@/data/pvcColorAlternatives";

import imgVillaWindow from "@/assets/hero-villa-window.jpg";
import imgBalcony from "@/assets/hero-guillotine-balcony.jpg";
import imgJaluzi from "@/assets/hero-jaluzi-villa.jpg";
import imgFacade from "@/assets/hero-curtain-facade.jpg";
import imgArchitecture from "@/assets/hero-glass-architecture.jpg";
import imgTech from "@/assets/project-tech.jpg";

const services = [
  {
    icon: Layers,
    title: "PVC Pencereler (70'lik & 75'lik Sistemler)",
    badge: "Hazır & Özel Ölçü",
    href: "/urunler/cift-cam",
    image: imgVillaWindow,
    desc: "70 mm ve 75 mm Fıratpen sistem genişliği, galvanizli destek sacı, 2.5 mm - 3.0 mm profil et kalınlığı ve 4+16+4 ısıcam ile ısı yalıtımı ve dayanımı dengeler. Tek bölmeli, ortadan kanatlı ve bir sabit bir açılır modeller.",
    specs: ["19 Farklı Renk Alternatifi", "Sağ / Sol • Tek / Çift Açılım", "4+16+4 Isıcam & Destek Sacı"],
  },
  {
    icon: Blinds,
    title: "PVC Sürme Pencereler & Sürme Kapılar",
    badge: "Çift Kanat & Hebeschiebe",
    href: "/urunler/temperli-cam",
    image: imgArchitecture,
    desc: "Normal pencere açılımının dar olduğu balkon, teras ve mutfaklar için 120×120 cm, 140×120 cm çift kanat PVC sürme pencereler, Volkswagen sürme ve 300 kg kapasiteli Hebeschiebe sistemleri.",
    specs: ["Çift Kanat PVC Sürme", "EPDM Contalı & Fırçalı", "4+16+4 Isıcamlı Sistem"],
  },
  {
    icon: Sun,
    title: "Düz, L ve U Cam Balkon Sistemleri",
    badge: "8mm - 10mm & Isıcamlı",
    href: "/urunler/balkon-cami",
    image: imgBalcony,
    desc: "Düz balkon, L balkon ve U balkon tiplerine özel katlanır cam balkon, eşikli/eşiksiz sürme ve uzaktan kumandalı motorlu giyotin cam sistemleri.",
    specs: ["Düz • L • U Cam Balkon", "8mm/10mm Temperli & Isıcamlı", "Alüminyum Damlalıklı Profil"],
  },
  {
    icon: Shield,
    title: "PVC Balkon Kapıları & PVC WC Kapıları",
    badge: "85×198 • 85×200 • 85×210",
    href: "/urunler/jaluzili-isicam",
    image: imgJaluzi,
    desc: "85×198 cm ve 85×210 cm ısıcamlı PVC balkon kapıları ile 85×200 cm neme ve buhara tam dayanıklı buzlu camlı / lambri panelli PVC WC ve banyo kapıları.",
    specs: ["85×210 Balkon Kapısı", "85×200 WC Kapısı", "Motorlu Panjur Uyumlu"],
  },
  {
    icon: Building2,
    title: "B2B Müteahhit, Şantiye & Toplu Sipariş",
    badge: "Düzenli Tedarik",
    href: "/urunler/dis-cephe-camlari",
    image: imgFacade,
    desc: "Müteahhitler, bayiler, şantiyeler, konut projeleri ve üretim atölyeleri için toplu sipariş ve düzenli tedarik modelleri. Sipariş adetleri ve sevkiyat planına göre proje bazlı operasyon.",
    specs: ["Toplu Konut & Şantiye", "Planlı Termin & Sevkiyat", "Alüminyum & Kış Bahçesi"],
  },
  {
    icon: Sparkles,
    title: "Pencere Kolları, Sineklik & Montaj Malzemeleri",
    badge: "Tam Donanım",
    href: "/urunler/lamine-cam",
    image: imgTech,
    desc: "Plise sineklik sistemleri, tek/çift açılım ispanyolet aksesuarları, pencere kolları ve montaj izolasyon malzemeleri (poliüretan köpükler, silikonlar, izolasyon mastikleri).",
    specs: ["Plise & Menteşeli Sineklik", "PU Köpük, Silikon & Mastik", "Pencere Kolları & Aksesuar"],
  },
];

const standardWindowModels = [
  { size: "40×40 cm & 50×50 cm", type: "70'lik Vasistas / Banyo-WC PVC Pencere", detail: "70 mm sistem, 1.00 mm destek sacı, 2.5 mm et kalınlığı, 4+16+4 ısıcam" },
  { size: "75×100 cm & 100×100 cm", type: "1 Bölmeli Standart PVC Pencere", detail: "Sağ / Sol açılım, Tek / Çift açılım aksesuar, Beyaz / Antrasit / Altınmeşe" },
  { size: "120×120 cm & 140×140 cm", type: "Standart Oda & Mutfak PVC Pencere", detail: "70 mm / 75 mm Fıratpen sistem, 4+16+4 ısıcam, yüksek ısı ve ses yalıtımı" },
  { size: "130×130 cm", type: "Ortadan Kanatlı PVC Pencere", detail: "Simetrik görünüm, sağ veya sol kanat açılım, tek/çift açılım mekanizma" },
  { size: "150×140 cm & 200×140 cm", type: "Geniş Cephe Salon PVC Pencere", detail: "Çelik destek saclı mukavemetli gövde, 4+16+4 ısıcam, EPDM sızdırmaz conta" },
  { size: "160×200 cm & 180×210 cm", type: "Bir Sabit Bir Açılır PVC Pencere", detail: "Fransız balkon ve salon cepheleri için geniş cam alanı ve konforlu havalandırma" },
  { size: "200×210 cm & 220×210 cm", type: "Ortadan Kanatlı Panoramik PVC Pencere", detail: "Geniş açıklıklı salon ve teras cepheleri için yüksek rüzgar dirençli seri" },
  { size: "120×120 cm & 140×120 cm", type: "Çift Kanat PVC Sürme Pencere", detail: "Dar alanlarda yer kaplamayan raylı sürme mekanizma, fırçalı ve EPDM contalı" },
  { size: "85×198 cm & 85×210 cm", type: "PVC Pencere Balkon Kapısı", detail: "Tam boy ısıcamlı veya alt lambri panelli, sağ/sol ve çift açılım seçenekli" },
  { size: "85×200 cm", type: "PVC WC & Banyo Kapısı", detail: "Suya ve buhara %100 dayanıklı, buzlu dekoratif camlı ve kilitli WC kapısı" },
];

export const Services = () => {
  const { t } = useLanguage();
  const [activeColor, setActiveColor] = useState(PVC_COLOR_ALTERNATIVES[0]);

  return (
    <section id="hizmetler" className="relative py-24 overflow-hidden bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 overflow-hidden">
        {/* Section Header */}
        <div className="max-w-3xl mb-14 space-y-4">
          <span className="inline-block text-xs font-mono uppercase tracking-[0.2em] text-sky-700 font-bold bg-sky-100/80 px-3.5 py-1.5 rounded-full border border-sky-200">
            // {t("servicesBadge", "Fıratpen Ürün & Sistem Kataloğu")}
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 break-words">
            PVC Pencereler, Kapılar, Sürme &{" "}
            <span className="text-gradient italic">
              Cam Balkon Sistemleri
            </span>
          </h2>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed font-normal">
            Dayanımı ve yalıtımı dengeli Fıratpen PVC pencere, balkon kapısı, WC kapısı, çift kanat sürme pencere ve Düz/L/U cam balkon seçeneklerini hem standart hazır ölçülerde hem de projenize özel ölçülerde üretiyoruz.
          </p>
        </div>

        {/* 6 Main Product Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
          {services.map((s) => {
            const Icon = s.icon;
            return (
              <Link
                to={s.href}
                key={s.title}
                className="group relative bg-white rounded-3xl overflow-hidden transition-all duration-500 hover:-translate-y-1.5 border border-slate-200 hover:border-sky-400 flex flex-col justify-between shadow-md hover:shadow-xl"
              >
                <div>
                  <div className="relative h-52 overflow-hidden bg-slate-100">
                    <img
                      src={s.image}
                      alt={s.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/15 to-transparent" />
                    <div className="absolute top-3.5 left-3.5 h-11 w-11 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200 grid place-items-center text-sky-600 shadow-md">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="absolute top-3.5 right-3.5 text-[11px] font-mono uppercase tracking-wider px-3 py-1 rounded-full bg-slate-900/85 backdrop-blur-md text-white border border-white/20 font-semibold">
                      {s.badge}
                    </span>
                  </div>

                  <div className="p-6 sm:p-7">
                    <h3 className="font-serif text-xl sm:text-2xl font-bold mb-2.5 text-slate-900 group-hover:text-sky-600 transition-colors">
                      {s.title}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed mb-5 font-normal">
                      {s.desc}
                    </p>
                  </div>
                </div>

                <div className="px-6 sm:px-7 pb-6 pt-4 border-t border-slate-100 space-y-4 bg-slate-50/60">
                  <div className="flex flex-wrap gap-1.5">
                    {s.specs.map((sp) => (
                      <span
                        key={sp}
                        className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-white text-slate-700 border border-slate-200 font-semibold"
                      >
                        {sp}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-xs font-bold text-sky-600 group-hover:text-sky-700">
                    <span>{t("servicesViewDetail", "Teknik Detayları İncele")}</span>
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Interactive 3-Column PVC Window Color Alternatives Showcase (from cukurovaprofil.com) */}
        <div className="mt-20 bg-white rounded-3xl p-7 sm:p-10 border border-slate-200 shadow-xl">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-10 pb-6 border-b border-slate-100">
            <div>
              <span className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-sky-700 font-bold mb-2">
                <Palette className="h-4 w-4 text-sky-600" />
                Canlı Pencere Renk Önizleme • 19 Farklı Laminasyon & Folyo Seçeneği
              </span>
              <h3 className="font-serif text-2xl sm:text-4xl font-bold text-slate-900">
                Renk Alternatifleri
              </h3>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono font-bold px-3.5 py-1.5 rounded-full bg-sky-50 text-sky-800 border border-sky-200">
                Seçili Renk: {activeColor.name} {activeColor.code !== "Standart" ? `(${activeColor.code})` : ""}
              </span>
              <Link to="/urunler/renkli-camlar">
                <Button variant="outline" size="sm" className="rounded-full border-slate-300 text-xs font-bold">
                  Tüm Kartelayı Gör →
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: 4 Feature Blocks */}
            <div className="lg:col-span-4 space-y-4">
              {WINDOW_COLOR_FEATURES.map((feat, i) => (
                <div
                  key={i}
                  className="p-5 rounded-2xl bg-slate-50 border border-slate-200/90 hover:border-sky-300 hover:bg-white transition-all shadow-sm"
                >
                  <h4 className="font-serif text-base font-bold text-slate-900 mb-1.5 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-sky-600 shrink-0" />
                    <span>{feat.title}</span>
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    {feat.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Center Column: Interactive Live Window Image Preview */}
            <div className="lg:col-span-4 flex flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100/80 rounded-3xl p-6 border border-slate-200 min-h-[420px]">
              <img
                src={activeColor.previewImage}
                alt={`${activeColor.name} (${activeColor.code}) PVC Pencere Renk Önizleme`}
                className="max-h-[360px] w-auto object-contain drop-shadow-2xl transition-all duration-300"
              />
              <div className="mt-4 text-center">
                <div className="font-serif text-lg font-bold text-slate-900">
                  {activeColor.name}
                </div>
                <div className="text-xs font-mono text-sky-700 font-semibold">
                  Renk Kodu: {activeColor.code} • {activeColor.category}
                </div>
              </div>
            </div>

            {/* Right Column: 19 Swatches Grid */}
            <div className="lg:col-span-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Renk Seçimi Yapın (19 Alternatif)
                </span>
                <span className="text-[11px] text-slate-500">Tıklayarak Önizleyin</span>
              </div>

              <div className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-4 gap-3">
                {PVC_COLOR_ALTERNATIVES.map((c) => {
                  const isSelected = activeColor.id === c.id;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setActiveColor(c)}
                      title={`${c.name} (${c.code})`}
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
                          loading="lazy"
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

              <div className="mt-5 pt-4 border-t border-slate-200 flex items-center justify-between gap-2">
                <Link to="/hesaplama" className="w-full">
                  <Button className="w-full rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs h-10 shadow-sm">
                    {activeColor.name} Rengiyle Fiyat Teklifi Al
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Standard Ready-Size & Custom-Size PVC Window/Door Matrix (Reference from uygunpencere.com without prices) */}
        <div className="mt-16 bg-white rounded-3xl p-7 sm:p-10 border border-slate-200 shadow-lg">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-8">
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-sky-700 font-bold mb-2">
                <CheckCircle2 className="h-4 w-4 text-sky-600" />
                Standart Hazır Ölçüler & Özel Üretim Seçenekleri
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
                Çok Tercih Edilen PVC Pencere, Sürme & Kapı Ölçüleri
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl">
                70 mm ve 75 mm Fıratpen sistem, 1.00 mm+ galvanizli destek sacı, 2.5 mm+ profil et kalınlığı ve 4+16+4 ısıcam standardıyla; 19 farklı renk alternatifinde, Sağ/Sol ve Tek/Çift açılım seçenekleriyle üretilir.
              </p>
            </div>
            <a
              href="https://wa.me/905336253611?text=Merhaba%20Acarpen%2C%20PVC%20pencere%20ve%20kap%C4%B1%20%C3%B6l%C3%A7%C3%BClerim%20i%C3%A7in%20fiyat%20teklifi%20almak%20istiyorum."
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button className="rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5">
                <MessageCircle className="mr-1.5 h-4 w-4" />
                Ölçü Listesi Gönder & Fiyat Al
              </Button>
            </a>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {standardWindowModels.map((item) => (
              <div
                key={item.size}
                className="rounded-2xl bg-slate-50 border border-slate-200 p-4 flex flex-col justify-between hover:border-sky-400 hover:bg-white transition-all"
              >
                <div>
                  <span className="inline-block text-xs font-mono font-extrabold text-sky-700 bg-sky-100 px-2.5 py-1 rounded-lg border border-sky-200 mb-2.5">
                    {item.size}
                  </span>
                  <h4 className="font-serif text-sm font-bold text-slate-900 mb-1.5">
                    {item.type}
                  </h4>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    {item.detail}
                  </p>
                </div>
                <div className="mt-4 pt-2.5 border-t border-slate-200/80 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-emerald-700 font-bold">4+16+4 Isıcam</span>
                  <Link to="/hesaplama" className="text-[11px] font-bold text-sky-600 hover:text-sky-800">
                    Seç & Teklif Al →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
