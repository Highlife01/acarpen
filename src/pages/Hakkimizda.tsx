import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { SEO } from "@/components/SEO";
import { ShieldCheck, Award, Building2, CheckCircle2, Users, Target, Sparkles, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import corporateImg from "@/assets/project-plaza.jpg";
import productionImg from "@/assets/project-tech.jpg";

export default function Hakkimizda() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 pt-28">
      <SEO
        title="Hakkımızda & Kurumsal Kimlik | Acarpen — Adana Fıratpen Yetkili Üretici Bayi"
        description="Acar Pen İnşaat Sanayi ve Ticaret Limited Şirketi (Acarpen), Adana Seyhan Gülbahçesi Mahallesi'ndeki üretim ve uygulama merkezinde Fıratpen Yetkili Üretici Bayisi olarak PVC pencere, kapı, sürme ve cam balkon sistemleri üretmektedir."
        canonicalPath="/hakkimizda"
        schemaType="AboutPage"
        breadcrumbs={[{ name: "Hakkımızda", path: "/hakkimizda" }]}
      />
      <Navbar />

      {/* Hero Section */}
      <section className="py-16 border-b border-slate-200 relative overflow-hidden bg-gradient-to-b from-sky-50 via-white to-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <span className="inline-block text-xs font-mono uppercase tracking-[0.2em] text-sky-700 font-bold bg-sky-100/80 px-3.5 py-1.5 rounded-full border border-sky-200 mb-3">
            // Kurumsal Hikayemiz & Vizyonumuz
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl font-bold text-slate-900 max-w-4xl leading-tight">
            Doğrudan Üretim, Hızlı Tedarik ve <span className="text-gradient italic">Fıratpen Güvencesi.</span>
          </h1>
          <p className="mt-4 text-slate-600 max-w-3xl text-base sm:text-lg leading-relaxed font-normal">
            <strong className="text-slate-900 font-bold">Acar Pen İnşaat Sanayi ve Ticaret Limited Şirketi (Acarpen)</strong> olarak, Adana Seyhan Gülbahçesi Mahallesi'ndeki üretim ve showroom merkezimizde; Fıratpen PVC Pencere & Kapı Sistemleri, Sürme Sistemler, Düz/L/U Cam Balkon, Panjur, Sineklik ve Montaj Malzemeleri üretimini tek çatı altında sunuyoruz.
          </p>
        </div>
      </section>

      {/* Corporate Overview Section */}
      <section className="py-16 max-w-7xl mx-auto px-6">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-lg relative overflow-hidden mb-16">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-center relative z-10">
            <div className="lg:col-span-6">
              <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-md relative group bg-slate-100">
                <img
                  src={corporateImg}
                  alt="Acarpen Fıratpen Yetkili Üretici Bayi Seyhan Adana"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/75 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold px-3 py-1.5 rounded-full bg-white/95 text-sky-800 border border-slate-200 shadow-sm">
                    <Sparkles className="h-3.5 w-3.5 text-sky-600" />
                    Acar Pen İnşaat San. ve Tic. Ltd. Şti.
                  </span>
                  <span className="text-xs font-mono text-white bg-slate-900/80 px-2.5 py-1 rounded-md border border-white/20 font-semibold">
                    Seyhan / ADANA
                  </span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 space-y-5">
              <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-sky-700 font-bold">
                <Award className="h-4 w-4 text-sky-600" />
                Doğrudan Üretim • Hızlı Üretim • Düzenli Tedarik • Tek Muhatap
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 leading-tight">
                Hem Bireysel Konutlarda Hem B2B Şantiye Projelerinde Güvenilir Çözüm Ortağınız
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-normal">
                Acarpen'de dayanımı ve yalıtımı dengeli Fıratpen PVC pencere ve kapı seçeneklerini hem standart hazır ölçülerde hem de projenize özel ölçülerde kolayca bulabilirsiniz. 70 mm, 75 mm (Selenit 75) ve 85 mm (Redonit 85) sistemlerimiz; galvanizli çelik destek sacı, 2.5 mm - 3.0 mm profil et kalınlığı ve 4+16+4 ısıcam standardıyla üretilir.
              </p>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-normal">
                B2B toplu alım tarafında; müteahhitler, bayiler, şantiyeler, konut projeleri ve üretim atölyeleri için toplu sipariş ve düzenli tedarik modelleriyle destek sunuyoruz. Sipariş adetleri ve sevkiyat planına göre paketleme, termin ve montaj organizasyonu titizlikle yürütülür.
              </p>

              <div className="grid sm:grid-cols-2 gap-3 pt-2">
                <div className="rounded-xl bg-slate-50 border border-slate-200 p-3.5 flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-sky-600 shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-slate-900">Gülbahçesi Mah. Seyhan</div>
                    <div className="text-[11px] text-slate-600 font-medium">13428 Sok. No:16/17 Seyhan / Adana</div>
                  </div>
                </div>
                <div className="rounded-xl bg-slate-50 border border-slate-200 p-3.5 flex items-center gap-3">
                  <Phone className="h-5 w-5 text-emerald-600 shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-slate-900">0533 625 36 11</div>
                    <div className="text-[11px] text-slate-600 font-medium">Telefon & WhatsApp Sipariş Hattı</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Technical & Operational Strengths */}
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-7 space-y-6">
            <h2 className="font-serif text-3xl font-bold text-slate-900">
              CNC Otomasyonlu Üretim ve Kalite Standartlarımız
            </h2>
            <p className="text-slate-600 leading-relaxed text-sm sm:text-base font-normal">
              Üretim parkurumuzda Fıratpen'in kurşunsuz hammadde formülasyonuyla üretilen A sınıfı profilleri; otomatik CNC kesim, dört köşe kaynak, CNC köşe temizleme ve ispanyolet donanım istasyonlarında işlenmektedir.
            </p>
            <p className="text-slate-600 leading-relaxed text-sm sm:text-base font-normal">
              Beyaz, Antrasit Gri ve Altınmeşe renk seçenekleri; Sağ/Sol açılım yönü ve Tek Açılım / Çift Açılım / Sürme aksesuar alternatifleriyle her mekana uzun ömürlü konfor kazandırıyoruz.
            </p>

            <div className="grid sm:grid-cols-2 gap-4 pt-4">
              {[
                "Fıratpen Resmi Yetkili Üretici Bayi Güvencesi",
                "70'lik, 75'lik (Selenit) ve 85'lik (Redonit) Seriler",
                "1.00 mm - 1.50 mm Galvanizli Çelik Destek Sacı",
                "4+16+4 mm Isıcam S ve Isıcam K Konfor Camlar",
                "Düz, L ve U Tipi Katlanır & Sürme Cam Balkon",
                "Pencere Kolları, Sineklik, PU Köpük & Mastik Tedariki",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2.5 bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                  <CheckCircle2 className="h-4 w-4 text-sky-600 shrink-0" />
                  <span className="text-xs sm:text-sm font-semibold text-slate-800">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 grid grid-cols-1 gap-5">
            <div className="rounded-3xl overflow-hidden border border-slate-200 shadow-md aspect-[16/10]">
              <img src={productionImg} alt="Acarpen CNC PVC Doğrama Üretimi" className="w-full h-full object-cover" />
            </div>
            {[
              {
                icon: Target,
                title: "Misyonumuz",
                desc: "Adana ve Çukurova'daki konut ve inşaat projelerine yüksek ısı/ses yalıtımlı Fıratpen PVC doğrama ve cam balkon sistemlerini doğrudan üretici avantajıyla sunmak.",
              },
              {
                icon: ShieldCheck,
                title: "Kalite Politikamız",
                desc: "Destek sacından EPDM contaya, 4+16+4 ısıcamdan montaj köpüğüne kadar hiçbir aşamada malzeme kalitesinden ödün vermeden sıfır hata ile üretim yapmak.",
              },
              {
                icon: Users,
                title: "Tek Muhatap Anlayışı",
                desc: "Lazer keşif, projelendirme, CNC imalat, şantiye sevkiyatı ve satış sonrası teknik servis süreçlerinin tamamında müşterilerimize tek muhatap güvencesi sağlamak.",
              },
            ].map((card) => {
              const Icon = card.icon;
              return (
                <div key={card.title} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-2.5">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-sky-50 border border-sky-200 grid place-items-center text-sky-600">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-serif text-xl font-bold text-slate-900">{card.title}</h3>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">{card.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 bg-sky-600 rounded-3xl p-8 sm:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold">
              Gülbahçesi Mah. Seyhan / Adana Showroomumuza Bekleriz
            </h3>
            <p className="text-sky-100 text-sm mt-1">
              Projeniz için ücretsiz keşif veya toplu sipariş teklifi almak için hemen bizimle iletişime geçin.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <Link to="/hesaplama">
              <Button size="lg" className="rounded-full bg-white text-sky-900 hover:bg-sky-50 font-bold text-xs sm:text-sm">
                Pencere & Cam Balkon Hesapla
              </Button>
            </Link>
            <a
              href="https://wa.me/905336253611?text=Merhaba%20Acarpen%2C%20kurumsal%20teklif%20almak%20istiyorum."
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="lg" variant="outline" className="rounded-full border-white text-white hover:bg-white/10 font-bold text-xs sm:text-sm">
                WhatsApp: 0533 625 36 11
              </Button>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
