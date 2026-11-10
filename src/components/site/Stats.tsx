import { useLanguage } from "@/context/LanguageContext";

export const Stats = () => {
  const { t } = useLanguage();

  const stats = [
    { value: "70 / 75 / 85", unit: "mm", label: "Fıratpen PVC Profil Sistemleri" },
    { value: "4+16+4", unit: "Isıcam", label: "Yüksek Isı & Ses Yalıtım Standardı" },
    { value: "3.500", unit: "+ Konut", label: t("statCapacity", "Tamamlanan Konut & Villa Projesi") },
    { value: "%100", unit: "Memnuniyet", label: t("statClients", "Doğrudan Üretim & Tek Muhatap") },
  ];

  return (
    <section className="relative py-16 border-y border-slate-200 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className={`relative min-w-0 ${
                i !== 0 ? "lg:pl-8 lg:border-l lg:border-slate-200" : ""
              }`}
            >
              <div className="flex items-baseline gap-1.5 flex-wrap">
                <span className="font-serif text-3xl sm:text-5xl font-extrabold text-gradient tracking-tight">
                  {s.value}
                </span>
                <span className="font-mono text-sm sm:text-lg text-sky-600 font-bold">{s.unit}</span>
              </div>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 font-semibold break-words">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
