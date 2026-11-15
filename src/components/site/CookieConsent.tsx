import React, { useState, useEffect } from "react";
import { ShieldCheck, Cookie, Check, X } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { getCookieConsent, setCookieConsent, subscribeCookieConsent, CookieConsentStatus } from "@/lib/analytics";

interface ConsentTranslation {
  title: string;
  description: string;
  badge: string;
  accept: string;
  reject: string;
  policy: string;
  guarantee: string;
}

const COOKIE_TRANSLATIONS: Record<"tr" | "en" | "ar", ConsentTranslation> = {
  tr: {
    title: "Gizlilik ve Çerez Tercihleriniz",
    description:
      "Acarpen olarak dil tercihiniz için zorunlu yerel depolama kullanıyoruz. Onay vermeniz hâlinde yalnızca ölçümleme amacıyla Google Analytics ve ziyaret istatistikleri etkinleşir; ayrıca tercihinize göre açılan Google Haritalar ve Google Çeviri bileşenleri Google hizmetleriyle doğrudan iletişim kurabilir.",
    badge: "KVKK & GDPR Uyumlu",
    accept: "Tümünü Kabul Et",
    reject: "Yalnızca Gerekli Çerezler",
    policy: "Çerez Politikası",
    guarantee: "Onay vermeden analiz izlemesi başlatılmaz; tercih altbilgiden geri çekilebilir.",
  },
  en: {
    title: "Privacy & Cookie Preferences",
    description:
      "At Acarpen, strictly necessary storage preserves your language preference. With your consent, Google Analytics and first-party visit statistics are enabled; optional embedded Google Maps and Google Translate components communicate directly with Google when used.",
    badge: "GDPR & KVKK Compliant",
    accept: "Accept All Cookies",
    reject: "Essential Only",
    policy: "Cookie Policy",
    guarantee: "No analytics tracking runs without consent; you may withdraw anytime in the footer.",
  },
  ar: {
    title: "تفضيلات الخصوصية وملفات تعريف الارتباط",
    description:
      "في أكاربن، نستخدم التخزين الضروري لحفظ تفضيل اللغة فقط. وعند موافقتكم يتم تفعيل إحصاءات Google Analytics والزيارات؛ كما قد تتواصل خدمات خرائط Google والترجمة عند استخدامها مع خوادم Google.",
    badge: "متوافق مع GDPR و KVKK",
    accept: "قبول جميع ملفات الارتباط",
    reject: "الملفات الأساسية فقط",
    policy: "سياسة ملفات الارتباط",
    guarantee: "لا يبدأ أي تتبع تحليلي قبل الموافقة، ويمكنكم سحبها في أي وقت.",
  },
};

export const CookieConsent: React.FC = () => {
  const { currentLanguage, isRTL } = useLanguage();
  const [consentStatus, setConsentStatus] = useState<CookieConsentStatus>(() => getCookieConsent());
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeCookieConsent((status) => {
      setConsentStatus(status);
      if (status === null) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    });

    const current = getCookieConsent();
    if (current === null) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 700);
      return () => {
        clearTimeout(timer);
        unsubscribe();
      };
    } else {
      setIsVisible(false);
    }

    return () => unsubscribe();
  }, []);

  const text = COOKIE_TRANSLATIONS[currentLanguage.code] || COOKIE_TRANSLATIONS.tr;

  const handleAccept = () => {
    setIsVisible(false);
    setCookieConsent("granted");
  };

  const handleReject = () => {
    setIsVisible(false);
    setCookieConsent("denied");
  };

  if (!isVisible || consentStatus !== null) {
    return null;
  }

  return (
    <aside
      aria-label="Cookie Consent Banner"
      dir={isRTL ? "rtl" : "ltr"}
      className="fixed bottom-4 left-4 right-4 sm:left-5 sm:right-auto sm:max-w-lg z-50 animate-in fade-in slide-in-from-bottom-6 duration-300 pointer-events-auto"
    >
      <div className="bg-slate-900/95 backdrop-blur-xl text-white rounded-3xl p-5 sm:p-6 shadow-2xl border border-slate-700/60 ring-1 ring-white/10 flex flex-col gap-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-sky-500/20 text-sky-400 border border-sky-500/30 grid place-items-center shrink-0">
              <Cookie className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm font-bold text-white tracking-wide">
                  {text.title}
                </h3>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono">
                  <ShieldCheck className="h-3 w-3" />
                  {text.badge}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5 font-medium">
                Acar Pen İnşaat Sanayi ve Ticaret Ltd. Şti.
              </p>
            </div>
          </div>

          <button
            onClick={handleReject}
            aria-label="Kapat"
            className="text-slate-400 hover:text-slate-200 p-1 rounded-xl hover:bg-slate-800/80 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed font-normal">
          {text.description}
        </p>

        <div className="pt-2 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0" />
            <span>{text.guarantee}</span>
          </div>

          <div className="flex items-center gap-2 justify-end">
            <button
              type="button"
              onClick={handleReject}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/90 hover:bg-slate-800 border border-slate-700/80 transition-all active:scale-95"
            >
              {text.reject}
            </button>

            <button
              type="button"
              onClick={handleAccept}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-400 hover:to-emerald-400 shadow-md shadow-sky-500/20 transition-all active:scale-95 flex items-center gap-1.5"
            >
              <Check className="h-3.5 w-3.5" />
              <span>{text.accept}</span>
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default CookieConsent;
