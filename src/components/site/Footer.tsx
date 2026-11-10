import { useState } from "react";
import { Link } from "react-router-dom";
import {
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  ArrowUpRight,
  Lock,
  FileText,
  X,
  Calculator,
  PackageSearch,
  BookOpen,
  Cpu,
  MessageCircle,
  Clock,
} from "lucide-react";
import { Logo } from "./Logo";
import { useLanguage } from "@/context/LanguageContext";

export const Footer = () => {
  const { t } = useLanguage();
  const [legalModal, setLegalModal] = useState<"kvkk" | "cookies" | "terms" | null>(null);

  return (
    <footer className="border-t border-slate-800 bg-[#040f26] text-slate-200 pt-12 pb-10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 overflow-hidden">
        {/* Quick Access & Utility Bar (Moved from Navbar to keep Header Clean) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pb-10 mb-10 border-b border-slate-800/90">
          <Link
            to="/hesaplama"
            className="group flex items-center justify-between gap-3 rounded-2xl bg-slate-900/80 hover:bg-sky-950/70 border border-slate-800 hover:border-sky-700/70 p-4 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-sky-500/15 text-sky-400 flex items-center justify-center shrink-0">
                <Calculator className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-white group-hover:text-sky-300 transition-colors">
                  Ölçü & Fiyat Robotu
                </div>
                <div className="text-[11px] text-slate-400">Online PVC & Cam Balkon Hesapla</div>
              </div>
            </div>
            <ArrowUpRight className="h-4 w-4 text-slate-500 group-hover:text-sky-400 shrink-0 transition-colors" />
          </Link>

          <Link
            to="/siparis-takip"
            className="group flex items-center justify-between gap-3 rounded-2xl bg-slate-900/80 hover:bg-emerald-950/50 border border-slate-800 hover:border-emerald-700/60 p-4 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0">
                <PackageSearch className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">
                  Canlı Sipariş Takibi
                </div>
                <div className="text-[11px] text-slate-400">Üretim & Sevkiyat Durumu Sorgula</div>
              </div>
            </div>
            <ArrowUpRight className="h-4 w-4 text-slate-500 group-hover:text-emerald-400 shrink-0 transition-colors" />
          </Link>

          <Link
            to="/rehber"
            className="group flex items-center justify-between gap-3 rounded-2xl bg-slate-900/80 hover:bg-amber-950/40 border border-slate-800 hover:border-amber-700/60 p-4 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center shrink-0">
                <BookOpen className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">
                  PVC & Cam Balkon Rehberi
                </div>
                <div className="text-[11px] text-slate-400">Seri Karşılaştırma & Isıcam Seçimi</div>
              </div>
            </div>
            <ArrowUpRight className="h-4 w-4 text-slate-500 group-hover:text-amber-400 shrink-0 transition-colors" />
          </Link>

          <Link
            to="/uretim-teknolojisi"
            className="group flex items-center justify-between gap-3 rounded-2xl bg-slate-900/80 hover:bg-indigo-950/50 border border-slate-800 hover:border-indigo-700/60 p-4 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-indigo-500/15 text-indigo-400 flex items-center justify-center shrink-0">
                <Cpu className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors">
                  Üretim & Kalite Süreci
                </div>
                <div className="text-[11px] text-slate-400">CNC Kesim, Kaynak & TSE Standartları</div>
              </div>
            </div>
            <ArrowUpRight className="h-4 w-4 text-slate-500 group-hover:text-indigo-400 shrink-0 transition-colors" />
          </Link>
        </div>

        {/* Main 5-Column Footer Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-6 pb-12 border-b border-slate-800/90">
          {/* Col 1: Brand & Official Producer Credential */}
          <div className="lg:col-span-3 space-y-4">
            <Link to="/" className="inline-block">
              <Logo size="lg" showSubtitle={true} theme="dark" />
            </Link>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              Acar Pen İnşaat Sanayi ve Ticaret Ltd. Şti. olarak Adana Seyhan Gülbahçesi Mahallesi'ndeki tesisimizde <strong>Fıratpen, Winsa ve Pimapen</strong> PVC Pencere, Kapı, Hebeschiebe Sürme, Renkli Isıcam ve Cam Balkon sistemleri üretiyoruz.
            </p>
            <div className="inline-flex items-center gap-2 text-[11px] text-sky-300 font-semibold bg-sky-950/70 px-3 py-2 rounded-xl border border-sky-800/80">
              <ShieldCheck className="h-4 w-4 shrink-0 text-sky-400" />
              <span>Fıratpen • Winsa • Pimapen | TS EN 12608-1</span>
            </div>
          </div>

          {/* Col 2: Product Systems */}
          <div className="lg:col-span-3 space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-widest text-sky-400 font-bold">
              Ürün Sistemlerimiz
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
              <li>
                <Link to="/urunler/cift-cam" className="hover:text-sky-400 transition-colors">
                  PVC Pencereler (Fıratpen • Winsa • Pimapen)
                </Link>
              </li>
              <li>
                <Link to="/urunler/temperli-cam" className="hover:text-sky-400 transition-colors">
                  Hebeschiebe & PVC Sürme Kapılar
                </Link>
              </li>
              <li>
                <Link to="/urunler/balkon-cami" className="hover:text-sky-400 transition-colors">
                  Düz, L ve U Cam Balkon Sistemleri
                </Link>
              </li>
              <li>
                <Link to="/urunler/jaluzili-isicam" className="hover:text-sky-400 transition-colors">
                  PVC Balkon & WC Kapıları, Panjur
                </Link>
              </li>
              <li>
                <Link to="/urunler/renkli-camlar" className="hover:text-sky-400 transition-colors">
                  19 PVC Renk & Renkli Isıcamlar
                </Link>
              </li>
              <li>
                <Link to="/urunler/lamine-cam" className="hover:text-sky-400 transition-colors">
                  Plise Sineklik & Pencere Aksesuarları
                </Link>
              </li>
              <li>
                <Link to="/urunler/dis-cephe-camlari" className="hover:text-sky-400 transition-colors">
                  B2B Müteahhit & Toplu Şantiye
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Corporate & Knowledge Center */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-widest text-sky-400 font-bold">
              Kurumsal & Bilgi
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
              <li>
                <Link to="/hakkimizda" className="hover:text-sky-400 transition-colors">
                  Hakkımızda / Kurumsal
                </Link>
              </li>
              <li>
                <Link to="/uretim-teknolojisi" className="hover:text-sky-400 transition-colors">
                  Üretim & Kalite Süreci
                </Link>
              </li>
              <li>
                <Link to="/rehber" className="hover:text-sky-400 transition-colors">
                  Teknik Seçim Rehberi
                </Link>
              </li>
              <li>
                <Link to="/projeler" className="hover:text-sky-400 transition-colors">
                  Referans Projelerimiz
                </Link>
              </li>
              <li>
                <Link to="/hesaplama" className="hover:text-sky-400 transition-colors text-sky-300 font-medium">
                  Pencere Ölçü Robotu
                </Link>
              </li>
              <li>
                <Link to="/siparis-takip" className="hover:text-sky-400 transition-colors text-emerald-300 font-medium">
                  Sipariş & Üretim Takibi
                </Link>
              </li>
              <li>
                <Link to="/iletisim" className="hover:text-sky-400 transition-colors">
                  İletişim & Ücretsiz Keşif
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Service Regions (Moved from Navbar & Expanded) */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-widest text-sky-400 font-bold">
              Hizmet Bölgelerimiz
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
              <li>
                <Link to="/bolgeler/adana-cam-fabrikasi" className="hover:text-sky-400 transition-colors">
                  Adana Merkez (Seyhan / Çukurova)
                </Link>
              </li>
              <li>
                <Link to="/bolgeler/mersin-cam-imalati" className="hover:text-sky-400 transition-colors">
                  Mersin & Tarsus PVC Sistemleri
                </Link>
              </li>
              <li>
                <Link to="/bolgeler/osmaniye-cam-ureticisi" className="hover:text-sky-400 transition-colors">
                  Osmaniye & Kadirli Doğrama
                </Link>
              </li>
              <li>
                <Link to="/bolgeler/hatay-cam-firmalari" className="hover:text-sky-400 transition-colors">
                  Hatay & İskenderun Tedarik
                </Link>
              </li>
              <li>
                <Link to="/bolgeler/gaziantep-cam-cozumleri" className="hover:text-sky-400 transition-colors">
                  Gaziantep Şantiye Çözümleri
                </Link>
              </li>
              <li>
                <Link
                  to="/bolgeler"
                  className="inline-flex items-center gap-1 text-sky-400 hover:text-sky-300 font-semibold transition-colors pt-0.5"
                >
                  <span>Tüm Hizmet İllerimiz</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Factory & Direct Contact */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-widest text-sky-400 font-bold">
              Fabrika & İletişim
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-sky-400 shrink-0 mt-0.5" />
                <span>Gülbahçesi Mah. 13428 Sok. No:16/17 Seyhan / ADANA</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-sky-400 shrink-0" />
                <a href="tel:+905336253611" className="hover:text-white transition-colors font-semibold">
                  0533 625 36 11
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-emerald-400 shrink-0" />
                <a
                  href="https://wa.me/905336253611"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:text-emerald-300 transition-colors font-semibold"
                >
                  WhatsApp Hattı
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-sky-400 shrink-0" />
                <a href="mailto:info@acarpen.com.tr" className="hover:text-white transition-colors">
                  info@acarpen.com.tr
                </a>
              </li>
              <li className="flex items-center gap-2 text-slate-400 text-xs pt-0.5">
                <Clock className="h-3.5 w-3.5 text-sky-400 shrink-0" />
                <span>Pzt – Cmt: 08:00 – 19:00</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Legal & Admin Link Bar */}
        <div className="pt-7 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>
            © {new Date().getFullYear()} Acarpen — Acar Pen İnşaat San. ve Tic. Ltd. Şti.{" "}
            {t("footerRights", "Tüm hakları saklıdır.")}
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={() => setLegalModal("kvkk")}
              className="hover:text-sky-400 transition-colors"
            >
              KVKK Aydınlatma Metni
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => setLegalModal("cookies")}
              className="hover:text-sky-400 transition-colors"
            >
              Çerez Politikası
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => setLegalModal("terms")}
              className="hover:text-sky-400 transition-colors"
            >
              Kalite & Garanti Koşulları
            </button>
            <span>•</span>
            <Link
              to="/admin"
              className="inline-flex items-center gap-1 text-slate-400 hover:text-sky-400 transition-colors"
            >
              <Lock className="h-3 w-3" />
              <span>Yönetim</span>
            </Link>
          </div>
        </div>
      </div>

      {/* KVKK / Legal Modal */}
      {legalModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 border border-slate-200 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto text-slate-800">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div className="flex items-center gap-2.5">
                <FileText className="h-5 w-5 text-sky-600" />
                <h4 className="font-serif text-xl font-bold text-slate-900">
                  {legalModal === "kvkk" && "6698 Sayılı KVKK Aydınlatma Metni"}
                  {legalModal === "cookies" && "Gizlilik ve Çerez (Cookie) Politikası"}
                  {legalModal === "terms" && "Fıratpen Doğrama & Isıcam Garanti Koşulları"}
                </h4>
              </div>
              <button
                onClick={() => setLegalModal(null)}
                className="p-1.5 rounded-lg bg-slate-100 text-slate-600 hover:text-slate-900"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {legalModal === "kvkk" && (
              <div className="text-xs sm:text-sm text-slate-600 space-y-3 leading-relaxed">
                <p>
                  <strong className="text-slate-900">Veri Sorumlusu:</strong> Acar Pen İnşaat Sanayi ve Ticaret Limited Şirketi (Gülbahçesi Mah. 13428 Sok. No:16/17 Seyhan / Adana).
                </p>
                <p>
                  Web sitemizdeki iletişim formu, pencere hesaplama robotu ve sipariş takip ekranları üzerinden paylaştığınız ad-soyad, telefon numarası, e-posta adresi ve doğrama/cam balkon ölçü bilgileriniz; yalnızca tarafınıza resmi fiyat teklifi sunulması, keşif planlaması, üretim ve sevkiyat süreçlerinin yürütülmesi amacıyla 6698 sayılı Kişisel Verilerin Korunması Kanunu'nun 5. ve 6. maddelerine uygun olarak işlenmektedir.
                </p>
                <p>
                  Kişisel verileriniz üçüncü şahıs reklam ağlarıyla kesinlikle paylaşılmamaktadır. KVKK kapsamındaki taleplerinizi <strong className="text-sky-700">info@acarpen.com.tr</strong> adresine yazılı olarak iletebilirsiniz.
                </p>
              </div>
            )}

            {legalModal === "cookies" && (
              <div className="text-xs sm:text-sm text-slate-600 space-y-3 leading-relaxed">
                <p>
                  Acarpen web sitesi, dil tercihinizi (TR / EN / AR) hatırlamak ve pencere/cam balkon ölçü robotu hesaplamalarınızı kesintisiz sunmak amacıyla yalnızca zorunlu oturum çerezleri kullanmaktadır.
                </p>
                <p>
                  Tarayıcı ayarlarınız üzerinden çerezleri dilediğiniz zaman temizleyebilir veya engelleyebilirsiniz.
                </p>
              </div>
            )}

            {legalModal === "terms" && (
              <div className="text-xs sm:text-sm text-slate-600 space-y-3 leading-relaxed">
                <p>
                  <strong className="text-slate-900">1. Profil & Donanım Garantisi:</strong> Acarpen tarafından üretilen Fıratpen PVC doğramalar TS EN 12608-1 standardında olup sararmaya ve üretim hatalarına karşı Fıratpen üretici bayi güvencesi altındadır.
                </p>
                <p>
                  <strong className="text-slate-900">2. Isıcam & Cam Balkon Standartları:</strong> Tüm pencerelerimizde 4+16+4 mm Isıcam ve cam balkonlarımızda TSE EN 12150 standardında 8 mm / 10 mm temperli emniyet camı kullanılmaktadır.
                </p>
                <p>
                  <strong className="text-slate-900">3. Ölçü ve Montaj:</strong> Adana ve Çukurova içi montajlı siparişlerde uzman ekibimizce yerinde lazer ölçü alınarak imalata geçilir.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </footer>
  );
};
