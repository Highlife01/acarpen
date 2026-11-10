import { FAQItem } from "@/components/SEO";

export interface RegionCityData {
  slug: string;
  city: string;
  plateCode: string;
  geoRegion: string;
  geoPosition: string;
  distanceKm: string;
  deliverySchedule: string;
  heroBadge: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  summary: string;
  climateProfile: string;
  recommendedGlass: string;
  recommendedUValue: string;
  recommendedSolarFactor: string;
  districts: string[];
  industrialZones: string[];
  highlights: string[];
  keywords: string[];
  productSpecs: {
    product: string;
    combination: string;
    benefit: string;
  }[];
  faqs: FAQItem[];
}

export const REGIONS_DATA: RegionCityData[] = [
  {
    slug: "adana-cam-fabrikasi",
    city: "Adana",
    plateCode: "01",
    geoRegion: "TR-01",
    geoPosition: "36.9850;35.2880",
    distanceKm: "Merkez Üretim Üssü (Seyhan / Adana)",
    deliverySchedule: "Aynı Gün Keşif, Montaj & Şantiye Sevkiyatı",
    heroBadge: "Merkez Fabrika & Fıratpen Yetkili Üretici Bayi",
    title: "Adana Fıratpen Yetkili Bayi: PVC Pencere, Balkon Kapısı, Sürme & Cam Balkon",
    metaTitle: "Adana Fıratpen Bayisi | PVC Pencere, Sürme & Cam Balkon | Acarpen",
    metaDescription:
      "Adana Seyhan Gülbahçesi Mah. 13428 Sok. No:16/17 adresindeki fabrikamızda Fıratpen yetkili üretici bayisi olarak 70'lik & 75'lik PVC pencere, balkon kapısı, sürme ve cam balkon üretimi.",
    summary:
      "Adana Seyhan (Gülbahçesi Mah. 13428 Sok. No:16/17) merkez tesisimizde Fıratpen Selenit 75, Elegance 80 ve Redonit 85 serisi PVC pencereler, 85×198 / 85×210 balkon kapıları, çift kanat sürme doğramalar ve Düz/L/U katlanır & giyotin cam balkon sistemlerini 19 farklı lamine renk seçeneğiyle üretiyoruz.",
    climateProfile: "Yüksek Yaz Sıcaklığı (+42°C) ve Yoğun Güneş Işıması",
    recommendedGlass: "Fıratpen Selenit 75 + 4+16+4 Konfor (Solar Low-E) Isıcam",
    recommendedUValue: "1.1 W/m²K",
    recommendedSolarFactor: "%60 Güneş Isısı Blokajı (g=0.40)",
    districts: ["Seyhan", "Çukurova", "Yüreğir", "Sarıçam", "Ceyhan", "Kozan", "İmamoğlu", "Karataş", "Yumurtalık", "Pozantı"],
    industrialZones: ["Adana Hacı Sabancı OSB (AOSB)", "Ceyhan Enerji İhtisas Endüstri Bölgesi", "Gülbahçesi & Metal Sanayi Aksı"],
    highlights: [
      "Seyhan, Çukurova, Yüreğir ve Sarıçam'da aynı gün ücretsiz yerinde ölçü ve keşif hizmeti",
      "70 mm ve 75 mm sistem genişliği, 1.00 mm+ galvaniz destek sacı, 2.5 mm+ A sınıfı et kalınlığı",
      "Antrasit Gri, Altın Meşe, Metalik Antrasit ve Vizon dahil 19 farklı UV dayanımlı lamine renk",
      "Müteahhit projeleri ve bireysel konutlar için demonte veya anahtar teslim montajlı uygulama",
    ],
    keywords: [
      "acarpen adana",
      "adana fıratpen bayisi",
      "adana pvc pencere",
      "adana cam balkon",
      "seyhan pimapen",
      "adana pvc balkon kapısı",
    ],
    productSpecs: [
      {
        product: "Konut & Rezidans PVC Pencere",
        combination: "Fıratpen Selenit 75 + 1.2mm Destek Sacı + 4+16+4 Konfor Isıcam",
        benefit: "Yazın klima yükünü %50 düşürür, kışın ısı kaybını önler (U=1.1 W/m²K)",
      },
      {
        product: "Düz, L ve U Tipi Cam Balkon",
        combination: "8mm / 10mm Füme & Bronz Temperli veya Isıcamlı Katlanır Sistem",
        benefit: "Alüminyum fitilli, çocuk kilitli ve su tahliye kanallı dört mevsim balkon",
      },
      {
        product: "Teras & Bahçe Sürme Kapı",
        combination: "Fıratpen Zenia Slide / Hebeschiebe + 19 Lamine Renk",
        benefit: "Geniş açıklıklarda yer kaplamayan, tek parmakla kayan tam sızdırmaz sistem",
      },
    ],
    faqs: [
      {
        question: "Adana'da Acarpen Fıratpen üretim tesisi nerede yer alıyor?",
        answer:
          "Acarpen merkez üretim ve showroom tesisimiz Gülbahçesi Mah. 13428 Sok. No:16/17 Seyhan / Adana adresinde hizmet vermektedir.",
      },
      {
        question: "Adana'nın sıcak iklimi için hangi PVC pencere ve cam kombinasyonu tercih edilmelidir?",
        answer:
          "Adana'da yaz aylarında güneş ısısını geri yansıtan 75'lik Fıratpen Selenit serisi ve 4+16+4 Solar Low-E (Konfor) ısıcam kombinasyonu klima elektrik tüketimini ciddi oranda düşürür.",
      },
    ],
  },
  {
    slug: "mersin-cam-imalati",
    city: "Mersin",
    plateCode: "33",
    geoRegion: "TR-33",
    geoPosition: "36.8121;34.6415",
    distanceKm: "65 km (Otoyol Bağlantılı 45 Dk)",
    deliverySchedule: "Düzenli Proje & Bayi Sevkiyatı",
    heroBadge: "Mersin, Tarsus & Sahil Şeridi PVC & Cam Balkon Sevkiyatı",
    title: "Mersin & Tarsus Fıratpen PVC Doğrama, Sürme ve Cam Balkon Sistemleri",
    metaTitle: "Mersin PVC Pencere, Sürme & Cam Balkon | Acarpen — Fıratpen Bayi",
    metaDescription:
      "Mersin Yenişehir, Mezitli, Tarsus ve Erdemli projelerine Fıratpen PVC pencere, Hebeschiebe sürme kapı ve rüzgar dayanımlı 10mm cam balkon sevkiyatı.",
    summary:
      "Adana Seyhan'daki üretim tesisimizden Yenişehir, Mezitli, Toroslar, Akdeniz, Tarsus ve Erdemli-Silifke sahil hattındaki konut, yazlık site ve müteahhit projelerine korozyon dirençli Fıratpen PVC doğrama ve cam balkon sevkiyatı gerçekleştiriyoruz.",
    climateProfile: "Yüksek Nem, Deniz Rüzgar Yükü ve Yoğun Akdeniz Güneşi",
    recommendedGlass: "75'lik Fıratpen Selenit + 10mm Temperli Sahil Tipi Cam Balkon",
    recommendedUValue: "1.1 W/m²K",
    recommendedSolarFactor: "%62 Güneş Kontrolü + UV Filtreleme",
    districts: ["Yenişehir", "Mezitli", "Toroslar", "Akdeniz", "Tarsus", "Erdemli", "Silifke", "Anamur"],
    industrialZones: ["Mersin-Tarsus OSB (MTOSB)", "Mersin Serbest Bölgesi", "Tarsus OSB"],
    highlights: [
      "Sahil şeridi rüzgar yüküne dayanıklı 1.5 mm galvaniz destek saclı PVC doğrama ve sürme sistemler",
      "Deniz nemine ve UV güneş ışınlarına dayanıklı 19 farklı lamine folyo renk seçeneği",
      "Tarsus ve Mersin merkezdeki toplu konut şantiyelerine demonte veya montajlı teslimat",
    ],
    keywords: ["mersin pvc pencere", "tarsus fıratpen", "mersin cam balkon", "erdemli pvc doğrama"],
    productSpecs: [
      {
        product: "Sahil Rezidans PVC Doğrama",
        combination: "Fıratpen Selenit 75 + Solar Low-E 4+16+4 Isıcam",
        benefit: "Şiddetli lodos/rüzgar yüküne tam mukavemet ve maksimum güneş kontrolü",
      },
      {
        product: "Katlanır & Giyotin Balkon Camlama",
        combination: "10mm Temperli Cam Balkon (Füme / Bronz / Şeffaf)",
        benefit: "Geniş açıklıklarda esneme yapmayan yüksek rüzgar direnci",
      },
    ],
    faqs: [
      {
        question: "Mersin ve Tarsus'a PVC doğrama ve cam balkon sevkiyatı yapılıyor mu?",
        answer:
          "Evet, Adana Seyhan fabrikamızdan Mersin merkez, Tarsus ve Erdemli bölgesindeki projelere düzenli sevkiyat ve montaj hizmeti sunuyoruz.",
      },
    ],
  },
  {
    slug: "osmaniye-cam-ureticisi",
    city: "Osmaniye",
    plateCode: "80",
    geoRegion: "TR-80",
    geoPosition: "37.0742;36.2478",
    distanceKm: "85 km (Otoyol ile 50 Dk)",
    deliverySchedule: "Planlı Şantiye & Konut Sevkiyatı",
    heroBadge: "Osmaniye, Kadirli & Düziçi PVC ve Cam Balkon Tedariki",
    title: "Osmaniye, Kadirli & Düziçi Fıratpen PVC Pencere ve Cam Balkon Çözümleri",
    metaTitle: "Osmaniye PVC Pencere, Kapı & Cam Balkon | Acarpen — Fıratpen Bayi",
    metaDescription:
      "Osmaniye merkez, Kadirli, Düziçi ve Toprakkale projelerine standart ve özel ölçü Fıratpen PVC pencere, balkon kapısı ve cam balkon sevkiyatı.",
    summary:
      "Osmaniye merkez, Kadirli, Düziçi ve Bahçe ilçelerindeki müteahhit projelerine ve bireysel konutlara 70'lik ve 75'lik Fıratpen PVC pencere, 85×198 / 85×210 balkon kapısı, 85×200 WC kapısı ve cam balkon sistemleri sevk ediyoruz.",
    climateProfile: "Sıcak Çukurova Yazları ve Rüzgarlı Geçit İklimi",
    recommendedGlass: "70'lik / 75'lik Fıratpen PVC Sistem + 4+16+4 Isıcam",
    recommendedUValue: "1.1 - 1.3 W/m²K",
    recommendedSolarFactor: "%55 Güneş Isısı Kontrolü",
    districts: ["Osmaniye Merkez", "Kadirli", "Düziçi", "Bahçe", "Toprakkale"],
    industrialZones: ["Osmaniye OSB (Toprakkale)", "Kadirli OSB"],
    highlights: [
      "Standart hazır ölçülerde (40×40'tan 220×210 cm'e) ve özel ölçülerde hızlı PVC doğrama üretimi",
      "19 farklı lamine renk, Sağ/Sol açılım yönü ve Tek/Çift açılım aksesuar seçenekleri",
      "Şantiye ve bireysel müşterilere doğrudan fabrika fiyatlarıyla teslimat",
    ],
    keywords: ["osmaniye pvc pencere", "kadirli cam balkon", "osmaniye fıratpen", "düziçi pvc doğrama"],
    productSpecs: [
      {
        product: "Konut PVC Pencere & Kapı",
        combination: "70'lik / 75'lik Fıratpen + 4+16+4 Isıcam",
        benefit: "Dört mevsim ısı ve ses yalıtımı, uzun ömürlü EPDM conta",
      },
    ],
    faqs: [
      {
        question: "Osmaniye ve Kadirli'ye demonte veya montajlı PVC pencere gönderiyor musunuz?",
        answer:
          "Evet, Osmaniye merkez, Kadirli ve Düziçi'ndeki tüm konut ve şantiye projelerine hem demonte (hazır ebatlı) hem de montajlı sevkiyat gerçekleştiriyoruz.",
      },
    ],
  },
  {
    slug: "hatay-cam-firmalari",
    city: "Hatay",
    plateCode: "31",
    geoRegion: "TR-31",
    geoPosition: "36.2021;36.1606",
    distanceKm: "130 km (İskenderun) / 190 km (Antakya)",
    deliverySchedule: "Toplu Konut & Şantiye Sevkiyatı",
    heroBadge: "Antakya, İskenderun, Dörtyol & Payas Proje Sevkiyatı",
    title: "Hatay & İskenderun Toplu Konut PVC Doğrama, Kapı ve Cam Balkon Sistemleri",
    metaTitle: "Hatay & İskenderun PVC Pencere, Kapı & Cam Balkon | Acarpen",
    metaDescription:
      "Hatay Antakya, İskenderun, Dörtyol, Payas ve Arsuz inşaat projeleri için yüksek kapasiteli Fıratpen PVC pencere, balkon kapısı, WC kapısı ve cam balkon üretimi.",
    summary:
      "Hatay genelindeki yeniden yapılanma, toplu konut şantiyeleri, İskenderun-Dörtyol hattı ve Arsuz projeleri için yüksek üretim kapasitemizle standart ve özel ölçü Fıratpen PVC pencere, balkon kapısı ve cam balkon sistemlerini tam zamanında sevk ediyoruz.",
    climateProfile: "Sıcak Akdeniz İklimi ve İskenderun Körfezi Rüzgar Koridoru",
    recommendedGlass: "75'lik Fıratpen Selenit + Güçlendirilmiş Destek Sacı + 4+16+4 Isıcam",
    recommendedUValue: "1.1 W/m²K",
    recommendedSolarFactor: "%60 Güneş Kontrolü + Yüksek Rüzgar Mukavemeti",
    districts: ["Antakya", "İskenderun", "Defne", "Dörtyol", "Samandağ", "Kırıkhan", "Arsuz", "Payas", "Erzin"],
    industrialZones: ["İskenderun OSB", "Payas OSB", "Antakya OSB", "Dörtyol Sanayi Bölgesi"],
    highlights: [
      "Toplu konut ve müteahhit şantiyelerine yüksek adetli CNC PVC pencere ve kapı üretimi",
      "1.00 mm+ galvaniz destek sacı ve 2.5 mm+ et kalınlığı ile tam statik dayanım",
      "İskenderun, Dörtyol, Payas ve Antakya şantiyelerine düzenli araç sevkiyatı",
    ],
    keywords: ["hatay pvc pencere", "iskenderun pvc doğrama", "antakya toptan pvc pencere", "dörtyol cam balkon"],
    productSpecs: [
      {
        product: "Toplu Konut PVC Doğrama Paketi",
        combination: "70'lik & 75'lik Fıratpen + 4+16+4 Isıcam + Çift Açılım",
        benefit: "CNC seri üretim kalitesi, hızlı şantiye teslimatı ve TSE garantisi",
      },
    ],
    faqs: [
      {
        question: "Hatay ve İskenderun'daki inşaat projelerine toplu PVC pencere ve kapı tedarik edebiliyor musunuz?",
        answer:
          "Evet, CNC kesim ve kaynak hatlarımızla Hatay, Antakya, İskenderun ve Dörtyol'daki müteahhit şantiyelerine yüksek adetli PVC pencere, balkon kapısı ve WC kapısı sevkiyatı sağlıyoruz.",
      },
    ],
  },
  {
    slug: "gaziantep-cam-cozumleri",
    city: "Gaziantep",
    plateCode: "27",
    geoRegion: "TR-27",
    geoPosition: "37.0662;37.3833",
    distanceKm: "210 km (TAG Otoyolu ile Doğrudan Sevkiyat)",
    deliverySchedule: "Haftalık Düzenli Proje Sevkiyatı",
    heroBadge: "Şehitkamil, Şahinbey & OSB Proje Çözümleri",
    title: "Gaziantep Fıratpen PVC Pencere, Hebeschiebe Sürme ve Cam Balkon",
    metaTitle: "Gaziantep PVC Pencere, Sürme & Cam Balkon | Acarpen — Fıratpen Bayi",
    metaDescription:
      "Gaziantep Şehitkamil, Şahinbey ve OSB projeleri için 75'lik ve 85'lik Fıratpen PVC doğrama, Zenia Slide sürme, jaluzili ısıcam ve cam balkon çözümleri.",
    summary:
      "Gaziantep'teki modern konut, villa ve ticari projeler için 19 farklı lamine renk seçeneğine sahip Fıratpen Selenit 75, Elegance 80 ve Redonit 85 PVC doğramalar ile Hebeschiebe sürme ve ısıcamlı cam balkon sistemleri üretiyoruz.",
    climateProfile: "Yazın Kurak ve Çok Sıcak, Kışın Soğuk Karasal Geçiş İklimi",
    recommendedGlass: "Fıratpen Elegance 80 / Selenit 75 + Dört Mevsim Konfor Isıcam",
    recommendedUValue: "0.9 - 1.1 W/m²K",
    recommendedSolarFactor: "Yaz/Kış Çift Yönlü İzolasyon",
    districts: ["Şehitkamil", "Şahinbey", "Nizip", "İslahiye", "Nurdağı"],
    industrialZones: ["Gaziantep Başpınar OSB", "Nizip OSB"],
    highlights: [
      "Yaz sıcağı ve kış soğuğuna karşı 6 odacıklı 75 mm / 80 mm Fıratpen profil serileri",
      "Villa ve teras projeleri için Antrasit Gri, Altın Meşe ve Vizon lamine renk alternatifleri",
      "TAG Otoyolu üzerinden şantiyelere güvenli ve zamanında teslimat",
    ],
    keywords: ["gaziantep pvc pencere", "gaziantep fıratpen", "şehitkamil cam balkon"],
    productSpecs: [
      {
        product: "Villa & Prestij Konut Paketi",
        combination: "Fıratpen Elegance 80 + Üçlü / Konfor Isıcam + Motorlu Panjur",
        benefit: "Maksimum ısı ve ses yalıtımı, 19 lamine renk ile modern cephe estetiği",
      },
    ],
    faqs: [
      {
        question: "Gaziantep projelerine özel ölçü renkli PVC doğrama sevkiyatı yapıyor musunuz?",
        answer:
          "Evet, 19 farklı lamine renk seçeneğiyle üretilen tüm PVC pencere ve sürme sistemlerimizi TAG Otoyolu üzerinden Gaziantep şantiyelerine sevk ediyoruz.",
      },
    ],
  },
  {
    slug: "kayseri-cam-toptan",
    city: "Kayseri",
    plateCode: "38",
    geoRegion: "TR-38",
    geoPosition: "38.7312;35.4787",
    distanceKm: "295 km (Otoyol Bağlantılı Sevkiyat)",
    deliverySchedule: "Planlı Toptan & Proje Sevkiyatı",
    heroBadge: "Kayseri Kış İklimine Özel Maksimum Yalıtımlı PVC Sistemler",
    title: "Kayseri 75'lik & 85'lik Fıratpen PVC Pencere ve Isıcamlı Cam Balkon",
    metaTitle: "Kayseri PVC Pencere & Isıcamlı Cam Balkon | Acarpen — Fıratpen Bayi",
    metaDescription:
      "Kayseri Melikgazi, Kocasinan ve Talas projeleri için sert kış şartlarına dayanıklı Fıratpen Redonit 85 / Selenit 75 PVC pencere ve ısıcamlı cam balkon.",
    summary:
      "Sert karasal kış ikliminin yaşandığı Kayseri'de ısı kaybını minimuma indiren 3 contalı Fıratpen Selenit 75, Elegance 80 ve Redonit 85 PVC pencere sistemleri ile ısıcamlı katlanır cam balkon çözümleri sunuyoruz.",
    climateProfile: "Sert ve Ayazlı Kış İklimi (-20°C'ye Varan Sıcaklık Farkları)",
    recommendedGlass: "Fıratpen Redonit 85 / Selenit 75 + Üçlü (Triple) Low-E Isıcam",
    recommendedUValue: "0.78 - 1.0 W/m²K (Maksimum Kış Yalıtımı)",
    recommendedSolarFactor: "Kış Güneş Kazancını Koruyan Low-E Kaplama",
    districts: ["Melikgazi", "Kocasinan", "Talas", "İncesu", "Develi"],
    industrialZones: ["Kayseri OSB", "Mimarsinan OSB", "İncesu OSB"],
    highlights: [
      "Sert kış şartlarında doğalgaz tasarrufu sağlayan 6-7 odacıklı ve 3 contalı Fıratpen profiller",
      "Isıcamlı katlanır cam balkon ve poliüretan dolgulu monoblok panjur sistemleri",
      "Toplu konut ve müteahhit siparişlerine özel demonte ve montajlı sevkiyat",
    ],
    keywords: ["kayseri pvc pencere", "kayseri ısıcamlı cam balkon", "talas pvc doğrama"],
    productSpecs: [
      {
        product: "Sert Kış İklimi Konut Paketi",
        combination: "Fıratpen Redonit 85 + Üçlü Argon Gazlı Low-E Isıcam",
        benefit: "0.78 W/m²K'ye inen Uw değeri ile maksimum ısıl izolasyon ve sıfır terleme",
      },
    ],
    faqs: [
      {
        question: "Kayseri gibi soğuk illerde hangi PVC profil serisi tercih edilmelidir?",
        answer:
          "Orta contalı (3 contalı) 75 mm Selenit 75 veya 85 mm Redonit 85 serisi profiller, çift veya üçlü Low-E ısıcam ile birlikte kullanıldığında en yüksek kış yalıtımını sağlar.",
      },
    ],
  },
  {
    slug: "nigde-cam-sevkiyati",
    city: "Niğde",
    plateCode: "51",
    geoRegion: "TR-51",
    geoPosition: "37.9667;34.6833",
    distanceKm: "195 km (Pozantı-Niğde Otoyolu ile 1 Saat 45 Dk)",
    deliverySchedule: "Haftalık Düzenli Proje Sevkiyatı",
    heroBadge: "Niğde, Bor & Çamardı Hattına Otoyol Bağlantılı Hızlı Tedarik",
    title: "Niğde & Bor Fıratpen PVC Pencere, Balkon Kapısı ve Isıcamlı Cam Balkon",
    metaTitle: "Niğde PVC Pencere, Kapı & Cam Balkon | Acarpen — Fıratpen Bayi",
    metaDescription:
      "Niğde merkez, Bor, Ulukışla ve Çamardı'daki konut ve şantiye projelerine otoyol hattından hızlı Fıratpen PVC pencere, kapı ve ısıcamlı cam balkon sevkiyatı.",
    summary:
      "Adana-Niğde Otoyolu sayesinde fabrikamızdan 1 saat 45 dakika mesafede bulunan Niğde merkez, Bor, Ulukışla ve Çamardı ilçelerindeki konut, yayla evi ve müteahhit şantiyelerine yüksek yalıtımlı Fıratpen PVC doğrama ve cam balkon sevkiyatı sağlıyoruz.",
    climateProfile: "Soğuk Karasal Kışlar ve Gece-Gündüz Yüksek Sıcaklık Farkı",
    recommendedGlass: "Fıratpen Selenit 75 + 4+16+4 Low-E Isıcam & Isıcamlı Cam Balkon",
    recommendedUValue: "1.1 W/m²K",
    recommendedSolarFactor: "Yüksek Isı Tutumu (%50 Enerji Tasarrufu)",
    districts: ["Niğde Merkez", "Bor", "Çiftlik", "Ulukışla", "Altunhisar", "Çamardı"],
    industrialZones: ["Niğde OSB", "Bor Karma OSB"],
    highlights: [
      "Adana-Niğde Otoyolu üzerinden Niğde merkez, Bor ve Çamardı'ya hızlı sevkiyat",
      "Kış şartlarına uygun ısıcamlı cam balkon ve 75'lik Fıratpen pencere sistemleri",
      "Hazır standart ebatlarda demonte veya yerinde montajlı teslimat seçeneği",
    ],
    keywords: ["niğde pvc pencere", "bor cam balkon", "niğde fıratpen", "çamardı pvc doğrama"],
    productSpecs: [
      {
        product: "Kışa Dayanıklı PVC Pencere",
        combination: "Fıratpen Selenit 75 + 4+16+4 Low-E Isıcam",
        benefit: "Kışın içerideki ısıyı korur, rüzgar ve soğuk sızıntısını tamamen keser",
      },
    ],
    faqs: [
      {
        question: "Niğde ve Bor'daki projelere PVC pencere ve cam balkon sevkiyatınız var mı?",
        answer:
          "Evet, Pozantı-Niğde otoyolu üzerinden haftalık düzenli araçlarımızla Niğde merkez, Bor, Çamardı ve Ulukışla'ya sevkiyat yapmaktayız.",
      },
    ],
  },
];

export const getRegionBySlug = (slug?: string): RegionCityData | undefined =>
  REGIONS_DATA.find((r) => r.slug === slug);
