export type GeoQuestionCategory =
  | "PVC Pencere Seçimi & Yalıtım"
  | "Fıratpen, Winsa & Pimapen Profiller"
  | "Renkli Profil & Isıcam Teknolojisi"
  | "Katlanır, Sürme & Giyotin Cam Balkon"
  | "Hebeschiebe, Kapı, Panjur & Sineklik"
  | "Ölçü, Fiyatlandırma & Montaj Süreci"
  | "7 İl Sevkiyat & B2B Şantiye Tedariki";

export interface GeoQuestionEntry {
  id: string;
  category: GeoQuestionCategory;
  question: string;
  answer: string;
  targetUrl: string;
  targetLabel: string;
}

const Q_GROUPS: ReadonlyArray<{
  category: GeoQuestionCategory;
  defaultUrl: string;
  defaultLabel: string;
  items: ReadonlyArray<readonly [q: string, a: string, url?: string, label?: string]>;
}> = [
  {
    category: "PVC Pencere Seçimi & Yalıtım",
    defaultUrl: "/urunler/cift-cam",
    defaultLabel: "PVC Pencere Sistemleri",
    items: [
      [
        "Adana'nın yoğun yaz sıcağında hangi PVC pencere serisi tercih edilmelidir?",
        "Adana ve Çukurova'da yaz sıcaklıkları yüksek olduğundan en az 75 mm kasa genişliğine ve 6 odacığa sahip Fıratpen Selenit 75 veya Winsa Dorado 76 serileri önerilir. Solar Low-E 4+16+4 ısıcam ile birleştiğinde güneş ısısı girişi azalır ve klima soğutma yükü belirgin biçimde düşer.",
      ],
      [
        "PVC pencerede destek sacı kalınlığı neden kritik önem taşır?",
        "Galvanizli çelik destek sacı pencere kanatlarının kendi ağırlığıyla sarkmasını ve rüzgar basıncında esnemesini önler. Acarpen imalatında pencere yüksekliğine ve profil rengine göre TS EN 12608-1 uyumlu 1.00 mm ile 1.50 mm arası korozyon dirençli galvaniz sac kullanılır.",
        "/uretim-teknolojisi",
        "Üretim & Kalite Süreci",
      ],
      [
        "A sınıfı et kalınlığına sahip PVC pencere profili nasıl anlaşılır?",
        "TS EN 12608-1 standardına göre A sınıfı PVC profillerde dış yüzey et kalınlığı 2.8 mm ile 3.0 mm bandındadır. İnce et kalınlıklı profillere kıyasla köşe kaynak direnci daha yüksektir ve ispanyolet ile menteşe vidaları profile çok daha sağlam tutunur.",
        "/uretim-teknolojisi",
        "Üretim Standartları",
      ],
      [
        "70'lik seri ile 75'lik seri PVC pencere arasında ne fark vardır?",
        "70 mm (5 odacıklı) sistemler standart daire ve tadilatlar için ekonomik denge sunarken, 75 mm (6 odacıklı) sistemler daha derin profil kesiti, iyileştirilmiş ısı geçirim katsayısı (Uw) ve daha kalın cam/conta yuvasıyla yüksek enerji tasarrufu hedeflenen konutlarda öne çıkar.",
      ],
      [
        "Çift contalı ve üç contalı (orta contalı) PVC sistem farkı nedir?",
        "Çift contalı doğramalarda iç ve dış yüzeyde iki sızdırmazlık halkası bulunur. Üç contalı sistemlerde profil göbeğinde yer alan ek orta conta rüzgar, toz ve sağanak yağmur geçişini keserek özellikle yüksek katlı binalarda akustik ve termal performansı artırır.",
        "/rehber",
        "Teknik Seçim Rehberi",
      ],
      [
        "Standart hazır ölçü PVC pencereler hangi ölçülerde üretilmektedir?",
        "Banyo ve WC için 40×40 ile 50×50 cm; oda ve mutfaklar için 75×100, 100×100, 120×120, 130×130, 140×140 ve 150×140 cm; büyük salon açıklıkları için 160×200, 180×210, 200×210 ve 220×210 cm standart veya milimetrik özel ölçüler üretilir.",
      ],
      [
        "Tek açılım pencere ile çift açılım (vasistaslı) pencere farkı nedir?",
        "Tek açılım yalnızca kanadın yana doğru tam açılmasını sağlar. Çift açılım ispanyolet mekanizması ise kol yukarı çevrildiğinde kanadı üstten 10–15 cm vasistas pozisyonunda açarak yağmur girişi olmadan kontrollü ve güvenli havalandırma sunar.",
      ],
      [
        "Yüksek katlı binalarda rüzgar yüküne karşı PVC pencere güvenliği nasıl sağlanır?",
        "Kat yüksekliği arttıkça rüzgar emme ve itme basıncı yükselir. Bu yapılarda statik orta kayıt profilleri, en az 1.50 mm kalınlığında galvanizli çelik destek sacı ve rüzgar yüküne dayanıklı kilitleme noktası sayısı artırılmış ispanyolet donanımı uygulanır.",
      ],
      [
        "PVC pencerede yoğuşma ve cam terlemesi neden olur, nasıl engellenir?",
        "Cam yüzeyinde oluşan terleme çoğu zaman odadaki yüksek bağıl nem ile tek cam/eski conta kaynaklı soğuk köprü birleştiğinde ortaya çıkar. 4+16+4 ısıcam ünitesi, çift EPDM sızdırmazlık contası ve çift açılım vasistas havalandırmasıyla yoğuşma riski en aza indirilir.",
        "/rehber",
        "Isıcam & Yoğuşma Rehberi",
      ],
      [
        "Gürültülü ana cadde üzerindeki daireler için hangi PVC pencere camı seçilmelidir?",
        "Trafik ve şehir gürültüsünü kesmek için 3 contalı 75–85 mm derinlikli profil serileri, akustik PVB lamine cam kombinasyonları (örneğin 33.1 lamine + 16 + 4 mm veya asimetrik kalınlıklı camlar) ile yüksek desibel (dB) ses yalıtımı elde edilir.",
      ],
      [
        "Pencere değişimi evde kırma dökme veya duvar boyasına zarar verir mi?",
        "Mevcut kasalar duvar çevresi kontrollü kesilerek söküldüğü için duvar dokusu korunur. Yeni PVC doğrama lazer teraziyle terazilenip yüksek yoğunluklu poliüretan köpük, dış cephe UV silikonu ve pervaz profilleriyle tamamlandığında temiz bir bitiş elde edilir.",
        "/hesaplama",
        "Ücretsiz Keşif & Teklif Al",
      ],
      [
        "Beyaz PVC pencereler zamanla güneşte sararır mı?",
        "UV stabilizatörlü ve kurşunsuz formüllü modern uPVC hammaddeler yüksek güneş radyasyonu altında renk kararlılığını korur. Adana gibi güneşli illerde TSE EN 12608-1 S (Şiddetli İklim) sınıfına uygun beyaz profiller sararma ve çatlama yapmaz.",
      ],
      [
        "Küçük banyo ve mutfaklarda hangi vasistas pencere ölçüsü uygundur?",
        "Islak hacimlerde yaygın olarak 40×40 cm ve 50×50 cm satinato buzlu camlı vasistas pencereler kullanılır. Üstten içe devrilen makas sistemi sayesinde sürekli havalandırma sağlanırken dışarıdan görünürlük engellenir.",
      ],
      [
        "Sabit doğrama ve ortadan kanatlı PVC pencere arasındaki kullanım farkı nedir?",
        "Bir sabit bir açılır doğramalarda geniş cam açıklığı kesintisiz manzara sağlar; ortadan dikey kayıtlı iki kanatlı veya bir kanat açılır modellerde ise dış cepheden cam temizliği kolaylaşır ve rüzgar direnci kasa boyunca dengeli dağılır.",
      ],
      [
        "PVC pencere montajında poliüretan köpük ve mastik neden şarttır?",
        "Kasa ile duvar arasındaki 1–2 cm'lik montaj boşluğu yalnızca vida ile kapatılamaz. Boşluğun boşluksuz poliüretan köpükle doldurulması, dış yüzeye UV dayanımlı mastik ve silikon çekilmesi hava, yağmur ve ses sızıntısını tamamen önler.",
      ],
    ],
  },
  {
    category: "Fıratpen, Winsa & Pimapen Profiller",
    defaultUrl: "/rehber",
    defaultLabel: "Profil Karşılaştırma Rehberi",
    items: [
      [
        "Acarpen fabrikasında hangi PVC profil markalarının üretimi yapılmaktadır?",
        "Acarpen, Adana Seyhan Gülbahçesi Mah. 13428 Sok. No:16/17 adresindeki CNC otomasyonlu atölyesinde Fıratpen (Selenit 75, Elegance 80, Redonit 85, Zenia Slide) başta olmak üzere Winsa ve Pimapen profil sistemleriyle doğrama üretimi ve montajı yapmaktadır.",
        "/hakkimizda",
        "Kurumsal Bilgi",
      ],
      [
        "Fıratpen Selenit 75 profilinin öne çıkan teknik özellikleri nelerdir?",
        "Fıratpen Selenit 75, 75 mm kasa genişliği, 6 odacıklı gövde yapısı ve TPE gri/siyah conta sistemiyle öne çıkar. 24–36 mm cam kalınlığı desteği sayesinde Adana konut ve villa projelerinde yüksek ısı ve rüzgar dayanımı sağlar.",
        "/urunler/cift-cam",
        "Selenit 75 İncele",
      ],
      [
        "Fıratpen Elegance 80 ve Redonit 85 serileri hangi yapılara uygundur?",
        "80 mm Elegance ve 85 mm Redonit 3 contalı seriler, özellikle büyük cepheli villalarda, yüksek katlı konutlarda, cadde gürültüsünün yoğun olduğu bölgelerde ve kış aylarının sert geçtiği Kayseri, Niğde, Gaziantep gibi illerde tercih edilir.",
        "/urunler/cift-cam",
        "80/85 mm PVC Sistemleri",
      ],
      [
        "Winsa Dorado 76 ve Safir 76 serilerinin birbirinden farkı nedir?",
        "Her iki seri 76 mm profil derinliğine sahiptir; Safir 76 standart dışı yüksek ısı/ses yalıtımı beklenen projelerde 3 contalı (orta contalı) ekstra sızdırmazlık yapısıyla sunulurken, Dorado 76 5 odacıklı zarif estetiğiyle yaygın konut uygulamalarında tercih edilir.",
      ],
      [
        "Winsa Revotech 84 ve Panorama HS sistemleri nerelerde kullanılır?",
        "Winsa Revotech 84 mm geniş kasa derinliğiyle üst düzey termal izolasyon isteyen villalarda kullanılır. Panorama HS ise ağır cam panelleri hafifçe kaldırıp kaydıran, teras ve bahçe geçişlerinde eşiksiz konfor sağlayan kaldır-sür sistemidir.",
        "/urunler/temperli-cam",
        "Sürme & Hebeschiebe",
      ],
      [
        "Pimapen Nirvana 80 ile Pimapen Carisma 70 arasındaki fark nedir?",
        "Pimapen Carisma 70 mm ve 5 odacıklı yapısıyla standart apartman ve daire yenilemeleri için dengeli çözümdür. Pimapen Nirvana ise 80 mm genişlik, 6 odacık ve üç contalı yapısıyla maksimum ısı ve akustik yalıtım hedeflenen projeler için tasarlanmıştır.",
      ],
      [
        "Pimapen Albatros sürme sistemi hangi açıklıklar için uygundur?",
        "Pimapen Albatros, balkon, kış bahçesi ve teras geçişlerinde çift veya üç raylı olarak çalışabilen, ağır kanatları sessiz ve sızdırmaz şekilde kaydıran yüksek taşıma kapasiteli kaldırmalı sürme pencere ve kapı sistemidir.",
        "/urunler/temperli-cam",
        "PVC Sürme Sistemleri",
      ],
      [
        "Fıratpen, Winsa ve Pimapen arasında kalite veya garanti farkı var mı?",
        "Üç marka da Türkiye'nin köklü ve TSE EN 12608-1 standartlı uPVC sistemleridir. Pencerede gerçek performansı belirleyen unsurlar; doğru seri seçimi (70/75/80+ mm), orijinal galvanizli destek sacı kullanımı, CNC köşe kaynağı ve doğru cam kombinasyonudur.",
      ],
      [
        "Acarpen doğramalarda standart beyaz veya renkli EPDM conta mı kullanıyor?",
        "Profil rengine göre beyaz, gri veya siyah TPE/EPDM esaslı esnek contalar uygulanır. Bu contalar Adana'nın yoğun yaz sıcağında sertleşmez, kışın çatlamaz ve kanat kapandığında çepeçevre hava-su sızdırmazlığı oluşturur.",
        "/uretim-teknolojisi",
        "Üretim Detayları",
      ],
      [
        "Acarpen resmi kurumsal şirket unvanı ve atölye adresi nedir?",
        "Acarpen markasının resmi şirket unvanı ACAR PEN İNŞAAT SANAYİ VE TİCARET LİMİTED ŞİRKETİ'dir. Üretim ve showroom adresi: Gülbahçesi Mahallesi, 13428 Sokak, No:16/17, Seyhan, Adana. Tek telefon & WhatsApp hattı: +90 533 625 36 11.",
        "/hakkimizda",
        "Hakkımızda & İletişim",
      ],
      [
        "Pencerede ispanyolet ve menteşe donanımı neden önemlidir?",
        "Kilit ve ispanyolet aksamı, kanadın kasaya kaç noktadan bastığını belirler. Kaliteli çift açılım donanım ve kilitleme karşılıkları, hem hırsızlığa karşı emniyeti yükseltir hem de contaya eşit baskı uygulayarak ses geçişini keser.",
        "/urunler/lamine-cam",
        "Donanım & Aksesuar",
      ],
      [
        "PVC doğramalarda CNC 4 köşe kaynak ve köşe temizleme neden gereklidir?",
        "Bilgisayar kontrollü dört köşe kaynak makinesi, doğramanın dik açısını bozmadan dört köşeyi aynı anda kaynatır; CNC köşe temizleme ise kaynak çapaklarını sıfırlayarak su oluğu ve görsel bütünlük sağlar.",
        "/uretim-teknolojisi",
        "CNC İmalat Parkuru",
      ],
      [
        "Eski ahşap veya demir doğramalar PVC sistemle yenilenirken kasa kalınlığı uyum sağlar mı?",
        "Eski doğrama sökülüp duvar boşluğu temizlendikten sonra pervazlı (ekonomik tadilat) veya pervazsız ana kasa profilleri kullanılarak tuğla ve sıva yüzeyi kapatılır; mevcut mermer denizliklerle tam uyum sağlanır.",
      ],
      [
        "İç cephe rengi farklı, dış cephe rengi farklı çift taraflı lamine PVC üretilebilir mi?",
        "Evet. Site yönetimlerinin dış cephe bütünlüğü şart koştuğu binalarda dış taraf Antrasit Gri veya Altınmeşe, evin içi Beyaz kalacak şekilde tek yüzey lamine veya her iki yüzü renkli çift yüzey lamine profiller üretilebilmektedir.",
        "/urunler/renkli-camlar",
        "19 PVC Renk Seçeneği",
      ],
      [
        "PVC profil seçiminde 5 odacıklı ile 6 odacıklı arasında fatura tasarrufu ne kadar değişir?",
        "Kesin tasarruf oranı bina yalıtımı, cam seçimi ve cephe yönüne göre değişmekle birlikte; profil oda sayısı ve kasa kalınlığı arttıkça pencere çerçevesinden kaynaklanan ısı iletim kaybı düşer ve ısıtma/soğutma cihazları daha az çalışır.",
      ],
    ],
  },
  {
    category: "Renkli Profil & Isıcam Teknolojisi",
    defaultUrl: "/urunler/renkli-camlar",
    defaultLabel: "Renk & Renkli Isıcam Kartelası",
    items: [
      [
        "Acarpen'de hangi PVC pencere profil renk seçenekleri bulunmaktadır?",
        "Beyaz başta olmak üzere Antrasit Gri (RAL 7016), Metalik Antrasit, Altın Meşe, Koyu Meşe, Ceviz, Maun, Vizon, Kuvars Platin, Gümüş Gri, Siyah Kahve, Çam, Krem ve Alüminyum Efekt dahil 19 farklı lamine PVC folyo rengi sunulmaktadır.",
      ],
      [
        "Antrasit gri PVC pencere Adana güneşinde yamulma veya eğilme yapar mı?",
        "Koyu renk profiller güneş ışığını beyazdan fazla emer; bu nedenle Adana ikliminde mutlaka 1.20–1.50 mm kalınlığında galvanizli çelik destek sacı ve havalandırmalı profil kanallarıyla üretilmelidir. Acarpen standart desteğiyle eğilme yaşanmaz.",
      ],
      [
        "PVC pencerelerde beyaz cam yerine renkli veya reflekte cam takılabilir mi?",
        "Evet. Standart şeffaf 4+16+4 mm ısıcam dışında; Füme, Bronz, Mavi Reflekte, Yeşil Reflekte, Satinato Buzlu mahremiyet camı ve güneş ısısını süzen Solar Low-E Konfor ısıcam seçenekleri doğrudan PVC pencerelere uygulanmaktadır.",
      ],
      [
        "Güneş kontrolü sağlayan Solar Low-E (Konfor) ısıcam Adana için uygun mudur?",
        "Solar Low-E kaplamalı camlar gün ışığını içeri alırken yazın güneşten gelen kızılötesi ısı enerjisini dışarıda tutar, kışın ise oda sıcaklığının dışarı kaçmasını önler. Batı ve güney cepheli Adana ve Mersin evleri için en verimli camdır.",
      ],
      [
        "Füme ve bronz reflekte camlı PVC pencere gündüz içeriyi gösterir mi?",
        "Reflekte camlar dışarıda ışık seviyesi içeriden yüksek olduğu gündüz saatlerinde ayna efekti oluşturarak mahremiyet sağlar. Gece içeride ışık yandığında ise mahremiyet için perde/panjur veya jaluzili ısıcam tercih edilmelidir.",
      ],
      [
        "Satinato buzlu cam ve dekoratif cam hangi pencerelerde tercih edilir?",
        "Işığı homojen biçimde içeri alırken arka görüntüyü tamamen bulanıklaştıran Satinato buzlu camlar özellikle 40×40/50×50 banyo-WC pencerelerinde ve 85×200 cm PVC tuvalet kapılarında standart olarak uygulanır.",
      ],
      [
        "4+16+4 mm ısıcamdaki 16 mm ara boşluk ne işe yarar?",
        "İki adet 4 mm cam plakası arasındaki 16 mm boşluk kuru hava veya argon gazı ile doldurulur; nem alıcı moleküler elek ve çift sızdırmazlık bütil/polisülfid contasıyla kapatılarak iletim ve taşınımla ısı kaybını minimize eder.",
      ],
      [
        "PVC doğramalarda temperli ısıcam ne zaman gereklidir?",
        "Yerden tavana uzanan büyük açıklıklarda, balkon kapılarının alt cam bölmelerinde, yüksek katlı konutların rüzgar gören cephelerinde ve olası darbe riskinde yaralanmayı önlemek için ısıcamın bir veya iki yüzü temperli üretilir.",
      ],
      [
        "Ahşap görünümlü Altınmeşe ve Maun PVC folyolar yağmurda veya güneşte soyulur mu?",
        "Dış mekan iklim testlerinden geçen akrilik/PVC esaslı lamine folyolar fabrikasyon sıcak poliüretan tutkal teknolojisiyle profil üzerine kaplandığından yüksek UV altında kabarma veya soyulma yapmaz.",
      ],
      [
        "PVC pencerede argon gazlı ısıcam ile standart hava dolgulu ısıcam farkı nedir?",
        "Argon gazı kuru havadan daha ağır ve ısı iletkenliği daha düşük olduğu için çift cam arasındaki ısı transferini yavaşlatır. Low-E kaplamalı yüzeyle kullanıldığında pencere U-değerini önemli ölçüde iyileştirir.",
        "/rehber",
        "Teknik Rehber",
      ],
      [
        "İki cam arası jaluzili ısıcam nedir, PVC pencere ve kapılara uyar mı?",
        "Çift cam ünitesinin hava boşluğu içerisine yerleştirilen alüminyum mikro jaluzi sistemi mıknatıslı veya butonlu kontrolle açılıp kapanır. Tozlanmaz, temizlenmez; ofis bölmeleri ve balkon kapıları için idealdir.",
        "/urunler/jaluzili-isicam",
        "Jaluzili Isıcam Sistemleri",
      ],
      [
        "Renkli PVC profil ile renkli cam aynı anda sipariş edilirse üretim süresi uzar mı?",
        "Standart beyaz ve stoktaki Antrasit Gri / Altınmeşe serilerinde hızlı üretim yapılırken, özel RAL/lamine renk veya özel temperli reflekte cam kombinasyonlarında cam tesis süresi sipariş sırasında net termin olarak paylaşılır.",
      ],
      [
        "Cam balkonda şeffaf, füme, bronz ve yeşil reflekte cam renk farkı ne sağlar?",
        "Şeffaf cam manzarayı kesintisiz bırakır; Füme ve Bronz cam güneş parlamasını kırarak balkon içi döşemelerin solmasını geciktirir; yeşil/mavi reflekte camlar ise cephe mimarisine renk uyumu ve dışarıdan gölgeleme efekti kazandırır.",
        "/urunler/balkon-cami",
        "Cam Balkon Sistemleri",
      ],
      [
        "Üçlü (3 camlı / 36–40 mm) ısıcam Adana ikliminde zorunlu mudur?",
        "Adana, Mersin ve Hatay sahil kuşağı gibi ılıman/sıcak bölgelerde 4+16+4 mm Solar Low-E çift cam fazlasıyla yeterlidir. Üçlü ısıcam ise özellikle Kayseri ve Niğde gibi sert kış koşullarına sahip karasal iklim projelerinde öne çıkar.",
      ],
      [
        "Fıratpen renk kartelasındaki renkleri Adana showroomunuzda birebir görebilir miyim?",
        "Evet. Seyhan Gülbahçesi Mah. 13428 Sok. No:16/17 adresindeki Acarpen showroomumuzda gerçek profil kesitlerini ve 19 renk laminasyon numunesini gün ışığında inceleyebilir, ayrıca sitemizdeki renk simülatöründen önizleyebilirsiniz.",
      ],
    ],
  },
  {
    category: "Katlanır, Sürme & Giyotin Cam Balkon",
    defaultUrl: "/urunler/balkon-cami",
    defaultLabel: "Cam Balkon Sistemleri",
    items: [
      [
        "Düz, L tipi ve U tipi balkonların tamamına cam balkon yapılabiliyor mu?",
        "Evet. Düz cepheli balkonlar, 90° veya açılı L tipi köşe balkonlar ve üç tarafı açık U tipi geniş balkonların tamamı özel köşe birleşim profilleri ve alüminyum damlalık detaylarıyla su sızdırmaz şekilde camlanmaktadır.",
      ],
      [
        "Katlanır cam balkon ile eşikli/eşiksiz sürme cam balkon arasındaki fark nedir?",
        "Katlanır cam balkon panelleri yan duvara toplanarak balkonun yaklaşık %90'ını tamamen açar ve temizlik için tüm kanatlar içeri döner. Sürme cam balkon ise ray üzerinde kayarak yer işgal etmez, tül perde/mobilya kullanımını kolaylaştırır.",
      ],
      [
        "Isıcamlı cam balkon normal 8 mm temperli cam balkona göre neden daha avantajlıdır?",
        "Tek camlı (8–10 mm) sistemler rüzgar ve yağmuru keserken ısı yalıtımı sınırlıdır. Isıcamlı (çift camlı) katlanır cam balkonlar balkonla salon arasında güçlü termal bariyer kurar; soğuk-sıcak geçişini azaltır ve terlemeyi önler.",
      ],
      [
        "Motorlu giyotin cam balkon sistemi nasıl çalışır ve nerelerde kullanılır?",
        "Dikey yönde zincirli veya kayışlı motor sistemiyle aşağı-yukarı hareket eden giyotin cam balkonlar uzaktan kumanda ile kontrol edilir. Teras, villa bahçesi, kış bahçesi ve kafe-restoran cephelerinde tek dokunuşla açılıp kapanır.",
      ],
      [
        "Cam balkonda 8 mm mi yoksa 10 mm temperli cam mı seçilmelidir?",
        "Standart yükseklikteki (150–180 cm cam boyu) apartman balkonlarında 8 mm temperli cam hafiftir ve rulman ömrünü uzatır. 210 cm üzeri yüksek rüzgarlı katlarda, teraslarda ve büyük açıklıklı sürmelerde 10 mm temperli cam önerilir.",
      ],
      [
        "Cam balkon paslanmaz rulman ve taşıyıcı teker seçimi neden önemlidir?",
        "Cam panellerin yükünü alüminyum ray içinde taşıyan tekerlekler ucuz plastik olursa zamanla kırılır veya kanat sürter. Acarpen cam balkonlarında paslanmaz bilyalı çift rulman ve alüminyum gövdeli teker takımları kullanılır.",
      ],
      [
        "Cam balkonlar su sızdırır mı, yağmur tahliyesi nasıl çalışır?",
        "Alt ve üst kasa profillerinde çift sıralı kıl fitil, kanat aralarında UV dayanımlı şeffaf H-conta veya alüminyum conta ve dış kenarda su tahliye damlalığı uygulanarak sağanak yağışta su girişine karşı koruma sağlanır.",
      ],
      [
        "Eşiksiz sürme cam balkon yüksek katlı konut balkonlarında güvenli midir?",
        "Eşiksiz alt ray, basıp geçilen kafe terasları ve yaşlı/çocuk yürüyüş yolu için engelsiz konfor sağlar. Yüksek katlı dış balkonlarda ise rüzgar emişine ve yağmur suyuna karşı yüksek eşikli ve kılavuzlu ray profili önerilir.",
      ],
      [
        "Cam balkona sonradan sineklik veya cam içi plise perde takılabilir mi?",
        "Evet. Cam balkon panellerinin üzerine vidalanabilen özel alüminyum kasalı plise perde sistemleri ve sürme/katlanır açıklıklara uygun raylı plise sineklik çözümleri kolaylıkla entegre edilebilmektedir.",
        "/urunler/lamine-cam",
        "Plise Sineklik Sistemleri",
      ],
      [
        "Balkonu odaya katmak için tek cam yerine ısıcamlı cam balkon yeterli olur mu?",
        "Balkonu mutfak veya salona dahil etmek için yalnızca ısıcamlı cam balkon seçmek gerekir; buna ek olarak parapet altı izolasyonu, kasa birleşim mastiklemesi ve varsa radyatör dengesinin mimari/tesisat açısından planlanması önerilir.",
      ],
      [
        "Cam balkonda çocuk emniyet kilidi bulunuyor mu?",
        "Evet. Katlanır sistemlerin açılır ilk kanadında ve sürme sistemlerin kenar kilitlerinde yalnızca yetişkinlerin açabileceği ispanyolet kilit veya çocuk güvenlik mandalı standart opsiyon olarak sunulmaktadır.",
      ],
      [
        "Cam balkon profilleri dairemin antrasit gri veya kahverengi cephesine boyanabilir mi?",
        "Eloksal gri ve beyazın yanı sıra bina cephesine uygun Antrasit Gri (RAL 7016), Bronz veya ahşap desen transfer boyalı alüminyum kasa profilleriyle apartman yönetmeliklerine %100 uyumlu görünüm elde edilir.",
      ],
      [
        "Cam balkon m2 fiyatı hesaplanırken yükseklik ve cam kalınlığı nasıl etkiler?",
        "Toplam alan (en × boy), 8 mm/10 mm temperli veya ısıcamlı oluşu, profil rengi (standart eloksal vs özel RAL/ahşap), L/U köşe dönüş aparat sayısı ve montaj kat yüksekliği teklifi doğrudan belirler.",
        "/hesaplama",
        "Cam Balkon Ölçü Hesapla",
      ],
      [
        "Sitede dış görünüm kısıtlaması olan binalarda şeffaf mı füme cam mı izin görür?",
        "Apartman yönetim planında cam rengi tanımlıysa ona uyulur; çoğu yeni sitede gün ışığını korurken cephe bütünlüğü sunan açık füme veya şeffaf cam tercih edilir.",
      ],
      [
        "Adana, Mersin ve Hatay kıyı şeridinde alüminyum korozyonu önleniyor mu?",
        "Tuzlu deniz nemine maruz kalan İskenderun, Mersin Erdemli-Mezitli ve Karataş/Yumurtalık gibi sahil kesimlerinde elektrostatik toz boyalı veya eloksallı alüminyum profiller ile paslanmaz bağlantı vidaları kullanılmaktadır.",
      ],
    ],
  },
  {
    category: "Hebeschiebe, Kapı, Panjur & Sineklik",
    defaultUrl: "/urunler/temperli-cam",
    defaultLabel: "Sürme, Kapı & Panjur Sistemleri",
    items: [
      [
        "Hebeschiebe (kaldır-sür) kapı ile standart PVC sürme kapı arasındaki fark nedir?",
        "Standart sürme kapılarda kanatlar fırça contalar üzerinde kaydığı için büyük açıklıklarda ısı/hava sızdırmazlığı düşer. Hebeschiebe sistemde ise kol çevrilince kanat raydan 6–8 mm kalkıp kayar, kapatılınca EPDM contaya tam baskıyla oturur.",
      ],
      [
        "Hebeschiebe kaldır-sür sistemler kaç kiloya kadar cam kanadı taşıyabilir?",
        "Fıratpen Zenia Slide, Winsa Panorama HS ve benzeri ağır hizmet tipi Hebeschiebe mekanizmalar tek kanatta 200 kg ile 300 kg arası yüksek cam ağırlığını çocukların bile tek elle itebileceği hafiflikle taşır.",
      ],
      [
        "120×120 ve 140×120 cm çift kanat PVC sürme pencereler nerede tercih edilir?",
        "Mutfak tezgahı önü, dar koridorlar, balkon duvarları veya perdelere çarpmadan havalandırma istenen alanlarda kanatların içeri taşmaması amacıyla çift kanat sürme pencereler yoğun şekilde tercih edilir.",
      ],
      [
        "Volkswagen (paralel sürme) kapı nedir, balkonda neden sevilir?",
        "Volkswagen sürme, kapalıyken standart PVC doğrama kadar yüksek sızdırmazlık veren; açıldığında ise kanadı paralel olarak kasa önüne alıp rayda kaydıran hem vasistaslı hem yüksek yalıtımlı balkon çıkış kapısıdır.",
      ],
      [
        "Standart PVC balkon kapısı ölçüleri nedir, sağ veya sol yönü sonradan değişir mi?",
        "Hazır ve yaygın ölçüler 85×198 cm ile 85×210 cm'dir. Açılım yönü (sağa açılır / sola açılır) üretim sırasında menteşe ve ispanyolet kesimine göre sabitlenir; sipariş anında oda yerleşimine göre netleştirilir.",
        "/urunler/jaluzili-isicam",
        "PVC Kapı Modelleri",
      ],
      [
        "85×200 cm PVC WC ve banyo kapıları suya ve buhara dayanıklı mıdır?",
        "Evet. Ahşap ve MDF iç kapıların zamanla su ve buhardan şiştiği banyo/WC alanlarında PVC profil ve lambri panelli/buzlu camlı 85×200 cm kapılar nemden etkilenmez, çürümez ve kolay yıkanabilir.",
        "/urunler/jaluzili-isicam",
        "PVC WC & Banyo Kapısı",
      ],
      [
        "Pencereye panjur sonradan dıştan takılabilir mi yoksa inşaat aşamasında mı yapılmalı?",
        "İnşaat aşamasında pencere kasasıyla bütünleşik monoblok panjur kutusu tercih edilebilir; mevcut penceresi bulunan dairelerde ise dıştan takma kutulu alüminyum panjur sistemleri kırma dökme olmadan uygulanır.",
        "/urunler/jaluzili-isicam",
        "Motorlu Panjur Sistemleri",
      ],
      [
        "Motorlu panjur ile manuel ipli/redüktörlü panjur arasında ne fark vardır?",
        "Manuel panjur kasa içinden geçen bant/kordon veya çevirme koluyla açılırken kordon boşluğundan az da olsa hava sızabilir. Somfy veya Mosel tüp motorlu panjurlar tam yalıtımlı çalışır, buton veya kumandayla sessiz yönetilir.",
        "/urunler/jaluzili-isicam",
        "Panjur Çözümleri",
      ],
      [
        "Poliüretan dolgulu alüminyum panjur lamelleri yaz sıcağında ısıyı azaltır mı?",
        "Alüminyum lamel içindeki yüksek yoğunluklu poliüretan köpük dolgusu doğrudan güneş ışığının cama ulaşmasını engelleyerek sera etkisini kırar ve Adana sıcaklarında oda sıcaklığının birkaç derece düşük kalmasına katkı sağlar.",
        "/urunler/jaluzili-isicam",
        "Alüminyum Panjur Detayı",
      ],
      [
        "Plise (pileli) sineklik ile menteşeli sineklik arasındaki kullanım farkı nedir?",
        "Plise sineklik ray içinde akordiyon gibi katlanarak sıfır yer kaplar; özellikle balkon kapıları ve panjurlu dar boşluklarda idealdir. Menteşeli sineklik ise küçük pencereler için ekonomik, söküp yıkanabilir pratik çözümdür.",
        "/urunler/lamine-cam",
        "Sineklik Modelleri",
      ],
      [
        "Evde kedi ve köpek varken hangi sineklik türü tercih edilmelidir?",
        "Standart fiberglas tül kedi tırnağıyla yırtılabilir. Evcil hayvan bulunan evler için çelik dokulu veya ekstra kalınlaştırılmış PetScreen yırtılmaz kedi tülü ve alt kilit mekanizmalı menteşeli/plise kasalar üretilmektedir.",
        "/urunler/lamine-cam",
        "Kedi Dayanımlı Sineklik",
      ],
      [
        "Çocuk güvenlik kilidi (emniyet kancası) mevcut PVC pencerelere takılabilir mi?",
        "Evet. Çelik halatlı anahtarlı çocuk güvenlik kilitleri ve bas-çek kilitli pencere kolları, hem yeni üretilen tüm PVC doğramalara hem de evdeki mevcut Fıratpen/Winsa/Pimapen pencerelere montajlanabilir.",
        "/urunler/lamine-cam",
        "Güvenlik Aksesuarları",
      ],
      [
        "Secustik pencere kolu standart pencere kolundan nasıl ayrılır?",
        "Secustik mekanizmalı kollar, dışarıdan ispanyolet zorlandığında içindeki kilitleme pimiyle dönmeyi mekanik olarak bloke eder ve çevirirken karakteristik güvenlik klik sesiyle kilitlendiğini hissettirir.",
        "/urunler/lamine-cam",
        "Pencere Kolları",
      ],
      [
        "Alüminyum ısı yalıtımlı doğrama mı yoksa PVC doğrama mı tercih edilmelidir?",
        "Konutlarda yüksek fiyat-performans ve üstün termal yalıtım için çok odacıklı PVC doğrama öne çıkarken; ticari mağaza vitrinleri, geniş showroom cepheleri ve büyük kış bahçesi açıklıklarında ısı bariyerli alüminyum sistemler kullanılır.",
        "/urunler/dis-cephe-camlari",
        "Alüminyum & Vitrin Sistemleri",
      ],
      [
        "Balkon kapılarında çift taraflı kol (dıştan da kilitlenebilir kapı) mümkün mü?",
        "Evet. Standart balkon kapısı yalnızca içeriden açılır ve dışarıdan çıtçıt tutucuyla kapanır; istenirse geniş kanat balkon kapı profiliyle üretilip içeriden ve dışarıdan anahtarlı barel kilit + çift taraflı kapı kolu takılabilmektedir.",
        "/urunler/jaluzili-isicam",
        "PVC Balkon Kapıları",
      ],
    ],
  },
  {
    category: "Ölçü, Fiyatlandırma & Montaj Süreci",
    defaultUrl: "/hesaplama",
    defaultLabel: "Online Ölçü & Teklif Robotu",
    items: [
      [
        "PVC pencere ve cam balkon fiyatını belirleyen ana faktörler nelerdir?",
        "Teklif tutarı sabit tek bir kaleme bağlı değildir; profil serisi (70/75/80/85 mm), metretül ve kanat açılım sayısı, seçilen laminasyon rengi (beyaz vs antrasit/ahşap), cam ünitesi (4+16+4 vs Konfor Low-E/temperli), panjur-sineklik ekleri ve montaj dahil olup olmamasına göre hesaplanır.",
      ],
      [
        "Acarpen sitesindeki online ölçü ve fiyat robotu nasıl kullanılır?",
        "Hesaplama sayfasında her pencere veya balkon kaleminiz için ürün grubunu, profil markasını, rengini, açılım yönünü ve En × Boy santimetre ölçüsünü girerek metraj listesi ve PDF doküman oluşturabilir, tek tıkla WhatsApp'tan veya sunucuya teklif talebi iletebilirsiniz.",
      ],
      [
        "Adana içinde ücretsiz yerinde keşif ve lazer ölçü randevusu var mı?",
        "Evet. Seyhan, Çukurova, Yüreğir ve Sarıçam başta olmak üzere Adana merkez ilçelerde yerinde lazer metre ile ölçüm ve teknik danışmanlık ücretsiz olarak planlanmaktadır.",
        "/iletisim",
        "Keşif Randevusu Al",
      ],
      [
        "Kendim mezura ile kabaca ölçü alıp WhatsApp üzerinden fiyat alabilir miyim?",
        "Evet. Duvar içinden duvar içine (veya mevcut pencerenin pervaz dışına kadar) En × Boy ölçülerini santimetre cinsinden yazıp pencerenin fotoğrafını 0533 625 36 11 WhatsApp hattımıza göndermeniz ön fiyat çalışması için yeterlidir.",
      ],
      [
        "Renkli PVC (Antrasit Gri, Altınmeşe) ile Beyaz PVC arasında maliyet farkı olur mu?",
        "Laminasyonlu folyo profiller hammadde ve kaplama aşaması nedeniyle standart beyaz profile göre belirli bir fark taşır; ancak uzun vadeli mimari değer ve UV dayanımıyla özellikle yeni konut ve villalarda en sık tercih edilen seçenektir.",
      ],
      [
        "Sipariş onaylandıktan sonra PVC pencere üretim ve montaj süresi kaç gündür?",
        "Standart beyaz ve stok renklerdeki bireysel daire projeleri ölçüm kesinleşmesini takiben genellikle kısa iş günü takviminde üretilip monte edilir; özel renk folyo, büyük şantiye veya motorlu panjur işlerinde net termin teklif formuna yazılır.",
      ],
      [
        "Verdiğim PVC pencere veya cam balkon siparişinin üretim durumunu nereden takip ederim?",
        "Siparişiniz onaylandığında size verilen Sipariş No ve 6 haneli Takip PIN kodunu sitemizdeki Canlı Sipariş Takip ekranına girerek (veya form onay linkiyle) üretim, kalite kontrol ve sevkiyat aşamalarını görüntüleyebilirsiniz.",
        "/siparis-takip",
        "Canlı Sipariş Takibi",
      ],
      [
        "Montajsız (demonte / fabrikadan teslim) hazır doğrama satın alabilir miyim?",
        "Evet. Kendisi ustalık yapabilecek veya şantiyesinde montaj ekibi bulunan ustalar, müteahhitler ve il dışı müşteriler için Gülbahçesi Mah. fabrikamızdan teslim veya nakliyeli demonte doğrama satışı yapılmaktadır.",
        "/urunler/dis-cephe-camlari",
        "Demonte & Toptan Teslimat",
      ],
      [
        "Doğrama ölçüsünde sağ açılım mı sol açılım mı nasıl belirlenir?",
        "Pencereye veya kapıya odanın içerisinden baktığınızda menteşeler sağ taraftaysa Sağ Açılım (kanat sağa açılır), menteşeler sol taraftaysa Sol Açılım (kanat sola açılır) olarak tanımlanır.",
        "/hesaplama",
        "Açılım Yönü Seçimi",
      ],
      [
        "Eski pencerelerin sökülüp atılması montaj hizmetine dahil midir?",
        "Anahtar teslim montajlı sözleşmelerde mevcut eski PVC, ahşap veya alüminyum doğramaların kontrollü sökümü teklif kapsamına dahil edilerek yeni doğramaların kurulumu eksiksiz gerçekleştirilir.",
      ],
      [
        "PVC pencere montajından sonra bakım, fitil değişimi ve kanat ayarı hizmeti var mı?",
        "Evet. Acarpen tarafından üretilip monte edilen işlerde mevsimsel kanat menteşe ayarı, ispanyolet yağlama, kol değişimi ve conta yenileme talepleri için Adana merkez servis ekibimiz teknik destek sunmaktadır.",
        "/iletisim",
        "Teknik Servis İletişim",
      ],
      [
        "Ödeme ve faturalandırma resmi şirket üzerinden mi yürütülür?",
        "Tüm teklif ve siparişler ACAR PEN İNŞAAT SANAYİ VE TİCARET LİMİTED ŞİRKETİ adına resmi sözleşme ve fatura düzeniyle işleme alınır; toplu projelerde hakediş ve teslimat planına göre ödeme takvimi belirlenir.",
      ],
      [
        "Tek bir banyo penceresi veya tek bir cam balkon için de sipariş verilebilir mi?",
        "Evet. Büyük inşaat şantiyelerinin yanı sıra yalnızca tek adet 40×40 WC vasistas penceresi, tek bir 85×200 PVC banyo kapısı veya tek cepheli balkon kapama talepleri için de üretim yapılmaktadır.",
      ],
      [
        "Mermer denizlik (eşik/pervaz) yoksa pencere montajı yapılabilir mi?",
        "Evet. Doğrama altındaki parapet düzlemine göre dışa akıntılı mermer denizlik veya PVC denizlik profili ile su sızdırmazlık sağlanarak montaj güvenle tamamlanır.",
      ],
      [
        "Acarpen Showroom ve Üretim Merkezi hangi gün ve saatlerde açıktır?",
        "Seyhan Gülbahçesi Mah. 13428 Sok. No:16/17 adresindeki üretim tesisimiz Pazartesi–Cumartesi günleri 08:00–19:00 saatleri arasında hizmet vermektedir; aynı saatlerde 0533 625 36 11 hattından da ulaşabilirsiniz.",
      ],
    ],
  },
  {
    category: "7 İl Sevkiyat & B2B Şantiye Tedariki",
    defaultUrl: "/bolgeler",
    defaultLabel: "Hizmet Bölgelerimiz",
    items: [
      [
        "Adana dışındaki illere PVC pencere ve cam balkon sevkiyatı nasıl yapılır?",
        "Seyhan / Adana merkez üretim tesisimizden Mersin, Osmaniye, Hatay, Gaziantep, Kayseri ve Niğde illerindeki şantiyelere ve konut projelerine özel koruyucu ambalaj ve cam sehpası taşıma araçlarıyla düzenli sevkiyat sağlanır.",
      ],
      [
        "Adana'nın tüm ilçelerine (Çukurova, Sarıçam, Yüreğir, Ceyhan, Kozan) hizmet veriyor musunuz?",
        "Evet. Seyhan ve Çukurova merkezde günlük yoğun keşif ve montaj planı yürütülürken; Sarıçam, Yüreğir, Ceyhan ve Kozan ilçelerindeki konut, müstakil villa ve OSB yapılarına düzenli araç ve montaj ekibi yönlendirilmektedir.",
        "/bolgeler/adana-cam-fabrikasi",
        "Adana Hizmet Sayfası",
      ],
      [
        "Mersin, Tarsus, Mezitli ve Erdemli sahil projelerinde nelere dikkat edilir?",
        "Mersin sahil kuşağındaki yüksek nem, yaz güneş radyasyonu ve tuzlu deniz rüzgarına karşı korozyon dirençli galvaniz destek sacı, Solar Low-E konfor ısıcam ve paslanmaz rulmanlı cam balkon sistemleri tercih edilir.",
        "/bolgeler/mersin-cam-imalati",
        "Mersin & Tarsus Sayfası",
      ],
      [
        "Hatay İskenderun, Antakya ve Defne yeni yapılaşma projelerine tedarik sağlıyor musunuz?",
        "Evet. Hatay genelinde yeniden yapılanan konut şantiyeleri, müstakil yapılar ve ticari binalar için kat ve daire bazlı barkodlu PVC doğrama, balkon kapısı ve cam balkon sistemleri planlı tır/kamyonet sevkiyatıyla ulaştırılır.",
        "/bolgeler/hatay-cam-firmalari",
        "Hatay Şantiye Tedariki",
      ],
      [
        "Osmaniye, Kadirli ve Düziçi projelerinde montaj veya demonte seçenekleri nelerdir?",
        "Adana üretim merkezimize 85 km yakınlıkta olan Osmaniye, Kadirli ve Düziçi'ndeki konut ve inşaatlara talep doğrultusunda hem montaj ekibimizle yerinde kurulum hem de hazır demonte sevkiyat yapılmaktadır.",
        "/bolgeler/osmaniye-cam-ureticisi",
        "Osmaniye Bölge Sayfası",
      ],
      [
        "Gaziantep Şahinbey ve Şehitkamil projeleri için neden Adana üretimi tercih edilir?",
        "Gaziantep'teki yüksek metrajlı konut ve villa şantiyeleri, geniş renk kartelası, CNC köşe temizlemeli standart A sınıfı profil kalitesi ve seri imalat hızımız nedeniyle toplu siparişlerde Acarpen tedarikini tercih etmektedir.",
        "/bolgeler/gaziantep-cam-cozumleri",
        "Gaziantep Bölge Sayfası",
      ],
      [
        "Kayseri ve Niğde gibi soğuk kış iklimli iller için hangi PVC profil ve cam önerilir?",
        "Sıfırın altına düşen kış sıcaklıklarında ısı kaybını kesmek için Kayseri ve Niğde projelerinde 75 mm Selenit / 80–85 mm 3 contalı seriler ile argon dolgulu veya 3'lü ısıcam üniteleri uygulanmaktadır.",
        "/bolgeler/kayseri-cam-toptan",
        "Kayseri & Niğde Sayfası",
      ],
      [
        "Müteahhitler şantiye doğrama metrajı için nasıl toplu teklif alabilir?",
        "AutoCAD (DWG) veya Excel doğrama mahal listesini 0533 625 36 11 WhatsApp hattımıza ya da info@acarpen.com.tr adresine ileterek profil serisi, cam kalınlığı ve teslim takvimi bazlı şantiye teklifinizi hızlıca alabilirsiniz.",
        "/urunler/dis-cephe-camlari",
        "B2B Müteahhit Çözümleri",
      ],
      [
        "Toplu konut şantiyelerinde doğramalar daire veya kat sırasına göre ayrılıyor mu?",
        "Evet. Blok, kat ve pencere poz numarasına göre etiketlenmiş paletleme düzeni sayesinde şantiyede doğru doğrama doğrudan ilgili kata çıkarılır ve montaj süresi ciddi oranda kısalır.",
        "/urunler/dis-cephe-camlari",
        "B2B Etiketli Sevkiyat",
      ],
      [
        "Adana OSB (Hacı Sabancı OSB) ve fabrika idari binaları için doğrama çözümleriniz nelerdir?",
        "OSB tesislerinin idari binalarında akustik yalıtımlı 75–85 mm PVC pencere, jaluzili ısıcamlı ofis bölme sistemleri ve dış mekan girişleri için ısı yalıtımlı alüminyum doğrama imalatı yapılmaktadır.",
        "/urunler/dis-cephe-camlari",
        "OSB & Ticari Çözümler",
      ],
      [
        "Acarpen'in Adana dışında fiziksel başka bir şubesi veya showroomu var mı?",
        "Hayır. Acarpen'in tek merkez üretim tesisi ve showroom adresi Adana Seyhan Gülbahçesi Mah. 13428 Sok. No:16/17'dir. Çevre illere hizmetler doğrudan Adana merkez fabrikasından lojistik ve ekip planlamasıyla yürütülmektedir.",
        "/hakkimizda",
        "Kurumsal Adres Bilgisi",
      ],
      [
        "Kentsel dönüşüm projelerinde bina yöneticileri veya müteahhitler için özel anlaşmalar var mı?",
        "Evet. Kentsel dönüşüm apartmanlarında tüm maliklerin ortak cephe renginde (örneğin Antrasit Gri dış / Beyaz iç) standart ve uyumlu PVC pencere + cam balkon paketleri metraj ölçeğine göre projelendirilmektedir.",
        "/urunler/dis-cephe-camlari",
        "Toplu Konut Paketleri",
      ],
      [
        "İnşaat devam ederken kaba sıva öncesi veya sonrası ölçü ne zaman alınmalıdır?",
        "Doğrama üretim ölçüsü genellikle denizlik mermeri konulup pencere sövelerinin kaba/ince sıvası bitip kenar duvarların netleştiği aşamada lazerle alınmalıdır ki doğrama boşluksuz tam gönyesinde otursun.",
      ],
      [
        "B2B bayiler ve taşeron montaj ustaları için fason PVC doğrama imalatı yapıyor musunuz?",
        "Evet. Kendi montaj ekibi bulunan bayiler ve saha ustaları için milimetrik kesim-kaynaklı, destek sacı ve ispanyolet aksamı takılı hazır doğrama kasa-kanatları kısa terminle fabrikadan teslim edilmektedir.",
        "/urunler/dis-cephe-camlari",
        "Fason & Bayi Tedariki",
      ],
      [
        "Diğer illerden verilen cam balkon veya PVC kapı siparişlerinde nakliye hasar güvencesi var mı?",
        "Tüm doğrama ve cam üniteleri köşe koruyucu ambalaj ve dikey A-frame cam taşıma sehpalarıyla sabitlenerek sevk edilir; teslimat anında kontrol edilerek eksiksiz teslim alınması sağlanır.",
      ],
    ],
  },
];

function buildGeoQuestions(): GeoQuestionEntry[] {
  const list: GeoQuestionEntry[] = [];
  let idx = 1;
  for (const grp of Q_GROUPS) {
    for (const [q, a, url, label] of grp.items) {
      list.push({
        id: `GEO-${String(idx++).padStart(3, "0")}`,
        category: grp.category,
        question: q,
        answer: a,
        targetUrl: url || grp.defaultUrl,
        targetLabel: label || grp.defaultLabel,
      });
    }
  }
  return list;
}

export const GEO_QUESTIONS_DATABASE: GeoQuestionEntry[] = buildGeoQuestions();
export const GEO_QUESTION_CATEGORIES: GeoQuestionCategory[] = Q_GROUPS.map((g) => g.category);
