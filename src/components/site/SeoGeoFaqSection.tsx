import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, HelpCircle, MapPin, ShieldCheck, MessageCircle, ArrowUpRight } from "lucide-react";
import { FAQItem } from "@/components/SEO";

export const HOME_GEO_FAQS: FAQItem[] = [
  {
    question: "Acarpen Fıratpen yetkili üretici bayisi midir ve Adana'daki adresi nerededir?",
    answer:
      "Evet, Acarpen (Acar Pen İnşaat Sanayi ve Ticaret Ltd. Şti.), Fıratpen resmi yetkili üretici bayisidir. CNC otomasyonlu üretim fabrikamız ve showroom merkezimiz Gülbahçesi Mah. 13428 Sok. No:16/17 Seyhan - Seyhan / Adana adresinde hizmet vermektedir.",
  },
  {
    question: "Acarpen'de Fıratpen dışında Winsa ve Pimapen PVC pencere serileri de üretiliyor mu?",
    answer:
      "Evet. Acarpen'in Gülbahçesi Mah. 13428 Sok. No:16/17 Seyhan / Adana adresindeki CNC otomasyonlu fabrikasında Fıratpen (Selenit 75, Elegance 80, Redonit 85, Zenia Slide) serilerinin yanı sıra Winsa (Dorado 76, Safir 76, Revotech, Panorama HS) ve Pimapen (Nirvana 80, Carisma 70, Albatros Sürme) PVC pencere, kapı ve sürme sistemleri de üretilip uygulanmaktadır.",
  },
  {
    question: "PVC pencerelerde renkli cam (füme, bronz, reflekte, buzlu) ve lamine profil seçenekleri nelerdir?",
    answer:
      "Antrasit Gri, Altın Meşe, Metalik Antrasit, Vizon, Koyu Meşe ve Maun dahil 19 farklı UV dayanımlı lamine PVC profil rengini; Füme, Bronz, Mavi Reflekte, Yeşil Reflekte, Satinato Buzlu mahremiyet camı ve 4+16+4 mm Solar Low-E Konfor ısıcam seçenekleriyle kombine ediyoruz.",
  },
  {
    question: "PVC doğramalarda kullanılan destek sacı ve profil et kalınlığı standartları nedir?",
    answer:
      "Ürettiğimiz tüm Fıratpen PVC pencere ve kapı sistemlerinde TS EN 12608-1 standardına uygun 2.5 mm - 3.0 mm profil et kalınlığı, kat yüksekliği ve rüzgar yüküne göre 1.00 mm - 1.50 mm korozyon dirençli galvanizli çelik destek sacı, EPDM sızdırmazlık contaları ve 4+16+4 mm ısıcam standart olarak uygulanır.",
  },
  {
    question: "Düz, L ve U tipi balkonlar için hangi cam balkon sistemlerini uyguluyorsunuz?",
    answer:
      "Düz balkon, L tipi köşe balkon, U balkon ve açılı balkonlara özel 8 mm / 10 mm temperli veya ısıcamlı katlanır cam balkon, eşikli/eşiksiz sürme cam balkon ve uzaktan kumandalı motorlu giyotin cam sistemleri üretip kendi uzman ekibimizle monte ediyoruz.",
  },
  {
    question: "Adana'nın hangi ilçelerine ücretsiz keşif ve çevre illere sevkiyat yapıyorsunuz?",
    answer:
      "Adana merkez ilçeleri olan Seyhan, Çukurova, Yüreğir ve Sarıçam başta olmak üzere Ceyhan, Kozan, Karaisalı ve İmamoğlu ilçelerine ücretsiz lazer ölçü ve montaj hizmeti sunuyoruz. Ayrıca Mersin, Osmaniye, Hatay, Gaziantep, Kayseri ve Niğde'deki konut ve şantiye projelerine düzenli sevkiyat gerçekleştiriyoruz.",
  },
  {
    question: "Müteahhitler, şantiyeler ve bayiler için B2B toplu PVC doğrama tedariki var mı?",
    answer:
      "Evet. Toplu konut şantiyeleri, müteahhitler ve bayiler için kat bazlı etiketlenmiş demonte (montajsız) hazır doğrama tedariki veya şantiye takvimine entegre anahtar teslim montajlı proje çözümleri sunuyoruz.",
  },
  {
    question: "Nasıl hızlı fiyat teklifi ve ücretsiz ölçü randevusu alabilirim?",
    answer:
      "Sitemizdeki Online Ölçü & Teklif Yapılandırıcı üzerinden pencere/balkon ölçülerinizi ve renk tercihinizi seçerek veya doğrudan 0533 625 36 11 numaralı WhatsApp hattımıza yazarak dakikalar içinde fiyat teklifi ve ücretsiz keşif randevusu alabilirsiniz.",
  },
];

const ADANA_DISTRICTS_AND_REGIONS = [
  { label: "Seyhan Fıratpen & PVC Pencere", href: "/bolgeler/adana-cam-fabrikasi" },
  { label: "Çukurova Cam Balkon & Sürme", href: "/bolgeler/adana-cam-fabrikasi" },
  { label: "Yüreğir & Sarıçam PVC Doğrama", href: "/bolgeler/adana-cam-fabrikasi" },
  { label: "Mersin & Tarsus PVC Sistemleri", href: "/bolgeler/mersin-cam-imalati" },
  { label: "Osmaniye & Kadirli PVC Pencere", href: "/bolgeler/osmaniye-cam-ureticisi" },
  { label: "Hatay & İskenderun Şantiye Tedarik", href: "/bolgeler/hatay-cam-firmalari" },
  { label: "Gaziantep PVC & Hebeschiebe", href: "/bolgeler/gaziantep-cam-cozumleri" },
  { label: "Kayseri & Niğde Isıcamlı Sistemler", href: "/bolgeler/kayseri-cam-toptan" },
];

export const SeoGeoFaqSection = () => {
  const [openIndex, setOpenIndex] = useState<number>(0);

  return (
    <section
      id="sss-bilgi-merkezi"
      className="seo-faq-section py-24 bg-slate-50 border-t border-slate-200"
      aria-labelledby="faq-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: GEO Citation Summary & Regional Internal Links */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <span className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-sky-700 font-bold bg-sky-100 px-3.5 py-1.5 rounded-full border border-sky-200 mb-3">
                <HelpCircle className="h-3.5 w-3.5" />
                Sıkça Sorulan Sorular & Teknik Rehber
              </span>
              <h2
                id="faq-heading"
                className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-slate-900"
              >
                Fıratpen, Winsa & Pimapen{" "}
                <span className="text-gradient italic">Bilgi Merkezi</span>
              </h2>
            </div>

            <article className="geo-summary rounded-3xl bg-white p-6 border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-700">
                <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Resmi Kurumsal & Teknik Özet</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                <strong>Acarpen (Acar Pen İnşaat Sanayi ve Ticaret Ltd. Şti.)</strong>, Adana Seyhan{" "}
                <strong>Gülbahçesi Mah. 13428 Sok. No:16/17</strong> adresindeki fabrikasında{" "}
                <strong>Fıratpen, Winsa ve Pimapen</strong> markalı TS EN 12608-1 A sınıfı PVC pencereler,
                Hebeschiebe sürme sistemler, 19 lamine renk, füme/bronz reflekte renkli ısıcamlar, motorlu panjur,
                plise sineklik ve Düz/L/U cam balkon sistemleri üretmektedir.
              </p>
              <div className="pt-2 flex flex-wrap gap-2">
                <a
                  href="https://wa.me/905336253611?text=Merhaba%20Acarpen%2C%20PVC%20pencere%20ve%20cam%20balkon%20hakk%C4%B1nda%20bilgi%20almak%20istiyorum."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl transition-colors"
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                  WhatsApp: 0533 625 36 11
                </a>
                <Link
                  to="/rehber"
                  className="inline-flex items-center gap-1 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 px-4 py-2.5 rounded-xl transition-colors"
                >
                  Teknik Seçim Rehberi
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </article>

            {/* Regional Internal Linking Hub */}
            <div className="rounded-3xl bg-white p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900 mb-3">
                <MapPin className="h-4 w-4 text-sky-600" />
                <span>Hizmet ve Sevkiyat Bölgelerimiz</span>
              </div>
              <div className="grid sm:grid-cols-2 gap-2">
                {ADANA_DISTRICTS_AND_REGIONS.map((reg) => (
                  <Link
                    key={reg.label}
                    to={reg.href}
                    className="text-xs text-slate-600 hover:text-sky-700 hover:bg-sky-50 px-3 py-2 rounded-xl border border-slate-100 hover:border-sky-200 transition-all flex items-center justify-between"
                  >
                    <span className="truncate font-medium">{reg.label}</span>
                    <ArrowUpRight className="h-3 w-3 shrink-0 text-sky-600" />
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Visible FAQ Accordion */}
          <div className="lg:col-span-7 space-y-3">
            {HOME_GEO_FAQS.map((item, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={item.question}
                  className={`rounded-2xl border transition-all bg-white ${
                    isOpen
                      ? "border-sky-400 shadow-md ring-1 ring-sky-400/20"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                    className="w-full flex items-center justify-between gap-4 text-left px-6 py-4"
                  >
                    <h3 className="font-serif text-base sm:text-lg font-bold text-slate-900 leading-snug">
                      {item.question}
                    </h3>
                    <ChevronDown
                      className={`h-5 w-5 text-sky-600 shrink-0 transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                      {item.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
