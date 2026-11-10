import heroProductImg from "@/assets/firatpen-cnc-uretim-hatti.jpg";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { FloatingWhatsApp } from "@/components/site/FloatingWhatsApp";
import { SEO } from "@/components/SEO";
import {
  Wrench,
  CheckCircle2,
  ArrowRight,
  Phone,
  ShieldCheck,
  Layers,
  Sparkles,
  MessageCircle,
} from "lucide-react";

const ACCESSORY_GROUPS = [
  {
    category: "Pencere & Kapı Kolları / Aksesuarlar",
    items: [
      "Secustik ve Kilitli PVC Pencere Kolları (Beyaz, Antrasit, Bronz, Gümüş)",
      "Tek Açılım ve Çift Açılım (Vasistas) İspanyolet Mekanizmaları",
      "Balkon Kapısı İç-Dış Kol Takımları, Barel ve Emniyet Kilitleri",
      "Çocuk Güvenlik Kilitleri ve Rüzgar Çarpma Tutucuları",
    ],
  },
  {
    category: "Plise (Pileli) & Menteşeli Sineklik Sistemleri",
    items: [
      "Yatay ve Dikey Çalışan Plise (Akordiyon) Pencere & Kapı Sineklikleri",
      "Sürme Doğrama ve Cam Balkon Uyumlu Raylı Sineklik Sistemleri",
      "Kedi/Evcil Hayvan Dayanımlı Yırtılmaz Tül Seçenekleri",
      "19 Farklı PVC Renk Alternatifine Uygun Boyalı/Kaplamalı Alüminyum Kasa",
    ],
  },
  {
    category: "Montaj & İzolasyon Malzemeleri",
    items: [
      "Yüksek Yoğunluklu Poliüretan (PU) Montaj Köpükleri",
      "Nötr & Asetoksi Dış Cephe Doğrama Silikonları (UV Dayanımlı)",
      "Akrilik Cephe Mastikleri ve EPDM Sızdırmazlık Contaları",
      "Çelik Montaj Dübelleri, Şim Takozları ve Buhar Dengeleyici Bantlar",
    ],
  },
];

const LamineCam = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Pencere Kolları, Plise Sineklik & Montaj İzolasyon Malzemeleri | Acarpen Adana"
        description="Adana Fıratpen yetkili üretici bayi Acarpen'de PVC pencere kolları, çift açılım aksesuarları, plise sineklik sistemleri, poliüretan montaj köpüğü, silikon ve mastik malzemeleri."
        canonicalPath="/urunler/lamine-cam"
        schemaType="Product"
        serviceName="Pencere Kolları, Plise Sineklik & Montaj İzolasyon Malzemeleri"
        breadcrumbs={[
          { name: "Ürünlerimiz", path: "/hizmetler" },
          { name: "Sineklik, Kol & Montaj Malzemeleri", path: "/urunler/lamine-cam" },
        ]}
      />

      <Navbar />

      <main className="pt-24">
        <section className="relative py-20 lg:py-28 bg-primary text-primary-foreground overflow-hidden">
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-accent via-transparent to-transparent" />
          <div className="container mx-auto px-4 lg:px-8 relative z-10"><div className="grid lg:grid-cols-12 gap-10 items-center"><div className="lg:col-span-7">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/20 text-accent text-xs font-medium tracking-wider uppercase mb-6">
                <Wrench className="w-3.5 h-3.5" />
                Tamamlayıcı Donanım, Sineklik & İzolasyon
              </span>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Pencere Kolları, Sineklik & <span className="text-accent">Montaj Malzemeleri</span>
              </h1>
              <p className="text-lg text-primary-foreground/80 leading-relaxed mb-8">
                PVC pencere ve kapı sistemlerinizin ömrünü uzatan orijinal <strong>pencere kolları</strong>,{" "}
                <strong>tek/çift açılım aksesuarları</strong>, özel ölçü <strong>plise sineklikler</strong> ve tam
                sızdırmazlık sağlayan <strong>poliüretan köpük, silikon ve mastik</strong> montaj malzemeleri.
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href="https://wa.me/905336253611?text=Merhaba%20Acarpen%2C%20sineklik%2C%20pencere%20kolu%20ve%20montaj%20malzemeleri%20hakk%C4%B1nda%20bilgi%20almak%20istiyorum."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold px-7 py-4 rounded-xl transition-all shadow-lg"
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp'tan Sipariş & Bilgi Al
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
                <img src={heroProductImg} alt="Pencere Kolları, Plise Sineklik ve Montaj İzolasyon Malzemeleri - Acarpen Adana" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 px-3 py-2 rounded-xl bg-slate-950/75 backdrop-blur-sm border border-white/10 text-xs font-medium text-white">
                  Orijinal Pencere Kolları • Plise Sineklik • PU Köpük & Mastik
                </div>
              </div>
            </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-background">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid lg:grid-cols-3 gap-8 mb-16">
              {ACCESSORY_GROUPS.map((group, idx) => (
                <div key={idx} className="bg-card border border-border rounded-2xl p-7 shadow-sm">
                  <div className="w-11 h-11 rounded-xl bg-accent/15 text-accent flex items-center justify-center mb-4">
                    {idx === 0 ? (
                      <ShieldCheck className="w-5 h-5" />
                    ) : idx === 1 ? (
                      <Layers className="w-5 h-5" />
                    ) : (
                      <Sparkles className="w-5 h-5" />
                    )}
                  </div>
                  <h2 className="font-display text-xl font-bold text-foreground mb-4">{group.category}</h2>
                  <ul className="space-y-3">
                    {group.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                        <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="bg-card border border-border rounded-3xl p-8 lg:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h2 className="font-display text-2xl font-bold text-foreground mb-2">
                  Demonte Siparişler İçin Tam Montaj Seti Desteği
                </h2>
                <p className="text-sm text-muted-foreground max-w-2xl">
                  Standart veya özel ölçü PVC pencere ve kapı siparişlerinizle birlikte pencere kolu, montaj vidası,
                  PU köpük, nötr silikon ve dış cephe mastik setlerini tek pakette temin edebilirsiniz.
                </p>
              </div>
              <a
                href="https://wa.me/905336253611?text=Merhaba%20Acarpen%2C%20PVC%20do%C4%9Frama%20ve%20montaj%20malzemeleri%20i%C3%A7in%20fiyat%20almak%20istiyorum."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-accent text-accent-foreground font-semibold px-6 py-3.5 rounded-xl hover:bg-accent/90 transition-all shrink-0"
              >
                Hemen İletişime Geçin
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <FloatingWhatsApp />
    </div>
  );
};

export default LamineCam;
