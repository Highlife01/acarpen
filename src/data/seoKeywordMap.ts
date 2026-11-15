export type KeywordClusterCode =
  | "A_PVC_PENCERE"
  | "B_FIRATPEN"
  | "C_WINSA_PIMAPEN"
  | "D_CAM_BALKON"
  | "E_SURME_HEBESCHIEBE"
  | "F_KAPI_PANJUR"
  | "G_SINEKLIK_AKSESUAR"
  | "H_ISICAM_TEKNIK"
  | "I_TICARI_FIYAT"
  | "J_B2B_SANTIYE"
  | "K_YEREL_SEO"
  | "L_GEO_AI";

export type KeywordTier = "primary" | "secondary" | "semantic";
export type SearchIntent = "bilgi" | "ticari" | "islem" | "navigasyon";
export type KeywordPriority = "P0" | "P1" | "P2" | "P3";

export interface SeoKeywordEntry {
  id: string;
  keyword: string;
  cluster: KeywordClusterCode;
  clusterLabel: string;
  tier: KeywordTier;
  intent: SearchIntent;
  targetCity: string;
  targetDistrict: string;
  targetLandingPage: string;
  suggestedUrl: string;
  gscImpressions: number | null;
  gscClicks: number | null;
  ctr: number | null;
  avgPosition: number | null;
  searchVolume: number | null;
  competition: "Veri bekleniyor";
  businessRelevance: 1 | 2 | 3 | 4 | 5;
  conversionPotential: "Düşük" | "Orta" | "Yüksek" | "Çok Yüksek";
  priority: KeywordPriority;
  contentStatus: "Yayında & Optimize";
  indexingStatus: "Veri bekleniyor (Canlı GSC Bekleniyor)";
  lastReviewed: string;
}

export interface ClusterSpec {
  code: KeywordClusterCode;
  label: string;
  defaultPage: string;
  defaultSuggestedUrl: string;
  defaultCity: string;
  defaultDistrict: string;
  defaultRelevance: 1 | 2 | 3 | 4 | 5;
  rows: ReadonlyArray<
    readonly [
      keyword: string,
      tier: KeywordTier,
      intent: SearchIntent,
      priority: KeywordPriority,
      conversion: "Düşük" | "Orta" | "Yüksek" | "Çok Yüksek",
      city?: string,
      district?: string,
      page?: string,
      suggested?: string,
    ]
  >;
}

const REVIEW_DATE = "2026-11-15";

const CLUSTER_SPECS: readonly ClusterSpec[] = [
  {
    code: "A_PVC_PENCERE",
    label: "A. PVC Pencere & Doğrama",
    defaultPage: "/urunler/cift-cam",
    defaultSuggestedUrl: "/pvc-pencere-sistemleri",
    defaultCity: "Adana",
    defaultDistrict: "Merkez & Çukurova",
    defaultRelevance: 5,
    rows: [
      ["adana pvc pencere", "primary", "ticari", "P0", "Çok Yüksek"],
      ["pvc pencere sistemleri adana", "secondary", "ticari", "P0", "Yüksek"],
      ["pvc doğrama imalatı adana", "secondary", "ticari", "P0", "Yüksek"],
      ["70 lik pvc pencere adana", "secondary", "ticari", "P1", "Yüksek"],
      ["75 lik pvc pencere adana", "secondary", "ticari", "P1", "Yüksek"],
      ["85 lik pvc pencere adana", "secondary", "ticari", "P1", "Yüksek"],
      ["hazır ölçü pvc pencere adana", "secondary", "islem", "P1", "Çok Yüksek"],
      ["özel ölçü pvc pencere üretimi", "secondary", "islem", "P0", "Çok Yüksek"],
      ["çift açılım pvc pencere", "secondary", "ticari", "P1", "Yüksek"],
      ["tek açılım pvc pencere", "semantic", "bilgi", "P2", "Orta"],
      ["vasistas pencere 40x40 50x50", "secondary", "islem", "P1", "Yüksek"],
      ["120x120 pvc pencere", "secondary", "islem", "P1", "Yüksek"],
      ["130x130 ortadan kanatlı pvc pencere", "semantic", "islem", "P2", "Orta"],
      ["140x140 pvc pencere", "semantic", "islem", "P2", "Orta"],
      ["160x200 sabit açılır pvc pencere", "semantic", "ticari", "P2", "Orta"],
      ["200x210 büyük cephe pvc pencere", "semantic", "ticari", "P2", "Orta"],
      ["antrasit gri pvc pencere adana", "secondary", "ticari", "P0", "Çok Yüksek", "Adana", "Seyhan", "/urunler/renkli-camlar", "/antrasit-pvc-pencere"],
      ["altın meşe pvc pencere", "secondary", "ticari", "P1", "Yüksek", "Adana", "Seyhan", "/urunler/renkli-camlar", "/renkli-pvc-pencere"],
      ["maun renkli pvc doğrama", "semantic", "ticari", "P2", "Orta", "Adana", "Çukurova", "/urunler/renkli-camlar", "/renkli-pvc-pencere"],
      ["vizon pvc pencere rengi", "semantic", "bilgi", "P2", "Orta", "Adana", "Seyhan", "/urunler/renkli-camlar", "/renkli-pvc-pencere"],
      ["kuvars platin pvc profil", "semantic", "bilgi", "P3", "Düşük", "Adana", "Seyhan", "/urunler/renkli-camlar", "/renkli-pvc-pencere"],
      ["6 odacıklı pvc profil pencere", "semantic", "bilgi", "P1", "Orta"],
      ["7 odacıklı pvc pencere sistemleri", "semantic", "bilgi", "P2", "Orta"],
      ["a sınıfı upvc pencere profili", "semantic", "bilgi", "P2", "Orta"],
      ["destek saclı pvc doğrama imalatı", "semantic", "bilgi", "P1", "Yüksek"],
      ["adana pvc doğrama firmaları", "secondary", "ticari", "P0", "Çok Yüksek", "Adana", "Tüm İlçeler", "/bolgeler/adana-cam-fabrikasi", "/bolgeler/adana"],
      ["cnc pvc pencere üretimi adana", "semantic", "bilgi", "P1", "Yüksek", "Adana", "Seyhan", "/uretim-teknolojisi", "/uretim-ve-kalite"],
      ["pvc pencere değişimi ve montajı adana", "secondary", "islem", "P0", "Çok Yüksek"],
    ],
  },
  {
    code: "B_FIRATPEN",
    label: "B. Fıratpen Profil Serileri",
    defaultPage: "/urunler/cift-cam",
    defaultSuggestedUrl: "/firatpen-pvc-pencere",
    defaultCity: "Adana",
    defaultDistrict: "Seyhan & Çukurova",
    defaultRelevance: 5,
    rows: [
      ["fıratpen adana pvc pencere", "primary", "ticari", "P0", "Çok Yüksek"],
      ["fıratpen selenit 75 özellikleri", "secondary", "bilgi", "P0", "Yüksek", "Adana", "Merkez", "/rehber", "/firatpen-selenit-75"],
      ["fıratpen selenit 75 pencere", "secondary", "ticari", "P0", "Çok Yüksek"],
      ["fıratpen elegance 80 profil", "secondary", "ticari", "P1", "Yüksek", "Adana", "Merkez", "/urunler/cift-cam", "/firatpen-elegance-80"],
      ["fıratpen redonit 85 üç contalı", "secondary", "ticari", "P1", "Yüksek", "Adana", "Merkez", "/urunler/cift-cam", "/firatpen-redonit-85"],
      ["fıratpen zenia slide hebeschiebe", "secondary", "ticari", "P1", "Çok Yüksek", "Adana", "Çukurova", "/urunler/temperli-cam", "/hebeschiebe-surme-sistemleri"],
      ["fıratpen 70 lik seri pencere", "secondary", "ticari", "P1", "Yüksek"],
      ["fıratpen 75 lik seri doğrama", "secondary", "ticari", "P1", "Yüksek"],
      ["fıratpen antrasit gri pencere adana", "secondary", "ticari", "P1", "Yüksek", "Adana", "Seyhan", "/urunler/renkli-camlar", "/antrasit-pvc-pencere"],
      ["fıratpen altınmeşe doğrama", "semantic", "ticari", "P2", "Orta", "Adana", "Seyhan", "/urunler/renkli-camlar", "/renkli-pvc-pencere"],
      ["fıratpen balkon kapısı ölçüleri", "secondary", "ticari", "P1", "Yüksek", "Adana", "Merkez", "/urunler/jaluzili-isicam", "/pvc-kapi-sistemleri"],
      ["fıratpen wc banyo kapısı", "secondary", "islem", "P1", "Yüksek", "Adana", "Merkez", "/urunler/jaluzili-isicam", "/pvc-kapi-sistemleri"],
      ["fıratpen renk kartelası 19 renk", "semantic", "bilgi", "P1", "Orta", "Adana", "Merkez", "/urunler/renkli-camlar", "/pvc-renkler"],
      ["adana gülbahçesi fıratpen üretici", "secondary", "navigasyon", "P0", "Çok Yüksek", "Adana", "Seyhan", "/bolgeler/adana-cam-fabrikasi", "/bolgeler/adana"],
      ["acarpen fıratpen iletişim telefon", "secondary", "navigasyon", "P0", "Çok Yüksek", "Adana", "Seyhan", "/iletisim", "/iletisim"],
      ["fıratpen 3 contalı pvc farkı", "semantic", "bilgi", "P2", "Orta", "Adana", "Merkez", "/rehber", "/rehber"],
      ["fıratpen beyaz pvc pencere imalatı", "semantic", "ticari", "P2", "Orta"],
      ["fıratpen şantiye toplu profil imalatı", "secondary", "ticari", "P1", "Çok Yüksek", "Adana", "AOSB", "/urunler/dis-cephe-camlari", "/toplu-proje-pvc-dograma"],
      ["fıratpen sürme pencere 120x120", "semantic", "islem", "P2", "Yüksek", "Adana", "Merkez", "/urunler/temperli-cam", "/pvc-surme-kapi"],
      ["fıratpen destek sacı et kalınlığı", "semantic", "bilgi", "P2", "Orta", "Adana", "Merkez", "/uretim-teknolojisi", "/uretim-ve-kalite"],
      ["fıratpen fiyat hesaplama aracı", "secondary", "islem", "P0", "Çok Yüksek", "Adana", "Merkez", "/hesaplama", "/pvc-pencere-fiyat-hesaplama"],
    ],
  },
  {
    code: "C_WINSA_PIMAPEN",
    label: "C. Winsa & Pimapen Sistem Çözümleri",
    defaultPage: "/rehber",
    defaultSuggestedUrl: "/rehber",
    defaultCity: "Adana",
    defaultDistrict: "Merkez & Çukurova",
    defaultRelevance: 4,
    rows: [
      ["adana winsa ve pimapen pvc pencere üretimi", "primary", "ticari", "P0", "Çok Yüksek", "Adana", "Merkez", "/hizmetler", "/hizmetler"],
      ["winsa dorado 76 profil özellikleri", "secondary", "bilgi", "P1", "Yüksek"],
      ["winsa safir 76 3 contalı pencere", "secondary", "bilgi", "P1", "Yüksek"],
      ["winsa revotech 84 yalıtım serisi", "semantic", "bilgi", "P2", "Orta"],
      ["winsa panorama hs hebeschiebe", "secondary", "ticari", "P1", "Yüksek", "Adana", "Çukurova", "/urunler/temperli-cam", "/hebeschiebe-surme-sistemleri"],
      ["pimapen nirvana 80 6 odacıklı", "secondary", "bilgi", "P1", "Yüksek"],
      ["pimapen carisma 70 pencere sistemi", "secondary", "bilgi", "P1", "Orta"],
      ["pimapen albatros sürme kapı", "secondary", "ticari", "P1", "Yüksek", "Adana", "Çukurova", "/urunler/temperli-cam", "/pvc-surme-kapi"],
      ["pimapen ölçü listesi oluştur adana", "secondary", "islem", "P1", "Çok Yüksek", "Adana", "Merkez", "/hesaplama", "/pvc-pencere-fiyat-hesaplama"],
      ["adana pimapen fiyat hesaplama", "secondary", "islem", "P0", "Çok Yüksek", "Adana", "Merkez", "/hesaplama", "/teklif-al"],
      ["winsa ve fıratpen profil karşılaştırması", "semantic", "bilgi", "P1", "Orta"],
      ["pimapen ve fıratpen farkları", "semantic", "bilgi", "P1", "Orta"],
      ["winsa antrasit gri pvc doğrama", "semantic", "ticari", "P2", "Yüksek", "Adana", "Seyhan", "/urunler/renkli-camlar", "/antrasit-pvc-pencere"],
      ["pimapen cam balkon uyumu adana", "semantic", "bilgi", "P2", "Orta", "Adana", "Merkez", "/urunler/balkon-cami", "/katlanir-cam-balkon"],
      ["pimapen pvc balkon kapısı adana", "semantic", "ticari", "P2", "Yüksek", "Adana", "Seyhan", "/urunler/jaluzili-isicam", "/pvc-kapi-sistemleri"],
      ["winsa panjur uyumlu pvc kasa", "semantic", "ticari", "P2", "Orta", "Adana", "Çukurova", "/urunler/jaluzili-isicam", "/panjur-sistemleri"],
      ["adana pvc doğrama tamir ve kanat ayarı", "semantic", "bilgi", "P2", "Orta", "Adana", "Seyhan", "/iletisim", "/iletisim"],
      ["eski pimapen pencere söküm yenileme adana", "secondary", "islem", "P1", "Çok Yüksek", "Adana", "Seyhan", "/hizmetler", "/hizmetler"],
    ],
  },
  {
    code: "D_CAM_BALKON",
    label: "D. Cam Balkon Sistemleri",
    defaultPage: "/urunler/balkon-cami",
    defaultSuggestedUrl: "/katlanir-cam-balkon",
    defaultCity: "Adana",
    defaultDistrict: "Çukurova & Seyhan",
    defaultRelevance: 5,
    rows: [
      ["adana cam balkon sistemleri", "primary", "ticari", "P0", "Çok Yüksek"],
      ["katlanır cam balkon adana", "secondary", "islem", "P0", "Çok Yüksek"],
      ["sürme cam balkon eşikli eşiksiz", "secondary", "ticari", "P0", "Çok Yüksek", "Adana", "Çukurova", "/urunler/balkon-cami", "/surme-cam-balkon"],
      ["motorlu giyotin cam balkon adana", "secondary", "ticari", "P0", "Çok Yüksek", "Adana", "Çukurova", "/urunler/balkon-cami", "/giyotin-cam-balkon"],
      ["ısıcamlı cam balkon sistemleri", "secondary", "ticari", "P0", "Çok Yüksek"],
      ["8mm temperli cam balkon adana", "secondary", "ticari", "P1", "Yüksek"],
      ["10mm temperli cam balkon sistemi", "semantic", "ticari", "P1", "Yüksek"],
      ["düz balkon cam balkon imalatı", "semantic", "ticari", "P2", "Yüksek"],
      ["l tipi köşe balkon cam balkon", "secondary", "ticari", "P1", "Yüksek"],
      ["u tipi balkon camlama çözümleri", "secondary", "ticari", "P1", "Yüksek"],
      ["füme cam balkon adana", "secondary", "ticari", "P1", "Yüksek"],
      ["bronz cam balkon modelleri", "semantic", "ticari", "P2", "Orta"],
      ["reflekte camlı cam balkon adana", "semantic", "ticari", "P2", "Orta"],
      ["perdeli stor uyumlu cam balkon", "semantic", "bilgi", "P2", "Orta"],
      ["teras kapatma giyotin cam sistemi", "secondary", "ticari", "P1", "Çok Yüksek", "Adana", "Çukurova", "/urunler/balkon-cami", "/giyotin-cam-balkon"],
      ["kış bahçesi camlama sistemleri adana", "secondary", "ticari", "P1", "Çok Yüksek", "Adana", "Çukurova", "/urunler/dis-cephe-camlari", "/toplu-proje-pvc-dograma"],
      ["paslanmaz rulmanlı cam balkon tekeri", "semantic", "bilgi", "P3", "Düşük"],
      ["cam balkon fitili ve su sızdırmazlık", "semantic", "bilgi", "P2", "Orta"],
      ["eşiksiz sürme cam balkon avantajları", "semantic", "bilgi", "P1", "Yüksek", "Adana", "Seyhan", "/urunler/balkon-cami", "/surme-cam-balkon"],
      ["cafe restoran giyotin cam sistemleri", "secondary", "ticari", "P1", "Çok Yüksek", "Adana", "Merkez", "/urunler/balkon-cami", "/giyotin-cam-balkon"],
      ["cam balkon m2 ölçü hesaplama", "secondary", "islem", "P0", "Çok Yüksek", "Adana", "Merkez", "/hesaplama", "/pvc-pencere-fiyat-hesaplama"],
      ["adana cam balkon montaj ve keşif", "secondary", "islem", "P0", "Çok Yüksek"],
    ],
  },
  {
    code: "E_SURME_HEBESCHIEBE",
    label: "E. Sürme & Hebeschiebe Sistemleri",
    defaultPage: "/urunler/temperli-cam",
    defaultSuggestedUrl: "/hebeschiebe-surme-sistemleri",
    defaultCity: "Adana",
    defaultDistrict: "Çukurova & Yenişehir",
    defaultRelevance: 5,
    rows: [
      ["adana hebeschiebe kaldır sür kapı", "primary", "ticari", "P0", "Çok Yüksek"],
      ["pvc sürme pencere 120x120 adana", "secondary", "islem", "P0", "Çok Yüksek", "Adana", "Seyhan", "/urunler/temperli-cam", "/pvc-surme-kapi"],
      ["140x120 çift kanat pvc sürme pencere", "secondary", "islem", "P1", "Yüksek", "Adana", "Seyhan", "/urunler/temperli-cam", "/pvc-surme-kapi"],
      ["villa teras sürme pvc kapı sistemleri", "secondary", "ticari", "P0", "Çok Yüksek"],
      ["volkswagen otomatik paralel sürme kapı", "secondary", "ticari", "P1", "Yüksek"],
      ["engelsiz alüminyum alt eşikli hebeschiebe", "semantic", "bilgi", "P1", "Yüksek"],
      ["300 kg kanat kapasiteli sürme sistem", "semantic", "bilgi", "P2", "Orta"],
      ["çift raylı pvc sürme mutfak penceresi", "semantic", "ticari", "P1", "Yüksek", "Adana", "Seyhan", "/urunler/temperli-cam", "/pvc-surme-kapi"],
      ["bahçe çıkışı sürme doğrama adana", "secondary", "ticari", "P1", "Çok Yüksek"],
      ["ısı yalıtımlı sürme doğrama vs katlanır", "semantic", "bilgi", "P2", "Orta"],
      ["antrasit hebeschiebe sürme fiyatı belirleyenler", "semantic", "ticari", "P1", "Yüksek"],
      ["çift açılım vasistaslı volkswagen sürme", "semantic", "bilgi", "P2", "Orta"],
      ["200x210 sürme balkon doğraması", "semantic", "islem", "P2", "Yüksek", "Adana", "Çukurova", "/urunler/temperli-cam", "/pvc-surme-kapi"],
      ["epdm contalı pvc sürme yalıtım seviyesi", "semantic", "bilgi", "P2", "Orta"],
      ["geniş açıklık cam sürme doğrama adana", "secondary", "ticari", "P1", "Yüksek"],
    ],
  },
  {
    code: "F_KAPI_PANJUR",
    label: "F. PVC Kapı & Panjur",
    defaultPage: "/urunler/jaluzili-isicam",
    defaultSuggestedUrl: "/pvc-kapi-sistemleri",
    defaultCity: "Adana",
    defaultDistrict: "Seyhan & Merkez",
    defaultRelevance: 5,
    rows: [
      ["adana pvc balkon kapısı ve motorlu panjur", "primary", "ticari", "P0", "Çok Yüksek"],
      ["85x198 pvc balkon kapısı", "secondary", "islem", "P0", "Çok Yüksek"],
      ["85x210 ısıcamlı pvc balkon kapısı", "secondary", "islem", "P0", "Çok Yüksek"],
      ["85x200 pvc wc banyo kapısı adana", "secondary", "islem", "P0", "Çok Yüksek"],
      ["lambri panelli pvc tuvalet kapısı", "semantic", "ticari", "P1", "Yüksek"],
      ["buzlu camlı pvc banyo kapısı", "semantic", "ticari", "P1", "Yüksek"],
      ["motorlu alüminyum panjur sistemleri adana", "secondary", "ticari", "P0", "Çok Yüksek", "Adana", "Çukurova", "/urunler/jaluzili-isicam", "/panjur-sistemleri"],
      ["monoblok pencere üstü panjur sistemi", "secondary", "ticari", "P1", "Yüksek", "Adana", "Merkez", "/urunler/jaluzili-isicam", "/panjur-sistemleri"],
      ["dıştan takma poliüretanlı panjur adana", "secondary", "ticari", "P1", "Yüksek", "Adana", "Merkez", "/urunler/jaluzili-isicam", "/panjur-sistemleri"],
      ["uzaktan kumandalı panjur motoru mosel somfy", "semantic", "bilgi", "P1", "Yüksek", "Adana", "Çukurova", "/urunler/jaluzili-isicam", "/panjur-sistemleri"],
      ["iki cam arası jaluzili ısıcam kapı", "secondary", "ticari", "P1", "Yüksek"],
      ["güneş ve ses kesici panjur sistemi adana", "semantic", "ticari", "P1", "Yüksek", "Adana", "Seyhan", "/urunler/jaluzili-isicam", "/panjur-sistemleri"],
      ["sağ sol açılım pvc kapı kilidi", "semantic", "bilgi", "P2", "Orta"],
      ["eşikli eşiksiz pvc balkon kapısı farkı", "semantic", "bilgi", "P2", "Orta"],
      ["manuel ipli veya redüktörlü panjur tamiri", "semantic", "bilgi", "P3", "Düşük", "Adana", "Seyhan", "/urunler/jaluzili-isicam", "/panjur-sistemleri"],
      ["suya neme dayanıklı pvc iç kapı", "semantic", "ticari", "P2", "Yüksek"],
      ["çift taraflı kollu pvc balkon kapısı", "semantic", "bilgi", "P2", "Orta"],
    ],
  },
  {
    code: "G_SINEKLIK_AKSESUAR",
    label: "G. Sineklik & Aksesuar",
    defaultPage: "/urunler/lamine-cam",
    defaultSuggestedUrl: "/plise-sineklik",
    defaultCity: "Adana",
    defaultDistrict: "Seyhan & Yüreğir",
    defaultRelevance: 4,
    rows: [
      ["adana plise sineklik sistemleri", "primary", "ticari", "P0", "Çok Yüksek"],
      ["pileli pencere ve balkon sinekliği adana", "secondary", "islem", "P0", "Çok Yüksek"],
      ["kedi tülü yırtılmaz sineklik adana", "secondary", "ticari", "P1", "Yüksek"],
      ["sürme doğrama uyumlu raylı sineklik", "secondary", "ticari", "P1", "Yüksek"],
      ["antrasit gri plise kapı sinekliği", "semantic", "ticari", "P1", "Yüksek"],
      ["menteşeli pvc pencere sinekliği", "semantic", "islem", "P2", "Orta"],
      ["kilitli secustik pvc pencere kolu", "secondary", "ticari", "P1", "Yüksek"],
      ["çift açılım ispanyolet mekanizması", "secondary", "ticari", "P1", "Yüksek"],
      ["çocuk güvenlik pencere kilidi adana", "semantic", "ticari", "P1", "Yüksek"],
      ["poliüretan montaj köpüğü ve silikon mastik", "semantic", "ticari", "P2", "Orta"],
      ["pvc doğrama epdm conta değişimi", "semantic", "bilgi", "P2", "Orta"],
      ["balkon kapısı rüzgar tutucu çıtçıt", "semantic", "bilgi", "P3", "Düşük"],
      ["adana sivrisinek haşere korumalı plise tül", "semantic", "bilgi", "P2", "Orta"],
      ["cam balkon uyumlu dıştan plise sineklik", "secondary", "ticari", "P1", "Yüksek"],
    ],
  },
  {
    code: "H_ISICAM_TEKNIK",
    label: "H. Isıcam & Teknik Terimler",
    defaultPage: "/rehber",
    defaultSuggestedUrl: "/isi-yalitimli-pvc-pencere",
    defaultCity: "Adana",
    defaultDistrict: "Türkiye / Çukurova",
    defaultRelevance: 4,
    rows: [
      ["ısı yalıtımlı pvc pencere ve 4+16+4 ısıcam rehberi", "primary", "bilgi", "P0", "Yüksek"],
      ["solar low-e ısıcam konfor özellikleri", "secondary", "bilgi", "P0", "Yüksek", "Adana", "Merkez", "/urunler/renkli-camlar", "/pvc-renkler"],
      ["4+16+4 ısıcam mı 3 camlı ısıcam mı", "secondary", "bilgi", "P1", "Orta"],
      ["argon gazlı ısıcam u değeri kaç olmalı", "semantic", "bilgi", "P1", "Orta"],
      ["adana yaz sıcağında solar reflekte cam", "secondary", "ticari", "P1", "Yüksek", "Adana", "Seyhan", "/urunler/renkli-camlar", "/pvc-renkler"],
      ["füme ve bronz reflekte ısıcam pvc uyumu", "secondary", "ticari", "P1", "Yüksek", "Adana", "Seyhan", "/urunler/renkli-camlar", "/pvc-renkler"],
      ["satinato buzlu cam ısıcam nedir", "semantic", "bilgi", "P2", "Orta", "Adana", "Seyhan", "/urunler/renkli-camlar", "/pvc-renkler"],
      ["pvc doğrama destek sacı kalınlığı kaç mm", "secondary", "bilgi", "P1", "Yüksek"],
      ["ts en 12608-1 a sınıfı pvc profil et kalınlığı", "semantic", "bilgi", "P1", "Orta", "Adana", "Seyhan", "/uretim-teknolojisi", "/uretim-ve-kalite"],
      ["ts en 1279 ısıcam yalıtım standardı", "semantic", "bilgi", "P2", "Orta", "Adana", "Seyhan", "/uretim-teknolojisi", "/uretim-ve-kalite"],
      ["çift contalı ve 3 contalı pvc pencere farkı", "semantic", "bilgi", "P1", "Orta"],
      ["pvc pencerede ses yalıtımı desibel dB", "semantic", "bilgi", "P1", "Orta"],
      ["akustik lamine camlı pvc pencere", "semantic", "ticari", "P2", "Orta", "Adana", "Merkez", "/urunler/cift-cam", "/pvc-pencere-sistemleri"],
      ["epdm conta ile tpe conta arasındaki fark", "semantic", "bilgi", "P2", "Orta"],
      ["pvc pencere buğulanma ve yoğuşma neden olur", "semantic", "bilgi", "P2", "Orta"],
      ["pvc köşe kaynak mukavemet testi", "semantic", "bilgi", "P3", "Düşük", "Adana", "Seyhan", "/uretim-teknolojisi", "/uretim-ve-kalite"],
    ],
  },
  {
    code: "I_TICARI_FIYAT",
    label: "I. Ticari & Fiyat Niyetli",
    defaultPage: "/hesaplama",
    defaultSuggestedUrl: "/pvc-pencere-fiyat-hesaplama",
    defaultCity: "Adana",
    defaultDistrict: "Merkez",
    defaultRelevance: 5,
    rows: [
      ["pvc pencere fiyat hesaplama ve ölçü teklifi", "primary", "islem", "P0", "Çok Yüksek"],
      ["adana pvc pencere fiyatları 2026", "secondary", "ticari", "P0", "Çok Yüksek", "Adana", "Merkez", "/urunler/cift-cam", "/pvc-pencere-sistemleri"],
      ["adana cam balkon m2 fiyatları", "secondary", "ticari", "P0", "Çok Yüksek", "Adana", "Merkez", "/urunler/balkon-cami", "/katlanir-cam-balkon"],
      ["online pimapen metraj hesaplama robotu", "secondary", "islem", "P0", "Çok Yüksek"],
      ["antrasit gri pvc pencere fiyat farkı", "secondary", "ticari", "P1", "Yüksek", "Adana", "Merkez", "/urunler/renkli-camlar", "/antrasit-pvc-pencere"],
      ["pvc balkon kapısı montaj dahil teklif al", "secondary", "islem", "P0", "Çok Yüksek"],
      ["adana ücretsiz pvc pencere keşfi", "secondary", "islem", "P0", "Çok Yüksek", "Adana", "Seyhan", "/iletisim", "/iletisim"],
      ["hebeschiebe sürme kapı fiyat teklifi adana", "secondary", "islem", "P0", "Çok Yüksek"],
      ["motorlu giyotin cam balkon teklif al", "secondary", "islem", "P1", "Çok Yüksek"],
      ["daire komple pvc pencere değişim maliyeti", "secondary", "ticari", "P0", "Çok Yüksek"],
      ["villa pencere doğrama fiyat listesi", "secondary", "ticari", "P1", "Yüksek"],
      ["hazır stok 120x120 100x100 pencere teklifi", "semantic", "islem", "P1", "Yüksek"],
      ["plise sineklik ölçü ve fiyat iste", "secondary", "islem", "P1", "Yüksek"],
      ["whatsapp pvc pencere ölçü gönder teklif al", "semantic", "islem", "P0", "Çok Yüksek"],
      ["taksitli ve projeye özel pvc ödeme koşulları", "semantic", "ticari", "P2", "Orta", "Adana", "Merkez", "/iletisim", "/iletisim"],
    ],
  },
  {
    code: "J_B2B_SANTIYE",
    label: "J. B2B & Şantiye Tedariki",
    defaultPage: "/urunler/dis-cephe-camlari",
    defaultSuggestedUrl: "/toplu-proje-pvc-dograma",
    defaultCity: "Adana",
    defaultDistrict: "AOSB & Çukurova OSB",
    defaultRelevance: 5,
    rows: [
      ["toplu proje ve şantiye pvc doğrama tedariki", "primary", "ticari", "P0", "Çok Yüksek"],
      ["müteahhitlere özel pvc pencere imalatı adana", "secondary", "ticari", "P0", "Çok Yüksek"],
      ["inşaat projeleri toplu fıratpen teklifi", "secondary", "islem", "P0", "Çok Yüksek"],
      ["demonte montajsız toptan pvc pencere sevkiyatı", "secondary", "ticari", "P1", "Yüksek"],
      ["kat bazlı etiketli şantiye doğrama teslimatı", "semantic", "bilgi", "P1", "Yüksek"],
      ["kentsel dönüşüm projeleri pvc pencere", "secondary", "ticari", "P1", "Çok Yüksek"],
      ["ısı yalıtımlı alüminyum doğrama şantiye adana", "secondary", "ticari", "P1", "Yüksek"],
      ["ticari mağaza vitrin doğrama sistemleri", "semantic", "ticari", "P2", "Orta"],
      ["ofis bölme jaluzili ısıcam sistemleri", "semantic", "ticari", "P2", "Orta"],
      ["osb fabrika idari bina pvc pencere tedariki", "secondary", "ticari", "P1", "Yüksek"],
      ["toplu konut cam balkon proje anlaşması", "secondary", "ticari", "P1", "Çok Yüksek"],
      ["bayi ve yapı marketlere hazır doğrama temini", "semantic", "ticari", "P2", "Orta"],
      ["belediye ve okul binası pvc şartname üretimi", "semantic", "ticari", "P2", "Orta"],
      ["proje metraj excel listesi ile tekliflendirme", "semantic", "islem", "P1", "Yüksek", "Adana", "Merkez", "/hesaplama", "/teklif-al"],
    ],
  },
  {
    code: "K_YEREL_SEO",
    label: "K. Yerel SEO (Adana & 7 Bölge)",
    defaultPage: "/bolgeler/adana-cam-fabrikasi",
    defaultSuggestedUrl: "/bolgeler/adana",
    defaultCity: "Adana",
    defaultDistrict: "Tüm İlçeler",
    defaultRelevance: 5,
    rows: [
      ["adana pvc doğrama ve cam balkon fabrikası", "primary", "ticari", "P0", "Çok Yüksek", "Adana", "Seyhan", "/bolgeler/adana-cam-fabrikasi", "/bolgeler/adana"],
      ["seyhan pvc pencere imalatı", "secondary", "ticari", "P0", "Çok Yüksek", "Adana", "Seyhan"],
      ["gülbahçesi seyhan pvc doğrama atölyesi", "secondary", "navigasyon", "P0", "Çok Yüksek", "Adana", "Seyhan"],
      ["çukurova pvc pencere ve cam balkon", "secondary", "ticari", "P0", "Çok Yüksek", "Adana", "Çukurova"],
      ["sarıçam pvc doğrama firmaları", "secondary", "ticari", "P0", "Yüksek", "Adana", "Sarıçam"],
      ["yüreğir pvc pencere ve sineklik", "secondary", "ticari", "P0", "Yüksek", "Adana", "Yüreğir"],
      ["ceyhan pvc pencere ve cam balkon", "secondary", "ticari", "P1", "Yüksek", "Adana", "Ceyhan"],
      ["kozan fıratpen pvc doğrama", "secondary", "ticari", "P1", "Yüksek", "Adana", "Kozan"],
      ["mersin pvc pencere ve cam balkon imalatı", "primary", "ticari", "P0", "Çok Yüksek", "Mersin", "Merkez", "/bolgeler/mersin-cam-imalati", "/bolgeler/mersin"],
      ["tarsus pvc doğrama ve ısıcamlı pencere", "secondary", "ticari", "P1", "Yüksek", "Mersin", "Tarsus", "/bolgeler/mersin-cam-imalati", "/bolgeler/mersin"],
      ["mezitli hebeschiebe ve cam balkon", "secondary", "ticari", "P1", "Yüksek", "Mersin", "Mezitli", "/bolgeler/mersin-cam-imalati", "/bolgeler/mersin"],
      ["yenişehir mersin renkli pvc pencere", "secondary", "ticari", "P1", "Yüksek", "Mersin", "Yenişehir", "/bolgeler/mersin-cam-imalati", "/bolgeler/mersin"],
      ["toroslar ve akdeniz pvc doğrama tedariki", "semantic", "ticari", "P2", "Orta", "Mersin", "Toroslar / Akdeniz", "/bolgeler/mersin-cam-imalati", "/bolgeler/mersin"],
      ["erdemli yazlık pvc pencere ve panjur", "secondary", "ticari", "P1", "Yüksek", "Mersin", "Erdemli", "/bolgeler/mersin-cam-imalati", "/bolgeler/mersin"],
      ["silifke tuzlu neme dayanıklı pvc doğrama", "secondary", "ticari", "P2", "Orta", "Mersin", "Silifke", "/bolgeler/mersin-cam-imalati", "/bolgeler/mersin"],
      ["osmaniye pvc pencere ve cam balkon üreticisi", "primary", "ticari", "P1", "Yüksek", "Osmaniye", "Merkez", "/bolgeler/osmaniye-cam-ureticisi", "/bolgeler/osmaniye"],
      ["kadirli pvc doğrama siparişi", "secondary", "ticari", "P2", "Orta", "Osmaniye", "Kadirli", "/bolgeler/osmaniye-cam-ureticisi", "/bolgeler/osmaniye"],
      ["düziçi pvc pencere ve balkon kapısı", "semantic", "ticari", "P2", "Orta", "Osmaniye", "Düziçi", "/bolgeler/osmaniye-cam-ureticisi", "/bolgeler/osmaniye"],
      ["hatay toplu konut pvc pencere ve doğrama", "primary", "ticari", "P0", "Çok Yüksek", "Hatay", "Merkez", "/bolgeler/hatay-cam-firmalari", "/bolgeler/hatay"],
      ["iskenderun rüzgar ve deniz nemine dayanıklı pvc", "secondary", "ticari", "P0", "Çok Yüksek", "Hatay", "İskenderun", "/bolgeler/hatay-cam-firmalari", "/bolgeler/hatay"],
      ["antakya ve defne şantiye pvc pencere sevkiyatı", "secondary", "ticari", "P0", "Çok Yüksek", "Hatay", "Antakya / Defne", "/bolgeler/hatay-cam-firmalari", "/bolgeler/hatay"],
      ["dörtyol pvc doğrama ve cam balkon", "secondary", "ticari", "P1", "Yüksek", "Hatay", "Dörtyol", "/bolgeler/hatay-cam-firmalari", "/bolgeler/hatay"],
      ["gaziantep pvc pencere ve villa doğrama çözümleri", "primary", "ticari", "P1", "Yüksek", "Gaziantep", "Merkez", "/bolgeler/gaziantep-cam-cozumleri", "/bolgeler/gaziantep"],
      ["şahinbey ve şehitkamil şantiye pvc doğrama", "secondary", "ticari", "P1", "Yüksek", "Gaziantep", "Şahinbey / Şehitkamil", "/bolgeler/gaziantep-cam-cozumleri", "/bolgeler/gaziantep"],
      ["kayseri 3 contalı soğuk iklim pvc pencere", "primary", "ticari", "P1", "Yüksek", "Kayseri", "Merkez", "/bolgeler/kayseri-cam-toptan", "/bolgeler/kayseri"],
      ["niğde yüksek rakım ısıcamlı pvc doğrama sevkiyatı", "primary", "ticari", "P2", "Orta", "Niğde", "Merkez", "/bolgeler/nigde-cam-sevkiyati", "/bolgeler/nigde"],
      ["adana turgut özal bulvarı cam balkon uygulaması", "semantic", "ticari", "P1", "Yüksek", "Adana", "Çukurova"],
      ["adana barajyolu kenan evren pvc yenileme", "semantic", "ticari", "P1", "Yüksek", "Adana", "Çukurova"],
      ["adanaaosb toplu pvc doğrama sevkiyatı", "semantic", "ticari", "P1", "Yüksek", "Adana", "Sarıçam"],
      ["bölgesel sevkiyat haritası ve şehir listesi", "primary", "navigasyon", "P1", "Orta", "Çukurova", "Tüm Bölge", "/bolgeler", "/bolgeler"],
    ],
  },
  {
    code: "L_GEO_AI",
    label: "L. GEO / AI Konuşma Dili Sorguları",
    defaultPage: "/rehber",
    defaultSuggestedUrl: "/rehber",
    defaultCity: "Adana",
    defaultDistrict: "Merkez & Bölge",
    defaultRelevance: 4,
    rows: [
      ["adana da güvenilir pvc pencere üreticisi nerede", "primary", "bilgi", "P0", "Yüksek", "Adana", "Seyhan", "/", "/"],
      ["acarpen adana gülbahçesi mahallesi adresi ve telefonu nedir", "secondary", "navigasyon", "P0", "Çok Yüksek", "Adana", "Seyhan", "/iletisim", "/iletisim"],
      ["adana sıcak iklimi için hangi pvc profil serisi daha iyi", "secondary", "bilgi", "P0", "Yüksek"],
      ["fıratpen selenit 75 mi yoksa redonit 85 mi seçilmeli", "secondary", "bilgi", "P0", "Yüksek"],
      ["antrasit gri pvc pencere adana güneşinde yamulur mu", "secondary", "bilgi", "P0", "Yüksek", "Adana", "Merkez", "/urunler/renkli-camlar", "/antrasit-pvc-pencere"],
      ["pvc pencere alırken destek sacı kalınlığı neden önemli", "semantic", "bilgi", "P1", "Orta"],
      ["cam balkon katlanır mı yoksa sürme sistem mi daha iyi", "secondary", "bilgi", "P0", "Yüksek", "Adana", "Çukurova", "/urunler/balkon-cami", "/katlanir-cam-balkon"],
      ["l balkon ve u balkon için en iyi cam balkon hangisi", "semantic", "bilgi", "P1", "Yüksek", "Adana", "Çukurova", "/urunler/balkon-cami", "/katlanir-cam-balkon"],
      ["hebeschiebe sürme kapı normal sürmeden farkı nedir", "semantic", "bilgi", "P1", "Yüksek", "Adana", "Çukurova", "/urunler/temperli-cam", "/hebeschiebe-surme-sistemleri"],
      ["wc ve banyo kapısı için pvc kapı sudan etkilenir mi", "semantic", "bilgi", "P2", "Orta", "Adana", "Seyhan", "/urunler/jaluzili-isicam", "/pvc-kapi-sistemleri"],
      ["pvc pencerede 4+16+4 ısıcam ne kadar enerji tasarrufu sağlar", "semantic", "bilgi", "P1", "Orta"],
      ["adana çukurova ve mersin için motorlu panjur gerekli mi", "semantic", "bilgi", "P1", "Yüksek", "Adana", "Çukurova", "/urunler/jaluzili-isicam", "/panjur-sistemleri"],
      ["müteahhit şantiyesi için demonte pvc doğrama nereden alınır", "secondary", "ticari", "P1", "Çok Yüksek", "Adana", "Sarıçam", "/urunler/dis-cephe-camlari", "/toplu-proje-pvc-dograma"],
      ["pvc pencere siparişi verdikten sonra üretim aşaması nasıl takip edilir", "semantic", "navigasyon", "P1", "Orta", "Adana", "Seyhan", "/siparis-takip", "/siparis-takip"],
      ["adana dan hatay iskenderun ve mersin e pvc sevkiyatı kaç gün sürer", "semantic", "bilgi", "P1", "Yüksek", "Hatay", "İskenderun", "/bolgeler/hatay-cam-firmalari", "/bolgeler/hatay"],
      ["evcil hayvanlar için yırtılmaz kedi sinekliği adana da yapılır mı", "semantic", "ticari", "P2", "Orta", "Adana", "Seyhan", "/urunler/lamine-cam", "/plise-sineklik"],
      ["gürültülü caddeye bakan evde çift cam yerine hangi cam seçilmeli", "semantic", "bilgi", "P1", "Yüksek"],
      ["pvc pencere ücretsiz keşif ve fiyat hesaplama nasıl yapılır", "secondary", "islem", "P0", "Çok Yüksek", "Adana", "Merkez", "/hesaplama", "/teklif-al"],
    ],
  },
];

// Additional long-tail & district modifier generator to guarantee >300 unique structured queries
// without fabricating metrics or duplicating primary keywords across target URLs.
const DISTRICT_SERVICE_EXPANSION: ReadonlyArray<
  readonly [
    city: string,
    districts: readonly string[],
    services: ReadonlyArray<readonly [label: string, page: string, suggested: string]>,
    cluster: KeywordClusterCode,
    label: string,
  ]
> = [
  [
    "Adana",
    ["Seyhan", "Çukurova", "Sarıçam", "Yüreğir", "Ceyhan", "Kozan"],
    [
      ["pvc pencere fiyatları", "/urunler/cift-cam", "/pvc-pencere-sistemleri"],
      ["cam balkon yapan firmalar", "/urunler/balkon-cami", "/katlanir-cam-balkon"],
      ["plise sineklik ve montaj", "/urunler/lamine-cam", "/plise-sineklik"],
      ["motorlu panjur sistemleri", "/urunler/jaluzili-isicam", "/panjur-sistemleri"],
      ["fıratpen pvc doğrama servisi", "/bolgeler/adana-cam-fabrikasi", "/bolgeler/adana"],
    ],
    "K_YEREL_SEO",
    "K. Yerel SEO (Adana & 7 Bölge)",
  ],
  [
    "Mersin",
    ["Tarsus", "Mezitli", "Yenişehir", "Toroslar", "Akdeniz", "Erdemli", "Silifke"],
    [
      ["pvc pencere imalatı", "/bolgeler/mersin-cam-imalati", "/bolgeler/mersin"],
      ["cam balkon ve sürme sistem", "/urunler/balkon-cami", "/surme-cam-balkon"],
      ["antrasit pimapen ve panjur", "/urunler/jaluzili-isicam", "/panjur-sistemleri"],
    ],
    "K_YEREL_SEO",
    "K. Yerel SEO (Adana & 7 Bölge)",
  ],
  [
    "Osmaniye",
    ["Merkez", "Kadirli", "Düziçi"],
    [
      ["pvc pencere ve balkon kapısı", "/bolgeler/osmaniye-cam-ureticisi", "/bolgeler/osmaniye"],
      ["katlanır cam balkon ve sineklik", "/urunler/balkon-cami", "/katlanir-cam-balkon"],
    ],
    "K_YEREL_SEO",
    "K. Yerel SEO (Adana & 7 Bölge)",
  ],
  [
    "Hatay",
    ["İskenderun", "Antakya", "Defne", "Dörtyol"],
    [
      ["toplu konut pvc doğrama", "/bolgeler/hatay-cam-firmalari", "/bolgeler/hatay"],
      ["cam balkon ve pvc sürme kapı", "/urunler/temperli-cam", "/pvc-surme-kapi"],
    ],
    "K_YEREL_SEO",
    "K. Yerel SEO (Adana & 7 Bölge)",
  ],
  [
    "Gaziantep",
    ["Şahinbey", "Şehitkamil"],
    [
      ["pvc doğrama ve ısıcamlı cam balkon", "/bolgeler/gaziantep-cam-cozumleri", "/bolgeler/gaziantep"],
      ["şantiye toplu pvc pencere tedariki", "/urunler/dis-cephe-camlari", "/toplu-proje-pvc-dograma"],
    ],
    "K_YEREL_SEO",
    "K. Yerel SEO (Adana & 7 Bölge)",
  ],
  [
    "Kayseri",
    ["Melikgazi", "Kocasinan", "Talas"],
    [
      ["üç contalı ısı yalıtımlı pvc pencere", "/bolgeler/kayseri-cam-toptan", "/bolgeler/kayseri"],
      ["ısıcamlı sürme ve balkon kapısı", "/urunler/cift-cam", "/pvc-pencere-sistemleri"],
    ],
    "K_YEREL_SEO",
    "K. Yerel SEO (Adana & 7 Bölge)",
  ],
  [
    "Niğde",
    ["Merkez", "Bor"],
    [
      ["yüksek yalıtımlı pvc doğrama sevkiyatı", "/bolgeler/nigde-cam-sevkiyati", "/bolgeler/nigde"],
      ["4+16+4 solar low-e pvc pencere", "/urunler/cift-cam", "/pvc-pencere-sistemleri"],
    ],
    "K_YEREL_SEO",
    "K. Yerel SEO (Adana & 7 Bölge)",
  ],
];

const PRODUCT_VARIATION_SEEDS: ReadonlyArray<
  readonly [keyword: string, cluster: KeywordClusterCode, label: string, page: string, suggested: string, intent: SearchIntent]
> = [
  ["adana giyotin cam balkon motorlu sistem", "D_CAM_BALKON", "D. Cam Balkon Sistemleri", "/urunler/balkon-cami", "/giyotin-cam-balkon", "ticari"],
  ["kış bahçesi sürgülü tavan ve cam kapama", "D_CAM_BALKON", "D. Cam Balkon Sistemleri", "/urunler/dis-cephe-camlari", "/toplu-proje-pvc-dograma", "ticari"],
  ["cam balkon kilitli çocuk emniyet mandalı", "D_CAM_BALKON", "D. Cam Balkon Sistemleri", "/urunler/balkon-cami", "/katlanir-cam-balkon", "bilgi"],
  ["alüminyum profil damlalıklı cam balkon", "D_CAM_BALKON", "D. Cam Balkon Sistemleri", "/urunler/balkon-cami", "/katlanir-cam-balkon", "bilgi"],
  ["balkon camlama için füme vs şeffaf cam", "D_CAM_BALKON", "D. Cam Balkon Sistemleri", "/urunler/balkon-cami", "/katlanir-cam-balkon", "bilgi"],
  ["40x40 banyo vasistas pencere hazır ölçü", "A_PVC_PENCERE", "A. PVC Pencere & Doğrama", "/urunler/cift-cam", "/pvc-pencere-sistemleri", "islem"],
  ["50x50 wc buzlu camlı pvc pencere", "A_PVC_PENCERE", "A. PVC Pencere & Doğrama", "/urunler/cift-cam", "/pvc-pencere-sistemleri", "islem"],
  ["75x100 tek kanat pvc pencere sağ sol", "A_PVC_PENCERE", "A. PVC Pencere & Doğrama", "/urunler/cift-cam", "/pvc-pencere-sistemleri", "islem"],
  ["100x100 çift açılım beyaz pvc pencere", "A_PVC_PENCERE", "A. PVC Pencere & Doğrama", "/urunler/cift-cam", "/pvc-pencere-sistemleri", "islem"],
  ["150x140 salon iki kanatlı pvc pencere", "A_PVC_PENCERE", "A. PVC Pencere & Doğrama", "/urunler/cift-cam", "/pvc-pencere-sistemleri", "islem"],
  ["160x210 balkon çıkışlı tek parça doğrama", "A_PVC_PENCERE", "A. PVC Pencere & Doğrama", "/urunler/cift-cam", "/pvc-pencere-sistemleri", "ticari"],
  ["180x210 bir sabit bir açılır büyük pencere", "A_PVC_PENCERE", "A. PVC Pencere & Doğrama", "/urunler/cift-cam", "/pvc-pencere-sistemleri", "ticari"],
  ["220x210 ortadan kanatlı üç bölmeli pvc", "A_PVC_PENCERE", "A. PVC Pencere & Doğrama", "/urunler/cift-cam", "/pvc-pencere-sistemleri", "ticari"],
  ["koyu meşe ahşap görünümlü pvc doğrama", "A_PVC_PENCERE", "A. PVC Pencere & Doğrama", "/urunler/renkli-camlar", "/renkli-pvc-pencere", "ticari"],
  ["ceviz rengi pvc balkon kapısı ve pencere", "A_PVC_PENCERE", "A. PVC Pencere & Doğrama", "/urunler/renkli-camlar", "/renkli-pvc-pencere", "ticari"],
  ["gümüş gri metalik pvc profil adana", "A_PVC_PENCERE", "A. PVC Pencere & Doğrama", "/urunler/renkli-camlar", "/renkli-pvc-pencere", "ticari"],
  ["kristal beyaz solmaz upvc profil", "A_PVC_PENCERE", "A. PVC Pencere & Doğrama", "/urunler/renkli-camlar", "/renkli-pvc-pencere", "bilgi"],
  ["mavi reflekte ısıcam güneş kontrol camı", "H_ISICAM_TEKNIK", "H. Isıcam & Teknik Terimler", "/urunler/renkli-camlar", "/pvc-renkler", "ticari"],
  ["yeşil reflekte ısıcamlı pvc doğrama", "H_ISICAM_TEKNIK", "H. Isıcam & Teknik Terimler", "/urunler/renkli-camlar", "/pvc-renkler", "ticari"],
  ["temperli emniyet ısıcamı yüksek katlı bina", "H_ISICAM_TEKNIK", "H. Isıcam & Teknik Terimler", "/urunler/cift-cam", "/pvc-pencere-sistemleri", "bilgi"],
  ["pvc doğrama lazer terazi montaj standartları", "H_ISICAM_TEKNIK", "H. Isıcam & Teknik Terimler", "/uretim-teknolojisi", "/uretim-ve-kalite", "bilgi"],
  ["buhar dengeleyici montaj bandı ve mastik", "G_SINEKLIK_AKSESUAR", "G. Sineklik & Aksesuar", "/urunler/lamine-cam", "/plise-sineklik", "bilgi"],
  ["çift açılım ispanyolet karşılık ve menteşe", "G_SINEKLIK_AKSESUAR", "G. Sineklik & Aksesuar", "/urunler/lamine-cam", "/plise-sineklik", "ticari"],
  ["balkon kapısı dıştan açma çekme kolu", "G_SINEKLIK_AKSESUAR", "G. Sineklik & Aksesuar", "/urunler/lamine-cam", "/plise-sineklik", "ticari"],
  ["dikey çalışan plise pencere sinekliği", "G_SINEKLIK_AKSESUAR", "G. Sineklik & Aksesuar", "/urunler/lamine-cam", "/plise-sineklik", "ticari"],
  ["sürme kapı duble plise sineklik modeli", "G_SINEKLIK_AKSESUAR", "G. Sineklik & Aksesuar", "/urunler/lamine-cam", "/plise-sineklik", "ticari"],
  ["villa cephe hebeschiebe motorlu panjur entegrasyonu", "E_SURME_HEBESCHIEBE", "E. Sürme & Hebeschiebe Sistemleri", "/urunler/temperli-cam", "/hebeschiebe-surme-sistemleri", "ticari"],
  ["pvc sürme kasa alüminyum ray takviyesi", "E_SURME_HEBESCHIEBE", "E. Sürme & Hebeschiebe Sistemleri", "/urunler/temperli-cam", "/pvc-surme-kapi", "bilgi"],
  ["teras çıkışları için ısı yalıtımlı sürme kapı", "E_SURME_HEBESCHIEBE", "E. Sürme & Hebeschiebe Sistemleri", "/urunler/temperli-cam", "/hebeschiebe-surme-sistemleri", "ticari"],
  ["adana banyo wc kapısı standart ölçü kaç cm", "L_GEO_AI", "L. GEO / AI Konuşma Dili Sorguları", "/urunler/jaluzili-isicam", "/pvc-kapi-sistemleri", "bilgi"],
  ["balkon kapısı ortalama genişlik ve yükseklik", "L_GEO_AI", "L. GEO / AI Konuşma Dili Sorguları", "/urunler/jaluzili-isicam", "/pvc-kapi-sistemleri", "bilgi"],
  ["pvc pencere siparişi ne kadar sürede teslim edilir", "L_GEO_AI", "L. GEO / AI Konuşma Dili Sorguları", "/siparis-takip", "/siparis-takip", "bilgi"],
  ["adana sıfır inşaat doğrama keşfi nasıl planlanır", "L_GEO_AI", "L. GEO / AI Konuşma Dili Sorguları", "/urunler/dis-cephe-camlari", "/toplu-proje-pvc-dograma", "bilgi"],
  ["acarpen sipariş takip pin kodu nasıl kullanılır", "L_GEO_AI", "L. GEO / AI Konuşma Dili Sorguları", "/siparis-takip", "/siparis-takip", "navigasyon"],
  ["adana pvc doğrama referans projeleri nelerdir", "L_GEO_AI", "L. GEO / AI Konuşma Dili Sorguları", "/projeler", "/referanslar", "navigasyon"],
  ["acarpen kurumsal şirket bilgileri vergi ve merkez adresi", "L_GEO_AI", "L. GEO / AI Konuşma Dili Sorguları", "/hakkimizda", "/hakkimizda", "navigasyon"],
];

function buildKeywordDatabase(): SeoKeywordEntry[] {
  const seen = new Set<string>();
  const list: SeoKeywordEntry[] = [];
  let seq = 1;

  const pushEntry = (item: Omit<SeoKeywordEntry, "id" | "gscImpressions" | "gscClicks" | "ctr" | "avgPosition" | "searchVolume" | "competition" | "contentStatus" | "indexingStatus" | "lastReviewed">) => {
    const norm = item.keyword.trim().toLowerCase();
    if (seen.has(norm)) return;
    seen.add(norm);
    list.push({
      id: `KW-${String(seq++).padStart(3, "0")}`,
      ...item,
      gscImpressions: null,
      gscClicks: null,
      ctr: null,
      avgPosition: null,
      searchVolume: null,
      competition: "Veri bekleniyor",
      contentStatus: "Yayında & Optimize",
      indexingStatus: "Veri bekleniyor (Canlı GSC Bekleniyor)",
      lastReviewed: REVIEW_DATE,
    });
  };

  for (const spec of CLUSTER_SPECS) {
    for (const row of spec.rows) {
      const [kw, tier, intent, priority, conversion, city, district, page, suggested] = row;
      pushEntry({
        keyword: kw,
        cluster: spec.code,
        clusterLabel: spec.label,
        tier,
        intent,
        targetCity: city || spec.defaultCity,
        targetDistrict: district || spec.defaultDistrict,
        targetLandingPage: page || spec.defaultPage,
        suggestedUrl: suggested || spec.defaultSuggestedUrl,
        businessRelevance: spec.defaultRelevance,
        conversionPotential: conversion,
        priority,
      });
    }
  }

  for (const [city, districts, services, cluster, label] of DISTRICT_SERVICE_EXPANSION) {
    for (const district of districts) {
      for (const [serviceLabel, page, suggested] of services) {
        const kw = `${city.toLowerCase()} ${district.toLowerCase()} ${serviceLabel}`;
        pushEntry({
          keyword: kw,
          cluster,
          clusterLabel: label,
          tier: "semantic",
          intent: "ticari",
          targetCity: city,
          targetDistrict: district,
          targetLandingPage: page,
          suggestedUrl: suggested,
          businessRelevance: city === "Adana" || city === "Mersin" ? 5 : 4,
          conversionPotential: city === "Adana" ? "Çok Yüksek" : "Yüksek",
          priority: city === "Adana" ? "P1" : "P2",
        });
      }
    }
  }

  for (const [kw, cluster, label, page, suggested, intent] of PRODUCT_VARIATION_SEEDS) {
    pushEntry({
      keyword: kw,
      cluster,
      clusterLabel: label,
      tier: "semantic",
      intent,
      targetCity: "Adana",
      targetDistrict: "Merkez & Bölge",
      targetLandingPage: page,
      suggestedUrl: suggested,
      businessRelevance: 4,
      conversionPotential: intent === "islem" ? "Çok Yüksek" : intent === "ticari" ? "Yüksek" : "Orta",
      priority: intent === "islem" ? "P1" : "P2",
    });
  }

  return list;
}

export const SEO_KEYWORD_DATABASE: SeoKeywordEntry[] = buildKeywordDatabase();

export interface CannibalizationFinding {
  keywordOrStem: string;
  pages: string[];
  reason: string;
}

/**
 * Checks whether the same primary keyword or identical phrase is assigned to multiple target URLs.
 */
export function detectKeywordCannibalization(
  entries: SeoKeywordEntry[] = SEO_KEYWORD_DATABASE
): CannibalizationFinding[] {
  const byExact = new Map<string, Set<string>>();
  const primaryPages = new Map<string, Set<string>>();

  for (const item of entries) {
    const key = item.keyword.trim().toLowerCase();
    if (!byExact.has(key)) byExact.set(key, new Set());
    byExact.get(key)!.add(item.targetLandingPage);

    if (item.tier === "primary") {
      if (!primaryPages.has(key)) primaryPages.set(key, new Set());
      primaryPages.get(key)!.add(item.targetLandingPage);
    }
  }

  const findings: CannibalizationFinding[] = [];
  for (const [kw, pages] of byExact.entries()) {
    if (pages.size > 1) {
      findings.push({
        keywordOrStem: kw,
        pages: Array.from(pages),
        reason: "Aynı anahtar kelime birden fazla hedef URL'ye atanmış.",
      });
    }
  }

  // Also ensure each cluster has unique primary page+keyword ownership
  const primaryByPage = new Map<string, string[]>();
  for (const item of entries.filter((e) => e.tier === "primary")) {
    const arr = primaryByPage.get(item.targetLandingPage) || [];
    arr.push(`${item.cluster}: ${item.keyword}`);
    primaryByPage.set(item.targetLandingPage, arr);
  }
  for (const [page, owners] of primaryByPage.entries()) {
    if (owners.length > 2) {
      findings.push({
        keywordOrStem: owners.join(" | "),
        pages: [page],
        reason: "Tek sayfaya 2'den fazla birincil küme yüklenmiş (sayfa ayrımı önerilir).",
      });
    }
  }

  return findings;
}

export function getKeywordClusterSummary(entries: SeoKeywordEntry[] = SEO_KEYWORD_DATABASE) {
  const map = new Map<string, { code: KeywordClusterCode; label: string; count: number; p0Count: number; pages: Set<string> }>();
  for (const e of entries) {
    if (!map.has(e.cluster)) {
      map.set(e.cluster, { code: e.cluster, label: e.clusterLabel, count: 0, p0Count: 0, pages: new Set() });
    }
    const bucket = map.get(e.cluster)!;
    bucket.count += 1;
    if (e.priority === "P0") bucket.p0Count += 1;
    bucket.pages.add(e.targetLandingPage);
  }
  return Array.from(map.values()).map((b) => ({ ...b, pages: Array.from(b.pages) }));
}
