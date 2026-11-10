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
    previewImage: "/assets/renk/resim-180911_h800-1_h800.png",
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
