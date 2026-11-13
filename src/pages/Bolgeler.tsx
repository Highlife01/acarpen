import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { REGIONS_DATA } from "@/data/regionsData";
import { MapPin, Building2, Truck, ShieldCheck, Calculator, Phone, CheckCircle2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const SECTORS = [
  {
    title: "İnşaat & Toplu Konut Projeleri",
    desc: "Yüksek katlı rezidanslar, villa siteleri ve kentsel dönüşüm projeleri için Fıratpen Selenit 75 / Elegance 80 PVC pencere, balkon kapısı ve cam balkon paketleri.",
  },
  {
    title: "Bireysel Konut & Tadilat Çözümleri",
    desc: "Eski doğramaların sökülerek 19 farklı lamine renk seçeneği, 4+16+4 ısıcam, plise sineklik ve motorlu panjur sistemleriyle anahtar teslim yenilenmesi.",
  },
  {
    title: "Villa, Teras & Kış Bahçesi",
    desc: "Panoramik Zenia Slide & Hebeschiebe sürme kapılar, Düz/L/U katlanır ve uzaktan kumandalı giyotin cam balkon sistemleri.",
  },
  {
    title: "Ticari Mağaza & Ofis Sistemleri",
    desc: "Isı yalıtımlı alüminyum doğrama, mağaza vitrinleri, jaluzili ısıcamlı ofis bölmeleri ve demonte/montajlı şantiye sevkiyatı.",
  },
];

export default function Bolgeler() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 pt-28 lg:pt-32">
      <SEO
        title="Hizmet Bölgelerimiz: Adana, Mersin, Osmaniye, Hatay, Gaziantep, Kayseri, Niğde | Acarpen"
        description="Adana Seyhan'daki (Gülbahçesi Mah. 13428 Sok. No:16/17) Fıratpen üretim tesisimizden Adana, Mersin, Osmaniye, Hatay, Gaziantep, Kayseri ve Niğde illerine PVC pencere, kapı ve cam balkon sevkiyatı."
        canonicalPath="/bolgeler"
        keywords={[
          "adana fıratpen bayisi",
          "adana pvc pencere",
          "mersin pvc doğrama",
          "osmaniye fıratpen",
          "hatay pvc pencere",
          "gaziantep pvc doğrama",
          "kayseri pvc pencere",
          "niğde cam balkon",
        ]}
        faqs={[
          {
            question: "Acarpen hangi illere Fıratpen PVC pencere ve cam balkon sevkiyatı yapıyor?",
            answer:
              "Adana Seyhan (Gülbahçesi Mah. 13428 Sok. No:16/17) merkez üretim tesisimizden başta Adana, Mersin, Osmaniye, Hatay, Gaziantep, Kayseri ve Niğde olmak üzere tüm Çukurova ve çevre illere montajlı veya demonte sevkiyat yapıyoruz.",
          },
          {
            question: "Bölgesel siparişlerde keşif ve teklif süreci nasıl işliyor?",
            answer:
              "0533 625 36 11 numaralı WhatsApp hattımızdan veya online pencere yapılandırıcımızdan ölçü ve renk tercihlerinizi ileterek anında fiyat teklifi alabilirsiniz.",
          },
        ]}
        breadcrumbs={[{ name: "Hizmet Bölgelerimiz & Sevkiyat Ağı", path: "/bolgeler" }]}
      />
      <Navbar />

      {/* Hero Bölümü */}
      <section className="py-16 bg-gradient-to-b from-sky-50 via-white to-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest text-sky-800 bg-sky-50 border border-sky-200 shadow-sm">
                <Truck className="h-3.5 w-3.5 text-sky-600" /> Adana • Mersin • Osmaniye • Hatay • Gaziantep • Kayseri • Niğde
              </span>
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight">
                Bölgesel Sevkiyat & <span className="text-gradient italic">Proje Çözümleri</span>
              </h1>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl">
                Adana Seyhan'daki (<strong>Gülbahçesi Mah. 13428 Sok. No:16/17</strong>) Fıratpen yetkili üretim tesisimizden <strong>Adana, Mersin, Osmaniye, Hatay, Gaziantep, Kayseri ve Niğde</strong> illerindeki bireysel konutlara, müteahhit şantiyelerine ve kurumsal projelere PVC doğrama ve cam balkon sevkiyatı gerçekleştiriyoruz.
              </p>
            </div>
            <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-2xl bg-sky-50 border border-sky-200 grid place-items-center text-sky-600">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Resmi Web Adresimiz</div>
                  <div className="font-serif text-lg font-bold text-slate-900">www.acarpen.com.tr</div>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Tüm PVC pencere, kapı, sürme ve cam balkon siparişleriniz özel taşıma araçlarımızla şantiye veya adresinize güvenle teslim edilir.
              </p>
              <Link to="/hesaplama" className="block">
                <Button className="w-full rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold">
                  <Calculator className="mr-2 h-4 w-4" /> Ölçü & Proje Fiyatı Hesapla
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 7 İl Kartları */}
      <section className="py-16 max-w-7xl mx-auto px-6 space-y-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {REGIONS_DATA.map((reg) => (
            <article
              key={reg.slug}
              id={reg.slug}
              className="bg-white rounded-3xl p-7 border border-slate-200 shadow-sm hover:shadow-lg hover:border-sky-300 transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-800 bg-sky-50 border border-sky-200 px-3 py-1 rounded-full">
                    <MapPin className="h-3.5 w-3.5 text-sky-600" /> {reg.city} ({reg.plateCode})
                  </span>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                    {reg.deliverySchedule}
                  </span>
                </div>

                <Link to={`/bolgeler/${reg.slug}`} className="block group">
                  <h2 className="font-serif text-xl font-bold text-slate-900 group-hover:text-sky-700 transition-colors">
                    {reg.title}
                  </h2>
                </Link>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                  {reg.summary}
                </p>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs">
                  <span className="font-bold text-slate-800 block">Önerilen Sistem & Yalıtım:</span>
                  <span className="text-sky-700 font-semibold">{reg.recommendedGlass}</span>
                </div>

                <ul className="space-y-2 pt-1">
                  {reg.highlights.slice(0, 3).map((h, i) => (
                    <li key={i} className="text-xs text-slate-700 flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-sky-600 shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-5 mt-5 border-t border-slate-100 flex items-center justify-between">
                <Link
                  to={`/bolgeler/${reg.slug}`}
                  className="text-xs font-bold text-sky-700 hover:text-sky-800 inline-flex items-center gap-1"
                >
                  {reg.city} Detay & Şartname <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <a
                  href="tel:+905336253611"
                  className="text-xs font-mono font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1"
                >
                  <Phone className="h-3 w-3" /> 0533 625 36 11
                </a>
              </div>
            </article>
          ))}
        </div>

        {/* 7 İl İklim ve Lojistik Karşılaştırma Tablosu */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
          <div className="mb-6">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              İllere Göre PVC Doğrama, Cam Seçimi & Sevkiyat Tablosu
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Adana, Mersin, Osmaniye, Hatay, Gaziantep, Kayseri ve Niğde illerinin iklim verilerine göre Fıratpen sistem tavsiyelerimiz
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b-2 border-slate-200 bg-slate-50 text-slate-800 uppercase text-[11px] tracking-wider font-bold">
                  <th className="py-3.5 px-4">İl / Bölge</th>
                  <th className="py-3.5 px-4">İklim Karakteristiği</th>
                  <th className="py-3.5 px-4">Tavsiye Edilen Sistem</th>
                  <th className="py-3.5 px-4">Hedef U-Değeri</th>
                  <th className="py-3.5 px-4">Sevkiyat Planı</th>
                </tr>
              </thead>
              <tbody>
                {REGIONS_DATA.map((r) => (
                  <tr key={r.slug} className="border-b border-slate-100 hover:bg-sky-50/40 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      <Link to={`/bolgeler/${r.slug}`} className="text-sky-700 hover:underline">
                        {r.city} ({r.plateCode})
                      </Link>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">{r.climateProfile}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800">{r.recommendedGlass}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-700">{r.recommendedUValue}</td>
                    <td className="py-3.5 px-4 text-slate-600">{r.deliverySchedule}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sektörel Çözümler */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-sm">
          <div className="max-w-2xl mb-8">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-sky-700">
              <Building2 className="h-4 w-4" /> Sektörel PVC & Cam Balkon Çözümleri
            </span>
            <h2 className="font-serif text-3xl font-bold text-slate-900 mt-2">
              Her Yapı Tipine Özel Şartname & Üretim
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {SECTORS.map((sec, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <h3 className="font-serif text-lg font-bold text-slate-900">{sec.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{sec.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
