import React, { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Globe, Check } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export const LanguageSelector = () => {
  const { currentLanguage, setLanguage, languages, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (code: string) => {
    setLanguage(code);
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Dil Seçimi / Select Language (TR, EN, AR)"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200 hover:border-sky-300 text-xs font-bold text-slate-800 transition-all hover:scale-105 shadow-sm group"
      >
        <span className="text-sm leading-none">{currentLanguage.flag}</span>
        <span className="uppercase tracking-wider font-bold text-[11px] text-sky-700">
          {currentLanguage.code}
        </span>
        <Globe className="h-3.5 w-3.5 text-slate-400 group-hover:text-sky-600 group-hover:rotate-45 transition-all" />
      </button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md bg-white border border-slate-200 text-slate-900 p-6 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
          <DialogHeader className="flex flex-row items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-sky-600 text-white shadow-sm">
                <Globe className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-lg font-serif font-bold text-slate-900">
                  {t("selectLanguage", "Dil Seçimi")} / TR · EN · AR
                </DialogTitle>
                <p className="text-[11px] text-slate-500">
                  Türkçe, English ve العربية (Arapça) dil seçeneği
                </p>
              </div>
            </div>
          </DialogHeader>

          <div className="grid grid-cols-1 gap-2.5 py-3">
            {languages.map((lang) => {
              const isSelected = currentLanguage.code === lang.code;
              return (
                <button
                  key={lang.code}
                  onClick={() => handleSelect(lang.code)}
                  className={`flex items-center justify-between p-3.5 rounded-2xl border text-left transition-all group ${
                    isSelected
                      ? "bg-sky-50 border-sky-500 shadow-sm"
                      : "bg-slate-50 border-slate-200 hover:border-sky-300 hover:bg-white hover:shadow-sm"
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <span className="text-2xl shrink-0 group-hover:scale-110 transition-transform">
                      {lang.flag}
                    </span>
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-slate-900 truncate group-hover:text-sky-700 transition-colors">
                        {lang.nativeName}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate">
                        {lang.name}{" "}
                        <span className="uppercase text-[10px] text-sky-700 font-mono font-bold">
                          ({lang.code.toUpperCase()})
                        </span>
                      </div>
                    </div>
                  </div>

                  {isSelected ? (
                    <div className="h-6 w-6 rounded-full bg-sky-600 text-white grid place-items-center shrink-0 shadow-sm">
                      <Check className="h-3.5 w-3.5 stroke-[3]" />
                    </div>
                  ) : (
                    <span className="text-[10px] uppercase font-mono font-bold text-slate-400 group-hover:text-sky-600 transition-colors">
                      Seç / Select
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center gap-1.5 text-sky-700 font-semibold">
              <span className="h-2 w-2 rounded-full bg-sky-500 animate-ping inline-block" />
              Türkçe · English · العربية
            </span>
            <span className="text-slate-400">Acarpen — Fıratpen Yetkili Bayi</span>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LanguageSelector;
