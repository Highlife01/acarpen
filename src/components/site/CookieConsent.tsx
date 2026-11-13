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
      "Acarpen (Acar Pen İnşaat San. ve Tic. Ltd. Şti.) olarak sitemizdeki deneyiminizi geliştirmek, PVC doğrama ve cam balkon teklif robotumuzun hatasız çalışmasını sağlamak ve ziyaretçi istatistiklerini anonim olarak analiz etmek amacıyla KVKK ve GDPR standartlarına uygun birinci taraf çerezler kullanıyoruz.",
    badge: "KVKK & GDPR Uyumlu",
    accept: "Tümünü Kabul Et",
    reject: "Yalnızca Gerekli Çerezler",
    policy: "Çerez Politikası",
    guarantee: "Kişisel verileriniz asla 3. taraflarla paylaşılmaz.",
  },
  en: {
    title: "Privacy & Cookie Preferences",
    description:
      "At Acarpen (Authorized Fıratpen Producer & Dealer), we use GDPR-compliant first-party cookies to optimize your browsing experience, ensure our PVC window & glass balcony quotation calculator operates accurately, and evaluate anonymous traffic statistics.",
    badge: "GDPR & KVKK Compliant",
    accept: "Accept All Cookies",
    reject: "Essential Only",
    policy: "Cookie Policy",
    guarantee: "Your personal data is never sold or shared with third parties.",
  },
  ar: {
    title: "تفضيلات الخصوصية وملفات تعريف الارتباط",
    description:
      "في شركة أكاربن (وكيل ومصنع معتمد لـ Fıratpen)، نستخدم ملفات تعريف الارتباط من الطرف الأول المتوافقة مع معايير GDPR وKVKK لتحسين تجربتكم وضمان دقة روبوت حساب أسعار النوافذ والواجهات الزجاجية وتحليل الإحصاءات بسرية تامة.",
    badge: "متوافق مع GDPR و KVKK",
    accept: "قبول جميع ملفات الارتباط",
    reject: "الملفات الأساسية فقط",
    policy: "سياسة ملفات الارتباط",
    guarantee: "بياناتكم الشخصية محمية ولا يتم مشاركتها مع أطراف خارجية.",
  },
};

export const CookieConsent: React.FC = () => {
  const { currentLanguage, isRTL } = useLanguage();
  const [consentStatus, setConsentStatus] = useState<CookieConsentStatus>(() => getCookieConsent());
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeCookieConsent((status) => {
      setConsentStatus(status);
      if (status !== null) {
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
