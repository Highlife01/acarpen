export type SupportedLanguageCode = "tr" | "en" | "ar";

export interface LanguageInfo {
  code: SupportedLanguageCode;
  name: string;
  nativeName: string;
  flag: string;
  dir: "ltr" | "rtl";
  locale: "tr_TR" | "en_US" | "ar_SA";
  region: "Türkiye" | "Global" | "Middle East";
}

export const SUPPORTED_LANG_CODES: readonly SupportedLanguageCode[] = ["tr", "en", "ar"] as const;

export const LANGUAGES: LanguageInfo[] = [
  {
    code: "tr",
    name: "Turkish",
    nativeName: "Türkçe",
    flag: "🇹🇷",
    dir: "ltr",
    locale: "tr_TR",
    region: "Türkiye",
  },
  {
    code: "en",
    name: "English",
    nativeName: "English",
    flag: "🇬🇧",
    dir: "ltr",
    locale: "en_US",
    region: "Global",
  },
  {
    code: "ar",
    name: "Arabic",
    nativeName: "العربية",
    flag: "🇸🇦",
    dir: "rtl",
    locale: "ar_SA",
    region: "Middle East",
  },
];

export const DEFAULT_LANGUAGE: SupportedLanguageCode = "tr";

export function isSupportedLanguage(code: string | null | undefined): code is SupportedLanguageCode {
  return code === "tr" || code === "en" || code === "ar";
}
