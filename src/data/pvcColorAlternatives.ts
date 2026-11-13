export interface PvcColorOption {
  id: string;
  name: string;
  code: string;
  previewImage: string;
  swatchImage: string;
  category: "Antrasit & Gri Tonlar" | "Ahşap Desenler" | "Metalik & Platin" | "Klasik & Koyu Tonlar";
}

export const PVC_COLOR_ALTERNATIVES: PvcColorOption[] = [
  {
    id: "antrasit-gri",
    name: "Antrasit Gri",
    code: "2613",
    previewImage: "/assets/renk/resim-63818_h800.png",
    swatchImage: "/assets/renk/resim-144345_w80_h80.jpg",
    category: "Antrasit & Gri Tonlar",
  },
  {
    id: "metalik-antrasit",
    name: "Metalik Antrasit",
    code: "2612",
    previewImage: "/assets/renk/resim-306576_h800.png",
    swatchImage: "/assets/renk/resim-993899_w80_h80.jpg",
    category: "Antrasit & Gri Tonlar",
  },
  {
    id: "altin-mese",
    name: "Altın Meşe",
    code: "2616",
    previewImage: "/assets/renk/resim-191078_h800.png",
    swatchImage: "/assets/renk/resim-536912_w80_h80.jpg",
    category: "Ahşap Desenler",
  },
  {
    id: "eskitme",
    name: "Eskitme",
    code: "2617",
    previewImage: "/assets/renk/resim-780201_h800.png",
    swatchImage: "/assets/renk/resim-273014_w80_h80.jpg",
    category: "Ahşap Desenler",
  },
  {
    id: "vizon",
    name: "Vizon",
    code: "2611",
    previewImage: "/assets/renk/resim-777221_h800.png",
    swatchImage: "/assets/renk/resim-857176_w80_h80.jpg",
    category: "Klasik & Koyu Tonlar",
  },
  {
    id: "koyu-mese",
    name: "Koyu Meşe",
    code: "2618",
    previewImage: "/assets/renk/resim-722372_h800.png",
    swatchImage: "/assets/renk/resim-894255_w80_h80.jpg",
    category: "Ahşap Desenler",
  },
  {
    id: "antik-mese",
    name: "Antik Meşe",
    code: "2614",
    previewImage: "/assets/renk/resim-117777_h800.png",
    swatchImage: "/assets/renk/resim-711994_w80_h80.jpg",
    category: "Ahşap Desenler",
  },
  {
    id: "karbon-siyah",
    name: "Karbon Siyah",
    code: "2610",
    previewImage: "/assets/renk/resim-168298_h800.png",
    swatchImage: "/assets/renk/resim-767967_w80_h80.jpg",
    category: "Klasik & Koyu Tonlar",
  },
  {
    id: "siyah",
    name: "Siyah",
    code: "2620",
    previewImage: "/assets/renk/resim-20878_h800.png",
    swatchImage: "/assets/renk/resim-300042_w80_h80.jpg",
    category: "Klasik & Koyu Tonlar",
  },
  {
    id: "gumus-gri",
    name: "Gümüş Gri",
    code: "Standart",
    previewImage: "/assets/renk/gumus-gri-pencere_h800.png",
    swatchImage: "/assets/renk/gumus-gri_w80_h80.jpg",
    category: "Antrasit & Gri Tonlar",
  },
  {
    id: "aluminyum-efekt",
    name: "Alüminyum Efekt",
    code: "Metalik",
    previewImage: "/assets/renk/resim-180911_h800.png",
    swatchImage: "/assets/renk/aluminyum-efekt_w80_h80.jpg",
    category: "Metalik & Platin",
  },
  {
    id: "kristal-beyaz",
    name: "Kristal Beyaz",
    code: "RAL 9016",
    previewImage: "/assets/renk/kristal-beyaz_h800.png",
    swatchImage: "/assets/renk/kristal-beyaz_w80_h80.jpg",
    category: "Klasik & Koyu Tonlar",
  },
  {
    id: "maun",
    name: "Maun",
    code: "2619",
    previewImage: "/assets/renk/resim-267369_h800.png",
    swatchImage: "/assets/renk/resim-182914_w80_h80.jpg",
    category: "Ahşap Desenler",
  },
  {
    id: "budakli-mese",
    name: "Budaklı Meşe",
    code: "2615",
    previewImage: "/assets/renk/resim-394224_h800.png",
    swatchImage: "/assets/renk/resim-338923_w80_h80.jpg",
    category: "Ahşap Desenler",
  },
  {
    id: "pirit",
    name: "Pirit",
    code: "2623",
    previewImage: "/assets/renk/resim-571705_h800.png",
    swatchImage: "/assets/renk/resim-991855_w80_h80.jpg",
    category: "Metalik & Platin",
  },
  {
    id: "kuvars-platin",
    name: "Kuvars Platin",
    code: "2624",
    previewImage: "/assets/renk/resim-59119_h800.png",
    swatchImage: "/assets/renk/resim-253302_w80_h80.jpg",
    category: "Metalik & Platin",
  },
  {
    id: "bazalt-gri",
    name: "Bazalt Gri",
    code: "2625",
    previewImage: "/assets/renk/resim-279387_h800.png",
    swatchImage: "/assets/renk/resim-886614_w80_h80.jpg",
    category: "Antrasit & Gri Tonlar",
  },
  {
    id: "tac-platin",
    name: "Taç Platin",
    code: "2626",
    previewImage: "/assets/renk/resim-983478_h800.png",
    swatchImage: "/assets/renk/resim-884355_w80_h80.jpg",
    category: "Metalik & Platin",
  },
  {
    id: "parlak-gumus",
    name: "Parlak Gümüş",
    code: "2622",
    previewImage: "/assets/renk/resim-180911_h800.png",
    swatchImage: "/assets/renk/resim-248358_w80_h80.jpg",
    category: "Metalik & Platin",
  },
];

export const WINDOW_COLOR_FEATURES = [
  {
    title: "Güçlü Yalıtım Kat Sayısı ile Üstün Konfor",
    desc: "Yüksek performanslı ısı ve ses yalıtımı sağlayan özel hava odacıkları sayesinde enerji tasarrufunu en üst seviyeye çıkartır.",
  },
  {
    title: "Panoramik Görünüm, Maksimum Estetik",
    desc: "Modern tasarımı sayesinde doğal ışığı maksimum seviyede içeri alarak panoramik bir görüş sağlar.",
  },
  {
    title: "Her Koşula Karşı Dayanıklı Yapı",
    desc: "Rüzgâr, yağmur, kar ve UV ışınlarına karşı üstün dayanıklılık göstererek uzun ömürlü kullanım sunar.",
  },
  {
    title: "Test Edildi, Onaylandı!",
    desc: "Kapsamlı performans testlerinden başarıyla geçerek ısı ve ses yalıtımında üstün performans sağladığı kanıtlanmıştır.",
  },
];


export interface PvcColoredGlassOption {
  id: string;
  name: string;
  spec: string;
  colorHex: string;
  gradientClass: string;
  matchingProfiles: string;
  usage: string;
  benefit: string;
  solarControl: string;
  privacyLevel: string;
}

export const PVC_COLORED_GLASS_OPTIONS: PvcColoredGlassOption[] = [
  {
    id: "fume-reflekte",
    name: "Füme (Gri) & Füme Reflekte Isıcam",
    spec: "4+16+4 mm Füme Isıcam / 8-10 mm Temperli",
    colorHex: "#334155",
    gradientClass: "from-slate-700 via-slate-800 to-slate-950",
    matchingProfiles: "Antrasit Gri, Metalik Antrasit, Karbon Siyah, Bazalt Gri, Kuvars Platin",
    usage: "Salon & cephe PVC pencereleri, Hebeschiebe sürme kapılar, Düz/L/U cam balkonlar",
    benefit: "Adana güneşinde parlama ve ısı girişini keser; gündüz dışarıdan içerinin görünmesini önleyerek yüksek mahremiyet sağlar.",
    solarControl: "%58 Güneş Isısı Kırımı",
    privacyLevel: "Yüksek Gündüz Mahremiyeti",
  },
  {
    id: "bronz-reflekte",
    name: "Bronz & Bronz Reflekte Isıcam",
    spec: "4+16+4 mm Bronz Isıcam / 8-10 mm Temperli",
    colorHex: "#78350f",
    gradientClass: "from-amber-800 via-amber-900 to-stone-950",
    matchingProfiles: "Altın Meşe, Koyu Meşe, Antik Meşe, Maun, Vizon, Budaklı Meşe",
    usage: "Ahşap desenli PVC pencereler, villa sürme doğramaları, balkon kapıları ve cam balkonlar",
    benefit: "Doğal ahşap lamine PVC profillerle sıcak estetik bütünlük kurar; zararlı UV ışınlarını süzerek perde ve mobilyaların solmasını önler.",
    solarControl: "%55 Güneş & UV Kırımı",
    privacyLevel: "Yüksek Gündüz Mahremiyeti",
  },
  {
    id: "mavi-reflekte",
    name: "Mavi Reflekte (Solar Güneş Kontrol) Isıcam",
    spec: "4+16+4 mm Solar Mavi Reflekte Isıcam",
    colorHex: "#0369a1",
    gradientClass: "from-sky-600 via-blue-800 to-slate-950",
    matchingProfiles: "Kristal Beyaz, Gümüş Gri, Alüminyum Efekt, Parlak Gümüş, Antrasit Gri",
    usage: "Güney ve batı cepheli daire PVC pencereleri, rezidanslar ve dubleks teras kapamaları",
    benefit: "Yüksek güneş enerjisi kırımı ile yaz aylarında klima sarfiyatını düşürür, dış cepheye prestijli aynalı reflekte görünüm kazandırır.",
    solarControl: "%62 Güneş Isısı Kırımı",
    privacyLevel: "Aynalı Dış Yansıma (Reflekte)",
  },
  {
    id: "yesil-reflekte",
    name: "Yeşil & Tifani Reflekte Isıcam",
    spec: "4+16+4 mm Yeşil Isıcam / 8-10 mm Temperli",
    colorHex: "#047857",
    gradientClass: "from-emerald-600 via-teal-800 to-slate-950",
    matchingProfiles: "Kristal Beyaz, Altın Meşe, Vizon, Antrasit Gri",
    usage: "Bahçe katı villalar, kış bahçesi PVC/alüminyum doğramaları, panoramik salon pencereleri",
    benefit: "Doğal ışık geçirgenliğini korurken güneş ısısını dengeler, peyzaj ve bahçe cepheleriyle ferah bir uyum sağlar.",
    solarControl: "%52 Güneş Isısı Kırımı",
    privacyLevel: "Orta-Yüksek Gündüz Mahremiyeti",
  },
  {
    id: "satinato-buzlu",
    name: "Satinato (Buzlu / Kumlu / Desenli) PVC Camı",
    spec: "4+16+4 mm Buzlu Isıcam / 4-6 mm Tek Cam",
    colorHex: "#94a3b8",
    gradientClass: "from-slate-300 via-slate-400 to-slate-600",
    matchingProfiles: "Tüm 19 PVC Renk Alternatifi (Özellikle 85×200 WC Kapıları & 40×40 / 50×50 Vasistas)",
    usage: "85×200 cm PVC WC & banyo kapıları, 40×40 ve 50×50 cm banyo vasistas pencereleri, apartman aydınlık pencereleri",
    benefit: "Gün ışığını mekan içerisine homojen şekilde geçirirken gece ve gündüz görüntüyü %100 bloke ederek tam mahremiyet sağlar.",
    solarControl: "Homojen Gün Işığı Dağılımı",
    privacyLevel: "%100 Gece & Gündüz Tam Mahremiyet",
  },
  {
    id: "seffaf-konfor-isicam",
    name: "Şeffaf Konfor & Sinerji (4 Mevsim Low-E) Isıcam",
    spec: "4+16+4 mm Argon Gazlı Solar Low-E Isıcam",
    colorHex: "#0284c7",
    gradientClass: "from-sky-400 via-cyan-600 to-slate-800",
    matchingProfiles: "Fıratpen Selenit 75, Redonit 85, Elegance 80 ve Tüm Sürme Serileri",
    usage: "Tüm konut, villa ve toplu konut PVC pencere, balkon kapısı ve ısıcamlı cam balkon projeleri",
    benefit: "Berrak şeffaf görünümü koruyarak kışın ısı kaybını %50, yazın güneş ısısı girişini %45'e varan oranda azaltır.",
    solarControl: "Uw: 1.1 W/m²K Dört Mevsim Yalıtım",
    privacyLevel: "Maksimum Doğal Gün Işığı (%78 LT)",
  },
];
