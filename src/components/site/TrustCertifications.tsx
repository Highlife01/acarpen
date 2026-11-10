import { ShieldCheck, Award, CheckCircle2, FileCheck2, Sparkles } from "lucide-react";

const certs = [
  {
    code: "FIRATPEN YETKİLİ BAYİ",
    title: "Fıratpen Resmi Üretici Bayi",
    desc: "Orijinal Fıratpen 70'lik, 75'lik Selenit ve 85'lik Redonit PVC profil sistemleri",
    icon: ShieldCheck,
  },
  {
    code: "TS EN 12608-1",
    title: "PVC-U Profil Kalite Standardı",
    desc: "Kurşunsuz hammadde, 2.5mm - 3.0mm profil et kalınlığı ve UV dayanımı",
    icon: Award,
  },
  {
    code: "TSE EN 1279",
    title: "4+16+4 Isıcam Garantisi",
    desc: "Yüksek ısı ve ses yalıtımlı çift cam, Isıcam S ve Isıcam K konfor üniteleri",
    icon: CheckCircle2,
  },
  {
    code: "1.00 - 1.50 MM SAC",
    title: "Galvanizli Çelik Destek Sacı",
    desc: "Rüzgar yüküne ve esnemeye karşı tüm doğramalarda korozyon dirençli destek sacı",
    icon: FileCheck2,
  },
  {
    code: "EPDM & ÇİFT AÇILIM",
    title: "Tam Sızdırmazlık & Aksesuar",
    desc: "EPDM contalı sızdırmazlık, Sağ/Sol ve Tek/Çift açılım ispanyolet donanımı",
    icon: Sparkles,
  },
];

export const TrustCertifications = () => {
  return (
    <section className="py-12 bg-slate-900 text-white border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8 pb-6 border-b border-slate-800">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-sky-400 font-bold block mb-1">
              // Kalite, Dayanım & Yalıtım Güvencesi
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
              Fıratpen Standartları & Teknik Donanım Belgelerimiz
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 max-w-md font-normal">
            Acarpen üretim merkezinden çıkan tüm PVC pencere, balkon kapısı, sürme sistem ve cam balkonlar ulusal ve uluslararası kalite normlarına uygundur.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {certs.map((c) => {
            const Icon = c.icon;
            return (
              <div
                key={c.code}
                className="rounded-2xl bg-slate-800/90 border border-slate-700 p-4 hover:border-sky-400 transition-all group"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-mono font-extrabold px-2.5 py-1 rounded-md bg-sky-500/20 text-sky-300 border border-sky-400/30">
                    {c.code}
                  </span>
                  <Icon className="h-5 w-5 text-emerald-400 group-hover:scale-110 transition-transform" />
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
