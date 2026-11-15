import { useState } from "react";
import { Link } from "react-router-dom";
import { FAQItem } from "@/components/SEO";
import { trackConversion } from "@/lib/conversionTracker";
import {
  CheckCircle2,
  ChevronDown,
  HelpCircle,
  Calculator,
  MessageCircle,
  Phone,
  ArrowRight,
  MapPin,
  ShieldCheck,
  Coins,
  Users,
} from "lucide-react";

export interface RelatedLinkItem {
  label: string;
  to: string;
  tag?: string;
}

interface ProductSeoEnrichmentProps {
  categoryTitle: string;
  geoSummary: string;
  targetUsers: string[];
  priceFactors: string[];
  acarpenProcess: string;
  faqs: FAQItem[];
  relatedLinks: RelatedLinkItem[];
  trackingCategory: string;
}

const DEFAULT_CITY_LINKS: RelatedLinkItem[] = [
  { label: "Adana Seyhan & Çukurova", to: "/bolgeler/adana-cam-fabrikasi" },
  { label: "Mersin & Tarsus", to: "/bolgeler/mersin-cam-imalati" },
  { label: "Osmaniye & Kadirli", to: "/bolgeler/osmaniye-cam-ureticisi" },
  { label: "Hatay & İskenderun", to: "/bolgeler/hatay-cam-firmalari" },
  { label: "Gaziantep", to: "/bolgeler/gaziantep-cam-cozumleri" },
  { label: "Kayseri", to: "/bolgeler/kayseri-cam-toptan" },
  { label: "Niğde", to: "/bolgeler/nigde-cam-sevkiyati" },
];

export const ProductSeoEnrichment = ({
  categoryTitle,
  geoSummary,
  targetUsers,
  priceFactors,
  acarpenProcess,
  faqs,
  relatedLinks,
  trackingCategory,
}: ProductSeoEnrichmentProps) => {
  const [openFaq, setOpenFaq] = useState<number>(0);

  return (
    <section
      className="py-16 bg-slate-50 border-t border-slate-200"
      aria-labelledby="product-seo-guide"
    >
      <div className="container mx-auto px-4 lg:px-8 space-y-10">
        {/* GEO Answer-First Summary */}
        <article className="geo-summary rounded-3xl bg-white p-7 sm:p-9 border border-slate-200 shadow-sm space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-sky-700 bg-sky-50 px-3 py-1 rounded-full border border-sky-200">
            <ShieldCheck className="h-3.5 w-3.5 text-sky-600" />
            Teknik Özet & Hızlı Doğrulama
          </div>
          <h2 id="product-seo-guide" className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900">
            {categoryTitle}: Teknik Bilgi, Fiyat Faktörleri ve Teklif Süreci
          </h2>
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed max-w-4xl">
            {geoSummary}
          </p>
        </article>

        {/* Kimler İçin + Fiyatı Etkileyen Faktörler + Acarpen Hizmeti */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5 text-sky-700 font-bold text-sm">
              <Users className="h-5 w-5" />
              <h3>Kimler ve Hangi Yapılar İçin Uygundur?</h3>
            </div>
            <ul className="space-y-2.5">
              {targetUsers.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5 text-amber-700 font-bold text-sm">
              <Coins className="h-5 w-5" />
              <h3>Fiyatı Etkileyen Teknik Faktörler</h3>
            </div>
            <ul className="space-y-2.5">
              {priceFactors.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  <CheckCircle2 className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-[#040f26] text-white rounded-3xl p-6 sm:p-7 border border-slate-800 shadow-lg flex flex-col justify-between space-y-5">
            <div className="space-y-3">
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-sky-400">
                Acarpen Seyhan / Adana Üretim Süreci
              </div>
              <h3 className="font-serif text-xl font-bold">
                Keşif, CNC Üretim ve Teklif Nasıl İşler?
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {acarpenProcess}
              </p>
            </div>

            <div className="flex flex-col gap-2.5 pt-2">
              <Link
                to="/hesaplama"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs py-3 px-4 transition-colors"
              >
                <Calculator className="h-4 w-4" />
                Online Ölçü Listesi & Teklif Oluştur
              </Link>
              <div className="grid grid-cols-2 gap-2">
                <a
                  href={`https://wa.me/905336253611?text=${encodeURIComponent(
                    `Merhaba Acarpen, ${categoryTitle} hakkında ölçü ve fiyat teklifi almak istiyorum.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackConversion("whatsapp_click", `${trackingCategory} WhatsApp CTA`)}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2.5 px-3 transition-colors"
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                  WhatsApp
                </a>
                <a
                  href="tel:+905336253611"
                  onClick={() => trackConversion("phone_click", `${trackingCategory} Call CTA`)}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs py-2.5 px-3 transition-colors"
                >
                  <Phone className="h-3.5 w-3.5" />
                  0533 625 36 11
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Category FAQs synced with Schema */}
        {faqs.length > 0 && (
          <div className="bg-white rounded-3xl p-7 sm:p-9 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-sky-700 mb-2">
              <HelpCircle className="h-4 w-4 text-sky-600" />
              Sıkça Sorulan Sorular
            </div>
            <h3 className="font-serif text-2xl font-bold text-slate-900 mb-6">
              {categoryTitle} Hakkında Merak Edilenler
            </h3>
            <div className="space-y-3">
              {faqs.map((item, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div
                    key={item.question}
                    className={`rounded-2xl border transition-all ${
                      isOpen ? "border-sky-300 bg-sky-50/40" : "border-slate-200 bg-slate-50/40"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                      aria-expanded={isOpen}
                      className="w-full px-5 py-4 text-left flex items-center justify-between gap-4"
                    >
                      <span className="font-serif text-sm sm:text-base font-bold text-slate-900">
                        {item.question}
                      </span>
                      <ChevronDown
                        className={`h-4 w-4 shrink-0 text-slate-500 transition-transform ${
                          isOpen ? "rotate-180 text-sky-600" : ""
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {item.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Cross-Linking Hub: Related Products & Regional Delivery Pages */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-display text-lg font-bold text-slate-900">
                İlgili Ürün Sistemleri ve Bölgesel Sevkiyat Sayfaları
              </h3>
              <p className="text-xs text-slate-500">
                Doğru profil, cam kalınlığı ve bölge lojistiği için bağlantılı sayfalarımızı inceleyin:
              </p>
            </div>
            <Link
              to="/rehber"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-700 hover:text-sky-800 shrink-0"
            >
              Tüm Teknik Rehber &amp; 105+ GEO SSS <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="flex flex-wrap gap-2">
            {relatedLinks.map((lnk) => (
              <Link
                key={lnk.to + lnk.label}
                to={lnk.to}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-900 border border-sky-200 text-xs font-semibold transition-colors"
              >
                <span>{lnk.label}</span>
                {lnk.tag && (
                  <span className="text-[10px] font-mono text-sky-700 bg-white px-1.5 py-0.5 rounded-md border border-sky-200">
                    {lnk.tag}
                  </span>
                )}
              </Link>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 mr-1">
              <MapPin className="h-3.5 w-3.5 text-sky-600" /> Bölgesel Hizmet Ağı:
            </span>
            {DEFAULT_CITY_LINKS.map((city) => (
              <Link
                key={city.to}
                to={city.to}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors"
              >
                {city.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
