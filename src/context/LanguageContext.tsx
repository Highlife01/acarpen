import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import {
  LANGUAGES,
  LanguageInfo,
  DEFAULT_LANGUAGE,
  SupportedLanguageCode,
  isSupportedLanguage,
} from "../i18n/languages";
import { TRANSLATIONS, TranslationKeys } from "../i18n/translations";

interface LanguageContextType {
  currentLanguage: LanguageInfo;
  setLanguage: (code: string) => void;
  languages: LanguageInfo[];
  t: (key: keyof TranslationKeys, fallback?: string) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = "acarpen_preferred_lang";

function getInitialLanguage(): SupportedLanguageCode {
  try {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const urlLang = params.get("lang")?.toLowerCase();
      if (isSupportedLanguage(urlLang)) {
        localStorage.setItem(STORAGE_KEY, urlLang);
        return urlLang;
      }
    }
    const saved = localStorage.getItem(STORAGE_KEY)?.toLowerCase();
    if (isSupportedLanguage(saved)) {
      return saved;
    }
    localStorage.setItem(STORAGE_KEY, DEFAULT_LANGUAGE);
    return DEFAULT_LANGUAGE;
  } catch {
    return DEFAULT_LANGUAGE;
  }
}

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentCode, setCurrentCode] = useState<SupportedLanguageCode>(getInitialLanguage);

  const currentLanguage =
    LANGUAGES.find((l) => l.code === currentCode) || LANGUAGES[0];
  const isRTL = currentLanguage.dir === "rtl";

  const triggerLiveTranslate = (targetLang: SupportedLanguageCode) => {
    try {
      if (typeof window === "undefined") return;

      document.cookie = `googtrans=/tr/${targetLang}; path=/; domain=${window.location.hostname}`;
      document.cookie = `googtrans=/tr/${targetLang}; path=/;`;

      const selectEl = document.querySelector(".goog-te-combo") as HTMLSelectElement | null;
      if (selectEl) {
        selectEl.value = targetLang;
        selectEl.dispatchEvent(new Event("change"));
      } else if (targetLang !== "tr") {
        if (!document.getElementById("google-translate-script")) {
          const s = document.createElement("script");
          s.id = "google-translate-script";
          s.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
          s.async = true;
          document.body.appendChild(s);

          (window as any).googleTranslateElementInit = () => {
            try {
              new (window as any).google.translate.TranslateElement(
                {
                  pageLanguage: "tr",
                  includedLanguages: "tr,en,ar",
                  autoDisplay: false,
                },
                "google_translate_element"
              );
              setTimeout(() => {
                const el = document.querySelector(".goog-te-combo") as HTMLSelectElement | null;
                if (el) {
                  el.value = targetLang;
                  el.dispatchEvent(new Event("change"));
                }
              }, 300);
            } catch {
              // ignore
            }
          };
        }
      }
    } catch (e) {
      console.warn("Translation bridge notice:", e);
    }
  };

  const syncUrlLangParam = (code: SupportedLanguageCode) => {
    try {
      if (typeof window === "undefined" || !window.history?.replaceState) return;
      const url = new URL(window.location.href);
      if (code === "tr") {
        url.searchParams.delete("lang");
      } else {
        url.searchParams.set("lang", code);
      }
      const nextUrl = `${url.pathname}${url.search}${url.hash}`;
      const currentUrl = `${window.location.pathname}${window.location.search}${window.location.hash}`;
      if (nextUrl !== currentUrl) {
        window.history.replaceState(null, "", nextUrl);
      }
    } catch {
      // ignore
    }
  };

  const setLanguage = (code: string) => {
    const normalized = code.toLowerCase();
    if (!isSupportedLanguage(normalized)) return;
    setCurrentCode(normalized);
    try {
      localStorage.setItem(STORAGE_KEY, normalized);
    } catch {
      // ignore
    }
    syncUrlLangParam(normalized);
    triggerLiveTranslate(normalized);
  };

  useEffect(() => {
    try {
      document.documentElement.lang = currentLanguage.code;
      document.documentElement.dir = currentLanguage.dir;

      if (currentCode !== "tr") {
        triggerLiveTranslate(currentCode);
      }
    } catch {
      // ignore
    }
  }, [currentCode, currentLanguage]);

  const t = (key: keyof TranslationKeys, fallback?: string): string => {
    const langDict = TRANSLATIONS[currentCode];
    if (langDict && langDict[key]) {
      return langDict[key] as string;
    }
    const defaultDict = TRANSLATIONS[DEFAULT_LANGUAGE];
    if (defaultDict && defaultDict[key]) {
      return defaultDict[key] as string;
    }
    return fallback || (key as string);
  };

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage,
        setLanguage,
        languages: LANGUAGES,
        t,
        isRTL,
      }}
    >
      <div id="google_translate_element" style={{ display: "none" }} aria-hidden="true" />
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

export default LanguageContext;
