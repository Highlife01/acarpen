import heroProductImg from "@/assets/firatpen-cam-balkon-sistemleri.jpg";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { FloatingWhatsApp } from "@/components/site/FloatingWhatsApp";
import { SEO } from "@/components/SEO";
import {
  Home,
  CheckCircle2,
  ArrowRight,
  Phone,
  Shield,
  Sun,
  Award,
  MessageCircle,
} from "lucide-react";

const BalkonCami = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Düz, L ve U Katlanır, Sürme & Giyotin Cam Balkon Sistemleri | Acarpen Adana"
        description="Adana Acarpen'de Düz, L ve U balkon tiplerine özel 8mm - 10mm temperli ve ısıcamlı katlanır, eşikli/eşiksiz sürme ve motorlu giyotin cam balkon sistemleri."
        canonicalPath="/urunler/balkon-cami"
        schemaType="Product"
        serviceName="Düz, L ve U Katlanır, Sürme & Giyotin Cam Balkon Sistemleri"
        breadcrumbs={[
          { name: "Ürünlerimiz", path: "/hizmetler" },
          { name: "Cam Balkon Sistemleri", path: "/urunler/balkon-cami" },
        ]}
      />

      <Navbar />

      <main className="pt-24">
        <section className="relative py-20 lg:py-28 bg-primary text-primary-foreground overflow-hidden">
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-accent via-transparent to-transparent" />
          <div className="container mx-auto px-4 lg:px-8 relative z-10"><div className="grid lg:grid-cols-12 gap-10 items-center"><div className="lg:col-span-7">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/20 text-accent text-xs font-medium tracking-wider uppercase mb-6">
                <Home className="w-3.5 h-3.5" />
                Dört Mevsim Balkon & Teras Sistemleri
              </span>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Düz, L ve U Tipi <span className="text-accent">Cam Balkon Sistemleri</span>
              </h1>
              <p className="text-lg text-primary-foreground/80 leading-relaxed mb-8">
                Balkonunuzu dört mevsim kullanılabilir konforlu bir yaşam alanına dönüştüren 8 mm / 10 mm temperli veya
                ısıcamlı <strong>Katlanır Cam Balkon</strong>, <strong>Eşikli/Eşiksiz Sürme</strong> ve{" "}
                <strong>Uzaktan Kumandalı Giyotin Cam</strong> sistemlerini Adana Seyhan fabrikamızda özel ölçü
                üretiyoruz.
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href="https://wa.me/905336253611?text=Merhaba%20Acarpen%2C%20cam%20balkon%20sistemleri%20i%C3%A7in%20%C3%BCcretsiz%20ke%C5%9Fif%20ve%20fiyat%20teklifi%20almak%20istiyorum."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold px-7 py-4 rounded-xl transition-all shadow-lg"
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp'tan Ücretsiz Keşif İste
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
                <img src={heroProductImg} alt="Düz, L ve U Tipi Katlanır ve Sürme Cam Balkon Sistemleri - Acarpen Adana" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 px-3 py-2 rounded-xl bg-slate-950/75 backdrop-blur-sm border border-white/10 text-xs font-medium text-white">
                  Düz • L • U Tipi 8mm/10mm Temperli & Isıcamlı Cam Balkon
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
                  icon: Shield,
                  title: "Düz, L ve U Balkonlara Özel Tasarım",
                  desc: "Açılı, köşeli, L veya U tipi balkonlarda kesintisiz hareket eden çelik rulmanlı katlanır ve sürme kanat mimarisi.",
                },
                {
                  icon: Sun,
                  title: "Isıcamlı & Renkli Temperli Cam",
                  desc: "Şeffaf, füme, bronz, yeşil ve mavi reflekte cam alternatifleri ile sıcak/soğuk geçirgenliğini önleyen ısıcamlı seri.",
                },
                {
                  icon: Award,
                  title: "Alüminyum Fitil & Su Tahliye Kanalı",
                  desc: "Sararma yapmayan mıknatıslı/alüminyum ara fitiller, çocuk emniyet kilidi ve fırtınada su sızdırmayan damlalık profili.",
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
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-6">
                Cam Balkon Uygulama Seçeneklerimiz
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {[
                  "Düz, L ve U Tipi Katlanır Cam Balkon",
                  "Isıcamlı (Çift Camlı) Katlanır Cam Balkon",
                  "Eşikli & Eşiksiz Sürme Cam Balkon",
                  "Motorlu (Kumandalı) Giyotin Cam Sistemleri",
                  "Füme, Bronz ve Reflekte Cam Seçenekleri",
                  "Antrasit Gri, Bronz ve Ahşap Desen Alüminyum Kasa",
                ].map((spec, i) => (
                  <div key={i} className="flex items-center gap-3 p-4 rounded-xl bg-secondary/50 border border-border">
                    <CheckCircle2 className="w-5 h-5 text-accent shrink-0" />
                    <span className="text-sm font-medium text-foreground">{spec}</span>
                  </div>
                ))}
              </div>
              <Link
                to="/hesaplama"
                className="inline-flex items-center gap-2 bg-accent text-accent-foreground font-semibold px-6 py-3.5 rounded-xl hover:bg-accent/90 transition-all"
              >
                Cam Balkon Ölçü & Fiyat Hesaplama
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <FloatingWhatsApp />
    </div>
  );
};

export default BalkonCami;
