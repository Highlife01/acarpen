import heroProductImg from "@/assets/firatpen-selenit-pvc-pencere.jpg";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { FloatingWhatsApp } from "@/components/site/FloatingWhatsApp";
import { SEO } from "@/components/SEO";
import { PVC_COLOR_ALTERNATIVES, PVC_COLORED_GLASS_OPTIONS } from "@/data/pvcColorAlternatives";
import {
  Shield,
  Thermometer,
  CheckCircle2,
  ArrowRight,
  Phone,
  Layers,
  Sparkles,
  MessageCircle,
  Palette,
  SlidersHorizontal,
} from "lucide-react";

const STANDARD_WINDOW_MATRIX = [
  { size: "40×40 cm / 50×50 cm", type: "Banyo & WC Vasistas Pencere", spec: "70'lik Sistem • Tek Açılım / Vasistas • Buzlu 4+16+4 Isıcam" },
  { size: "75×100 cm / 100×100 cm", type: "Standart Tek Kanat PVC Pencere", spec: "70'lik Sistem • Sağ/Sol Seçenekli • Tek/Çift Açılım" },
  { size: "120×120 cm", type: "Standart PVC Pencere", spec: "70'lik / 75'lik Sistem • 1.00 mm+ Destek Sacı • 4+16+4 Isıcam" },
  { size: "130×130 cm", type: "Ortadan Kanatlı PVC Pencere", spec: "70'lik / 75'lik Sistem • Sağ/Sol Açılım • Çift Açılım Opsiyonlu" },
  { size: "140×140 cm / 150×140 cm", type: "Geniş Salon & Oda Penceresi", spec: "70'lik / 75'lik Sistem • 2.5 mm+ Et Kalınlığı • Yüksek Yalıtım" },
  { size: "160×200 cm / 160×210 cm", type: "Bir Sabit Bir Açılır Pencere", spec: "75'lik Selenit / Elegance • Geniş Cam Açıklığı • EPDM Conta" },
  { size: "180×210 cm / 200×140 cm", type: "Bir Sabit Bir Açılır Panoramik", spec: "75'lik Sistem • 1.5 mm+ Galvaniz Destek Sacı • Konfor Isıcam" },
  { size: "200×210 cm / 220×210 cm", type: "Ortadan Kanatlı Büyük Cephe", spec: "75'lik / 85'lik Sistem • Maksimum Statik Mukavemet • 19 Renk" },
];

const CiftCam = () => {
  const [selectedColor, setSelectedColor] = useState(PVC_COLOR_ALTERNATIVES[0]);

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="PVC Pencere Sistemleri (Fıratpen • Winsa • Pimapen) | Acarpen Adana"
        description="Adana Fıratpen yetkili üretici bayi Acarpen'de 40x40'tan 220x210 cm'e hazır standart ve özel ölçü PVC pencereler, 1.00 mm+ destek sacı, 2.5 mm+ et kalınlığı, 4+16+4 ısıcam ve 19 renk seçeneği."
        canonicalPath="/urunler/cift-cam"
        schemaType="Product"
        serviceName="Fıratpen 70'lik & 75'lik PVC Pencere Sistemleri"
        breadcrumbs={[
          { name: "Ürünlerimiz", path: "/hizmetler" },
          { name: "PVC Pencere Sistemleri", path: "/urunler/cift-cam" },
        ]}
      />

      <Navbar />

      <main className="pt-24">
        <section className="relative py-20 lg:py-28 bg-primary text-primary-foreground overflow-hidden">
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-accent via-transparent to-transparent" />
          <div className="container mx-auto px-4 lg:px-8 relative z-10"><div className="grid lg:grid-cols-12 gap-10 items-center"><div className="lg:col-span-7">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/20 text-accent text-xs font-medium tracking-wider uppercase mb-6">
                <Thermometer className="w-3.5 h-3.5" />
                Fıratpen • Winsa • Pimapen PVC Pencere Sistemleri
              </span>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Fıratpen, Winsa & Pimapen <span className="text-accent">PVC Pencereler</span>
              </h1>
              <p className="text-lg text-primary-foreground/80 leading-relaxed mb-8">
                Acarpen fabrikasında TS EN 12608-1 A sınıfı standartlarında üretilen Fıratpen Selenit 75, Elegance 80 ve
                Redonit 85 serisi pencereler; <strong>1.00 mm+ galvaniz destek sacı</strong>,{" "}
                <strong>2.5 mm+ profil et kalınlığı</strong> ve <strong>4+16+4 ısıcam</strong> donanımıyla maksimum ısı
                ve ses yalıtımı sağlar.
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href="https://wa.me/905336253611?text=Merhaba%20Acarpen%2C%20PVC%20pencere%20%C3%B6l%C3%A7%C3%BC%20ve%20fiyat%20teklifi%20almak%20istiyorum."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold px-7 py-4 rounded-xl transition-all shadow-lg"
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp'tan Ölçü Gönder & Teklif Al
                </a>
                <a
                  href="tel:+905336253611"
                  className="inline-flex items-center gap-2 border border-primary-foreground/30 hover:bg-primary-foreground/10 text-primary-foreground font-semibold px-7 py-4 rounded-xl transition-all"
                >
                  <Phone className="w-4 h-4" />
                  0533 625 36 11
                </a>
              </div>
            </div>
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl overflow-hidden border border-white/15 shadow-2xl bg-slate-900 aspect-[4/3]">
                <img src={heroProductImg} alt="Fıratpen Selenit 75 ve Redonit 85 PVC Pencere Sistemleri - Acarpen Adana" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 px-3 py-2 rounded-xl bg-slate-950/75 backdrop-blur-sm border border-white/10 text-xs font-medium text-white">
                  Fıratpen Selenit 75 • 4+16+4 Isıcam • Çift Açılım İspanyolet
                </div>
              </div>
            </div>
            </div>
          </div>
        </section>

        {/* Technical Highlights */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
              {[
                {
                  icon: Layers,
                  title: "Fıratpen, Winsa & Pimapen Serileri",
                  desc: "Fıratpen (Selenit 75, Redonit 85), Winsa (Dorado 76, Safir 76, Revotech) ve Pimapen (Nirvana 80, Carisma 70) serileriyle üstün ısı ve ses yalıtımı.",
                },
                {
                  icon: Shield,
                  title: "1.00 mm+ Destek Sacı & 2.5 mm+ Et Kalınlığı",
                  desc: "Rüzgar yüküne ve sarkmalara karşı korozyon dirençli galvaniz çelik destek sacı ve A sınıfı profil et kalınlığı.",
                },
                {
                  icon: SlidersHorizontal,
                  title: "Sağ/Sol Yön & Tek/Çift Açılım",
                  desc: "İhtiyacınıza göre Sağ veya Sol açılım yönü, standart Tek Açılım veya Vasistaslı Çift Açılım ispanyolet mekanizması.",
                },
                {
                  icon: Sparkles,
                  title: "4+16+4 Isıcam & Konfor Cam",
                  desc: "Standart 24 mm (4+16+4) çift cam veya dört mevsim güneş kontrol kaplamalı Sinerji/Konfor ısıcam uygulaması.",
                },
              ].map((item, i) => (
                <div key={i} className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                  <div className="w-12 h-12 rounded-xl bg-accent/15 text-accent flex items-center justify-center mb-4">
                    <item.icon className="w-6 h-6" />
                  </div>
                  <h2 className="font-display text-lg font-bold text-foreground mb-2">{item.title}</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>

            {/* Standard Sizes Matrix */}
            <div className="bg-card border border-border rounded-3xl p-8 lg:p-12 mb-16">
              <div className="max-w-2xl mb-8">
                <span className="text-xs font-bold uppercase tracking-wider text-accent">
                  1 Bölmeli • Ortadan Kanatlı • Bir Sabit Bir Açılır
                </span>
                <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mt-1">
                  Standart ve Özel Ölçü PVC Pencere Tablosu
                </h2>
                <p className="text-sm text-muted-foreground mt-2">
                  Bireysel tadilatlar, müteahhit projeleri ve demonte/montajlı talepler için en çok tercih edilen
                  pencere ölçülerimiz (özel ölçülerde milimetrik CNC üretim yapılmaktadır):
                </p>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {STANDARD_WINDOW_MATRIX.map((row, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-secondary/50 border border-border"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
                        <span className="font-display font-bold text-foreground">{row.size}</span>
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-accent/15 text-accent font-semibold">
                          {row.type}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 pl-6">{row.spec}</p>
                    </div>
                    <a
                      href={`https://wa.me/905336253611?text=${encodeURIComponent(
                        `Merhaba Acarpen, ${row.size} (${row.type}) PVC pencere için fiyat teklifi almak istiyorum.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-accent hover:underline pl-6 sm:pl-0 shrink-0"
                    >
                      Teklif İste →
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* 19 Color Alternatives Interactive Preview */}
            <div className="bg-secondary/40 border border-border rounded-3xl p-8 lg:p-12">
              <div className="grid lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-5 text-center">
                  <div className="bg-background rounded-2xl p-6 border border-border shadow-sm">
                    <img
                      src={selectedColor.previewImage}
                      alt={`${selectedColor.name} PVC Pencere`}
                      className="max-h-72 mx-auto object-contain"
                    />
                    <div className="mt-4">
                      <span className="text-xs uppercase tracking-wider text-accent font-bold">
                        Seçili Lamine Renk ({selectedColor.code})
                      </span>
                      <h3 className="font-display text-xl font-bold text-foreground">{selectedColor.name}</h3>
                    </div>
                  </div>
                </div>
                <div className="lg:col-span-7">
                  <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-accent mb-2">
                    <Palette className="w-4 h-4" />
                    19 Farklı Lamine Renk Alternatifi
                  </div>
                  <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-3">
                    Cephenize Uygun Renk ve Ahşap Dokusunu Seçin
                  </h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    Antrasit Gri, Altın Meşe, Metalik Antrasit, Vizon ve Kristal Beyaz dahil 19 farklı UV dayanımlı
                    folyo kaplama seçeneğiyle pencerelerinizi kişiselleştirin.
                  </p>
                  <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2.5 mb-6">
                    {PVC_COLOR_ALTERNATIVES.map((color) => {
                      const active = color.id === selectedColor.id;
                      return (
                        <button
                          key={color.id}
                          type="button"
                          onClick={() => setSelectedColor(color)}
                          className={`p-1.5 rounded-xl border text-left transition-all ${
                            active
                              ? "border-accent bg-accent/10 ring-2 ring-accent/30"
                              : "border-border bg-background hover:border-accent/50"
                          }`}
                        >
                          <img
                            src={color.swatchImage}
                            alt={color.name}
                            className="w-full h-9 object-cover rounded-lg mb-1"
                          />
                          <span className="block text-[10px] font-semibold text-foreground truncate">{color.name}</span>
                        </button>
                      );
                    })}
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Link
                      to="/urunler/renkli-camlar"
                      className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-5 py-3 rounded-xl text-sm hover:bg-primary/90 transition-all"
                    >
                      Tüm 19 Renk Kataloğunu İncele
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link
                      to="/hesaplama"
                      className="inline-flex items-center gap-2 bg-accent text-accent-foreground font-semibold px-5 py-3 rounded-xl text-sm hover:bg-accent/90 transition-all"
                    >
                      Online Ölçü & Teklif Hesapla
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* PVC İçin Renkli & Reflekte Isıcam Seçenekleri */}
            <div className="mt-14 bg-slate-900 text-white rounded-3xl p-8 lg:p-10 border border-slate-800 shadow-xl">
              <div className="max-w-3xl mb-8">
                <span className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-sky-400 font-bold mb-2">
                  <Sparkles className="w-4 h-4" />
                  PVC Doğramalar İçin Renkli & Güneş Kontrol Camları
                </span>
                <h3 className="font-display text-2xl md:text-3xl font-bold text-white mb-2">
                  PVC Pencereleriniz İçin Renkli Isıcam Seçenekleri
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Fıratpen PVC pencerelerinizde standart şeffaf çift camın yanı sıra; güneş ısısını kesen, içerinin görünmesini engelleyen ve doğrama renginizle bütünleşen <strong>Füme, Bronz, Mavi/Yeşil Reflekte, Satinato Buzlu ve Solar Low-E Konfor</strong> cam alternatiflerini tercih edebilirsiniz.
                </p>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {PVC_COLORED_GLASS_OPTIONS.map((g) => (
                  <div key={g.id} className="rounded-2xl bg-slate-950/80 border border-slate-800 p-5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className={`w-9 h-9 rounded-xl bg-gradient-to-br ${g.gradientClass} border border-white/20 inline-block`} />
                        <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/30">
                          {g.solarControl}
                        </span>
                      </div>
                      <h4 className="font-bold text-base text-white mb-1">{g.name}</h4>
                      <div className="text-xs font-mono text-sky-400 mb-2">{g.spec}</div>
                      <p className="text-xs text-slate-300 leading-relaxed mb-3">{g.benefit}</p>
                    </div>
                    <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400">
                      <strong className="text-slate-200">Uyumlu PVC Renkleri:</strong> {g.matchingProfiles}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* PVC İçin Renkli & Reflekte Isıcam Seçenekleri */}
            <div className="mt-14 bg-slate-900 text-white rounded-3xl p-8 lg:p-10 border border-slate-800 shadow-xl">
              <div className="max-w-3xl mb-8">
                <span className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-sky-400 font-bold mb-2">
                  <Sparkles className="w-4 h-4" />
                  PVC Doğramalar İçin Renkli & Güneş Kontrol Camları
                </span>
                <h3 className="font-display text-2xl md:text-3xl font-bold text-white mb-2">
                  PVC Pencereleriniz İçin Renkli Isıcam Seçenekleri
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Fıratpen PVC pencerelerinizde standart şeffaf çift camın yanı sıra; güneş ısısını kesen, içerinin görünmesini engelleyen ve doğrama renginizle bütünleşen <strong>Füme, Bronz, Mavi/Yeşil Reflekte, Satinato Buzlu ve Solar Low-E Konfor</strong> cam alternatiflerini tercih edebilirsiniz.
                </p>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {PVC_COLORED_GLASS_OPTIONS.map((g) => (
                  <div key={g.id} className="rounded-2xl bg-slate-950/80 border border-slate-800 p-5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className={`w-9 h-9 rounded-xl bg-gradient-to-br ${g.gradientClass} border border-white/20 inline-block`} />
                        <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/30">
                          {g.solarControl}
                        </span>
                      </div>
                      <h4 className="font-bold text-base text-white mb-1">{g.name}</h4>
                      <div className="text-xs font-mono text-sky-400 mb-2">{g.spec}</div>
                      <p className="text-xs text-slate-300 leading-relaxed mb-3">{g.benefit}</p>
                    </div>
                    <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400">
                      <strong className="text-slate-200">Uyumlu PVC Renkleri:</strong> {g.matchingProfiles}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <FloatingWhatsApp />
    </div>
  );
};

export default CiftCam;
