import { useParams, Link, Navigate } from "react-router-dom";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { getRegionBySlug, REGIONS_DATA } from "@/data/regionsData";
import {
  MapPin,
  Truck,
  ShieldCheck,
  Calculator,
  Phone,
  CheckCircle2,
  Building2,
  ThermometerSun,
  HelpCircle,
  ArrowRight,
  Compass,
  Factory,
} from "lucide-react";

export default function BolgeDetay() {
  const { slug } = useParams<{ slug: string }>();
  const region = getRegionBySlug(slug);

  if (!region) {
    return <Navigate to="/bolgeler" replace />;
  }

  const otherRegions = REGIONS_DATA.filter((r) => r.slug !== region.slug);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 pt-20 lg:pt-28">
      <SEO
        title={region.metaTitle}
        description={region.metaDescription}
        canonicalPath={`/bolgeler/${region.slug}`}
        keywords={region.keywords}
        serviceName={`${region.city} Fıratpen PVC Pencere, Kapı ve Cam Balkon Çözümleri`}
        geoPlacename={region.city}
        geoRegion={region.geoRegion}
        geoPosition={region.geoPosition}
        faqs={region.faqs}
        breadcrumbs={[
          { name: "Hizmet Bölgelerimiz", path: "/bolgeler" },
          { name: `${region.city} PVC & Cam Balkon`, path: `/bolgeler/${region.slug}` },
        ]}
      />
      <Navbar />

      {/* Hero Bölümü */}
      <section className="py-16 sm:py-20 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white border-b border-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(14,165,233,0.18),transparent_55%)] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-8 space-y-5">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-sky-300 bg-sky-500/20 border border-sky-400/30">
                  <MapPin className="h-3.5 w-3.5 text-sky-400" /> {region.city} ({region.plateCode}) • {region.heroBadge}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold text-emerald-300 bg-emerald-500/15 border border-emerald-400/30">
                  <Truck className="h-3.5 w-3.5" /> {region.deliverySchedule}
                </span>
              </div>

              <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
                {region.title}
              </h1>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-3xl">
                {region.summary}
              </p>

              <div className="pt-2 flex flex-wrap gap-3.5">
                <Link to="/hesaplama">
                  <Button size="lg" className="rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold shadow-glow">
                    <Calculator className="mr-2 h-4 w-4" /> {region.city} İçin Online Fiyat Hesapla
                  </Button>
                </Link>
                <a
                  href={`https://wa.me/905336253611?text=${encodeURIComponent(
                    `Merhaba Acarpen, ${region.city} bölgesindeki projemiz için Fıratpen PVC pencere / cam balkon fiyat teklifi almak istiyorum.`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-xl border-white/25 bg-white/10 text-white hover:bg-white/20 font-bold"
                  >
                    WhatsApp {region.city} Sipariş Hattı
                  </Button>
                </a>
              </div>
            </div>

            {/* Sağ İklim & Mühendislik Özeti Kartı */}
            <div className="lg:col-span-4 bg-white/10 backdrop-blur-xl rounded-3xl p-6 sm:p-7 border border-white/20 space-y-4">
              <div className="flex items-center gap-3 border-b border-white/15 pb-3.5">
                <div className="h-11 w-11 rounded-2xl bg-sky-500/20 border border-sky-400/30 grid place-items-center text-sky-300">
                  <ThermometerSun className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-sky-300">
                    {region.city} İklim & Doğrama Analizi
                  </div>
                  <div className="text-sm font-bold text-white">{region.climateProfile}</div>
                </div>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="p-3 rounded-xl bg-slate-950/60 border border-white/10">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Önerilen Doğrama & Cam</span>
                  <span className="text-white font-bold mt-0.5 block">{region.recommendedGlass}</span>
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-white/10">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Hedef U-Değeri</span>
                    <span className="text-emerald-300 font-mono font-bold mt-0.5 block">{region.recommendedUValue}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-white/10">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Lojistik Mesafe</span>
                    <span className="text-sky-300 font-mono font-bold mt-0.5 block">{region.distanceKm}</span>
                  </div>
                </div>
              </div>

              <a
                href="tel:+905336253611"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors"
              >
                <Phone className="h-4 w-4" /> Hızlı İletişim: 0533 625 36 11
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* İçerik Bölümü */}
      <section className="py-16 max-w-7xl mx-auto px-6 space-y-14">
        {/* Öne Çıkan Avantajlar & İlçeler */}
        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 bg-white rounded-3xl p-7 sm:p-8 border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-sky-700">
              <ShieldCheck className="h-4 w-4" /> Neden {region.city} Projelerinde Acarpen?
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              Fıratpen Yetkili Üretici Gücüyle {region.city} Projelerine Doğrudan Üretim
            </h2>
            <ul className="space-y-3.5 pt-2">
              {region.highlights.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-slate-700 leading-relaxed">
                  <CheckCircle2 className="h-5 w-5 text-sky-600 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-5 space-y-6">
            {/* Hizmet Verilen İlçeler */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-800">
                <Compass className="h-4 w-4 text-sky-600" /> {region.city} Sevkiyat İlçelerimiz
              </div>
              <div className="flex flex-wrap gap-2">
                {region.districts.map((d) => (
                  <span
                    key={d}
                    className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700"
                  >
                    📍 {d}
                  </span>
                ))}
              </div>
            </div>

            {/* OSB ve Sanayi Bölgeleri */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-800">
                <Factory className="h-4 w-4 text-emerald-600" /> Organize Sanayi & Proje Bölgeleri
              </div>
              <div className="space-y-2">
                {region.industrialZones.map((zone) => (
                  <div
                    key={zone}
                    className="px-3.5 py-2 rounded-xl bg-emerald-50/60 border border-emerald-200 text-xs font-bold text-emerald-900 flex items-center gap-2"
                  >
                    <Building2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span>{zone}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bölgeye Özel Teknik Şartname Tablosu */}
        <div className="bg-white rounded-3xl p-7 sm:p-8 border border-slate-200 shadow-sm">
          <div className="mb-6">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
              {region.city} İklim ve Mimari Şartname Önerileri
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              {region.city} bölgesindeki konut, villa ve ticari yapılar için en çok tercih edilen doğrama ve cam kombinasyonları
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b-2 border-slate-200 bg-slate-50 text-slate-800 uppercase text-[11px] tracking-wider font-bold">
                  <th className="py-3.5 px-4">Uygulama Alanı</th>
                  <th className="py-3.5 px-4">Önerilen Teknik Kombinasyon</th>
                  <th className="py-3.5 px-4">Performans & Avantaj</th>
                </tr>
              </thead>
              <tbody>
                {region.productSpecs.map((spec, idx) => (
                  <tr key={idx} className="border-b border-slate-100 hover:bg-sky-50/40 transition-colors">
                    <td className="py-4 px-4 font-bold text-slate-900">{spec.product}</td>
                    <td className="py-4 px-4 font-mono font-semibold text-sky-700">{spec.combination}</td>
                    <td className="py-4 px-4 text-slate-600">{spec.benefit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sıkça Sorulan Sorular */}
        <div className="bg-white rounded-3xl p-7 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-sky-700">
            <HelpCircle className="h-4 w-4" /> {region.city} PVC & Cam Balkon Sıkça Sorulan Sorular
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {region.faqs.map((faq, i) => (
              <div key={i} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <h3 className="font-serif text-base font-bold text-slate-900">{faq.question}</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Diğer Hizmet İllerimiz */}
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl font-bold text-slate-900">Diğer Bölgesel Sevkiyat Merkezlerimiz</h2>
            <Link to="/bolgeler" className="text-xs font-bold text-sky-700 hover:text-sky-800 flex items-center gap-1">
              Tüm Bölgeleri Gör <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {otherRegions.map((r) => (
              <Link
                key={r.slug}
                to={`/bolgeler/${r.slug}`}
                className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-sky-300 hover:shadow-md transition-all group flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-bold text-sky-700">{r.city} ({r.plateCode})</div>
                  <div className="text-sm font-bold text-slate-900 group-hover:text-sky-700 transition-colors mt-0.5 line-clamp-1">
                    {r.title}
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-sky-600 group-hover:translate-x-1 transition-all shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
