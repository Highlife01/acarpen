import { useState, useEffect } from "react";
import {
  Menu,
  X,
  Phone,
  ChevronDown,
  Calculator,
  MapPin,
  ShieldCheck,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { Logo } from "./Logo";
import { LanguageSelector } from "../LanguageSelector";
import { useLanguage } from "@/context/LanguageContext";

const productLinks = [
  { label: "PVC Pencereler (Fıratpen • Winsa • Pimapen)", href: "/urunler/cift-cam", badge: "70 / 75 / 80 mm" },
  { label: "PVC Sürme Pencereler & Hebeschiebe", href: "/urunler/temperli-cam", badge: "Çift Kanat" },
  { label: "Düz, L ve U Cam Balkon Sistemleri", href: "/urunler/balkon-cami", badge: "Katlanır / Sürme" },
  { label: "PVC Balkon & WC Kapıları, Panjur", href: "/urunler/jaluzili-isicam", badge: "85×198 / 85×210" },
  { label: "19 PVC Renk & Renkli Isıcamlar", href: "/urunler/renkli-camlar", badge: "Lamine & Reflekte" },
  { label: "Plise Sineklik, Kol & Montaj Malzemeleri", href: "/urunler/lamine-cam", badge: "Aksesuar" },
  { label: "B2B Müteahhit, Şantiye & Toplu Sipariş", href: "/urunler/dis-cephe-camlari", badge: "Toptan Tedarik" },
];

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
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
    setMobileProductsOpen(false);
  }, [location.pathname]);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/98 backdrop-blur-xl shadow-md border-b border-slate-200"
          : "bg-white/95 backdrop-blur-lg shadow-sm border-b border-slate-200/90"
      }`}
    >
      {/* Slim Top Corporate Bar */}
      <div className="hidden lg:block border-b border-slate-800 bg-[#040f26] text-white">
        <div className="max-w-7xl mx-auto px-6 py-1.5 flex items-center justify-between text-xs text-slate-200">
          <div className="flex items-center gap-5">
            <span className="flex items-center gap-1.5 font-medium">
              <ShieldCheck className="h-3.5 w-3.5 text-sky-400" />
              Fıratpen • Winsa • Pimapen PVC Sistemleri • TS EN 12608-1 & 4+16+4 Isıcam
            </span>
            <span className="text-slate-700">|</span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <MapPin className="h-3.5 w-3.5 text-sky-400" />
              Gülbahçesi Mah. 13428 Sok. No:16/17 Seyhan / Adana
            </span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="tel:+905336253611"
              className="flex items-center gap-1.5 font-semibold text-slate-100 hover:text-sky-300 transition-colors"
            >
              <Phone className="h-3.5 w-3.5 text-sky-400" />
              <span>0533 625 36 11</span>
            </a>
            <span className="text-slate-700">|</span>
            <a
              href="https://wa.me/905336253611"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              <span>WhatsApp Hızlı Teklif</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-4">
        {/* Official Brand Logo */}
        <Link to="/" className="flex items-center group shrink-0">
          <Logo size="md" showSubtitle={true} theme="light" />
        </Link>

        {/* Streamlined Core Desktop Navigation (5 Core Links) */}
        <nav aria-label="Ana Menü" className="hidden lg:flex items-center gap-7 xl:gap-8">
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
              <ChevronDown
                className={`h-4 w-4 transition-transform ${
                  dropdownOpen ? "rotate-180 text-sky-600" : ""
                }`}
              />
            </Link>

            {dropdownOpen && (
              <div className="absolute top-full left-0 w-[340px] pt-2 z-50">
                <div className="bg-white rounded-2xl p-2 border border-slate-200 shadow-2xl space-y-1">
                  {productLinks.map((item) => (
                    <Link
                      key={item.href}
                      to={item.href}
                      className="flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:text-sky-700 hover:bg-sky-50 transition-colors"
                    >
                      <span>{item.label}</span>
                      <span className="shrink-0 text-[10px] px-2 py-0.5 rounded-full bg-sky-100 text-sky-700 border border-sky-200 font-mono">
                        {item.badge}
                      </span>
                    </Link>
                  ))}
                  <div className="pt-1 mt-1 border-t border-slate-100">
                    <Link
                      to="/hizmetler"
                      className="block text-center py-2 text-xs font-bold text-sky-600 hover:text-sky-700"
                    >
                      Tüm Ürün Sistemlerini İncele →
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          <Link
            to="/projeler"
            className={`text-sm font-semibold transition-colors ${
              location.pathname.startsWith("/projeler")
                ? "text-sky-600"
                : "text-slate-700 hover:text-sky-600"
            }`}
          >
            {t("navProjects", "Referanslar")}
          </Link>

          <Link
            to="/hakkimizda"
            className={`text-sm font-semibold transition-colors ${
              location.pathname === "/hakkimizda"
                ? "text-sky-600"
                : "text-slate-700 hover:text-sky-600"
            }`}
          >
            {t("navAbout", "Kurumsal")}
          </Link>

          <Link
            to="/iletisim"
            className={`text-sm font-semibold transition-colors ${
              location.pathname === "/iletisim"
                ? "text-sky-600"
                : "text-slate-700 hover:text-sky-600"
            }`}
          >
            {t("navContact", "İletişim")}
          </Link>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center gap-2.5 shrink-0">
          <LanguageSelector />

          <Link to="/hesaplama">
            <Button
              variant="outline"
              className="rounded-full border-sky-200 bg-sky-50 hover:bg-sky-100 text-sky-700 font-semibold px-4 text-xs h-9"
            >
              <Calculator className="h-3.5 w-3.5 mr-1.5 text-sky-600" />
              Ölçü & Fiyat Hesapla
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

      {/* Streamlined Mobile Drawer */}
      {open && (
        <div className="lg:hidden bg-white border-t border-slate-200 px-6 py-5 space-y-3.5 max-h-[85vh] overflow-y-auto shadow-xl">
          <Link to="/" className="block text-base font-bold text-slate-900 hover:text-sky-600 py-1">
            {t("navHome", "Ana Sayfa")}
          </Link>

          <div className="border-y border-slate-100 py-2.5">
            <button
              type="button"
              onClick={() => setMobileProductsOpen((v) => !v)}
              className="w-full flex items-center justify-between text-base font-bold text-slate-900 py-1"
            >
              <span>{t("navServices", "Ürünlerimiz")}</span>
              <ChevronDown
                className={`h-4 w-4 text-slate-500 transition-transform ${
                  mobileProductsOpen ? "rotate-180 text-sky-600" : ""
                }`}
              />
            </button>

            {mobileProductsOpen && (
              <div className="mt-2 space-y-1.5 pl-2">
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
                <Link
                  to="/hizmetler"
                  className="block pt-1 text-xs font-bold text-sky-600 hover:text-sky-700"
                >
                  Tüm Ürün Sistemlerini Gör →
                </Link>
              </div>
            )}
          </div>

          <Link
            to="/projeler"
            className="block text-base font-bold text-slate-900 hover:text-sky-600 py-1"
          >
            {t("navProjects", "Referans Projeler")}
          </Link>

          <Link
            to="/hakkimizda"
            className="block text-base font-bold text-slate-900 hover:text-sky-600 py-1"
          >
            {t("navAbout", "Kurumsal / Hakkımızda")}
          </Link>

          <Link
            to="/iletisim"
            className="block text-base font-bold text-slate-900 hover:text-sky-600 py-1"
          >
            {t("navContact", "İletişim & Showroom")}
          </Link>

          <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <Link to="/hesaplama" className="w-full">
              <Button
                variant="outline"
                className="w-full rounded-full border-sky-300 bg-sky-50 text-sky-700 font-bold"
              >
                <Calculator className="h-4 w-4 mr-2" />
                Ölçü & Fiyat Hesapla
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
