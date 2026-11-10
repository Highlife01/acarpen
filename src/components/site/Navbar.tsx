import { useState, useEffect } from "react";
import { Menu, X, Phone, ChevronDown, Calculator, MapPin, ShieldCheck, PackageSearch, BookOpen, Globe2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { Logo } from "./Logo";
import { LanguageSelector } from "../LanguageSelector";
import { useLanguage } from "@/context/LanguageContext";

const productLinks = [
  { label: "PVC Pencereler (70'lik & 75'lik Sistemler)", href: "/urunler/cift-cam", badge: "Hazır & Özel" },
  { label: "PVC Sürme Pencereler & Sürme Kapılar", href: "/urunler/temperli-cam", badge: "Çift Kanat" },
  { label: "Düz, L ve U Cam Balkon Sistemleri", href: "/urunler/balkon-cami", badge: "Katlanır / Sürme" },
  { label: "PVC Balkon Kapıları & PVC WC Kapıları", href: "/urunler/jaluzili-isicam", badge: "85×198 / 85×210" },
  { label: "B2B Müteahhit, Şantiye & Toplu Sipariş", href: "/urunler/dis-cephe-camlari", badge: "Düzenli Tedarik" },
  { label: "Pencere Kolları, Sineklik & Montaj Malzemeleri", href: "/urunler/lamine-cam", badge: "Aksesuar & PU" },
  { label: "Renk Seçenekleri (Beyaz / Antrasit / Altınmeşe)", href: "/urunler/renkli-camlar", badge: "Laminasyon" },
];

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();
  const { t } = useLanguage();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setDropdownOpen(false);
  }, [location.pathname]);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-xl shadow-md border-b border-slate-200"
          : "bg-white/90 backdrop-blur-lg border-b border-slate-200/80"
      }`}
    >
      {/* Top Corporate Info Bar */}
      <div className="hidden lg:block border-b border-slate-200 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-6 py-1.5 flex items-center justify-between text-xs text-slate-200">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 font-medium">
              <ShieldCheck className="h-3.5 w-3.5 text-sky-400" />
              Fıratpen Yetkili Üretici Bayi • Doğrudan Üretim • Hızlı Üretim • Düzenli Tedarik
            </span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <MapPin className="h-3.5 w-3.5 text-sky-400" />
              Gülbahçesi Mah. 13428 Sok. No:16/17 Seyhan / Adana
            </span>
          </div>
          <div className="flex items-center gap-5">
            <Link to="/rehber" className="hover:text-sky-300 transition-colors font-medium flex items-center gap-1 text-amber-300">
              <BookOpen className="h-3.5 w-3.5" />
              PVC & Cam Balkon Rehberi
            </Link>
            <span className="text-slate-600">|</span>
            <Link to="/bolgeler" className="hover:text-sky-300 transition-colors font-medium flex items-center gap-1 text-emerald-300">
              <Globe2 className="h-3.5 w-3.5" />
              Hizmet Bölgelerimiz
            </Link>
            <span className="text-slate-600">|</span>
            <Link to="/siparis-takip" className="hover:text-sky-300 transition-colors font-medium flex items-center gap-1 text-sky-300">
              <PackageSearch className="h-3.5 w-3.5" />
              Sipariş Takibi
            </Link>
            <span className="text-slate-600">|</span>
            <Link to="/hesaplama" className="hover:text-sky-300 transition-colors font-medium text-white">
              Pencere & Cam Balkon Ölçü Robotu
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-2">
        {/* Official Brand Logo: acar|pen */}
        <Link to="/" className="flex items-center group shrink-0">
          <Logo size="md" showSubtitle={true} theme="light" />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-5 xl:gap-6">
          <Link
            to="/"
            className={`text-sm font-semibold transition-colors ${
              location.pathname === "/" ? "text-sky-600" : "text-slate-700 hover:text-sky-600"
            }`}
          >
            {t("navHome", "Ana Sayfa")}
          </Link>

          {/* Products Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setDropdownOpen(true)}
            onMouseLeave={() => setDropdownOpen(false)}
          >
            <Link
              to="/hizmetler"
              className={`flex items-center gap-1 text-sm font-semibold transition-colors py-2 ${
                location.pathname.startsWith("/urunler") || location.pathname === "/hizmetler"
                  ? "text-sky-600"
                  : "text-slate-700 hover:text-sky-600"
              }`}
            >
              {t("navServices", "Ürünlerimiz")}
              <ChevronDown className={`h-4 w-4 transition-transform ${dropdownOpen ? "rotate-180 text-sky-600" : ""}`} />
            </Link>

            {dropdownOpen && (
              <div className="absolute top-full left-0 w-80 pt-2 z-50">
                <div className="bg-white rounded-2xl p-2 border border-slate-200 shadow-2xl space-y-1">
                  {productLinks.map((item) => (
                    <Link
                      key={item.href}
                      to={item.href}
                      className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:text-sky-700 hover:bg-sky-50 transition-colors"
                    >
                      <span>{item.label}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-100 text-sky-700 border border-sky-200 font-mono">
                        {item.badge}
                      </span>
                    </Link>
                  ))}
                  <div className="pt-1 mt-1 border-t border-slate-100">
                    <Link
                      to="/hizmetler"
                      className="block text-center py-2 text-xs font-bold text-sky-600 hover:text-sky-700"
                    >
                      Tüm Ürün Kategorilerini Gör →
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          <Link
            to="/uretim-teknolojisi"
            className={`text-sm font-semibold transition-colors ${
              location.pathname === "/uretim-teknolojisi" ? "text-sky-600" : "text-slate-700 hover:text-sky-600"
            }`}
          >
            Üretim & Kalite
          </Link>

          <Link
            to="/rehber"
            className={`text-sm font-semibold transition-colors ${
              location.pathname === "/rehber" ? "text-sky-600" : "text-slate-700 hover:text-sky-600"
            }`}
          >
            Teknik Rehber
          </Link>

          <Link
            to="/projeler"
            className={`text-sm font-semibold transition-colors ${
              location.pathname.startsWith("/projeler") ? "text-sky-600" : "text-slate-700 hover:text-sky-600"
            }`}
          >
            {t("navProjects", "Referanslar")}
          </Link>

          <Link
            to="/bolgeler"
            className={`text-sm font-semibold transition-colors ${
              location.pathname.startsWith("/bolgeler") ? "text-sky-600" : "text-slate-700 hover:text-sky-600"
            }`}
          >
            Bölgeler
          </Link>

          <Link
            to="/hakkimizda"
            className={`text-sm font-semibold transition-colors ${
              location.pathname === "/hakkimizda" ? "text-sky-600" : "text-slate-700 hover:text-sky-600"
            }`}
          >
            {t("navAbout", "Kurumsal")}
          </Link>

          <Link
            to="/iletisim"
            className={`text-sm font-semibold transition-colors ${
              location.pathname === "/iletisim" ? "text-sky-600" : "text-slate-700 hover:text-sky-600"
            }`}
          >
            {t("navContact", "İletişim")}
          </Link>
        </nav>

        {/* Actions */}
        <div className="hidden lg:flex items-center gap-2.5 shrink-0">
          <LanguageSelector />

          <a
            href="tel:+905336253611"
            className="hidden xl:flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-sky-600 transition-colors px-2.5 py-2 rounded-lg hover:bg-slate-100"
          >
            <Phone className="h-3.5 w-3.5 text-sky-600" />
            <span>0533 625 36 11</span>
          </a>

          <Link to="/hesaplama">
            <Button
              variant="outline"
              className="rounded-full border-sky-200 bg-sky-50 hover:bg-sky-100 text-sky-700 font-semibold px-4 text-xs h-9"
            >
              <Calculator className="h-3.5 w-3.5 mr-1.5 text-sky-600" />
              Pencere Hesapla
            </Button>
          </Link>

          <Link to="/iletisim">
            <Button className="rounded-full bg-sky-600 hover:bg-sky-700 text-white font-semibold px-5 text-xs h-9 shadow-md">
              {t("navQuoteBtn", "Teklif Al")}
            </Button>
          </Link>
        </div>

        {/* Mobile Actions & Hamburger */}
        <div className="flex lg:hidden items-center gap-2">
          <LanguageSelector />
          <button
            className="text-slate-800 p-2 rounded-lg hover:bg-slate-100"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menü"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {open && (
        <div className="lg:hidden bg-white border-t border-slate-200 px-6 py-6 space-y-4 max-h-[85vh] overflow-y-auto shadow-xl">
          <Link to="/" className="block text-base font-bold text-slate-900 hover:text-sky-600 py-1">
            {t("navHome", "Ana Sayfa")}
          </Link>

          <div className="space-y-2 border-y border-slate-100 py-3">
            <div className="text-xs font-mono uppercase tracking-wider text-sky-700 font-bold">
              Ürün Kategorilerimiz
            </div>
            {productLinks.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="flex items-center justify-between py-1.5 text-sm font-medium text-slate-700 hover:text-sky-600"
              >
                <span>{item.label}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200">
                  {item.badge}
                </span>
              </Link>
            ))}
          </div>

          <Link to="/uretim-teknolojisi" className="block text-base font-bold text-slate-900 hover:text-sky-600 py-1">
            Üretim & Kalite Süreci
          </Link>
          <Link to="/rehber" className="block text-base font-bold text-amber-600 hover:text-amber-700 py-1">
            PVC & Cam Balkon Rehberi
          </Link>
          <Link to="/projeler" className="block text-base font-bold text-slate-900 hover:text-sky-600 py-1">
            {t("navProjects", "Referans Projeler")}
          </Link>
          <Link to="/bolgeler" className="block text-base font-bold text-emerald-600 hover:text-emerald-700 py-1">
            Hizmet Bölgelerimiz (Adana & Çukurova)
          </Link>
          <Link to="/siparis-takip" className="block text-base font-bold text-sky-600 hover:text-sky-700 py-1 flex items-center gap-2">
            <PackageSearch className="h-4 w-4" />
            Canlı Sipariş Takibi
          </Link>
          <Link to="/hakkimizda" className="block text-base font-bold text-slate-900 hover:text-sky-600 py-1">
            {t("navAbout", "Kurumsal / Hakkımızda")}
          </Link>
          <Link to="/iletisim" className="block text-base font-bold text-slate-900 hover:text-sky-600 py-1">
            {t("navContact", "İletişim & Showroom")}
          </Link>

          <div className="pt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link to="/hesaplama" className="w-full">
              <Button variant="outline" className="w-full rounded-full border-sky-300 bg-sky-50 text-sky-700 font-bold">
                <Calculator className="h-4 w-4 mr-2" />
                Pencere Hesapla
              </Button>
            </Link>
            <Link to="/iletisim" className="w-full">
              <Button className="w-full rounded-full bg-sky-600 text-white font-bold">
                {t("navQuoteBtn", "Hemen Teklif Al")}
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
