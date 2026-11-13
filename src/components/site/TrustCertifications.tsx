import { ShieldCheck, Award, CheckCircle2, FileCheck2, Sparkles } from "lucide-react";

const certs = [
  {
    code: "FIRATPEN SİSTEMLERİ",
    title: "Fıratpen Selenit 75 & Redonit 85",
    desc: "70 mm, 75 mm Selenit, 80 mm Elegance, 85 mm Redonit ve Zenia Slide Hebeschiebe serileri",
    icon: ShieldCheck,
  },
  {
    code: "WINSA SİSTEMLERİ",
    title: "Winsa Dorado 76, Safir & Revotech",
    desc: "76 mm 5 odacıklı Dorado & Safir, 84 mm 7 odacıklı Revotech ve Panorama HS sürme sistemleri",
    icon: Award,
  },
  {
    code: "PİMAPEN SİSTEMLERİ",
    title: "Pimapen Nirvana 80 & Carisma 70",
    desc: "80 mm 6 odacıklı 3 contalı Nirvana, 70 mm Carisma ve Albatros / Infinity sürme serileri",
    icon: Sparkles,
  },
  {
    code: "TS EN 12608-1 & SAC",
    title: "1.00 - 1.50 mm Galvaniz Destek Sacı",
    desc: "A sınıfı et kalınlığı, UV dayanımlı 19 lamine renk ve korozyon dirençli çelik destek sacı",
    icon: FileCheck2,
  },
  {
    code: "TSE EN 1279 ISICAM",
    title: "4+16+4 Isıcam & Renkli Konfor Cam",
    desc: "Şeffaf, Solar Low-E Konfor, Füme, Bronz ve Reflekte ısıcam üniteleri ile tam yalıtım",
    icon: CheckCircle2,
  },
];

export const TrustCertifications = () => {
  return (
    <section className="py-12 bg-[#040f26] text-white border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8 pb-6 border-b border-slate-800">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-sky-400 font-bold block mb-1">
              3 Lider Marka • Tek Üretim Merkezi • Uluslararası Kalite
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
              Fıratpen, Winsa & Pimapen Sistem Standartlarımız
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 max-w-md font-normal">
            Acarpen üretim merkezinden çıkan tüm Fıratpen, Winsa ve Pimapen PVC pencereler, kapılar, sürme sistemler ve cam balkonlar TSE ve CE normlarına tam uygundur.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {certs.map((c) => {
            const Icon = c.icon;
            return (
              <div
                key={c.code}
                className="rounded-2xl bg-slate-900/90 border border-slate-800 p-4 hover:border-sky-400 transition-all group"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10.5px] font-mono font-extrabold px-2.5 py-1 rounded-md bg-sky-500/20 text-sky-300 border border-sky-400/30">
                    {c.code}
                  </span>
                  <Icon className="h-5 w-5 text-emerald-400 group-hover:scale-110 transition-transform shrink-0" />
                </div>
                <div className="font-serif font-bold text-sm text-white mb-1">{c.title}</div>
                <div className="text-[11px] text-slate-300 leading-relaxed">{c.desc}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
