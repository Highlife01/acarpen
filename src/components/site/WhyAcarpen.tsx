import { ShieldCheck, Cpu, Truck, Wrench, Award, Headphones, CheckCircle2 } from "lucide-react";

const reasons = [
  {
    icon: ShieldCheck,
    title: "Fıratpen Resmi Yetkili Üretici Bayi",
    desc: "Selenit 75, Redonit 85 ve Elegans serisi A sınıfı et kalınlığına sahip orijinal Fıratpen profiller, çelik destek sacı ve EPDM contalarla uzun ömürlü üretim yapıyoruz.",
    highlight: "Orijinal Fıratpen Garantisi",
  },
  {
    icon: Cpu,
    title: "CNC Otomasyonlu Köşe Kaynak & İmalat",
    desc: "Milimetrik CNC profil kesim, otomatik dört köşe kaynak ve CNC köşe temizleme makinelerimizle gönyesinde, su ve rüzgar sızdırmaz doğramalar üretiyoruz.",
    highlight: "0.1 mm Kesim & Kaynak Hassasiyeti",
  },
  {
    icon: Award,
    title: "Isıcam Konfor & Maksimum Yalıtım",
    desc: "Adana'nın sıcak yaz iklimine uygun Solar Low-E (Isıcam K) ve argon gazlı çift/üçlü cam üniteleriyle klima ve doğalgaz faturalarınızda %50'ye varan tasarruf sağlıyoruz.",
    highlight: "%50'ye Varan Enerji Tasarrufu",
  },
  {
    icon: Wrench,
    title: "Ücretsiz Lazer Keşif & Uzman Montaj",
    desc: "Kendi bünyemizdeki kadrolu montaj ustalarımızla lazer terazi kullanarak poliüretan köpük, silikon ve dış cephe mastik izolasyonlu kusursuz montaj gerçekleştiriyoruz.",
    highlight: "Temiz & Zamanında Teslimat",
  },
  {
    icon: Truck,
    title: "Adana Merkezden Tüm Çukurova'ya Hizmet",
    desc: "Gülbahçesi Mah. Seyhan / Adana'daki üretim ve showroom merkezimizden Seyhan, Çukurova, Yüreğir, Sarıçam ve çevre illere kendi araçlarımızla hızlı sevkiyat yapıyoruz.",
    highlight: "Gülbahçesi Mah. Seyhan / Adana",
  },
  {
    icon: Headphones,
    title: "Satış Sonrası Teknik Servis & Destek",
    desc: "Montaj sonrasında da yanınızdayız! Kanat ayarı, ispanyolet mekanizma bakımı, fitil değişimi ve sineklik/panjur servis ihtiyaçlarınızda hızlı teknik destek sunuyoruz.",
    highlight: "Kesintisiz Satış Sonrası Güvence",
  },
];

export const WhyAcarpen = () => {
  return (
    <section className="relative py-24 overflow-hidden bg-white border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-14 gap-6">
          <div className="space-y-4 max-w-2xl">
            <span className="inline-block text-xs font-mono uppercase tracking-[0.2em] text-sky-700 font-bold bg-sky-50 px-3.5 py-1.5 rounded-full border border-sky-200">
              // Neden Acarpen & Fıratpen?
            </span>
            <h2 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-slate-900">
              Adana'da <span className="text-gradient italic">Acarpen'i</span> Tercih Etmeniz İçin 6 Güçlü Neden
            </h2>
          </div>
          <p className="text-slate-600 max-w-md text-sm sm:text-base leading-relaxed font-normal">
            Yalnızca pencere veya cam balkon satmıyoruz; Fıratpen'in mühendislik gücünü Acarpen'in titiz imalat ve montaj ustalığıyla birleştirerek evinize değer katıyoruz.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reasons.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-slate-50 rounded-3xl p-7 border border-slate-200 hover:border-sky-400 hover:bg-white transition-all duration-300 group flex flex-col justify-between shadow-sm hover:shadow-xl"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="h-12 w-12 rounded-2xl bg-sky-100 border border-sky-200 grid place-items-center text-sky-700 group-hover:bg-sky-600 group-hover:text-white transition-colors">
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-400">0{idx + 1}</span>
                  </div>

                  <h3 className="font-serif text-xl font-bold text-slate-900 mb-2.5 group-hover:text-sky-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-5 font-normal">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-200/80 flex items-center gap-2 text-xs font-bold text-emerald-700">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                  <span>{item.highlight}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
