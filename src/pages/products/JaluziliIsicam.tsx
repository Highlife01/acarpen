import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { FloatingWhatsApp } from "@/components/site/FloatingWhatsApp";
import { SEO } from "@/components/SEO";
import {
  DoorOpen,
  CheckCircle2,
  ArrowRight,
  Phone,
  Sparkles,
  MessageCircle,
} from "lucide-react";

const DOOR_MODELS = [
  {
    title: "85×198 cm & 85×210 cm PVC Balkon Kapısı",
    subtitle: "Standart Hazır & Özel Ölçü Balkon Kapıları",
    desc: "70'lik ve 75'lik Fıratpen profil serisi, 1.00 mm+ galvaniz destek sacı, 4+16+4 ısıcam, Sağ/Sol açılım yönü ve Tek/Çift açılım aksesuar seçenekleriyle üretilir.",
  },
  {
    title: "85×200 cm PVC WC & Banyo Kapısı",
    subtitle: "Suya ve Neme %100 Dayanıklı Kapı Sistemi",
    desc: "Banyo, tuvalet ve ıslak hacimler için buzlu ısıcamlı veya tam/yarım PVC lambri panelli, kilitli ve uzun ömürlü kapı çözümü.",
  },
  {
    title: "Motorlu & Manuel Alüminyum Panjur Sistemleri",
    subtitle: "Monoblok & Dıştan Takma Poliüretan Dolgulu Panjur",
    desc: "Güneş ışığını, sıcaklığı ve dış gürültüyü kesen, uzaktan kumandalı Somfy/Mosel motorlu veya manuel panjur ve kepenk sistemleri.",
  },
  {
    title: "Jaluzili Isıcamlı PVC Kapı & Pencere",
    subtitle: "Çift Cam Arası Mıknatıslı Jaluzi",
    desc: "Tozlanmayan ve bakım gerektirmeyen, iki cam arasına entegre jaluzi perdeli özel tasarım balkon kapısı ve ofis bölme sistemleri.",
  },
];

const JaluziliIsicam = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="PVC Balkon Kapıları (85x198, 85x210), WC Kapıları & Panjur | Acarpen Adana"
        description="Adana Fıratpen yetkili üretici bayi Acarpen'de 85x198 cm, 85x210 cm PVC balkon kapıları, 85x200 cm PVC WC/banyo kapıları, motorlu panjur ve jaluzili ısıcam sistemleri."
        canonicalPath="/urunler/jaluzili-isicam"
        schemaType="Product"
        serviceName="PVC Balkon Kapıları, WC Kapıları & Motorlu Panjur"
        breadcrumbs={[
          { name: "Ürünlerimiz", path: "/hizmetler" },
          { name: "PVC Kapı & Panjur Sistemleri", path: "/urunler/jaluzili-isicam" },
        ]}
      />

      <Navbar />

      <main className="pt-24">
        <section className="relative py-20 lg:py-28 bg-primary text-primary-foreground overflow-hidden">
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-accent via-transparent to-transparent" />
          <div className="container mx-auto px-4 lg:px-8 relative z-10">
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/20 text-accent text-xs font-medium tracking-wider uppercase mb-6">
                <DoorOpen className="w-3.5 h-3.5" />
                Fıratpen PVC Kapı & Panjur Sistemleri
              </span>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                PVC Balkon Kapıları, WC Kapıları & <span className="text-accent">Motorlu Panjur</span>
              </h1>
              <p className="text-lg text-primary-foreground/80 leading-relaxed mb-8">
                Standart <strong>85×198 cm</strong>, <strong>85×210 cm PVC balkon kapıları</strong> ve{" "}
                <strong>85×200 cm PVC WC/banyo kapıları</strong> ile monoblok motorlu panjur sistemlerinde 19 farklı
                lamine renk, Sağ/Sol yön ve Tek/Çift açılım seçenekleriyle doğrudan fabrika üretimi.
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href="https://wa.me/905336253611?text=Merhaba%20Acarpen%2C%20PVC%20balkon%20kap%C4%B1s%C4%B1%20%2F%20WC%20kap%C4%B1s%C4%B1%20ve%20panjur%20i%C3%A7in%20fiyat%20teklifi%20almak%20istiyorum."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold px-7 py-4 rounded-xl transition-all shadow-lg"
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp'tan Kapı & Panjur Teklifi Al
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
          </div>
        </section>

        <section className="py-20 bg-background">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid md:grid-cols-2 gap-6 mb-16">
              {DOOR_MODELS.map((item, i) => (
                <div key={i} className="bg-card border border-border rounded-2xl p-7 shadow-sm flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-accent">{item.subtitle}</span>
                    <h2 className="font-display text-2xl font-bold text-foreground mt-1 mb-3">{item.title}</h2>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-6">{item.desc}</p>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-foreground">
                      <CheckCircle2 className="w-4 h-4 text-accent" />
                      19 Renk • Sağ/Sol Açılım
                    </span>
                    <a
                      href={`https://wa.me/905336253611?text=${encodeURIComponent(
                        `Merhaba Acarpen, ${item.title} için fiyat teklifi almak istiyorum.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-bold text-accent hover:underline"
                    >
                      WhatsApp Teklif <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-card border border-border rounded-3xl p-8 lg:p-12">
              <div className="flex items-center gap-3 mb-6">
                <Sparkles className="w-6 h-6 text-accent" />
                <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                  Teknik Standartlar & Donanım Özellikleri
                </h2>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  "85×198 cm ve 85×210 cm Standart PVC Balkon Kapısı",
                  "85×200 cm Suya Dayanıklı PVC WC & Banyo Kapısı",
                  "1.00 mm+ Galvaniz Çelik Destek Sacı ve 2.5 mm+ Et Kalınlığı",
                  "4+16+4 Isıcam, Buzlu Cam veya Dekoratif PVC Panel",
                  "Sağ / Sol Açılım Yönü ve Tek / Çift Açılım Aksesuar",
                  "Uzaktan Kumandalı Poliüretan Dolgulu Alüminyum Panjur",
                ].map((spec, i) => (
                  <div key={i} className="flex items-center gap-3 p-4 rounded-xl bg-secondary/50 border border-border">
                    <CheckCircle2 className="w-5 h-5 text-accent shrink-0" />
                    <span className="text-sm font-medium text-foreground">{spec}</span>
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

export default JaluziliIsicam;
