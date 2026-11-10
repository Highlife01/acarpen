import { useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, ShieldCheck, ArrowUpRight, Lock, FileText, X } from "lucide-react";
import { Logo } from "./Logo";
import { useLanguage } from "@/context/LanguageContext";

export const Footer = () => {
  const { t } = useLanguage();
  const [legalModal, setLegalModal] = useState<"kvkk" | "cookies" | "terms" | null>(null);

  return (
    <footer className="border-t border-slate-200 bg-slate-900 text-slate-200 pt-16 pb-10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-4">
            <Link to="/" className="inline-block">
              <Logo size="lg" showSubtitle={true} theme="dark" />
            </Link>
            <p className="text-sm text-slate-300 max-w-sm leading-relaxed font-normal">
              Acar Pen İnşaat Sanayi ve Ticaret Ltd. Şti. olarak Adana Seyhan Gülbahçesi Mahallesi'ndeki tesisimizde; Fıratpen PVC Pencere & Kapı Sistemleri, Sürme Sistemler, Düz/L/U Cam Balkon, Panjur, Sineklik ve Montaj Malzemeleri üretimi yapıyoruz.
            </p>
            <div className="inline-flex items-center gap-2 text-xs text-sky-300 font-semibold bg-sky-950/80 px-3.5 py-2 rounded-xl border border-sky-800">
              <ShieldCheck className="h-4 w-4 shrink-0 text-sky-400" />
              <span>Fıratpen Yetkili Üretici Bayi • TS EN 12608-1 & 4+16+4 Isıcam</span>
            </div>
          </div>

          {/* Products Column */}
          <div className="lg:col-span-3 space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-widest text-sky-400 font-bold">
              Ürün Kategorilerimiz
            </h3>
            <ul className="space-y-2.5 text-sm text-slate-300">
              <li>
                <Link to="/urunler/cift-cam" className="hover:text-sky-400 transition-colors">
                  PVC Pencereler (70'lik & 75'lik Sistemler)
                </Link>
              </li>
              <li>
                <Link to="/urunler/temperli-cam" className="hover:text-sky-400 transition-colors">
                  PVC Sürme Pencereler & Sürme Kapılar
                </Link>
              </li>
              <li>
                <Link to="/urunler/balkon-cami" className="hover:text-sky-400 transition-colors">
                  Düz, L ve U Cam Balkon Sistemleri
                </Link>
              </li>
              <li>
                <Link to="/urunler/jaluzili-isicam" className="hover:text-sky-400 transition-colors">
                  PVC Balkon Kapıları & PVC WC Kapıları
                </Link>
              </li>
              <li>
                <Link to="/urunler/dis-cephe-camlari" className="hover:text-sky-400 transition-colors">
                  B2B Müteahhit, Şantiye & Toplu Sipariş
                </Link>
              </li>
              <li>
                <Link to="/urunler/lamine-cam" className="hover:text-sky-400 transition-colors">
                  Pencere Kolları, Sineklik & Montaj Malzemeleri
                </Link>
              </li>
              <li>
                <Link to="/urunler/renkli-camlar" className="hover:text-sky-400 transition-colors">
                  Renk Seçenekleri (Beyaz / Antrasit / Altınmeşe)
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links Column */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-widest text-sky-400 font-bold">
              Kurumsal & Araçlar
            </h3>
            <ul className="space-y-2.5 text-sm text-slate-300">
              <li>
                <Link to="/uretim-teknolojisi" className="hover:text-sky-400 transition-colors font-medium text-white">
                  Üretim & Kalite Süreci
                </Link>
              </li>
              <li>
                <Link to="/rehber" className="hover:text-sky-400 transition-colors font-semibold text-amber-300">
                  PVC & Cam Balkon Rehberi
                </Link>
              </li>
              <li>
                <Link to="/bolgeler" className="hover:text-sky-400 transition-colors font-semibold text-emerald-300">
                  Hizmet Bölgelerimiz
                </Link>
              </li>
              <li>
                <Link to="/hakkimizda" className="hover:text-sky-400 transition-colors">
                  Hakkımızda / Kurumsal
                </Link>
              </li>
              <li>
                <Link to="/projeler" className="hover:text-sky-400 transition-colors">
                  Referans Projeler
                </Link>
              </li>
              <li>
                <Link to="/hesaplama" className="hover:text-sky-400 transition-colors flex items-center gap-1 text-sky-400 font-semibold">
                  <span>Pencere Ölçü Robotu</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </li>
              <li>
                <Link to="/siparis-takip" className="hover:text-sky-400 transition-colors flex items-center gap-1 text-emerald-400 font-semibold">
                  <span>Canlı Sipariş Takibi</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </li>
              <li>
                <Link to="/iletisim" className="hover:text-sky-400 transition-colors">
                  İletişim & Ücretsiz Keşif
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div className="lg:col-span-3 space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-widest text-sky-400 font-bold">
              Merkez & İletişim
            </h3>
            <ul className="space-y-3 text-sm text-slate-300">
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-sky-400 shrink-0 mt-1" />
                <span>Gülbahçesi Mah. 13428 Sok. No:16/17 Seyhan - Seyhan / ADANA</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-sky-400 shrink-0" />
                <a href="tel:+905336253611" className="hover:text-white transition-colors font-semibold">
                  0533 625 36 11
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-sky-400 shrink-0" />
                <a href="mailto:info@acarpen.com.tr" className="hover:text-white transition-colors">
                  info@acarpen.com.tr
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Legal & Admin Link Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>
            © {new Date().getFullYear()} Acarpen — Acar Pen İnşaat San. ve Tic. Ltd. Şti. {t("footerRights", "Tüm hakları saklıdır.")}
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
