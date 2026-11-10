export interface TranslationKeys {
  // Navbar
  navHome: string;
  navServices: string;
  navProjects: string;
  navAbout: string;
  navContact: string;
  navCalculator: string;
  navQuoteBtn: string;
  navDoubleGlass: string;
  navTemperedGlass: string;
  navBalconyGlass: string;
  navBlindsGlass: string;
  navFacadeGlass: string;
  navLaminatedGlass: string;

  // Hero
  heroBadge: string;
  heroTitle1: string;
  heroTitleHighlight: string;
  heroTitle2: string;
  heroTitleHighlight2: string;
  heroDesc: string;
  heroCtaQuote: string;
  heroCtaCalculator: string;
  heroCert1: string;
  heroCert2: string;
  heroCert3: string;

  // Services
  servicesBadge: string;
  servicesTitle: string;
  servicesTitleHighlight: string;
  servicesDesc: string;
  servicesViewDetail: string;

  // Stats
  statArea: string;
  statExp: string;
  statCapacity: string;
  statClients: string;

  // Projects
  projectsBadge: string;
  projectsTitle: string;
  projectsTitleHighlight: string;

  // Contact & Footer
  contactBadge: string;
  contactTitle: string;
  contactDesc: string;
  footerRights: string;
  selectLanguage: string;
  searchLanguage: string;
}

export const TRANSLATIONS: Record<"tr" | "en" | "ar", Partial<TranslationKeys>> = {
  tr: {
    navHome: "Ana Sayfa",
    navServices: "Ürünlerimiz",
    navProjects: "Referanslar",
    navAbout: "Kurumsal",
    navContact: "İletişim",
    navCalculator: "Fiyat Robotu",
    navQuoteBtn: "Teklif Al",
    navDoubleGlass: "Fıratpen • Winsa • Pimapen PVC Pencere",
    navTemperedGlass: "Hebeschiebe & Sürme Sistemler",
    navBalconyGlass: "Katlanır & Giyotin Cam Balkon",
    navBlindsGlass: "Motorlu Panjur & Kepenk",
    navFacadeGlass: "Kış Bahçesi & Alüminyum Doğrama",
    navLaminatedGlass: "Plise Sineklik & Isıcam Sistemleri",
    heroBadge: "Fıratpen • Winsa • Pimapen PVC Sistemleri • Seyhan / Adana",
    heroTitle1: "FIRATPEN, WINSA & PİMAPEN.",
    heroTitleHighlight: "ACARPEN",
    heroTitle2: "ÜRETİM GÜCÜ VE",
    heroTitleHighlight2: "GÜVENCESİ.",
    heroDesc:
      "Adana Seyhan Gülbahçesi Mahallesi'ndeki modern üretim ve uygulama merkezimizde; Fıratpen, Winsa ve Pimapen PVC pencere & kapı sistemleri, Hebeschiebe sürme, motorlu panjur, plise sineklik ve ısıcamlı cam balkon çözümleri üretiyoruz.",
    heroCtaQuote: "Ücretsiz Keşif & Teklif Al",
    heroCtaCalculator: "PVC & Cam Balkon Fiyatı Hesapla",
    heroCert1: "Fıratpen • Winsa • Pimapen",
    heroCert2: "CNC Köşe Kaynak Otomasyonu",
    heroCert3: "Adana & Çukurova Uzman Montaj",
    servicesBadge: "Fıratpen • Winsa • Pimapen Sistem Kataloğu",
    servicesTitle: "PVC Pencere, Sürme &",
    servicesTitleHighlight: "Cam Balkon Çözümlerimiz",
    servicesDesc:
      "Fıratpen (Selenit 75, Redonit 85), Winsa (Dorado 76, Safir 76, Revotech) ve Pimapen (Nirvana, Carisma) PVC profil serileri ile katlanır/giyotin cam balkon, motorlu panjur ve sineklik sistemlerini Acarpen ustalığıyla mekanlarınıza uyguluyoruz.",
    servicesViewDetail: "Teknik Detayları İncele",
    statArea: "CNC Otomasyonlu Üretim",
    statExp: "Yıllık Sektör Tecrübesi",
    statCapacity: "Tamamlanan Konut & Villa",
    statClients: "Mutlu Müşteri & Referans",
    projectsBadge: "Seçkin Referanslar",
    projectsTitle: "İmza Attığımız",
    projectsTitleHighlight: "Mimari Projeler",
    contactBadge: "7/24 Keşif & Destek",
    contactTitle: "Projeniz İçin Hemen Fiyat Alın",
    contactDesc:
      "Ölçülerinizi iletin veya ücretsiz lazer keşif talep edin; uzman ekibimiz en uygun Fıratpen, Winsa, Pimapen veya cam balkon çözümünü sunsun.",
    footerRights: "Tüm hakları saklıdır.",
    selectLanguage: "Dil Seçimi",
    searchLanguage: "Dil ara...",
  },
  en: {
    navHome: "Home",
    navServices: "Products",
    navProjects: "Projects",
    navAbout: "About Us",
    navContact: "Contact",
    navCalculator: "Price Calculator",
    navQuoteBtn: "Get a Quote",
    navDoubleGlass: "Fıratpen, Winsa & Pimapen uPVC Windows",
    navTemperedGlass: "Hebeschiebe & Sliding Systems",
    navBalconyGlass: "Folding & Guillotine Glass Balcony",
    navBlindsGlass: "Motorized Roller Shutters",
    navFacadeGlass: "Winter Garden & Aluminum Systems",
    navLaminatedGlass: "Pleated Fly Screens & Insulating Glass",
    heroBadge: "Fıratpen • Winsa • Pimapen uPVC Producer • Seyhan / Adana",
    heroTitle1: "FIRATPEN, WINSA & PİMAPEN.",
    heroTitleHighlight: "ACARPEN",
    heroTitle2: "PRECISION &",
    heroTitleHighlight2: "TRUST.",
    heroDesc:
      "At our Seyhan / Adana production and showroom center, we manufacture and install Fıratpen, Winsa, and Pimapen uPVC windows and doors, Hebeschiebe sliding systems, motorized shutters, fly screens, and glass balcony systems.",
    heroCtaQuote: "Request Free Survey & Quote",
    heroCtaCalculator: "Calculate Window & Balcony Price",
    heroCert1: "Fıratpen • Winsa • Pimapen",
    heroCert2: "CNC Corner Welding Automation",
    heroCert3: "Expert Installation Team",
    servicesBadge: "Fıratpen • Winsa • Pimapen Product Catalog",
    servicesTitle: "uPVC Windows, Sliding &",
    servicesTitleHighlight: "Glass Balcony Systems",
    servicesDesc:
      "We combine Fıratpen, Winsa, and Pimapen multi-chamber thermal and acoustic uPVC profiles with panoramic glass balcony, motorized shutter, and pleated fly screen solutions.",
    servicesViewDetail: "Explore Specifications",
    statArea: "CNC Automated Production",
    statExp: "Years of Industry Experience",
    statCapacity: "Completed Homes & Villas",
    statClients: "Happy Clients & Projects",
    projectsBadge: "Featured Portfolio",
    projectsTitle: "Landmark",
    projectsTitleHighlight: "Projects",
    contactBadge: "24/7 Support & Free Survey",
    contactTitle: "Request a Quote for Your Project",
    contactDesc: "Send your dimensions or request a free laser measurement in Adana & Çukurova.",
    footerRights: "All rights reserved.",
    selectLanguage: "Select Language",
    searchLanguage: "Search language...",
  },
  ar: {
    navHome: "الرئيسية",
    navServices: "منتجاتنا",
    navProjects: "المشاريع",
    navAbout: "من نحن",
    navContact: "اتصل بنا",
    navCalculator: "حاسبة الأسعار",
    navQuoteBtn: "اطلب عرض سعر",
    navDoubleGlass: "نوافذ وأبواب Fıratpen و Winsa و Pimapen PVC",
    navTemperedGlass: "أنظمة السحب Hebeschiebe",
    navBalconyGlass: "زجاج الشرفات القابل للطي والمنزلق",
    navBlindsGlass: "الأباجورات الكهربائية",
    navFacadeGlass: "الحدائق الشتوية والألمنيوم",
    navLaminatedGlass: "ناموسيات بليسيه والزجاج العازل",
    heroBadge: "أنظمة Fıratpen • Winsa • Pimapen PVC • سيهان / أضنة",
    heroTitle1: "FIRATPEN & WINSA & PİMAPEN.",
    heroTitleHighlight: "أكاربن",
    heroTitle2: "لإتقان النوافذ",
    heroTitleHighlight2: "والواجهات.",
    heroDesc:
      "في مركز الإنتاج والمعرض الخاص بنا في سيهان / أضنة، نقوم بتصنيع وتركيب أنظمة النوافذ والأبواب Fıratpen و Winsa و Pimapen PVC وأنظمة السحب والأباجورات الكهربائية وزجاج الشرفات.",
    heroCtaQuote: "اطلب معاينة مجانية وعرض سعر",
    heroCtaCalculator: "احسب سعر النوافذ والشرفة",
    heroCert1: "Fıratpen • Winsa • Pimapen",
    heroCert2: "خطوط لحام CNC أوتوماتيكية",
    heroCert3: "فريق تركيب متخصص في أضنة",
    servicesBadge: "كتالوج Fıratpen و Winsa و Pimapen",
    servicesTitle: "نوافذ PVC وأنظمة",
    servicesTitleHighlight: "الشرفات الزجاجية",
    servicesDesc:
      "أفضل حلول العزل الحراري والصوتي باستخدام مقاطع Fıratpen و Winsa و Pimapen PVC وأنظمة الشرفات الزجاجية والأباجورات.",
    servicesViewDetail: "عرض التفاصيل الفنية",
    statArea: "إنتاج أوتوماتيكي CNC",
    statExp: "سنوات من الخبرة الصناعية",
    statCapacity: "مشاريع سكنية وفيلات منجزة",
    statClients: "عملاء وشركاء راضون",
    projectsBadge: "مشاريعنا المميزة",
    projectsTitle: "أبرز",
    projectsTitleHighlight: "المشاريع المعمارية",
    contactBadge: "دعم ومعاينة مجانية",
    contactTitle: "احصل على عرض سعر لمشروعك الآن",
    contactDesc: "أرسل مقاساتك وسيتواصل معك فريقنا الفني فوراً.",
    footerRights: "جميع الحقوق محفوظة.",
    selectLanguage: "اختر اللغة",
    searchLanguage: "ابحث عن لغة...",
  },
};
