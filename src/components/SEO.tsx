import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import { SupportedLanguageCode, isSupportedLanguage } from "@/i18n/languages";

export interface FAQItem {
  question: string;
  answer: string;
}

interface SEOProps {
  title: string;
  description: string;
  canonicalPath?: string;
  keywords?: string[];
  ogType?: "website" | "article" | "product";
  ogImage?: string;
  ogImageAlt?: string;
  faqs?: FAQItem[];
  schemaType?:
    | "LocalBusiness"
    | "Organization"
    | "Service"
    | "Product"
    | "Article"
    | "CollectionPage"
    | "AboutPage"
    | "ContactPage"
    | "TechArticle";
  serviceName?: string;
  breadcrumbs?: { name: string; path: string }[];
  noindex?: boolean;
  geoPlacename?: string;
  geoRegion?: string;
  geoPosition?: string;
}

const BASE_URL = "https://www.acarpen.com.tr";
const DEFAULT_IMAGE = `${BASE_URL}/assets/firatpen-selenit-pvc-pencere.jpg`;
const COMPANY_NAME = "Acarpen — Fıratpen, Winsa & Pimapen Yetkili Bayi";

const DNS_GOOGLE_VERIFICATION_FALLBACK = "";

export const SEO_LANGUAGES: readonly SupportedLanguageCode[] = ["tr", "en", "ar"] as const;

const OG_LOCALE_MAP: Record<SupportedLanguageCode, string> = {
  tr: "tr_TR",
  en: "en_US",
  ar: "ar_SA",
};

const LOCALIZED_PAGE_META: Record<
  string,
  {
    en: { title: string; description: string };
    ar: { title: string; description: string };
  }
> = {
  "/": {
    en: {
      title: "Acarpen | Authorized Fıratpen PVC Window, Door & Glass Balcony Producer in Adana",
      description:
        "Acarpen (Gülbahçesi Mah. 13428 Sok. No:16/17 Seyhan / Adana) — Authorized Fıratpen manufacturer producing 70mm & 75mm PVC windows, balcony doors, sliding systems, colored insulating glass, and folding glass balconies.",
    },
    ar: {
      title: "أكاربن (Acarpen) | الوكيل والمصنع المعتمد لأنظمة نوافذ وأبواب Fıratpen PVC في أضنة",
      description:
        "شركة أكاربن في سيهان / أضنة — وكيل ومصنع معتمد لأنظمة Fıratpen لإنتاج نوافذ وأبواب PVC العازلة، الأنظمة المنزلقة، الزجاج العازل الملون، وزجاج الشرفات القابل للطي بـ 19 لوناً مختلفاً.",
    },
  },
  "/hizmetler": {
    en: {
      title: "PVC Windows, Balcony Doors, Sliding & Glass Balcony Systems | Acarpen Adana",
      description:
        "Explore Acarpen's Fıratpen product range: Selenit 75 & Redonit 85 PVC windows, 85x198 / 85x210 balcony doors, 85x200 WC doors, Hebeschiebe sliding systems, 19 laminate colors, and solar tinted glass.",
    },
    ar: {
      title: "منتجات نوافذ وأبواب PVC وأنظمة الشرفات الزجاجية | أكاربن أضنة",
      description:
        "تصفح منتجات أكاربن المعتمدة من Fıratpen: نوافذ PVC عازلة، أبواب شرفات وحمامات، أنظمة سحب منزلقة، وزجاج شرفات مع 19 خياراً للألوان وزجاج عاكس ملون.",
    },
  },
  "/hesaplama": {
    en: {
      title: "Online PVC Window & Glass Balcony Configurator | Acarpen Adana",
      description:
        "Select standard or custom dimensions, 19 PVC laminate colors, opening direction, and double-action hardware to get an instant WhatsApp quote from Acarpen.",
    },
    ar: {
      title: "حاسبة مقاسات وأسعار نوافذ PVC والشرفات الزجاجية | أكاربن أضنة",
      description:
        "اختر المقاسات القياسية أو الخاصة وألوان PVC الـ 19 واتجاه الفتح للحصول على عرض سعر فوري عبر واتساب من أكاربن.",
    },
  },
  "/urunler/cift-cam": {
    en: {
      title: "Fıratpen Selenit 75 & Redonit 85 uPVC Window Systems | Acarpen Adana",
      description:
        "Standard ready-size and custom-made Fıratpen 70mm, 75mm & 85mm uPVC windows with galvanized steel reinforcement, 4+16+4 double glazing, and 19 color options in Adana.",
    },
    ar: {
      title: "أنظمة نوافذ Fıratpen Selenit 75 و Redonit 85 PVC | أكاربن أضنة",
      description:
        "نوافذ PVC قياسية ومخصصة مدعمة بالفولاذ المجلفن وزجاج مزدوج 4+16+4 عازل للحرارة والصوت مع 19 لوناً في أضنة.",
    },
  },
  "/urunler/temperli-cam": {
    en: {
      title: "Hebeschiebe Lift-and-Slide & uPVC Sliding Doors | Acarpen Adana",
      description:
        "Fıratpen Zenia Slide Hebeschiebe patio doors (300kg sash capacity) and double-sash uPVC sliding windows with 4+16+4 insulating glass in Adana.",
    },
    ar: {
      title: "أبواب ونوافذ السحب المنزلقة Hebeschiebe PVC | أكاربن أضنة",
      description:
        "أنظمة أبواب التراس المنزلقة Fıratpen Zenia Slide Hebeschiebe ونوافذ السحب المزدوجة العازلة في أضنة.",
    },
  },
  "/urunler/balkon-cami": {
    en: {
      title: "Folding, Sliding & Motorized Guillotine Glass Balcony Systems | Acarpen Adana",
      description:
        "8mm & 10mm tempered and double-glazed folding, sliding, and motorized guillotine glass balcony systems for straight, L-shaped, and U-shaped balconies in Adana.",
    },
    ar: {
      title: "أنظمة زجاج الشرفات القابلة للطي والمنزلقة والكهربائية | أكاربن أضنة",
      description:
        "أنظمة تغليف الشرفات بالزجاج المقسى 8-10 ملم أو الزجاج المزدوج العازل بجميع الألوان في أضنة.",
    },
  },
  "/urunler/renkli-camlar": {
    en: {
      title: "19 uPVC Window Laminate Colors & Solar Tinted Insulating Glass | Acarpen Adana",
      description:
        "Interactive preview of 19 Fıratpen uPVC profile colors (Anthracite Grey, Golden Oak, Mink, Mahogany) paired with Smoked, Bronze, Blue/Green Reflective, and Frosted double glazing.",
    },
    ar: {
      title: "19 لوناً لمقاطع نوافذ PVC وخيارات الزجاج العازل الملون | أكاربن أضنة",
      description:
        "معاينة تفاعلية لـ 19 لوناً لمقاطع PVC مع خيارات الزجاج المزدوج الملون والعاكس للحرارة والخصوصية.",
    },
  },
  "/iletisim": {
    en: {
      title: "Contact & Adana Factory Showroom | Acarpen — Authorized Fıratpen Producer",
      description:
        "Visit Acarpen at Gülbahçesi Mah. 13428 Sok. No:16/17 Seyhan / Adana or message +90 533 625 36 11 on WhatsApp for free laser measurement and uPVC window quotes.",
    },
    ar: {
      title: "اتصل بنا وعنوان المصنع والمعرض في أضنة | أكاربن",
      description:
        "تواصل مع أكاربن في سيهان / أضنة عبر الهاتف أو واتساب 05336253611 للحصول على معاينة مجانية وعرض سعر.",
    },
  },
};

const SERVED_CITIES_SCHEMA = [
  {
    "@type": "City",
    name: "Adana",
    sameAs: ["https://tr.wikipedia.org/wiki/Adana", "https://www.wikidata.org/wiki/Q40939"],
    geo: { "@type": "GeoCoordinates", latitude: 36.985, longitude: 35.288 },
  },
  {
    "@type": "AdministrativeArea",
    name: "Seyhan, Adana",
    sameAs: "https://tr.wikipedia.org/wiki/Seyhan",
  },
  {
    "@type": "AdministrativeArea",
    name: "Çukurova, Adana",
    sameAs: "https://tr.wikipedia.org/wiki/%C3%87ukurova,_Adana",
  },
  {
    "@type": "AdministrativeArea",
    name: "Yüreğir, Adana",
    sameAs: "https://tr.wikipedia.org/wiki/Y%C3%BCre%C4%9Fir",
  },
  {
    "@type": "AdministrativeArea",
    name: "Sarıçam, Adana",
    sameAs: "https://tr.wikipedia.org/wiki/Sar%C4%B1%C3%A7am",
  },
  {
    "@type": "City",
    name: "Mersin",
    sameAs: ["https://tr.wikipedia.org/wiki/Mersin", "https://www.wikidata.org/wiki/Q134267"],
    geo: { "@type": "GeoCoordinates", latitude: 36.8121, longitude: 34.6415 },
  },
  {
    "@type": "City",
    name: "Osmaniye",
    sameAs: ["https://tr.wikipedia.org/wiki/Osmaniye", "https://www.wikidata.org/wiki/Q185806"],
    geo: { "@type": "GeoCoordinates", latitude: 37.0742, longitude: 36.2478 },
  },
  {
    "@type": "City",
    name: "Hatay",
    sameAs: ["https://tr.wikipedia.org/wiki/Hatay", "https://www.wikidata.org/wiki/Q79865"],
    geo: { "@type": "GeoCoordinates", latitude: 36.2021, longitude: 36.1606 },
  },
  {
    "@type": "City",
    name: "Gaziantep",
    sameAs: ["https://tr.wikipedia.org/wiki/Gaziantep", "https://www.wikidata.org/wiki/Q93338"],
    geo: { "@type": "GeoCoordinates", latitude: 37.0662, longitude: 37.3833 },
  },
  {
    "@type": "City",
    name: "Kayseri",
    sameAs: ["https://tr.wikipedia.org/wiki/Kayseri", "https://www.wikidata.org/wiki/Q48338"],
    geo: { "@type": "GeoCoordinates", latitude: 38.7312, longitude: 35.4787 },
  },
  {
    "@type": "City",
    name: "Niğde",
    sameAs: ["https://tr.wikipedia.org/wiki/Ni%C4%9Fde", "https://www.wikidata.org/wiki/Q200780"],
    geo: { "@type": "GeoCoordinates", latitude: 37.9667, longitude: 34.6833 },
  },
];

const OFFER_CATALOG_SCHEMA = {
  "@type": "OfferCatalog",
  name: "Acarpen — Fıratpen PVC Doğrama, Renkli Isıcam ve Cam Balkon Sistemleri",
  itemListElement: [
    {
      "@type": "OfferCatalog",
      name: "Fıratpen 70'lik, 75'lik (Selenit 75) ve 85'lik (Redonit 85) PVC Pencere Sistemleri",
      url: `${BASE_URL}/urunler/cift-cam`,
    },
    {
      "@type": "OfferCatalog",
      name: "PVC Çift Kanat Sürme Pencereler ve Zenia Slide Hebeschiebe Kapılar",
      url: `${BASE_URL}/urunler/temperli-cam`,
    },
    {
      "@type": "OfferCatalog",
      name: "Düz, L ve U Tipi Katlanır, Sürme ve Motorlu Giyotin Cam Balkon Sistemleri",
      url: `${BASE_URL}/urunler/balkon-cami`,
    },
    {
      "@type": "OfferCatalog",
      name: "85x198 / 85x210 PVC Balkon Kapıları, 85x200 WC Kapıları ve Motorlu Panjur",
      url: `${BASE_URL}/urunler/jaluzili-isicam`,
    },
    {
      "@type": "OfferCatalog",
      name: "19 Farklı PVC Lamine Renk Alternatifi ve Füme/Bronz/Reflekte Renkli Isıcamlar",
      url: `${BASE_URL}/urunler/renkli-camlar`,
    },
    {
      "@type": "OfferCatalog",
      name: "Plise Sineklik, Secustik Pencere Kolları ve Montaj İzolasyon Malzemeleri",
      url: `${BASE_URL}/urunler/lamine-cam`,
    },
  ],
};

export const CANONICAL_PATH_MAP: Record<string, string> = {
  "/index.html": "/",
  "/home": "/",
  "/anasayfa": "/",
  "/urunler": "/hizmetler",
  "/hizmetler/cift-cam": "/urunler/cift-cam",
  "/cift-cam": "/urunler/cift-cam",
  "/pvc-pencere": "/urunler/cift-cam",
  "/hizmetler/temperli-cam": "/urunler/temperli-cam",
  "/temperli-cam": "/urunler/temperli-cam",
  "/pvc-surme": "/urunler/temperli-cam",
  "/hizmetler/balkon-cami": "/urunler/balkon-cami",
  "/balkon-cami": "/urunler/balkon-cami",
  "/cam-balkon": "/urunler/balkon-cami",
  "/hizmetler/jaluzili-isicam": "/urunler/jaluzili-isicam",
  "/jaluzili-isicam": "/urunler/jaluzili-isicam",
  "/pvc-kapi": "/urunler/jaluzili-isicam",
  "/hizmetler/dis-cephe-camlari": "/urunler/dis-cephe-camlari",
  "/dis-cephe-camlari": "/urunler/dis-cephe-camlari",
  "/hizmetler/lamine-cam": "/urunler/lamine-cam",
  "/lamine-cam": "/urunler/lamine-cam",
  "/hizmetler/renkli-camlar": "/urunler/renkli-camlar",
  "/renkli-camlar": "/urunler/renkli-camlar",
  "/pvc-renkler": "/urunler/renkli-camlar",
  "/adana-firatpen-bayisi": "/bolgeler/adana-cam-fabrikasi",
  "/teklif": "/hesaplama",
  "/fiyat-hesaplama": "/hesaplama",
};

export function normalizeCanonicalPath(raw: string): string {
  if (!raw) return "/";
  const withoutHashOrQuery = raw.split("#")[0].split("?")[0].trim();
  const withLeadingSlash = withoutHashOrQuery.startsWith("/")
    ? withoutHashOrQuery
    : `/${withoutHashOrQuery}`;
  const collapsed = withLeadingSlash.replace(/\/+/g, "/");
  const stripped =
    collapsed.length > 1 && collapsed.endsWith("/") ? collapsed.slice(0, -1) : collapsed;
  return CANONICAL_PATH_MAP[stripped] || stripped || "/";
}

export function buildLanguageCanonicalUrl(cleanPath: string, lang?: string | null): string {
  const base = `${BASE_URL}${cleanPath === "/" ? "/" : cleanPath}`;
  if (lang === "en" || lang === "ar") {
    return `${base}?lang=${lang}`;
  }
  return base;
}

const absoluteUrl = (value: string) => {
  if (value.startsWith("http")) return value;
  const norm = normalizeCanonicalPath(value);
  return `${BASE_URL}${norm === "/" ? "/" : norm}`;
};

const KEYWORDS_BY_LANG: Record<SupportedLanguageCode, string[]> = {
  tr: [
    "acarpen",
    "adana fıratpen bayisi",
    "fıratpen adana yetkili bayi",
    "adana pvc pencere",
    "adana winsa bayisi",
    "winsa pvc pencere adana",
    "winsa dorado 76",
    "adana pimapen",
    "pimapen nirvana",
    "pimapen carisma",
    "seyhan pvc doğrama",
    "çukurova pimapen",
    "yüreğir pvc pencere",
    "sarıçam cam balkon",
    "fıratpen selenit 75",
    "fıratpen redonit 85",
    "adana ısıcamlı cam balkon",
    "pvc balkon kapısı 85x210",
    "pvc wc kapısı 85x200",
    "pvc sürme pencere",
    "hebeschiebe sürme adana",
    "antrasit gri pvc pencere",
    "altın meşe pvc doğrama",
    "pvc pencere renkli cam",
    "füme ısıcamlı pvc pencere",
    "bronz reflekte cam balkon",
    "plise sineklik adana",
    "motorlu panjur adana",
  ],
  en: [
    "acarpen adana",
    "firatpen authorized producer adana",
    "upvc windows turkey",
    "pvc balcony doors",
    "hebeschiebe sliding doors",
    "solar tinted double glazing pvc",
    "folding glass balcony adana",
  ],
  ar: [
    "أكاربن أضنة",
    "نوافذ وأبواب PVC أضنة",
    "وكيل فراتبن المعتمد",
    "زجاج شرفات قابل للطي",
    "زجاج مزدوج ملون عاكس",
  ],
};

export const SEO = ({
  title,
  description,
  canonicalPath,
  keywords = [],
  ogType = "website",
  ogImage = DEFAULT_IMAGE,
  ogImageAlt = "Acarpen — Adana Fıratpen Yetkili Üretici Bayi PVC Pencere, Renkli Isıcam ve Cam Balkon Sistemleri",
  faqs,
  schemaType = "LocalBusiness",
  serviceName,
  breadcrumbs = [],
  noindex = false,
  geoPlacename = "Adana",
  geoRegion = "TR-01",
  geoPosition = "36.9850;35.2880",
}: SEOProps) => {
  const location = useLocation();
  const { currentLanguage } = useLanguage();

  const searchParams = new URLSearchParams(location.search);
  const urlLangParam = searchParams.get("lang")?.toLowerCase();
  const activeLang: SupportedLanguageCode = isSupportedLanguage(urlLangParam)
    ? urlLangParam
    : currentLanguage.code;

  const normalizedPath = normalizeCanonicalPath(canonicalPath || location.pathname || "/");
  const baseCanonicalUrl = `${BASE_URL}${normalizedPath === "/" ? "/" : normalizedPath}`;
  const selfCanonicalUrl = buildLanguageCanonicalUrl(normalizedPath, activeLang);

  const localizedEntry = LOCALIZED_PAGE_META[normalizedPath];
  const resolvedTitle =
    activeLang === "en" && localizedEntry?.en
      ? localizedEntry.en.title
      : activeLang === "ar" && localizedEntry?.ar
        ? localizedEntry.ar.title
        : title.includes("Acarpen")
          ? title
          : `${title} | Acarpen — Fıratpen Yetkili Bayi`;

  const resolvedDescription =
    activeLang === "en" && localizedEntry?.en
      ? localizedEntry.en.description
      : activeLang === "ar" && localizedEntry?.ar
        ? localizedEntry.ar.description
        : description;

  const allKeywords = Array.from(
    new Set([
      ...keywords,
      ...KEYWORDS_BY_LANG.tr,
      ...KEYWORDS_BY_LANG.en,
      ...KEYWORDS_BY_LANG.ar,
    ])
  ).join(", ");

  useEffect(() => {
    const setMeta = (name: string, content: string, isProperty = false) => {
      if (!content) return;
      const attr = isProperty ? "property" : "name";
      let element = document.head.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attr, name);
        document.head.appendChild(element);
      }
      element.content = content;
    };

    document.documentElement.lang = activeLang;
    document.documentElement.dir = activeLang === "ar" ? "rtl" : "ltr";

    document.title = resolvedTitle;
    setMeta("description", resolvedDescription);
    setMeta("keywords", allKeywords);
    setMeta(
      "robots",
      noindex
        ? "noindex, nofollow, noarchive"
        : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
    );
    setMeta("author", COMPANY_NAME);
    setMeta("geo.region", geoRegion);
    setMeta("geo.placename", geoPlacename);
    setMeta("geo.position", geoPosition);
    setMeta("ICBM", geoPosition.replace(";", ", "));
    setMeta("og:title", resolvedTitle, true);
    setMeta("og:description", resolvedDescription, true);
    setMeta("og:url", selfCanonicalUrl, true);
    setMeta("og:type", ogType, true);
    setMeta("og:site_name", COMPANY_NAME, true);
    setMeta("og:locale", OG_LOCALE_MAP[activeLang], true);
    setMeta("og:image", absoluteUrl(ogImage), true);
    setMeta("og:image:alt", ogImageAlt, true);
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", resolvedTitle);
    setMeta("twitter:description", resolvedDescription);
    setMeta("twitter:url", selfCanonicalUrl);
    setMeta("twitter:image", absoluteUrl(ogImage));

    document.head
      .querySelectorAll('meta[property="og:locale:alternate"]')
      .forEach((el) => el.remove());
    SEO_LANGUAGES.filter((code) => code !== activeLang).forEach((altCode) => {
      const meta = document.createElement("meta");
      meta.setAttribute("property", "og:locale:alternate");
      meta.content = OG_LOCALE_MAP[altCode];
      document.head.appendChild(meta);
    });

    const envGoogle =
      import.meta.env.VITE_GOOGLE_SITE_VERIFICATION || DNS_GOOGLE_VERIFICATION_FALLBACK;
    if (envGoogle) setMeta("google-site-verification", envGoogle);

    let canonical = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = selfCanonicalUrl;

    const allowedHreflangs = new Set(["x-default", "tr", "en", "ar"]);
    document.head.querySelectorAll('link[rel="alternate"][hreflang]').forEach((el) => {
      const code = el.getAttribute("hreflang");
      if (!code || !allowedHreflangs.has(code)) {
        el.remove();
      }
    });

    const setHreflang = (hreflang: string, href: string) => {
      let link = document.head.querySelector(
        `link[rel="alternate"][hreflang="${hreflang}"]`
      ) as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement("link");
        link.rel = "alternate";
        link.setAttribute("hreflang", hreflang);
        document.head.appendChild(link);
      }
      link.href = href;
    };

    setHreflang("x-default", baseCanonicalUrl);
    setHreflang("tr", baseCanonicalUrl);
    setHreflang("en", `${baseCanonicalUrl}?lang=en`);
    setHreflang("ar", `${baseCanonicalUrl}?lang=ar`);

    const oldScript = document.getElementById("dynamic-seo-jsonld");
    oldScript?.remove();
    const staticPrerenderScript = document.getElementById("static-prerender-jsonld");
    staticPrerenderScript?.remove();

    const schemas: Record<string, unknown>[] = [
      {
        "@type": "WebSite",
        "@id": `${BASE_URL}/#website`,
        url: BASE_URL,
        name: COMPANY_NAME,
        alternateName: ["Acarpen", "Acarpen Adana Fıratpen Bayisi"],
        inLanguage: ["tr", "en", "ar"],
        publisher: { "@id": `${BASE_URL}/#organization` },
        potentialAction: {
          "@type": "ViewAction",
          name: "Online PVC Pencere & Cam Balkon Ölçü Yapılandırıcı",
          target: `${BASE_URL}/hesaplama`,
        },
      },
      {
        "@type": ["LocalBusiness", "HomeAndConstructionBusiness", "Store", "Organization"],
        "@id": `${BASE_URL}/#organization`,
        name: COMPANY_NAME,
        alternateName: ["Acarpen", "Acar Pen İnşaat Sanayi ve Ticaret Ltd. Şti."],
        legalName: "ACAR PEN İNŞAAT SANAYİ VE TİCARET LİMİTED ŞİRKETİ",
        url: BASE_URL,
        logo: {
          "@type": "ImageObject",
          url: `${BASE_URL}/assets/acarpen-logo.png`,
          width: 512,
          height: 512,
        },
        image: absoluteUrl(ogImage),
        description: resolvedDescription,
        telephone: "+90 533 625 36 11",
        email: "info@acarpen.com.tr",
        priceRange: "₺₺",
        inLanguage: ["tr", "en", "ar"],
        hasMap: "https://maps.google.com/?q=G%C3%BClbah%C3%A7esi+Mah.+13428+Sok.+No:16/17+Seyhan+Adana",
        brand: [
          { "@type": "Brand", name: "Acarpen" },
          { "@type": "Brand", name: "Fıratpen", sameAs: "https://www.firatpen.com.tr" },
          { "@type": "Brand", name: "Winsa", sameAs: "https://www.winsa.com.tr" },
          { "@type": "Brand", name: "Pimapen", sameAs: "https://www.pimapen.com.tr" },
        ],
        knowsAbout: [
          "Fıratpen, Winsa ve Pimapen PVC Pencere Sistemleri",
          "Fıratpen Selenit 75 & Redonit 85, Winsa Dorado 76 & Revotech, Pimapen Nirvana 80",
          "Hebeschiebe ve Çift Kanat PVC Sürme Sistemler",
          "Düz, L ve U Tipi Katlanır ve Isıcamlı Cam Balkon",
          "PVC Pencereler İçin Füme, Bronz ve Reflekte Renkli Isıcam",
          "Motorlu Alüminyum Panjur ve Plise Sineklik",
          "19 Farklı UV Dayanımlı PVC Lamine Renk Alternatifi",
        ],
        hasOfferCatalog: OFFER_CATALOG_SCHEMA,
        address: {
          "@type": "PostalAddress",
          streetAddress: "Gülbahçesi Mah. 13428 Sok. No:16/17",
          addressLocality: "Seyhan",
          addressRegion: "Adana",
          postalCode: "01080",
          addressCountry: "TR",
        },
        geo: { "@type": "GeoCoordinates", latitude: 36.985, longitude: 35.288 },
        areaServed: SERVED_CITIES_SCHEMA,
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            opens: "08:00",
            closes: "19:00",
          },
        ],
        contactPoint: [
          {
            "@type": "ContactPoint",
            telephone: "+90-533-625-36-11",
            contactType: "sales",
            contactOption: "WhatsApp",
            areaServed: ["TR-01", "TR-33", "TR-80", "TR-31", "TR-27", "TR-38", "TR-51"],
            availableLanguage: ["Turkish", "English", "Arabic"],
          },
        ],
      },
      {
        "@type":
          schemaType === "CollectionPage"
            ? "CollectionPage"
            : schemaType === "AboutPage"
            ? "AboutPage"
            : schemaType === "ContactPage"
            ? "ContactPage"
            : "WebPage",
        "@id": `${selfCanonicalUrl}#webpage`,
        url: selfCanonicalUrl,
        name: resolvedTitle,
        description: resolvedDescription,
        inLanguage: activeLang,
        isPartOf: { "@id": `${BASE_URL}/#website` },
        about: { "@id": `${BASE_URL}/#organization` },
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["h1", ".geo-summary", ".seo-faq-section"],
        },
      },
    ];

    if (serviceName) {
      schemas.push({
        "@type": schemaType === "Product" ? "Product" : "Service",
        name: serviceName,
        description: resolvedDescription,
        image: [absoluteUrl(ogImage)],
        url: selfCanonicalUrl,
        brand: {
          "@type": "Brand",
          name: "Acarpen • Fıratpen • Winsa • Pimapen",
        },
        manufacturer: { "@id": `${BASE_URL}/#organization` },
        provider: { "@id": `${BASE_URL}/#organization` },
      });
    }

    if (breadcrumbs.length > 0) {
      schemas.push({
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: `${BASE_URL}/` },
          ...breadcrumbs.map((breadcrumb, index) => ({
            "@type": "ListItem",
            position: index + 2,
            name: breadcrumb.name,
            item: absoluteUrl(breadcrumb.path),
          })),
        ],
      });
    }

    if (faqs?.length) {
      schemas.push({
        "@type": "FAQPage",
        inLanguage: activeLang,
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      });
    }

    const script = document.createElement("script");
    script.id = "dynamic-seo-jsonld";
    script.type = "application/ld+json";
    script.textContent = JSON.stringify({ "@context": "https://schema.org", "@graph": schemas });
    document.head.appendChild(script);

    return () => {
      document.getElementById("dynamic-seo-jsonld")?.remove();
    };
  }, [
    activeLang,
    allKeywords,
    baseCanonicalUrl,
    breadcrumbs,
    faqs,
    geoPlacename,
    geoPosition,
    geoRegion,
    noindex,
    ogImage,
    ogImageAlt,
    ogType,
    resolvedDescription,
    resolvedTitle,
    schemaType,
    selfCanonicalUrl,
    serviceName,
  ]);

  return null;
};

export default SEO;
