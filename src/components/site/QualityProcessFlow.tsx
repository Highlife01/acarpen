import { ClipboardCheck, Scissors, Sparkles, Flame, Layers, Truck } from "lucide-react";

const steps = [
  {
    step: "01",
    icon: ClipboardCheck,
    title: "Lazer Keşif & Ölçü Seçimi",
    desc: "Standart hazır ölçüler veya yerinde ücretsiz lazer ölçüm ile renk (Beyaz/Antrasit/Altınmeşe), açılım yönü (Sağ/Sol) ve aksesuar (Tek/Çift açılım) belirlenir.",
  },
  {
    step: "02",
    icon: Scissors,
    title: "CNC Profil & Destek Sacı Kesimi",
    desc: "70'lik ve 75'lik Fıratpen profiller (2.5mm - 3.0mm et kalınlığı) ve 1.00mm - 1.50mm galvanizli çelik destek sacları CNC makinelerde milimetrik kesilir.",
  },
  {
    step: "03",
    icon: Flame,
    title: "4 Köşe CNC Kaynak & Temizleme",
    desc: "Çelik destek sacı vidalanan profiller, otomatik dört köşe kaynak makinesinde birleştirilir ve CNC köşe temizleme hattında pürüzsüzleştirilir.",
  },
  {
    step: "04",
    icon: Sparkles,
    title: "EPDM Conta & İspanyolet Aksesuar",
    desc: "Siyah/gri EPDM sızdırmazlık contaları çekilir; tek açılım, çift açılım, vasistas veya sürme ispanyolet mekanizmaları ve pencere kolları monte edilir.",
  },
  {
    step: "05",
    icon: Layers,
    title: "4+16+4 Isıcam & Kalite Kontrol",
    desc: "Yüksek ısı ve ses yalıtımlı 4+16+4 mm Isıcam üniteleri takozlanarak yerleştirilir, kanat gönye ve açma-kapama testleri yapılır.",
  },
  {
    step: "06",
    icon: Truck,
    title: "Sevkiyat, PU Köpük & Mastik Montaj",
    desc: "Gülbahçesi Mah. Seyhan / Adana merkezimizden şantiyenize veya evinize sevk edilerek PU köpük, silikon ve izolasyon mastikleriyle kusursuzca monte edilir.",
  },
];

export const QualityProcessFlow = () => {
  return (
    <section className="py-24 bg-slate-50 border-b border-slate-200 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="inline-block text-xs font-mono uppercase tracking-[0.2em] text-sky-700 font-bold bg-sky-100/80 px-3.5 py-1.5 rounded-full border border-sky-200">
            // 6 Aşamalı Acarpen Üretim & Montaj Süreci
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-slate-900">
            Ölçüden Montaja <span className="text-gradient italic">Kusursuz İşAkışı</span>
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-normal">
            Ürettiğimiz her PVC pencere, balkon kapısı, sürme sistem ve cam balkon; TS EN 12608-1 profil ve TSE EN 1279 ısıcam standartlarına uygun olarak 6 aşamalı kalite kontrol sürecinden geçer.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-5 relative">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-3xl p-6 border border-slate-200 hover:border-sky-400 transition-all duration-300 flex flex-col justify-between relative group shadow-sm hover:shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-sky-50 text-sky-700 border border-sky-200">
                      ADIM {item.step}
                    </span>
                    <div className="h-10 w-10 rounded-xl bg-slate-100 border border-slate-200 grid place-items-center text-sky-600 group-hover:bg-sky-600 group-hover:text-white transition-colors">
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>
                  <h3 className="font-serif text-lg font-bold text-slate-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] font-mono text-emerald-700 font-bold">
                  <span>KALİTE KONTROL</span>
                  <span>%100 ONAY</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
