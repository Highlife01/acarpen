import heroProductImg from "@/assets/firatpen-santiye-toplu-pvc.jpg";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { FloatingWhatsApp } from "@/components/site/FloatingWhatsApp";
import { SEO } from "@/components/SEO";
import {
  Building2,
  CheckCircle2,
  ArrowRight,
  Phone,
  Shield,
  Sun,
  Layers,
  MessageCircle,
} from "lucide-react";

const DisCepheCamlari = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="B2B Müteahhit Toplu PVC Siparişi, Alüminyum Doğrama & Kış Bahçesi | Acarpen Adana"
        description="Adana Fıratpen yetkili üretici bayi Acarpen'de müteahhit ve inşaat projelerine özel toplu PVC doğrama, ısı yalıtımlı alüminyum doğrama, kış bahçesi ve ofis bölme sistemleri."
        canonicalPath="/urunler/dis-cephe-camlari"
        schemaType="Service"
        serviceName="B2B Müteahhit Toplu PVC Siparişi, Alüminyum Doğrama & Kış Bahçesi"
        breadcrumbs={[
          { name: "Ürünlerimiz", path: "/hizmetler" },
          { name: "B2B Proje & Alüminyum Sistemleri", path: "/urunler/dis-cephe-camlari" },
        ]}
      />

      <Navbar />

      <main className="pt-20 lg:pt-28">
        <section className="relative py-16 lg:py-24 bg-[#040f26] text-white overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(14,165,233,0.22),transparent_60%)] pointer-events-none" />
          <div className="container mx-auto px-4 lg:px-8 relative z-10"><div className="grid lg:grid-cols-12 gap-10 items-center"><div className="lg:col-span-7">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-500/20 border border-sky-400/30 text-sky-300 text-xs font-mono font-bold tracking-wider uppercase mb-6">
                <Building2 className="w-3.5 h-3.5" />
                B2B Müteahhit & Şantiye Proje Çözümleri
              </span>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-white">
                Toplu Konut, Kış Bahçesi & <span className="text-sky-300 italic">Alüminyum Doğrama</span>
              </h1>
              <p className="text-lg text-slate-300 leading-relaxed mb-8">
                Adana ve Çukurova genelinde inşaat firmaları, müteahhitler ve mimari projeler için metraj bazlı toplu
                <strong> Fıratpen PVC doğrama</strong>, <strong>ısı yalıtımlı alüminyum doğrama</strong>,{" "}
                <strong>kış bahçesi</strong> ve ticari vitrin sistemlerini şantiye takviminize tam uyumlu olarak üretip
                montajlıyoruz.
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href="https://wa.me/905336253611?text=Merhaba%20Acarpen%2C%20m%C3%BCteahhit%20%2F%20%C5%9Fantiye%20projemiz%20i%C3%A7in%20toplu%20PVC%20ve%20al%C3%BCminyum%20do%C4%9Frama%20teklifi%20almak%20istiyoruz."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold px-7 py-4 rounded-xl transition-all shadow-lg"
                >
                  <MessageCircle className="w-4 h-4" />
                  Şantiye & Proje Teklifi İste
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
                <img src={heroProductImg} alt="B2B Müteahhit, Şantiye ve Toplu Konut PVC Doğrama Tedariki - Acarpen Adana" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 px-3 py-2 rounded-xl bg-slate-950/75 backdrop-blur-sm border border-white/10 text-xs font-medium text-white">
                  Toplu Konut & Şantiye Projeleri • Planlı Termin & Sevkiyat
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
                  icon: Layers,
                  title: "Toplu Konut & Şantiye Üretim Gücü",
                  desc: "CNC kesim ve dört köşe kaynak hattımızla çok bloklu konut projelerinde standart kalite ve zamanında teslimat garantisi.",
                },
                {
                  icon: Sun,
                  title: "Kış Bahçesi & Teras Kapama",
                  desc: "Villa, restoran ve müstakil konutlar için statik hesaplı, ısıcamlı ve sürme/katlanır entegreli kış bahçesi sistemleri.",
                },
                {
                  icon: Shield,
                  title: "Isı Yalıtımlı Alüminyum & Vitrin",
                  desc: "Ticari mağaza girişleri, ofis bölmeleri ve geniş açıklıklı mimari cepheler için alüminyum doğrama çözümleri.",
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
                Kurumsal & Mimari Proje Çözümlerimiz
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {[
                  "Müteahhit Projelerine Özel Toplu PVC Pencere & Kapı",
                  "Demonte (Montajsız) veya Anahtar Teslim Montajlı Sevkiyat",
                  "Isı Yalıtımlı Alüminyum Doğrama ve Mağaza Vitrinleri",
                  "Villa & Restoran Kış Bahçesi Sistemleri",
                  "19 Farklı Lamine Renk ve Güneş Kontrol Isıcam Seçeneği",
                  "Teknik Şartnameye Uygun TSE & CE Belgeli Üretim",
                ].map((spec, i) => (
                  <div key={i} className="flex items-center gap-3 p-4 rounded-xl bg-secondary/50 border border-border">
                    <CheckCircle2 className="w-5 h-5 text-accent shrink-0" />
                    <span className="text-sm font-medium text-foreground">{spec}</span>
                  </div>
                ))}
              </div>
              <Link
                to="/iletisim"
                className="inline-flex items-center gap-2 bg-accent text-accent-foreground font-semibold px-6 py-3.5 rounded-xl hover:bg-accent/90 transition-all"
              >
                Proje Metraj Listesi Gönderin
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

export default DisCepheCamlari;
