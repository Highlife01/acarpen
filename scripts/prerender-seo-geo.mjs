#!/usr/bin/env node
/**
 * Acarpen — SEO & GEO Prerender Engine (Generative Engine Optimization)
 *
 * Vite tarafından derlenen dist/index.html şablonunu temel alarak tüm 28 rotanın
 * statik HTML sürümlerini (dist/<route>/index.html) oluşturur.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const distDir = path.join(rootDir, "dist");

const BASE_URL = "https://www.acarpen.com.tr";
const DEFAULT_IMAGE = `${BASE_URL}/assets/firatpen-selenit-pvc-pencere.jpg`;

const SERVED_CITIES = [
  { name: "Adana", lat: 36.985, lng: 35.288, qid: "Q40939" },
  { name: "Mersin", lat: 36.8121, lng: 34.6415, qid: "Q134267" },
  { name: "Osmaniye", lat: 37.0742, lng: 36.2478, qid: "Q185806" },
  { name: "Hatay", lat: 36.2021, lng: 36.1606, qid: "Q79865" },
  { name: "Gaziantep", lat: 37.0662, lng: 37.3833, qid: "Q93338" },
  { name: "Kayseri", lat: 38.7312, lng: 35.4787, qid: "Q48338" },
  { name: "Niğde", lat: 37.9667, lng: 34.6833, qid: "Q200780" },
];

function buildPrerenderProductSchema(params) {
  return {
    "@type": "Product",
    name: params.name,
    description: params.description,
    category: params.category || "PVC Pencere & Cam Balkon",
    sku: params.sku || "AP-PVC-01",
    mpn: params.sku || "AP-PVC-01",
    image: [DEFAULT_IMAGE],
    url: params.url,
    brand: { "@type": "Brand", name: "Acarpen & Fıratpen" },
    manufacturer: { "@id": `${BASE_URL}/#organization` },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "148",
      bestRating: "5",
      worstRating: "1",
    },
  };
}

const ORGANIZATION_BASE_SCHEMA = {
  "@type": ["LocalBusiness", "HomeAndConstructionBusiness", "Organization"],
  "@id": `${BASE_URL}/#organization`,
  name: "Acarpen — Fıratpen Yetkili Üretici Bayi",
  legalName: "ACAR PEN İNŞAAT SANAYİ VE TİCARET LİMİTED ŞİRKETİ",
  url: BASE_URL,
  logo: `${BASE_URL}/favicon.svg`,
  image: DEFAULT_IMAGE,
  telephone: "+90 533 625 36 11",
  email: "info@acarpen.com.tr",
  priceRange: "₺₺",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Gülbahçesi Mah. 13428 Sok. No:16/17",
    addressLocality: "Seyhan",
    addressRegion: "Adana",
    postalCode: "01080",
    addressCountry: "TR",
  },
  geo: { "@type": "GeoCoordinates", latitude: 36.985, longitude: 35.288 },
  areaServed: SERVED_CITIES.map((c) => ({
    "@type": "City",
    name: c.name,
    sameAs: [`https://tr.wikipedia.org/wiki/${encodeURIComponent(c.name)}`, `https://www.wikidata.org/wiki/${c.qid}`],
    geo: { "@type": "GeoCoordinates", latitude: c.lat, longitude: c.lng },
  })),
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
};

const ROUTES = [
  {
    path: "/",
    title: "Acarpen | Adana Fıratpen Yetkili Üretici Bayi — PVC Pencere, Kapı, Sürme & Cam Balkon",
    description:
      "Acarpen (Gülbahçesi Mah. 13428 Sok. No:16/17 Seyhan / Adana), Fıratpen Yetkili Üretici Bayisi olarak 70'lik & 75'lik PVC Pencereler, Balkon Kapıları, WC Kapıları, Çift Kanat Sürme Sistemler ve Düz/L/U Cam Balkon üretimi yapmaktadır.",
    keywords: "acarpen, adana fıratpen bayisi, fıratpen adana, adana pvc pencere, pvc balkon kapısı, pvc sürme pencere, cam balkon adana",
    geoRegion: "TR-01",
    geoPlacename: "Adana",
    geoPosition: "36.9850;35.2880",
    breadcrumbs: [],
    h1: "Adana Fıratpen Yetkili Üretici Bayi: PVC Pencere, Kapı, Sürme ve Cam Balkon Sistemleri",
    summary:
      "Gülbahçesi Mah. 13428 Sok. No:16/17 Seyhan / Adana adresindeki modern üretim tesisimizde Fıratpen Selenit 75, Elegance 80 ve Redonit 85 serisi PVC pencereler, balkon ve WC kapıları, sürme doğramalar ve cam balkon sistemleri üretiyoruz.",
    specsTitle: "Üretim ve Kalite Standartlarımız",
    specs: [
      { label: "Yetkili Üretici Statüsü", val: "Fıratpen Resmi Yetkili Üretici Bayi" },
      { label: "Merkez Fabrika & Showroom", val: "Gülbahçesi Mah. 13428 Sok. No:16/17 Seyhan / Adana" },
      { label: "Profil & Donanım", val: "70 mm & 75 mm A Sınıfı Profil, 1.00 mm+ Destek Sacı, 2.5 mm+ Et Kalınlığı, 4+16+4 Isıcam" },
      { label: "Renk Seçenekleri", val: "Antrasit Gri, Altın Meşe, Metalik Antrasit ve Vizon dahil 19 Lamine Renk" },
      { label: "İletişim & WhatsApp", val: "0533 625 36 11" },
    ],
    faqs: [
      {
        q: "Acarpen Fıratpen yetkili üretici bayisi midir ve adresi nerededir?",
        a: "Evet, Acarpen Fıratpen resmi yetkili üretici bayisidir. Üretim ve showroom merkezimiz Gülbahçesi Mah. 13428 Sok. No:16/17 Seyhan / Adana adresindedir.",
      },
      {
        q: "Nasıl fiyat teklifi alabilirim?",
        a: "0533 625 36 11 numaralı WhatsApp hattımızdan veya online pencere yapılandırıcımızdan ölçü ve renk seçerek anında teklif alabilirsiniz.",
      },
    ],
  },
  {
    path: "/hesaplama",
    title: "Online PVC Pencere & Cam Balkon Ölçü ve Teklif Yapılandırıcı | Acarpen",
    description:
      "Standart hazır veya özel ölçü PVC pencere, balkon kapısı, sürme ve cam balkon için 19 renk, Sağ/Sol yön ve Tek/Çift açılım seçerek anında WhatsApp teklifi alın.",
    keywords: "pvc pencere hesaplama, pimapen ölçü teklif, cam balkon hesaplama adana, acarpen teklif",
    geoRegion: "TR-01",
    geoPlacename: "Adana",
    geoPosition: "36.9850;35.2880",
    breadcrumbs: [{ name: "Ölçü & Teklif Yapılandırıcı", path: "/hesaplama" }],
    h1: "Online PVC Pencere, Kapı ve Cam Balkon Yapılandırıcı",
    summary:
      "Standart hazır ebatlar (40×40'tan 220×210 cm'e) veya özel ölçülerinizle renk, açılım yönü ve aksesuar seçerek doğrudan WhatsApp hattımızdan fiyat teklifi alın.",
    specsTitle: "Yapılandırıcıda Desteklenen Sistemler",
    specs: [
      { label: "PVC Pencereler", val: "70'lik & 75'lik Fıratpen Selenit / Elegance / Redonit Serileri" },
      { label: "PVC Kapılar", val: "85×198 cm, 85×210 cm Balkon Kapısı ve 85×200 cm WC Kapısı" },
      { label: "PVC Sürme Sistemler", val: "120×120 cm, 140×120 cm Çift Kanat Sürme & Hebeschiebe" },
      { label: "Cam Balkon", val: "Düz, L ve U Tipi Katlanır, Sürme ve Motorlu Giyotin Cam Balkon" },
    ],
    faqs: [
      {
        q: "Özel ölçülerde üretim yapıyor musunuz?",
        a: "Evet, tüm standart hazır ölçülerin yanı sıra milimetrik özel ölçülerde üretim ve ücretsiz yerinde keşif yapıyoruz.",
      },
    ],
  },
  {
    path: "/hizmetler",
    title: "PVC Pencere, Kapı, Sürme & Cam Balkon Ürünlerimiz | Acarpen Adana",
    description:
      "Fıratpen 70'lik ve 75'lik PVC pencereler, balkon kapıları, WC kapıları, çift kanat sürme doğramalar, cam balkon, sineklik ve panjur sistemleri.",
    keywords: "fıratpen ürünleri adana, pvc pencere modelleri, pvc balkon kapısı, cam balkon sistemleri",
    geoRegion: "TR-01",
    geoPlacename: "Adana",
    geoPosition: "36.9850;35.2880",
    breadcrumbs: [{ name: "Ürünlerimiz", path: "/hizmetler" }],
    h1: "Fıratpen PVC Pencere, Kapı, Sürme ve Cam Balkon Ürün Kataloğu",
    summary:
      "Adana Seyhan üretim tesisimizde konut, villa ve şantiye projeleri için yüksek ısı ve ses yalıtımlı PVC doğrama ve cam balkon sistemleri üretiyoruz.",
    specsTitle: "Ürün Gruplarımız",
    specs: [
      { label: "PVC Pencere Sistemleri", val: "1 Bölmeli, Ortadan Kanatlı, Bir Sabit Bir Açılır (70'lik & 75'lik)" },
      { label: "PVC Sürme & Hebeschiebe", val: "120×120, 140×120 Çift Kanat Sürme & Zenia Slide" },
      { label: "Cam Balkon Sistemleri", val: "Düz, L ve U Katlanır, Sürme & Motorlu Giyotin Cam Balkon" },
      { label: "PVC Kapı & Panjur", val: "85×198, 85×210 Balkon Kapısı, 85×200 WC Kapısı & Motorlu Panjur" },
      { label: "Sineklik & Aksesuar", val: "Plise Sineklik, Secustik Kollar, PU Köpük, Silikon ve Mastikler" },
    ],
    faqs: [
      {
        q: "Kaç farklı renk seçeneği sunuyorsunuz?",
        a: "Antrasit Gri, Altın Meşe, Metalik Antrasit ve Vizon dahil 19 farklı UV dayanımlı lamine renk seçeneği sunuyoruz.",
      },
    ],
  },
  {
    path: "/urunler/cift-cam",
    title: "PVC Pencere Sistemleri (70'lik & 75'lik Hazır ve Özel Ölçü) | Acarpen",
    description:
      "Adana Fıratpen yetkili üretici bayi Acarpen'de 40x40'tan 220x210 cm'e hazır standart ve özel ölçü PVC pencereler, 1.00 mm+ destek sacı, 2.5 mm+ et kalınlığı ve 4+16+4 ısıcam.",
    keywords: "pvc pencere adana, fıratpen selenit 75, hazır pvc pencere ölçüleri, çift açılım pencere",
    geoRegion: "TR-01",
    geoPlacename: "Adana",
    geoPosition: "36.9850;35.2880",
    breadcrumbs: [{ name: "Ürünlerimiz", path: "/hizmetler" }, { name: "PVC Pencere Sistemleri", path: "/urunler/cift-cam" }],
    h1: "Standart Hazır & Özel Ölçü Fıratpen PVC Pencere Sistemleri",
    summary:
      "70 mm ve 75 mm sistem genişliği, 1.00 mm+ galvaniz destek sacı, 2.5 mm+ et kalınlığı, 4+16+4 ısıcam, Sağ/Sol yön ve Tek/Çift açılım seçenekleriyle PVC pencereler.",
    specsTitle: "Standart PVC Pencere Ölçüleri",
    specs: [
      { label: "Banyo & WC Vasistas", val: "40×40 cm ve 50×50 cm Buzlu Isıcamlı Vasistas" },
      { label: "Standart Tek Kanat", val: "75×100 cm, 100×100 cm ve 120×120 cm" },
      { label: "Ortadan Kanatlı Pencere", val: "130×130 cm, 140×140 cm, 150×140 cm, 200×140 cm, 200×210 cm, 220×210 cm" },
      { label: "Bir Sabit Bir Açılır", val: "160×200 cm, 160×210 cm ve 180×210 cm" },
    ],
    faqs: [
      {
        q: "Pencerelerde hangi cam ve destek sacı kullanılıyor?",
        a: "Tüm PVC pencerelerimizde 1.00 mm+ galvaniz çelik destek sacı, 2.5 mm+ profil et kalınlığı ve 4+16+4 ısıcam standart olarak kullanılır.",
      },
    ],
  },
  {
    path: "/urunler/temperli-cam",
    title: "PVC Sürme Pencereler & Hebeschiebe Sürme Kapılar | Acarpen",
    description:
      "Adana Fıratpen yetkili üretici bayi Acarpen'de 120x120, 140x120 çift kanat PVC sürme pencereler, Zenia Slide ve Hebeschiebe kaldır-sür teras kapıları.",
    keywords: "pvc sürme pencere, çift kanat sürme, hebeschiebe adana, fıratpen zenia slide",
    geoRegion: "TR-01",
    geoPlacename: "Adana",
    geoPosition: "36.9850;35.2880",
    breadcrumbs: [{ name: "Ürünlerimiz", path: "/hizmetler" }, { name: "PVC Sürme Sistemleri", path: "/urunler/temperli-cam" }],
    h1: "PVC Sürme Pencereler ve Hebeschiebe Teras Kapıları",
    summary:
      "120×120 cm ve 140×120 cm çift kanat PVC sürme pencereler ile geniş teras açıklıkları için Fıratpen Zenia Slide ve Hebeschiebe kaldır-sür sistemleri.",
    specsTitle: "Sürme Sistem Özellikleri",
    specs: [
      { label: "Çift Kanat PVC Sürme", val: "120×120 cm, 140×120 cm ve Özel Ölçüler" },
      { label: "Hebeschiebe (Kaldır-Sür)", val: "300 kg Kanat Kapasiteli Panoramik Teras Sürme" },
      { label: "Donanım", val: "4+16+4 Isıcam, Paslanmaz Rulman ve 19 Lamine Renk" },
    ],
    faqs: [
      {
        q: "Sürme pencerelerde ısıcam kullanılıyor mu?",
        a: "Evet, tüm çift kanat PVC sürme ve Hebeschiebe sistemlerimizde 4+16+4 ısıcam ve EPDM/fırça conta yalıtımı uygulanmaktadır.",
      },
    ],
  },
  {
    path: "/urunler/balkon-cami",
    title: "Düz, L ve U Katlanır, Sürme & Giyotin Cam Balkon Sistemleri | Acarpen",
    description:
      "Adana Acarpen'de Düz, L ve U balkon tiplerine özel 8mm - 10mm temperli ve ısıcamlı katlanır, eşikli/eşiksiz sürme ve motorlu giyotin cam balkon sistemleri.",
    keywords: "adana cam balkon, katlanır cam balkon, ısıcamlı cam balkon, giyotin cam balkon adana",
    geoRegion: "TR-01",
    geoPlacename: "Adana",
    geoPosition: "36.9850;35.2880",
    breadcrumbs: [{ name: "Ürünlerimiz", path: "/hizmetler" }, { name: "Cam Balkon Sistemleri", path: "/urunler/balkon-cami" }],
    h1: "Düz, L ve U Tipi Katlanır, Sürme ve Giyotin Cam Balkon Sistemleri",
    summary:
      "8 mm ve 10 mm temperli veya ısıcamlı katlanır, sürme ve uzaktan kumandalı giyotin cam balkon sistemleriyle balkonunuzu dört mevsim yaşam alanına dönüştürün.",
    specsTitle: "Cam Balkon Seçeneklerimiz",
    specs: [
      { label: "Balkon Tipleri", val: "Düz Balkon, L Balkon, U Balkon ve Açılı Balkon" },
      { label: "Cam Seçenekleri", val: "8mm / 10mm Temperli veya Isıcamlı (Şeffaf, Füme, Bronz)" },
      { label: "Sistem Türleri", val: "Katlanır, Eşikli/Eşiksiz Sürme ve Motorlu Giyotin" },
    ],
    faqs: [
      {
        q: "Cam balkon için ücretsiz ölçü alıyor musunuz?",
        a: "Evet, Adana genelinde lazer metre ile ücretsiz yerinde keşif ve ölçü hizmeti sunuyoruz.",
      },
    ],
  },
  {
    path: "/urunler/jaluzili-isicam",
    title: "PVC Balkon Kapıları (85x198, 85x210), WC Kapıları & Panjur | Acarpen",
    description:
      "Adana Fıratpen yetkili üretici bayi Acarpen'de 85x198 cm, 85x210 cm PVC balkon kapıları, 85x200 cm PVC WC/banyo kapıları, motorlu panjur ve jaluzili ısıcam sistemleri.",
    keywords: "pvc balkon kapısı, pvc wc kapısı, 85x200 pvc kapı, 85x210 balkon kapısı, motorlu panjur adana",
    geoRegion: "TR-01",
    geoPlacename: "Adana",
    geoPosition: "36.9850;35.2880",
    breadcrumbs: [{ name: "Ürünlerimiz", path: "/hizmetler" }, { name: "PVC Kapı & Panjur", path: "/urunler/jaluzili-isicam" }],
    h1: "PVC Balkon Kapıları, WC Kapıları ve Motorlu Panjur Sistemleri",
    summary:
      "Standart 85×198 cm, 85×210 cm PVC balkon kapıları, 85×200 cm suya dayanıklı PVC WC kapıları ve uzaktan kumandalı monoblok panjur sistemleri.",
    specsTitle: "Kapı & Panjur Standartları",
    specs: [
      { label: "PVC Balkon Kapısı", val: "85×198 cm, 85×210 cm ve Özel Ölçü (Tek/Çift Açılım)" },
      { label: "PVC WC & Banyo Kapısı", val: "85×200 cm Buzlu Camlı / Lambri Panelli Kilitli Kapı" },
      { label: "Panjur Sistemleri", val: "Motorlu ve Manuel Poliüretan Dolgulu Alüminyum Panjur" },
    ],
    faqs: [
      {
        q: "Balkon kapılarında çift açılım (vasistas) yapılabilir mi?",
        a: "Evet, PVC balkon kapılarımızda hem Tek Açılım hem de Vasistaslı Çift Açılım aksesuar seçeneği mevcuttur.",
      },
    ],
  },
  {
    path: "/urunler/dis-cephe-camlari",
    title: "B2B Müteahhit Toplu PVC Siparişi, Alüminyum Doğrama & Kış Bahçesi | Acarpen",
    description:
      "Adana Fıratpen yetkili üretici bayi Acarpen'de müteahhit ve inşaat projelerine özel toplu PVC doğrama, ısı yalıtımlı alüminyum doğrama ve kış bahçesi sistemleri.",
    keywords: "müteahhit toplu pvc pencere, şantiye pvc doğrama adana, kış bahçesi adana, alüminyum doğrama",
    geoRegion: "TR-01",
    geoPlacename: "Adana",
    geoPosition: "36.9850;35.2880",
    breadcrumbs: [{ name: "Ürünlerimiz", path: "/hizmetler" }, { name: "B2B Proje & Alüminyum", path: "/urunler/dis-cephe-camlari" }],
    h1: "Toplu Konut PVC Doğrama, Kış Bahçesi ve Alüminyum Sistemleri",
    summary:
      "Müteahhitler, inşaat firmaları ve şantiyeler için metraj bazlı toplu Fıratpen PVC doğrama, ısı yalıtımlı alüminyum doğrama ve kış bahçesi üretimi.",
    specsTitle: "Kurumsal Proje Hizmetlerimiz",
    specs: [
      { label: "B2B Toplu Üretim", val: "Çok Bloklu Konut ve Şantiye Projelerine Özel Termin" },
      { label: "Teslimat Modeli", val: "Demonte (Hazır Doğrama) veya Anahtar Teslim Montajlı" },
      { label: "Mimari Sistemler", val: "Kış Bahçesi, Alüminyum Doğrama ve Mağaza Vitrinleri" },
    ],
    faqs: [
      {
        q: "Şantiye projelerine demonte sevkiyat yapıyor musunuz?",
        a: "Evet, müteahhit ve bayilerimize standart veya özel ölçülerde demonte (montajsız) ya da montajlı toplu sevkiyat yapıyoruz.",
      },
    ],
  },
  {
    path: "/urunler/lamine-cam",
    title: "Pencere Kolları, Plise Sineklik & Montaj İzolasyon Malzemeleri | Acarpen",
    description:
      "Adana Fıratpen yetkili üretici bayi Acarpen'de PVC pencere kolları, çift açılım aksesuarları, plise sineklik sistemleri, poliüretan montaj köpüğü, silikon ve mastik malzemeleri.",
    keywords: "plise sineklik adana, pvc pencere kolu, çift açılım mekanizması, montaj köpüğü silikon mastik",
    geoRegion: "TR-01",
    geoPlacename: "Adana",
    geoPosition: "36.9850;35.2880",
    breadcrumbs: [{ name: "Ürünlerimiz", path: "/hizmetler" }, { name: "Sineklik & Aksesuar", path: "/urunler/lamine-cam" }],
    h1: "Pencere Kolları, Plise Sineklik ve Montaj İzolasyon Malzemeleri",
    summary:
      "Orijinal pencere ve kapı kolları, çift açılım ispanyoletler, özel ölçü plise sineklikler ve PU köpük, nötr silikon ve dış cephe mastik malzemeleri.",
    specsTitle: "Tamamlayıcı Donanım Grupları",
    specs: [
      { label: "Pencere & Kapı Kolları", val: "Secustik, Kilitli ve Standart Kollar (Beyaz, Antrasit, Bronz)" },
      { label: "Sineklik Sistemleri", val: "Plise (Pileli), Menteşeli, Sürme ve Kedi Tüllü Sineklik" },
      { label: "Montaj & İzolasyon", val: "Poliüretan Köpük, Nötr Silikon, Akrilik Mastik ve EPDM Conta" },
    ],
    faqs: [
      {
        q: "Mevcut pencerelere sonradan plise sineklik takılabilir mi?",
        a: "Evet, tüm PVC pencere, balkon kapısı ve sürme sistemlere uygun renkte plise sineklik üretip monte ediyoruz.",
      },
    ],
  },
  {
    path: "/urunler/renkli-camlar",
    title: "PVC Pencere & Kapı Renk Alternatifleri (19 Farklı Desen) | Acarpen Adana",
    description:
      "Acarpen Fıratpen PVC pencere ve kapı renk alternatifleri: Antrasit Gri, Metalik Antrasit, Altın Meşe, Eskitme, Vizon, Koyu Meşe, Antik Meşe, Karbon Siyah, Maun, Budaklı Meşe, Kuvars Platin ve Bazalt Gri.",
    keywords: "pvc pencere renkleri, antrasit gri pvc pencere, altın meşe pimapen, vizon pvc doğrama",
    geoRegion: "TR-01",
    geoPlacename: "Adana",
    geoPosition: "36.9850;35.2880",
    breadcrumbs: [{ name: "Ürünlerimiz", path: "/hizmetler" }, { name: "Renk Alternatifleri", path: "/urunler/renkli-camlar" }],
    h1: "19 Farklı PVC Pencere ve Kapı Lamine Renk Alternatifleri",
    summary:
      "Antrasit Gri 2613, Metalik Antrasit 2612, Altın Meşe 2616, Vizon 2611, Koyu Meşe 2618 ve Kristal Beyaz dahil 19 farklı UV dayanımlı lamine renk kartelası.",
    specsTitle: "Öne Çıkan Lamine Renk Kodları",
    specs: [
      { label: "Antrasit & Gri Tonları", val: "Antrasit Gri (2613), Metalik Antrasit (2612), Bazalt Gri (2625), Gümüş Gri" },
      { label: "Ahşap Desen Serisi", val: "Altın Meşe (2616), Koyu Meşe (2618), Antik Meşe (2614), Budaklı Meşe (2615), Maun (2619)" },
      { label: "Modern & Metalik Seri", val: "Vizon (2611), Karbon Siyah (2610), Kuvars Platin (2624), Taç Platin (2626), Kristal Beyaz" },
    ],
    faqs: [
      {
        q: "Renkli PVC pencereler güneşte solar mı?",
        a: "Hayır, dış cephe UV ışınlarına dayanıklı akrilik esaslı lamine folyolar Adana güneşinde solma ve kabarma yapmaz.",
      },
    ],
  },
  {
    path: "/bolgeler",
    title: "Hizmet Bölgelerimiz: Adana, Mersin, Osmaniye, Hatay, Gaziantep, Kayseri, Niğde | Acarpen",
    description:
      "Adana Seyhan merkez fabrikamızdan Mersin, Osmaniye, Hatay, Gaziantep, Kayseri ve Niğde'ye Fıratpen PVC pencere, kapı ve cam balkon sevkiyatı.",
    keywords: "adana fıratpen bayisi, mersin pvc pencere, osmaniye fıratpen, hatay pvc doğrama",
    geoRegion: "TR-01",
    geoPlacename: "Adana",
    geoPosition: "36.9850;35.2880",
    breadcrumbs: [{ name: "Bölgelerimiz", path: "/bolgeler" }],
    h1: "Bölgesel PVC Doğrama ve Cam Balkon Sevkiyat Ağımız",
    summary:
      "Gülbahçesi Mah. 13428 Sok. No:16/17 Seyhan / Adana tesisimizden tüm Çukurova ve çevre illere demonte veya montajlı sevkiyat.",
    specsTitle: "Hizmet Verilen İller",
    specs: [
      { label: "Adana (01)", val: "Seyhan, Çukurova, Yüreğir, Sarıçam, Ceyhan, Kozan (Aynı Gün Keşif)" },
      { label: "Çevre İller", val: "Mersin, Osmaniye, Hatay, Gaziantep, Kayseri, Niğde" },
    ],
    faqs: [
      {
        q: "Şehir dışı şantiye projelerine sevkiyat yapıyor musunuz?",
        a: "Evet, toplu konut ve şantiye projelerine kendi araçlarımızla sevkiyat ve montaj desteği sağlıyoruz.",
      },
    ],
  },
  {
    path: "/bolgeler/adana-cam-fabrikasi",
    title: "Adana Fıratpen Bayisi | PVC Pencere, Sürme & Cam Balkon | Acarpen",
    description:
      "Adana Seyhan Gülbahçesi Mah. 13428 Sok. No:16/17 adresindeki fabrikamızda Fıratpen yetkili üretici bayisi olarak 70'lik & 75'lik PVC pencere, balkon kapısı, sürme ve cam balkon üretimi.",
    keywords: "adana fıratpen bayisi, adana pvc pencere, seyhan pimapen, adana cam balkon, acarpen",
    geoRegion: "TR-01",
    geoPlacename: "Adana",
    geoPosition: "36.9850;35.2880",
    breadcrumbs: [{ name: "Bölgelerimiz", path: "/bolgeler" }, { name: "Adana Fıratpen Bayisi", path: "/bolgeler/adana-cam-fabrikasi" }],
    h1: "Adana Fıratpen Yetkili Bayi: PVC Pencere, Balkon Kapısı, Sürme & Cam Balkon",
    summary:
      "Gülbahçesi Mah. 13428 Sok. No:16/17 Seyhan / Adana merkez tesisimizde 70'lik ve 75'lik Fıratpen PVC pencere, balkon kapısı, sürme ve cam balkon sistemleri üretiyoruz.",
    specsTitle: "Adana Hizmet ve Teknik Standartlarımız",
    specs: [
      { label: "Merkez Adres", val: "Gülbahçesi Mah. 13428 Sok. No:16/17 Seyhan / Adana" },
      { label: "Telefon & WhatsApp", val: "0533 625 36 11" },
      { label: "Önerilen Sistem", val: "Fıratpen Selenit 75 + 4+16+4 Konfor Isıcam" },
    ],
    faqs: [
      {
        q: "Adana içi keşif ücretli mi?",
        a: "Hayır, Adana merkez ilçelerinde yerinde ölçü ve keşif hizmetimiz tamamen ücretsizdir.",
      },
    ],
  },
  {
    path: "/bolgeler/mersin-cam-imalati",
    title: "Mersin PVC Pencere, Sürme & Cam Balkon | Acarpen — Fıratpen Bayi",
    description: "Mersin Yenişehir, Mezitli, Tarsus ve Erdemli projelerine Fıratpen PVC pencere, Hebeschiebe sürme ve cam balkon sevkiyatı.",
    keywords: "mersin pvc pencere, tarsus fıratpen, mersin cam balkon",
    geoRegion: "TR-33",
    geoPlacename: "Mersin",
    geoPosition: "36.8121;34.6415",
    breadcrumbs: [{ name: "Bölgelerimiz", path: "/bolgeler" }, { name: "Mersin", path: "/bolgeler/mersin-cam-imalati" }],
    h1: "Mersin & Tarsus Fıratpen PVC Doğrama ve Cam Balkon Sistemleri",
    summary: "Mersin, Tarsus ve Erdemli projelerine rüzgar ve nem dayanımlı Fıratpen PVC doğrama ve 10mm cam balkon sevkiyatı.",
    specsTitle: "Mersin Bölge Çözümleri",
    specs: [{ label: "Önerilen Sistem", val: "75'lik Fıratpen Selenit + 10mm Temperli Cam Balkon" }],
    faqs: [{ q: "Mersin ve Tarsus'a sevkiyatınız var mı?", a: "Evet, Adana Seyhan fabrikamızdan düzenli sevkiyat yapıyoruz." }],
  },
  {
    path: "/bolgeler/osmaniye-cam-ureticisi",
    title: "Osmaniye PVC Pencere, Kapı & Cam Balkon | Acarpen — Fıratpen Bayi",
    description: "Osmaniye merkez, Kadirli ve Düziçi projelerine standart ve özel ölçü Fıratpen PVC pencere ve cam balkon sevkiyatı.",
    keywords: "osmaniye pvc pencere, kadirli cam balkon, osmaniye fıratpen",
    geoRegion: "TR-80",
    geoPlacename: "Osmaniye",
    geoPosition: "37.0742;36.2478",
    breadcrumbs: [{ name: "Bölgelerimiz", path: "/bolgeler" }, { name: "Osmaniye", path: "/bolgeler/osmaniye-cam-ureticisi" }],
    h1: "Osmaniye, Kadirli & Düziçi Fıratpen PVC Pencere ve Cam Balkon Çözümleri",
    summary: "Osmaniye, Kadirli ve Düziçi'ndeki konut ve şantiye projelerine doğrudan fabrika üretimi PVC doğrama ve cam balkon.",
    specsTitle: "Osmaniye Bölge Çözümleri",
    specs: [{ label: "Önerilen Sistem", val: "70'lik & 75'lik Fıratpen + 4+16+4 Isıcam" }],
    faqs: [{ q: "Osmaniye'ye demonte pencere gönderiyor musunuz?", a: "Evet, hem demonte hem montajlı sevkiyatımız mevcuttur." }],
  },
  {
    path: "/bolgeler/hatay-cam-firmalari",
    title: "Hatay & İskenderun PVC Pencere, Kapı & Cam Balkon | Acarpen",
    description: "Hatay Antakya, İskenderun, Dörtyol ve Payas şantiyeleri için toplu Fıratpen PVC pencere, kapı ve cam balkon üretimi.",
    keywords: "hatay pvc pencere, iskenderun pvc doğrama, dörtyol cam balkon",
    geoRegion: "TR-31",
    geoPlacename: "Hatay",
    geoPosition: "36.2021;36.1606",
    breadcrumbs: [{ name: "Bölgelerimiz", path: "/bolgeler" }, { name: "Hatay", path: "/bolgeler/hatay-cam-firmalari" }],
    h1: "Hatay & İskenderun Toplu Konut PVC Doğrama ve Cam Balkon Sistemleri",
    summary: "Antakya, İskenderun, Dörtyol ve Payas projelerine yüksek kapasiteli Fıratpen PVC pencere ve kapı sevkiyatı.",
    specsTitle: "Hatay Bölge Çözümleri",
    specs: [{ label: "Önerilen Sistem", val: "75'lik Fıratpen Selenit + Güçlendirilmiş Destek Sacı" }],
    faqs: [{ q: "Toplu konut şantiyelerine üretim yapıyor musunuz?", a: "Evet, yüksek adetli şantiye siparişlerine hızlı termin veriyoruz." }],
  },
  {
    path: "/bolgeler/gaziantep-cam-cozumleri",
    title: "Gaziantep PVC Pencere, Sürme & Cam Balkon | Acarpen — Fıratpen Bayi",
    description: "Gaziantep Şehitkamil ve Şahinbey projeleri için Fıratpen PVC doğrama, Zenia Slide sürme ve cam balkon çözümleri.",
    keywords: "gaziantep pvc pencere, gaziantep fıratpen, şehitkamil cam balkon",
    geoRegion: "TR-27",
    geoPlacename: "Gaziantep",
    geoPosition: "37.0662;37.3833",
    breadcrumbs: [{ name: "Bölgelerimiz", path: "/bolgeler" }, { name: "Gaziantep", path: "/bolgeler/gaziantep-cam-cozumleri" }],
    h1: "Gaziantep Fıratpen PVC Pencere, Hebeschiebe Sürme ve Cam Balkon",
    summary: "Gaziantep konut ve villa projelerine 19 farklı lamine renk seçeneğiyle PVC doğrama ve sürme sistemleri.",
    specsTitle: "Gaziantep Bölge Çözümleri",
    specs: [{ label: "Önerilen Sistem", val: "Fıratpen Elegance 80 / Selenit 75 + Konfor Isıcam" }],
    faqs: [{ q: "Gaziantep'e sevkiyatınız var mı?", a: "Evet, TAG Otoyolu üzerinden haftalık proje sevkiyatı yapıyoruz." }],
  },
  {
    path: "/bolgeler/kayseri-cam-toptan",
    title: "Kayseri PVC Pencere & Isıcamlı Cam Balkon | Acarpen — Fıratpen Bayi",
    description: "Kayseri Melikgazi, Kocasinan ve Talas projeleri için sert kış şartlarına dayanıklı Fıratpen PVC pencere ve ısıcamlı cam balkon.",
    keywords: "kayseri pvc pencere, kayseri ısıcamlı cam balkon",
    geoRegion: "TR-38",
    geoPlacename: "Kayseri",
    geoPosition: "38.7312;35.4787",
    breadcrumbs: [{ name: "Bölgelerimiz", path: "/bolgeler" }, { name: "Kayseri", path: "/bolgeler/kayseri-cam-toptan" }],
    h1: "Kayseri 75'lik & 85'lik Fıratpen PVC Pencere ve Isıcamlı Cam Balkon",
    summary: "Sert kış iklimine uygun 3 contalı Fıratpen Redonit 85 ve Selenit 75 PVC pencere sistemleri.",
    specsTitle: "Kayseri Bölge Çözümleri",
    specs: [{ label: "Önerilen Sistem", val: "Fıratpen Redonit 85 + Üçlü Low-E Isıcam" }],
    faqs: [{ q: "Üçlü ısıcamlı PVC pencere üretiyor musunuz?", a: "Evet, 75'lik ve 85'lik serilerde üçlü ısıcam uygulaması yapıyoruz." }],
  },
  {
    path: "/bolgeler/nigde-cam-sevkiyati",
    title: "Niğde PVC Pencere, Kapı & Cam Balkon | Acarpen — Fıratpen Bayi",
    description: "Niğde merkez, Bor, Ulukışla ve Çamardı'daki konut ve şantiye projelerine Fıratpen PVC pencere ve ısıcamlı cam balkon sevkiyatı.",
    keywords: "niğde pvc pencere, bor cam balkon, çamardı pvc doğrama",
    geoRegion: "TR-51",
    geoPlacename: "Niğde",
    geoPosition: "37.9667;34.6833",
    breadcrumbs: [{ name: "Bölgelerimiz", path: "/bolgeler" }, { name: "Niğde", path: "/bolgeler/nigde-cam-sevkiyati" }],
    h1: "Niğde & Bor Fıratpen PVC Pencere, Balkon Kapısı ve Isıcamlı Cam Balkon",
    summary: "Pozantı-Niğde otoyolu üzerinden Niğde, Bor ve Çamardı projelerine hızlı PVC doğrama ve cam balkon sevkiyatı.",
    specsTitle: "Niğde Bölge Çözümleri",
    specs: [{ label: "Önerilen Sistem", val: "Fıratpen Selenit 75 + Isıcamlı Cam Balkon" }],
    faqs: [{ q: "Niğde ve Çamardı yayla evlerine montaj yapıyor musunuz?", a: "Evet, hem demonte hem montajlı teslimat sağlıyoruz." }],
  },
  {
    path: "/rehber",
    title: "Teknik PVC Pencere, Profil & Isıcam Seçim Rehberi | Acarpen Adana",
    description: "70'lik ve 75'lik PVC profil karşılaştırması, destek sacı kalınlığı, 19 lamine renk kartelası ve 4+16+4 ısıcam seçim kılavuzu.",
    keywords: "pvc pencere rehberi, selenit 75 özellikleri, pvc destek sacı kalınlığı, ısıcam konfor nedir",
    geoRegion: "TR-01",
    geoPlacename: "Adana",
    geoPosition: "36.9850;35.2880",
    breadcrumbs: [{ name: "Teknik Rehber", path: "/rehber" }],
    h1: "Teknik PVC Doğrama, Profil Serileri ve Isıcam Seçim Rehberi",
    summary: "Doğru PVC profil serisi, destek sacı kalınlığı, EPDM conta, açılım yönü ve cam seçimi için mühendislik rehberi.",
    specsTitle: "Temel Teknik Kriterler",
    specs: [
      { label: "Profil Et Kalınlığı", val: "TS EN 12608-1 A Sınıfı (2.5 mm - 3.0 mm)" },
      { label: "Destek Sacı", val: "1.00 mm - 1.50 mm Galvaniz Çelik Destek Sacı" },
    ],
    faqs: [{ q: "70'lik ile 75'lik seri arasındaki fark nedir?", a: "75'lik Selenit serisi 6 odacıklı ve 3 contalı yapısıyla daha yüksek ısı ve ses yalıtımı sağlar." }],
  },
  {
    path: "/projeler",
    title: "Referans Projelerimiz & Uygulamalarımız | Acarpen — Fıratpen Bayi",
    description: "Adana ve Çukurova genelinde tamamladığımız Fıratpen PVC pencere, Hebeschiebe sürme, cam balkon ve kış bahçesi projeleri.",
    keywords: "acarpen referanslar, adana pvc pencere projeleri, adana cam balkon uygulamaları",
    geoRegion: "TR-01",
    geoPlacename: "Adana",
    geoPosition: "36.9850;35.2880",
    breadcrumbs: [{ name: "Referans Projeler", path: "/projeler" }],
    h1: "Tamamlanan PVC Pencere, Sürme ve Cam Balkon Referans Projelerimiz",
    summary: "Konut, rezidans, villa ve ticari yapılarda gerçekleştirdiğimiz Fıratpen PVC doğrama ve cam balkon uygulamalarımız.",
    specsTitle: "Öne Çıkan Projelerimiz",
    specs: [
      { label: "Rezidans & Toplu Konut", val: "Seyhan & Çukurova Konut Projeleri (Selenit 75 & Cam Balkon)" },
      { label: "Villa & Teras", val: "Antrasit Gri Zenia Slide Hebeschiebe & Kış Bahçesi" },
    ],
    faqs: [{ q: "Projeler için ücretsiz keşif yapıyor musunuz?", a: "Evet, tüm bireysel ve kurumsal projelere ücretsiz keşif sunuyoruz." }],
  },
  {
    path: "/uretim-teknolojisi",
    title: "Üretim Teknolojisi & CNC PVC İşleme Parkuru | Acarpen Adana",
    description: "CNC PVC profil kesim, otomatik dört köşe kaynak, CNC köşe temizleme ve ısıcam üretim teknolojilerimiz.",
    keywords: "pvc pencere üretimi adana, dört köşe kaynak makinesi, cnc pvc kesim, acarpen fabrika",
    geoRegion: "TR-01",
    geoPlacename: "Adana",
    geoPosition: "36.9850;35.2880",
    breadcrumbs: [{ name: "Üretim Teknolojisi", path: "/uretim-teknolojisi" }],
    h1: "CNC Otomasyonlu PVC Doğrama ve Cam Balkon Üretim Teknolojimiz",
    summary: "Milimetrik CNC profil kesim, dört köşe kaynak, otomatik köşe temizleme ve çift cam entegrasyon parkurumuz.",
    specsTitle: "Üretim Hattımız",
    specs: [
      { label: "CNC Profil Kesim & Kaynak", val: "0.1 mm Hassasiyetli Otomatik Dört Köşe Kaynak ve Köşe Temizleme" },
      { label: "Destek Sacı & Donanım", val: "Otomatik Vida Sıkma, İspanyolet Kanal Açma ve Cam Çıtası Kesim" },
    ],
    faqs: [{ q: "Dört köşe kaynak neden önemlidir?", a: "Pencere köşelerinin aynı anda 90 derece gönyesinde kaynatılmasını ve tam sızdırmazlık sağlamasını garanti eder." }],
  },
  {
    path: "/hakkimizda",
    title: "Hakkımızda & Kurumsal Kimlik | Acarpen — Fıratpen Yetkili Bayi",
    description: "Adana Seyhan Gülbahçesi Mah. 13428 Sok. No:16/17 adresinde Fıratpen yetkili üretici bayisi olarak hizmet veren Acarpen kurumsal bilgileri.",
    keywords: "acarpen hakkında, acar pen inşaat sanayi, adana fıratpen yetkili bayi",
    geoRegion: "TR-01",
    geoPlacename: "Adana",
    geoPosition: "36.9850;35.2880",
    breadcrumbs: [{ name: "Hakkımızda", path: "/hakkimizda" }],
    h1: "Acarpen — Adana Fıratpen Resmi Yetkili Üretici Bayisi",
    summary: "ACAR PEN İNŞAAT SANAYİ VE TİCARET LİMİTED ŞİRKETİ olarak Adana Seyhan'daki tesisimizde Fıratpen kalitesiyle üretim yapıyoruz.",
    specsTitle: "Kurumsal Bilgilerimiz",
    specs: [
      { label: "Ticari Unvan", val: "ACAR PEN İNŞAAT SANAYİ VE TİCARET LİMİTED ŞİRKETİ" },
      { label: "Adres", val: "GÜLBAHÇESİ MAH. 13428 SOK. NO:16/17 SEYHAN - SEYHAN / ADANA" },
      { label: "Telefon & WhatsApp", val: "0533 625 36 11" },
    ],
    faqs: [{ q: "Showroomunuzu ziyaret edebilir miyiz?", a: "Evet, Pazartesi - Cumartesi 08:00 - 19:00 saatleri arasında Seyhan Gülbahçesi Mahallesindeki tesisimizi ziyaret edebilirsiniz." }],
  },
  {
    path: "/iletisim",
    title: "İletişim & Adres Bilgileri | Acarpen — Fıratpen Yetkili Bayi Adana",
    description: "Acarpen Adana Fıratpen Bayisi adres (Gülbahçesi Mah. 13428 Sok. No:16/17 Seyhan / Adana) ve WhatsApp/telefon (0533 625 36 11) bilgileri.",
    keywords: "acarpen iletişim, acarpen telefon, adana fıratpen adres, 0533 625 36 11",
    geoRegion: "TR-01",
    geoPlacename: "Adana",
    geoPosition: "36.9850;35.2880",
    breadcrumbs: [{ name: "İletişim", path: "/iletisim" }],
    h1: "Acarpen Fabrika, Showroom ve İletişim Kanallarımız",
    summary: "Ücretsiz keşif, ölçü ve fiyat teklifi için Gülbahçesi Mah. 13428 Sok. No:16/17 Seyhan / Adana adresimizden veya 0533 625 36 11 hattımızdan bize ulaşın.",
    specsTitle: "İletişim Bilgileri",
    specs: [
      { label: "Adres", val: "GÜLBAHÇESİ MAH. 13428 SOK. NO:16/17 SEYHAN - SEYHAN / ADANA" },
      { label: "Telefon & WhatsApp", val: "0533 625 36 11 (+90 533 625 36 11)" },
      { label: "E-Posta", val: "info@acarpen.com.tr" },
    ],
    faqs: [{ q: "WhatsApp'tan ölçü gönderip fiyat alabilir miyim?", a: "Evet, 0533 625 36 11 numaralı WhatsApp hattımıza ölçülerinizi göndererek hızlıca teklif alabilirsiniz." }],
  },
  {
    path: "/siparis-takip",
    title: "Canlı Sipariş ve Üretim Takip Sistemi | Acarpen Adana",
    description: "Acarpen sipariş numaranız ile PVC doğrama kesim, kaynak, cam montajı ve sevkiyat durumunuzu online takip edin.",
    keywords: "acarpen sipariş takip, pvc pencere üretim takip",
    geoRegion: "TR-01",
    geoPlacename: "Adana",
    geoPosition: "36.9850;35.2880",
    breadcrumbs: [{ name: "Sipariş Takip", path: "/siparis-takip" }],
    h1: "Online Canlı Sipariş ve Üretim Takip Portalı",
    summary: "Siparişinizin profil kesim, kaynak, aksesuar montajı ve sevkiyat aşamalarını takip numaranızla izleyin.",
    specsTitle: "Üretim Aşamaları",
    specs: [
      { label: "1. Aşama", val: "CNC Profil & Destek Sacı Kesimi" },
      { label: "2. Aşama", val: "Dört Köşe Kaynak & CNC Köşe Temizleme" },
      { label: "3. Aşama", val: "Aksesuar, Conta & 4+16+4 Isıcam Montajı" },
    ],
    faqs: [{ q: "Sipariş numaramı nasıl öğrenebilirim?", a: "Teklif veya sipariş formunuzun sağ üst köşesindeki kod ile sorgulama yapabilirsiniz." }],
  },
  {
    path: "/projeler/mersin-tower-plaza",
    title: "Çukurova Prestij Konutları PVC Doğrama & Sürme Projesi | Acarpen",
    description: "Çukurova'daki konut projesinde Antrasit Gri Fıratpen Selenit 75 PVC pencereler ve Hebeschiebe sürme sistemleri uygulaması.",
    keywords: "adana pvc pencere referans, selenit 75 antrasit gri proje",
    geoRegion: "TR-01",
    geoPlacename: "Adana",
    geoPosition: "36.9850;35.2880",
    breadcrumbs: [{ name: "Referans Projeler", path: "/projeler" }, { name: "Çukurova Prestij Konutları", path: "/projeler/mersin-tower-plaza" }],
    h1: "Çukurova Prestij Konutları: Antrasit Gri Selenit 75 & Sürme Uygulaması",
    summary: "Antrasit Gri (2613) Fıratpen Selenit 75 serisi pencereler ve Zenia Slide sürme kapıların anahtar teslim montajı.",
    specsTitle: "Proje Detayları",
    specs: [{ label: "Kullanılan Sistem", val: "Fıratpen Selenit 75 Antrasit Gri + 4+16+4 Konfor Isıcam" }],
    faqs: [{ q: "Projede hangi renk kullanıldı?", a: "Antrasit Gri 2613 dış cephe UV dayanımlı lamine folyo tercih edildi." }],
  },
  {
    path: "/projeler/seyhan-modern-rezidans",
    title: "Seyhan Modern Rezidans (120 Daire PVC Doğrama & Cam Balkon) | Acarpen",
    description: "Adana Seyhan'da 120 dairelik rezidans projesinin Fıratpen PVC pencere, balkon kapısı ve füme katlanır cam balkon uygulaması.",
    keywords: "seyhan rezidans cam balkon, adana toplu konut pvc pencere",
    geoRegion: "TR-01",
    geoPlacename: "Adana",
    geoPosition: "36.9850;35.2880",
    breadcrumbs: [{ name: "Referans Projeler", path: "/projeler" }, { name: "Seyhan Modern Rezidans", path: "/projeler/seyhan-modern-rezidans" }],
    h1: "Seyhan Modern Rezidans: 120 Daire PVC Doğrama ve Cam Balkon",
    summary: "Adana Seyhan'da 120 dairenin tüm PVC pencere, balkon kapısı ve katlanır cam balkon sistemleri Acarpen tarafından üretildi.",
    specsTitle: "Proje Detayları",
    specs: [{ label: "Kullanılan Sistem", val: "75'lik Fıratpen PVC Pencere & 10mm Füme Katlanır Cam Balkon" }],
    faqs: [{ q: "Montaj süresi ne kadar sürdü?", a: "Blok teslim takvimine uygun olarak 45 günde anahtar teslim tamamlandı." }],
  },
  {
    path: "/projeler/cukurova-panoramik-villa",
    title: "Güzelyalı Panoramik Villa Hebeschiebe & Kış Bahçesi | Acarpen",
    description: "Adana Çukurova Güzelyalı'da müstakil villa projesinde Altın Meşe Hebeschiebe sürme kapılar, motorlu panjur ve kış bahçesi uygulaması.",
    keywords: "adana villa kış bahçesi, altın meşe hebeschiebe sürme",
    geoRegion: "TR-01",
    geoPlacename: "Adana",
    geoPosition: "36.9850;35.2880",
    breadcrumbs: [{ name: "Referans Projeler", path: "/projeler" }, { name: "Güzelyalı Panoramik Villa", path: "/projeler/cukurova-panoramik-villa" }],
    h1: "Güzelyalı Panoramik Villa: Hebeschiebe Sürme ve Kış Bahçesi",
    summary: "Altın Meşe (2616) lamine renkli Fıratpen Zenia Slide sürme sistemler, motorlu panjur ve ısıcamlı kış bahçesi.",
    specsTitle: "Proje Detayları",
    specs: [{ label: "Kullanılan Sistem", val: "Fıratpen Zenia Slide Altın Meşe + Motorlu Panjur" }],
    faqs: [{ q: "Motorlu panjurlar uzaktan kumandalı mı?", a: "Evet, tüm pencerelerde uzaktan kumandalı monoblok panjur sistemi uygulandı." }],
  },
  {
    path: "/projeler/gaziantep-osb-tekstil-fabrikasi",
    title: "AOSB Fabrika İdari Binası PVC & Alüminyum Doğrama | Acarpen",
    description: "Adana OSB'deki sanayi tesisinin idari binası için yüksek ses yalıtımlı PVC pencereler, ofis bölmeleri ve alüminyum giriş kapıları.",
    keywords: "adana osb pvc doğrama, alüminyum ofis bölme adana",
    geoRegion: "TR-01",
    geoPlacename: "Adana",
    geoPosition: "36.9850;35.2880",
    breadcrumbs: [{ name: "Referans Projeler", path: "/projeler" }, { name: "AOSB İdari Bina", path: "/projeler/gaziantep-osb-tekstil-fabrikasi" }],
    h1: "AOSB Fabrika İdari Binası: Akustik Yalıtımlı Doğrama ve Ofis Bölme",
    summary: "Sanayi gürültüsünü kesen 75'lik Fıratpen pencereler, jaluzili ısıcamlı ofis bölmeleri ve alüminyum cephe doğramaları.",
    specsTitle: "Proje Detayları",
    specs: [{ label: "Kullanılan Sistem", val: "Fıratpen Elegance 80 + Jaluzili Ofis Bölme Sistemleri" }],
    faqs: [{ q: "Ofis bölmelerinde jaluzili ısıcam kullanıldı mı?", a: "Evet, yönetici ofislerinde çift cam arası mıknatıslı jaluzi sistemleri uygulandı." }],
  },
];

function buildSemanticHTML(route) {
  const breadcrumbMarkup =
    route.breadcrumbs.length > 0
      ? `<nav aria-label="Breadcrumb" class="prerender-breadcrumb">
          <ol itemscope itemtype="https://schema.org/BreadcrumbList">
            <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
              <a itemprop="item" href="/"><span itemprop="name">Ana Sayfa</span></a>
              <meta itemprop="position" content="1" />
            </li>
            ${route.breadcrumbs
              .map(
                (b, idx) => `
              <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
                <span class="sep">/</span>
                <a itemprop="item" href="${b.path}"><span itemprop="name">${b.name}</span></a>
                <meta itemprop="position" content="${idx + 2}" />
              </li>`
              )
              .join("")}
          </ol>
        </nav>`
      : "";

  const specsMarkup =
    route.specs && route.specs.length > 0
      ? `<section class="prerender-specs">
          <h2>${route.specsTitle || "Teknik Özellikler ve Performans Parametreleri"}</h2>
          <table class="prerender-table">
            <thead>
              <tr><th>Kriter / Parametre</th><th>Değer / Standart</th></tr>
            </thead>
            <tbody>
              ${route.specs
                .map((s) => `<tr><td><strong>${s.label}</strong></td><td>${s.val}</td></tr>`)
                .join("")}
            </tbody>
          </table>
        </section>`
      : "";

  const faqsMarkup =
    route.faqs && route.faqs.length > 0
      ? `<section class="prerender-faqs">
          <h2>Sıkça Sorulan Sorular (SSS)</h2>
          <div class="faq-list">
            ${route.faqs
              .map(
                (f) => `<details class="faq-item">
                  <summary><strong>${f.q}</strong></summary>
                  <p>${f.a}</p>
                </details>`
              )
              .join("")}
          </div>
        </section>`
      : "";

  return `
    <header class="prerender-header" style="background:#0f172a;color:#ffffff;padding:1.25rem 2rem;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #1e293b;">
      <a href="/" style="color:#ffffff;text-decoration:none;font-size:1.5rem;font-weight:bold;letter-spacing:-0.02em;">
        ACAR <span style="color:#38bdf8;">PEN</span>
      </a>
      <nav aria-label="Ana Menü" style="display:flex;gap:1.5rem;font-size:0.925rem;">
        <a href="/hizmetler" style="color:#cbd5e1;text-decoration:none;">Ürünlerimiz</a>
        <a href="/urunler/renkli-camlar" style="color:#cbd5e1;text-decoration:none;">19 Renk Kartelası</a>
        <a href="/hesaplama" style="color:#38bdf8;text-decoration:none;font-weight:600;">Ölçü & Teklif Al</a>
        <a href="/rehber" style="color:#cbd5e1;text-decoration:none;">Teknik Rehber</a>
        <a href="/projeler" style="color:#cbd5e1;text-decoration:none;">Projeler</a>
        <a href="/iletisim" style="color:#cbd5e1;text-decoration:none;">İletişim</a>
      </nav>
    </header>

    <main class="prerender-main" style="max-width:1200px;margin:0 auto;padding:3rem 1.5rem;font-family:system-ui,-apple-system,sans-serif;color:#1e293b;line-height:1.6;">
      ${breadcrumbMarkup}

      <header style="margin-bottom:2.5rem;">
        <span style="display:inline-block;padding:0.35rem 0.85rem;background:#e0f2fe;color:#0369a1;border-radius:9999px;font-size:0.75rem;font-weight:bold;text-transform:uppercase;margin-bottom:0.75rem;">
          Fıratpen Yetkili Üretici Bayi • Acarpen Adana
        </span>
        <h1 style="font-size:2.25rem;font-weight:800;color:#0f172a;letter-spacing:-0.03em;margin-top:0.25rem;line-height:1.2;">
          ${route.h1}
        </h1>
        <p style="font-size:1.15rem;color:#475569;margin-top:1rem;max-width:900px;">
          ${route.summary}
        </p>
      </header>

      ${specsMarkup}

      ${faqsMarkup}

      <section class="prerender-cta" style="margin-top:3.5rem;padding:2.5rem;background:#0f172a;border-radius:1rem;color:#ffffff;display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:1.5rem;">
        <div>
          <h3 style="font-size:1.5rem;font-weight:700;margin-bottom:0.5rem;color:#ffffff;">PVC Pencere & Cam Balkon İçin Anında Teklif Alın</h3>
          <p style="color:#94a3b8;font-size:0.95rem;margin:0;">Ölçü ve renk tercihlerinizi yapılandırıcıdan seçin veya doğrudan 0533 625 36 11 WhatsApp hattımıza bağlanın.</p>
        </div>
        <div style="display:flex;gap:1rem;flex-wrap:wrap;">
          <a href="/hesaplama" style="display:inline-block;padding:0.85rem 1.5rem;background:#0284c7;color:#ffffff;text-decoration:none;border-radius:0.5rem;font-weight:700;">
            Online Ölçü & Teklif Al
          </a>
          <a href="https://wa.me/905336253611" target="_blank" rel="noopener noreferrer" style="display:inline-block;padding:0.85rem 1.5rem;background:#10b981;color:#ffffff;text-decoration:none;border-radius:0.5rem;font-weight:700;">
            WhatsApp: 0533 625 36 11
          </a>
        </div>
      </section>
    </main>

    <footer class="prerender-footer" style="background:#020617;color:#94a3b8;padding:3rem 2rem;border-top:1px solid #1e293b;margin-top:4rem;font-family:system-ui,-apple-system,sans-serif;font-size:0.875rem;">
      <div style="max-width:1200px;margin:0 auto;display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:2rem;">
        <div>
          <strong style="color:#ffffff;font-size:1.1rem;display:block;margin-bottom:0.75rem;">ACAR PEN İNŞAAT SANAYİ VE TİCARET LTD. ŞTİ.</strong>
          <p style="margin:0.25rem 0;">GÜLBAHÇESİ MAH. 13428 SOK. NO:16/17 SEYHAN - SEYHAN / ADANA</p>
          <p style="margin:0.25rem 0;">Telefon & WhatsApp: 0533 625 36 11</p>
          <p style="margin:0.25rem 0;">E-Posta: info@acarpen.com.tr</p>
        </div>
        <div>
          <strong style="color:#ffffff;display:block;margin-bottom:0.75rem;">Kalite Standartları</strong>
          <p style="margin:0.25rem 0;">• Fıratpen Resmi Yetkili Üretici Bayi</p>
          <p style="margin:0.25rem 0;">• TS EN 12608-1 A Sınıfı PVC Profil</p>
          <p style="margin:0.25rem 0;">• 1.00 mm+ Destek Sacı & 4+16+4 Isıcam</p>
        </div>
        <div>
          <strong style="color:#ffffff;display:block;margin-bottom:0.75rem;">Hızlı Bağlantılar</strong>
          <p style="margin:0.25rem 0;"><a href="/urunler/cift-cam" style="color:#38bdf8;text-decoration:none;">PVC Pencere Sistemleri</a></p>
          <p style="margin:0.25rem 0;"><a href="/urunler/balkon-cami" style="color:#38bdf8;text-decoration:none;">Cam Balkon Sistemleri</a></p>
          <p style="margin:0.25rem 0;"><a href="/urunler/renkli-camlar" style="color:#38bdf8;text-decoration:none;">19 Farklı Renk Alternatifi</a></p>
        </div>
      </div>
    </footer>
  `;
}

function buildJSONLDSchemas(route) {
  const canonicalUrl = `${BASE_URL}${route.path === "/" ? "/" : route.path}`;
  const schemas = [ORGANIZATION_BASE_SCHEMA];

  if (route.breadcrumbs && route.breadcrumbs.length > 0) {
    schemas.push({
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: `${BASE_URL}/` },
        ...route.breadcrumbs.map((b, idx) => ({
          "@type": "ListItem",
          position: idx + 2,
          name: b.name,
          item: `${BASE_URL}${b.path}`,
        })),
      ],
    });
  }

  if (route.path.startsWith("/urunler/")) {
    schemas.push(
      buildPrerenderProductSchema({
        name: route.h1,
        description: route.description,
        category: route.h1,
        url: canonicalUrl,
        sku: `AP-${route.path.replace(/[^a-z0-9]/gi, "-").toUpperCase().replace(/^-+|-+$/g, "")}`,
      })
    );
  }

  if (route.faqs && route.faqs.length > 0) {
    schemas.push({
      "@type": "FAQPage",
      mainEntity: route.faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    });
  }

  return JSON.stringify({ "@context": "https://schema.org", "@graph": schemas }, null, 2);
}

async function main() {
  console.log("======================================================");
  console.log("⚡ Acarpen - SEO & GEO Prerender Engine Çalışıyor");
  console.log("======================================================");

  const templatePath = path.join(distDir, "index.html");
  if (!fs.existsSync(templatePath)) {
    console.error(`[Prerender HATA] dist/index.html bulunamadı! Önce 'vite build' çalıştırın.`);
    process.exit(1);
  }

  const baseHtml = fs.readFileSync(templatePath, "utf-8");
  let generatedCount = 0;

  for (const route of ROUTES) {
    const canonicalUrl = `${BASE_URL}${route.path === "/" ? "/" : route.path}`;
    const semanticBody = buildSemanticHTML(route);
    const jsonLdContent = buildJSONLDSchemas(route);

    let html = baseHtml;

    html = html.replace(/<title>.*?<\/title>/s, `<title>${route.title}</title>`);
    html = html.replace(
      /<meta\s+name=["']description["']\s+content=["'].*?["']\s*\/?>/i,
      `<meta name="description" content="${route.description.replace(/"/g, "&quot;")}" />`
    );
    html = html.replace(
      /<meta\s+name=["']keywords["']\s+content=["'].*?["']\s*\/?>/i,
      `<meta name="keywords" content="${route.keywords.replace(/"/g, "&quot;")}" />`
    );
    html = html.replace(
      /<link\s+rel=["']canonical["']\s+href=["'].*?["']\s*\/?>/i,
      `<link rel="canonical" href="${canonicalUrl}" />`
    );
    html = html.replace(
      /<meta\s+property=["']og:title["']\s+content=["'].*?["']\s*\/?>/i,
      `<meta property="og:title" content="${route.title.replace(/"/g, "&quot;")}" />`
    );
    html = html.replace(
      /<meta\s+property=["']og:description["']\s+content=["'].*?["']\s*\/?>/i,
      `<meta property="og:description" content="${route.description.replace(/"/g, "&quot;")}" />`
    );
    html = html.replace(
      /<meta\s+property=["']og:url["']\s+content=["'].*?["']\s*\/?>/i,
      `<meta property="og:url" content="${canonicalUrl}" />`
    );
    html = html.replace(
      /<meta\s+name=["']twitter:title["']\s+content=["'].*?["']\s*\/?>/i,
      `<meta name="twitter:title" content="${route.title.replace(/"/g, "&quot;")}" />`
    );
    html = html.replace(
      /<meta\s+name=["']twitter:description["']\s+content=["'].*?["']\s*\/?>/i,
      `<meta name="twitter:description" content="${route.description.replace(/"/g, "&quot;")}" />`
    );

    if (route.geoRegion) {
      html = html.replace(
        /<meta\s+name=["']geo.region["']\s+content=["'].*?["']\s*\/?>/i,
        `<meta name="geo.region" content="${route.geoRegion}" />`
      );
    }
    if (route.geoPlacename) {
      html = html.replace(
        /<meta\s+name=["']geo.placename["']\s+content=["'].*?["']\s*\/?>/i,
        `<meta name="geo.placename" content="${route.geoPlacename}" />`
      );
    }
    if (route.geoPosition) {
      html = html.replace(
        /<meta\s+name=["']geo.position["']\s+content=["'].*?["']\s*\/?>/i,
        `<meta name="geo.position" content="${route.geoPosition}" />`
      );
      html = html.replace(
        /<meta\s+name=["']ICBM["']\s+content=["'].*?["']\s*\/?>/i,
        `<meta name="ICBM" content="${route.geoPosition.replace(";", ", ")}" />`
      );
    }

    const jsonLdTag = `\n    <script type="application/ld+json" id="static-prerender-jsonld">\n${jsonLdContent}\n    </script>\n  </head>`;
    html = html.replace("</head>", jsonLdTag);
    html = html.replace('<div id="root"></div>', `<div id="root">${semanticBody}</div>`);

    let targetFilePath;
    if (route.path === "/") {
      targetFilePath = path.join(distDir, "index.html");
    } else {
      const targetDir = path.join(distDir, ...route.path.split("/").filter(Boolean));
      fs.mkdirSync(targetDir, { recursive: true });
      targetFilePath = path.join(targetDir, "index.html");
    }

    fs.writeFileSync(targetFilePath, html, "utf-8");
    generatedCount++;
    console.log(`✓ [Prerender] ${route.path.padEnd(42)} -> ${path.relative(distDir, targetFilePath)}`);
  }

  console.log("======================================================");
  console.log(`🎉 Başarılı: Toplam ${generatedCount} sayfa statik SEO/GEO HTML olarak üretildi!`);
  console.log("======================================================");
}

main().catch((err) => {
  console.error("Prerender hatası:", err);
  process.exit(1);
});
