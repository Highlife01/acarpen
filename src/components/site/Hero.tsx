import { useState, useEffect } from "react";
import { ArrowRight, ShieldCheck, Sparkles, Award, Calculator, CheckCircle2, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { addAdminQuote } from "@/lib/adminStorage";
import { useLanguage } from "@/context/LanguageContext";
import { PVC_COLOR_ALTERNATIVES } from "@/data/pvcColorAlternatives";
import { toast } from "sonner";

import slideFacade from "@/assets/firatpen-santiye-toplu-pvc.jpg";
import slideVilla from "@/assets/firatpen-selenit-pvc-pencere.jpg";
import slideBalcony from "@/assets/firatpen-cam-balkon-sistemleri.jpg";
import slideJaluzi from "@/assets/firatpen-balkon-wc-kapi.jpg";
import slideArchitecture from "@/assets/firatpen-hebeschiebe-surme.jpg";

const heroSlides = [
  {
    image: slideVilla,
    badge: "Doğrudan Üretim • Hızlı Üretim • Düzenli Tedarik • Tek Muhatap",
    caption: "Fıratpen 70'lik & 75'lik Sistem, Destek Saclı, 4+16+4 Isıcamlı Standart ve Özel Ölçü PVC Pencereler",
  },
  {
    image: slideBalcony,
    badge: "Düz, L ve U Cam Balkon & Sürme Sistemler",
    caption: "Katlanır, Sürme ve Giyotin Cam Balkon ile 120×120 / 140×120 Çift Kanat PVC Sürme Pencereler",
  },
  {
    image: slideJaluzi,
    badge: "PVC Balkon Kapıları & WC Kapıları",
    caption: "85×198 cm, 85×200 cm ve 85×210 cm PVC Balkon ve WC Kapılarında 19 Farklı Renk Alternatifi",
  },
  {
    image: slideFacade,
    badge: "B2B Müteahhit, Şantiye & Toplu Sipariş Tedariki",
    caption: "Konut Projeleri, Bayiler ve Şantiyeler İçin Seri Üretim, Paketleme ve Düzenli Sevkiyat Organizasyonu",
  },
  {
    image: slideArchitecture,
    badge: "Pencere Kolları, Montaj & İzolasyon Malzemeleri",
    caption: "Gülbahçesi Mah. Seyhan / Adana Merkezimizden PU Köpük, Silikon, Mastik, Aksesuar ve Tam Montaj Desteği",
  },
];

const QUICK_MODELS = [
  { id: "pvc-pencere-70", name: "70'lik / 75'lik Standart PVC Pencere (4+16+4 Isıcam)", w: 120, h: 120 },
  { id: "pvc-ortadan-kanat", name: "Ortadan Kanatlı PVC Pencere (130×130 / 200×210)", w: 130, h: 130 },
  { id: "pvc-sabit-acilir", name: "Bir Sabit Bir Açılır PVC Pencere (160×200 / 180×210)", w: 160, h: 200 },
  { id: "pvc-surme", name: "Çift Kanat PVC Sürme Pencere & Kapı (120×120 / 140×120)", w: 140, h: 120 },
  { id: "pvc-balkon-kapi", name: "PVC Pencere Balkon Kapısı (85×198 / 85×210 cm)", w: 85, h: 210 },
  { id: "pvc-wc-kapi", name: "PVC WC & Banyo Kapısı (85×200 cm)", w: 85, h: 200 },
  { id: "cam-balkon", name: "Düz / L / U Katlanır & Sürme Cam Balkon Sistemi", w: 350, h: 190 },
];

const BRAND_OPTIONS = [
  { id: "Fıratpen", series: "Selenit 75 / Redonit 85" },
  { id: "Winsa", series: "Dorado 76 / Safir 76" },
  { id: "Pimapen", series: "Nirvana 80 / Carisma 70" },
];

export const Hero = () => {
  const { t } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);

  const [selectedBrand, setSelectedBrand] = useState("Fıratpen");
  const [selectedModelId, setSelectedModelId] = useState(QUICK_MODELS[0].id);
  const [widthCm, setWidthCm] = useState<number>(120);
  const [heightCm, setHeightCm] = useState<number>(120);
  const [qty, setQty] = useState<number>(4);
  const [color, setColor] = useState("Kristal Beyaz");
  const [direction, setDirection] = useState("Sağ Açılım");
  const [accessory, setAccessory] = useState("Çift Açılım");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [showOrderInput, setShowOrderInput] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  const selectedModel = QUICK_MODELS.find((m) => m.id === selectedModelId) || QUICK_MODELS[0];
  const singleArea = Math.max(0.25, (widthCm / 100) * (heightCm / 100));
  const totalArea = Number((singleArea * Math.max(1, qty)).toFixed(2));

  const handleModelChange = (id: string) => {
    setSelectedModelId(id);
    const found = QUICK_MODELS.find((m) => m.id === id);
    if (found) {
      setWidthCm(found.w);
      setHeightCm(found.h);
    }
  };

  const handleQuickOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim()) {
      toast.error("Lütfen adınızı ve telefon numaranızı giriniz.");
      return;
    }

    const created = addAdminQuote({
      customerName: customerName.trim(),
      phone: customerPhone.trim(),
      city: "Adana (Hızlı Ölçü Robotu)",
      glassType: `[${selectedBrand}] ${selectedModel.name} [${color}]`,
      thickness: `${selectedBrand} • ${direction} • ${accessory} • 4+16+4 Isıcam`,
      dimensions: `${widthCm}x${heightCm} cm (${qty} Adet)`,
      totalArea,
      estimatedPrice: 0,
      status: "new",
    });

    toast.success(`Talebiniz (#${created.id}) Acarpen sistemine kaydedildi!`);

    const wpText = encodeURIComponent(
      `Merhaba Acarpen,\nWeb sitenizdeki Pencere & Kapı Yapılandırıcıdan fiyat teklifi rica ediyorum:\n\n` +
        `• Talep No: ${created.id}\n` +
        `• Ad Soyad: ${customerName}\n` +
        `• Telefon: ${customerPhone}\n` +
        `• Tercih Edilen Marka: ${selectedBrand}\n` +
        `• Ürün Modeli: ${selectedModel.name}\n` +
        `• Ölçü & Adet: ${widthCm}x${heightCm} cm (${qty} Adet — Toplam ${totalArea} m²)\n` +
        `• Renk Seçimi: ${color}\n` +
        `• Açılım Yönü & Aksesuar: ${direction} / ${accessory}\n` +
        `• Teknik Yapı: 1.00mm+ Destek Sacı, 2.5mm+ Et Kalınlığı, 4+16+4 Isıcam\n\n` +
        `Fiyat teklifi ve termin bilgisi için dönüşünüzü rica ederim.`
    );
    window.open(`https://wa.me/905336253611?text=${wpText}`, "_blank");
    setShowOrderInput(false);
    setCustomerName("");
    setCustomerPhone("");
  };

  return (
    <section className="relative min-h-[92vh] flex items-center overflow-hidden pt-28 pb-16 bg-slate-900">
      <div className="absolute inset-0 z-0">
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? "opacity-100 scale-100" : "opacity-0 scale-105"
            }`}
          >
            <img
              src={slide.image}
              alt={slide.badge}
              className="w-full h-full object-cover object-center brightness-[0.82] contrast-[1.05]"
            />
          </div>
        ))}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(95deg, rgba(15, 23, 42, 0.88) 0%, rgba(15, 23, 42, 0.70) 52%, rgba(15, 23, 42, 0.45) 100%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(180deg, rgba(15, 23, 42, 0.35) 0%, transparent 30%, rgba(248, 250, 252, 1) 100%)",
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full overflow-hidden">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          <div className="lg:col-span-7 space-y-6 min-w-0">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/95 backdrop-blur-md border border-sky-200 shadow-lg max-w-full">
              <Sparkles className="h-4 w-4 text-sky-600 shrink-0" />
              <span className="text-xs font-bold tracking-wider uppercase text-slate-900 truncate">
                {t("heroBadge", "Fıratpen Yetkili Üretici Bayi • Seyhan / Adana")}
              </span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold leading-[1.08] tracking-tight text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.6)] break-words">
              {t("heroTitle1", "DOĞRUDAN ÜRETİM.")}{" "}
              <span className="text-sky-300 italic font-extrabold">
                {t("heroTitleHighlight", "ACARPEN")}
              </span>
              <br />
              {t("heroTitle2", "FIRATPEN KALİTESİ VE")}{" "}
              <span className="text-emerald-300 font-extrabold">
                {t("heroTitleHighlight2", "GÜVENCESİ.")}
              </span>
            </h1>

            <p className="text-base sm:text-lg text-white max-w-2xl leading-relaxed font-medium bg-slate-900/55 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-white/20 shadow-xl">
              Adana Seyhan Gülbahçesi Mahallesi'ndeki üretim merkezimizde; <strong>Fıratpen, Winsa ve Pimapen</strong> PVC Pencereler, PVC Balkon & WC Kapıları, Hebeschiebe Sürme Sistemler, Renkli Isıcam ve Düz/L/U Cam Balkon çözümlerini doğrudan üretici güvencesiyle sunuyoruz.
            </p>

            <div className="flex flex-wrap items-center gap-3.5 pt-1">
              <Link to="/iletisim">
                <Button
                  size="lg"
                  className="rounded-full bg-sky-500 hover:bg-sky-400 text-slate-950 font-extrabold px-7 h-13 text-sm sm:text-base shadow-[0_10px_30px_rgba(14,165,233,0.45)] group transition-all"
                >
                  {t("heroCtaQuote", "Ücretsiz Keşif & Teklif Al")}
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <a
                href="https://wa.me/905336253611?text=Merhaba%20Acarpen%2C%20PVC%20pencere%2C%20kap%C4%B1%20ve%20cam%20balkon%20sistemleri%20i%C3%A7in%20fiyat%20teklifi%20almak%20istiyorum."
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full border-emerald-400/80 bg-emerald-600/90 hover:bg-emerald-500 text-white font-bold px-6 h-13 text-sm sm:text-base backdrop-blur-md shadow-lg"
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  WhatsApp: 0533 625 36 11
                </Button>
              </a>
            </div>

            <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-w-2xl">
              {[
                { icon: ShieldCheck, label: "3 Lider Marka", sub: "Fıratpen • Winsa • Pimapen" },
                { icon: Award, label: "Hızlı Üretim", sub: "Hazır & Özel Ölçü" },
                { icon: Sparkles, label: "Düzenli Tedarik", sub: "B2B Şantiye & Bayi" },
                { icon: CheckCircle2, label: "Tek Muhatap", sub: "Ölçü, İmalat & Montaj" },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    className="flex items-center gap-2.5 bg-white/95 backdrop-blur-md rounded-xl p-2.5 border border-slate-200 shadow-md"
                  >
                    <div className="h-8 w-8 rounded-lg bg-sky-50 border border-sky-200 grid place-items-center text-sky-600 shrink-0">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[11px] font-bold text-slate-900 truncate">{item.label}</div>
                      <div className="text-[10px] text-slate-600 font-medium truncate">{item.sub}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5">
                {heroSlides.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    aria-label={s.badge}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      idx === currentSlide ? "w-8 bg-sky-400" : "w-2 bg-white/50 hover:bg-white/80"
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs font-mono text-white font-semibold bg-slate-900/75 px-3 py-1 rounded-full border border-white/20">
                {heroSlides[currentSlide].badge}
              </span>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-[0_24px_60px_rgba(15,23,42,0.35)] relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 rounded-2xl bg-sky-600 grid place-items-center text-white shadow-md">
                    <Calculator className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-sky-600 block font-bold">
                      Pencere, Kapı & Cam Balkon Yapılandırıcı
                    </span>
                    <h2 className="font-serif text-lg sm:text-xl font-bold text-slate-900">
                      Ölçü, Renk & Açılım Seçin
                    </h2>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                  4+16+4 Isıcamlı
                </span>
              </div>

              <form onSubmit={handleQuickOrder} className="space-y-3.5">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    1. Profil Markası Seçin
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {BRAND_OPTIONS.map((b) => {
                      const active = selectedBrand === b.id;
                      return (
                        <button
                          key={b.id}
                          type="button"
                          onClick={() => setSelectedBrand(b.id)}
                          className={`rounded-xl border px-2.5 py-2 text-left transition-all ${
                            active
                              ? "border-sky-600 bg-sky-50 ring-2 ring-sky-500/20"
                              : "border-slate-200 bg-slate-50 hover:border-sky-300"
                          }`}
                        >
                          <div className={`text-xs font-extrabold ${active ? "text-sky-700" : "text-slate-900"}`}>
                            {b.id}
                          </div>
                          <div className="text-[9.5px] font-mono text-slate-500 truncate">{b.series}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    2. Ürün Kategorisi & Model Seçin
                  </label>
                  <select
                    value={selectedModelId}
                    onChange={(e) => handleModelChange(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs font-semibold focus:outline-none focus:border-sky-600 focus:bg-white transition-colors"
                  >
                    {QUICK_MODELS.map((item) => (
                      <option key={item.id} value={item.id} className="bg-white text-slate-900">
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">
                    Hazır Standart Ölçüler (veya Aşağıdan Özel Ölçü Girin)
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { l: "50×50", w: 50, h: 50 },
                      { l: "100×100", w: 100, h: 100 },
                      { l: "120×120", w: 120, h: 120 },
                      { l: "130×130", w: 130, h: 130 },
                      { l: "150×140", w: 150, h: 140 },
                      { l: "160×200", w: 160, h: 200 },
                      { l: "200×210", w: 200, h: 210 },
                      { l: "85×210 Kapı", w: 85, h: 210 },
                    ].map((preset) => (
                      <button
                        key={preset.l}
                        type="button"
                        onClick={() => {
                          setWidthCm(preset.w);
                          setHeightCm(preset.h);
                        }}
                        className={`text-[10px] font-mono px-2 py-1 rounded-lg border font-bold transition-colors ${
                          widthCm === preset.w && heightCm === preset.h
                            ? "bg-sky-600 text-white border-sky-600"
                            : "bg-slate-50 text-slate-700 border-slate-200 hover:border-sky-300"
                        }`}
                      >
                        {preset.l}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2.5">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">En (cm)</label>
                    <input
                      type="number"
                      min={30}
                      max={600}
                      value={widthCm}
                      onChange={(e) => setWidthCm(Number(e.target.value) || 0)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-mono text-sm font-bold focus:outline-none focus:border-sky-600 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Boy (cm)</label>
                    <input
                      type="number"
                      min={30}
                      max={600}
                      value={heightCm}
                      onChange={(e) => setHeightCm(Number(e.target.value) || 0)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-mono text-sm font-bold focus:outline-none focus:border-sky-600 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Adet</label>
                    <input
                      type="number"
                      min={1}
                      max={500}
                      value={qty}
                      onChange={(e) => setQty(Number(e.target.value) || 1)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-mono text-sm font-bold focus:outline-none focus:border-sky-600 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2.5">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Renk (19 Seçenek)</label>
                    <select
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className="w-full px-2.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs font-semibold"
                    >
                      {PVC_COLOR_ALTERNATIVES.map((c) => (
                        <option key={c.id} value={c.name}>
                          {c.name} ({c.code})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Açılım Yönü</label>
                    <select
                      value={direction}
                      onChange={(e) => setDirection(e.target.value)}
                      className="w-full px-2.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs font-semibold"
                    >
                      <option value="Sağ Açılım">Sağ Açılım</option>
                      <option value="Sol Açılım">Sol Açılım</option>
                      <option value="Çift Kanat / Sürme">Çift Kanat / Sürme</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Aksesuar</label>
                    <select
                      value={accessory}
                      onChange={(e) => setAccessory(e.target.value)}
                      className="w-full px-2.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs font-semibold"
                    >
                      <option value="Tek Açılım">Tek Açılım</option>
                      <option value="Çift Açılım">Çift Açılım</option>
                      <option value="Vasistas">Vasistas</option>
                    </select>
                  </div>
                </div>

                <div className="rounded-2xl bg-sky-50/90 border border-sky-200 p-3.5 flex items-center justify-between">
                  <div>
                    <div className="text-[11px] text-slate-700 font-semibold">
                      Toplam Metraj: <span className="text-slate-900 font-mono font-bold">{totalArea} m²</span> ({qty} Adet)
                    </div>
                    <div className="text-[11px] text-sky-800 font-medium mt-0.5">
                      {selectedBrand} • {color} • {direction} • {accessory}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-block text-[10px] font-mono font-bold px-2.5 py-1 rounded-lg bg-emerald-600 text-white">
                      Özel Fiyat Teklifi
                    </span>
                  </div>
                </div>

                {!showOrderInput ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                    <Button
                      type="button"
                      onClick={() => setShowOrderInput(true)}
                      className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-11 text-xs shadow-md"
                    >
                      <MessageCircle className="mr-1.5 h-4 w-4" />
                      WhatsApp'tan Fiyat Al
                    </Button>
                    <Link to="/hesaplama" className="w-full">
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full rounded-xl border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-semibold h-11 text-xs"
                      >
                        Çoklu Ölçü Listesi Oluştur →
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-2.5 pt-2 border-t border-slate-200 animate-fade-up">
                    <div className="grid grid-cols-2 gap-2.5">
                      <input
                        type="text"
                        required
                        placeholder="Adınız / Firma Adı *"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-sky-600"
                      />
                      <input
                        type="tel"
                        required
                        placeholder="Telefon Numaranız *"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-sky-600"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="submit"
                        className="flex-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-10 text-xs"
                      >
                        WhatsApp'tan Teklif İste (0533 625 36 11)
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setShowOrderInput(false)}
                        className="text-xs text-slate-600 hover:text-slate-900 h-10 px-3"
                      >
                        İptal
                      </Button>
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
