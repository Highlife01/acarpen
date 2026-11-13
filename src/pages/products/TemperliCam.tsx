import heroProductImg from "@/assets/firatpen-hebeschiebe-surme.jpg";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { FloatingWhatsApp } from "@/components/site/FloatingWhatsApp";
import { SEO } from "@/components/SEO";
import {
  Shield,
  CheckCircle2,
  ArrowRight,
  Phone,
  Maximize2,
  Sliders,
  Sparkles,
  MessageCircle,
} from "lucide-react";

const SLIDING_MODELS = [
  {
    name: "Fıratpen Zenia Slide, Winsa Panorama HS & Pimapen Albatros (Hebeschiebe)",
    dims: "Özel Ölçü Panoramik Cephe & Teras Kapıları",
    desc: "300 kg'a kadar kanat taşıma kapasitesi, engelsiz alt eşik ve tam sızdırmaz EPDM conta teknolojisiyle villa ve teraslar için üst segment sürme sistemi.",
  },
  {
    name: "120×120 cm Çift Kanat PVC Sürme Pencere",
    dims: "120×120 cm (Standart & Özel Ölçü)",
    desc: "Mutfak, balkon ve dar alanlarda kanat açılım yeri kaplamayan, çift raylı, ısıcamlı ve kilitli PVC sürme pencere sistemi.",
  },
  {
    name: "140×120 cm & Geniş Açıklıklı Çift Kanat PVC Sürme",
    dims: "140×120 cm / 160×140 cm / 200×210 cm",
    desc: "70'lik ve 75'lik seri profiller, 1.00 mm+ galvaniz destek sacı, 4+16+4 ısıcam ve 19 farklı lamine renk seçeneğiyle yüksek yalıtımlı sürme doğrama.",
  },
  {
    name: "Volkswagen (Tam Otomatik Paralel) Sürme Sistemleri",
    dims: "Balkon & Bahçe Çıkış Kapıları",
    desc: "Hem vasistas havalandırma hem de paralel kayar açılım sağlayan yüksek güvenlikli ve tam sızdırmaz sürme kapı çözümü.",
  },
];

const TemperliCam = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="PVC Sürme Pencereler & Hebeschiebe Sürme Kapılar | Acarpen — Fıratpen Bayi"
        description="Adana Fıratpen yetkili üretici bayi Acarpen'de 120x120, 140x120 çift kanat PVC sürme pencereler, Zenia Slide ve Hebeschiebe kaldır-sür teras kapıları."
        canonicalPath="/urunler/temperli-cam"
        schemaType="Product"
        serviceName="PVC Sürme Pencereler & Hebeschiebe Sürme Kapılar"
        breadcrumbs={[
          { name: "Ürünlerimiz", path: "/hizmetler" },
          { name: "PVC Sürme Sistemleri", path: "/urunler/temperli-cam" },
        ]}
      />

      <Navbar />

      <main className="pt-20 lg:pt-28">
        <section className="relative py-16 lg:py-24 bg-[#040f26] text-white overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(14,165,233,0.22),transparent_60%)] pointer-events-none" />
          <div className="container mx-auto px-4 lg:px-8 relative z-10"><div className="grid lg:grid-cols-12 gap-10 items-center"><div className="lg:col-span-7">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-500/20 border border-sky-400/30 text-sky-300 text-xs font-mono font-bold tracking-wider uppercase mb-6">
                <Maximize2 className="w-3.5 h-3.5" />
                Fıratpen • Winsa • Pimapen Sürme & Hebeschiebe
              </span>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-white">
                PVC Sürme Pencereler ve <span className="text-sky-300 italic">Hebeschiebe Kapılar</span>
              </h1>
              <p className="text-lg text-slate-300 leading-relaxed mb-8">
                Dar mekanlarda yer kazandıran <strong>120×120 cm</strong> ve <strong>140×120 cm çift kanat PVC sürme</strong>{" "}
                pencerelerden, geniş teras ve bahçe açıklıkları için tasarlanan{" "}
                <strong>Fıratpen Zenia Slide & Hebeschiebe</strong> kaldır-sür sistemlerine kadar tüm sürme doğrama
                çözümleri Acarpen'de.
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href="https://wa.me/905336253611?text=Merhaba%20Acarpen%2C%20PVC%20s%C3%BCrme%20pencere%20ve%20kap%C4%B1%20sistemleri%20i%C3%A7in%20fiyat%20teklifi%20almak%20istiyorum."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold px-7 py-4 rounded-xl transition-all shadow-lg"
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp'tan Sürme Teklifi Al
                </a>
                <a
                  href="tel:+905336253611"
                  className="inline-flex items-center gap-2 border border-white/30 bg-white/10 hover:bg-white/20 text-white font-semibold px-7 py-4 rounded-xl transition-all"
                >
                  <Phone className="w-4 h-4" />
                  0533 625 36 11
                </a>
              </div>
            </div>
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl overflow-hidden border border-white/15 shadow-2xl bg-slate-900 aspect-[4/3]">
                <img src={heroProductImg} alt="Fıratpen Zenia Hebeschiebe ve Çift Kanat PVC Sürme Sistemleri - Acarpen Adana" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 px-3 py-2 rounded-xl bg-slate-950/75 backdrop-blur-sm border border-white/10 text-xs font-medium text-white">
                  Fıratpen Zenia Slide & Hebeschiebe • 300 kg Kanat Kapasitesi
                </div>
              </div>
            </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-background">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              {[
                {
                  icon: Maximize2,
                  title: "Panoramik Manzara & Yer Tasarrufu",
                  desc: "İçe açılan kanat alanı gerektirmeyen raylı mekanizma sayesinde mutfak, balkon ve teraslarda maksimum kullanım alanı.",
                },
                {
                  icon: Shield,
                  title: "Güçlendirilmiş Rulman & Destek Sacı",
                  desc: "Ağır ısıcam yüklerini sessiz ve tek parmak dokunuşuyla taşıyan paslanmaz çelik ray ve rulman takımları.",
                },
                {
                  icon: Sliders,
                  title: "19 Renk & 4+16+4 Isıcam Donanımı",
                  desc: "Antrasit Gri, Altın Meşe, Vizon ve Kristal Beyaz dahil 19 lamine renk seçeneği ve temperli/lamine ısıcam opsiyonu.",
                },
              ].map((item, i) => (
                <div key={i} className="bg-card border border-border rounded-2xl p-7 shadow-sm">
                  <div className="w-12 h-12 rounded-xl bg-accent/15 text-accent flex items-center justify-center mb-5">
                    <item.icon className="w-6 h-6" />
                  </div>
                  <h2 className="font-display text-xl font-bold text-foreground mb-3">{item.title}</h2>
                  <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="bg-card border border-border rounded-3xl p-8 lg:p-12">
              <div className="flex items-center gap-3 mb-6">
                <Sparkles className="w-6 h-6 text-accent" />
                <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                  PVC Sürme Pencere & Kapı Modellerimiz
                </h2>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                {SLIDING_MODELS.map((model, i) => (
                  <div key={i} className="p-6 rounded-2xl bg-secondary/40 border border-border flex flex-col justify-between">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-accent">{model.dims}</span>
                      <h3 className="font-display text-xl font-bold text-foreground mt-1 mb-2">{model.name}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-4">{model.desc}</p>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-foreground">
                        <CheckCircle2 className="w-4 h-4 text-accent" />
                        Ücretsiz Keşif & Montaj
                      </span>
                      <a
                        href={`https://wa.me/905336253611?text=${encodeURIComponent(
                          `Merhaba Acarpen, ${model.name} için bilgi ve fiyat teklifi almak istiyorum.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-bold text-accent hover:underline"
                      >
                        Fiyat Teklifi Al <ArrowRight className="w-3.5 h-3.5" />
                      </a>
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

export default TemperliCam;
