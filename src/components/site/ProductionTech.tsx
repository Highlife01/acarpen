import { Cpu, Flame, Layers, Truck, ShieldCheck, CheckCircle2, ArrowRight, Wrench } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import productionHeroImg from "@/assets/firatpen-cnc-uretim-hatti.jpg";
import villaWindowImg from "@/assets/firatpen-selenit-pvc-pencere.jpg";

const productionPillars = [
  {
    icon: Cpu,
    title: "CNC Otomatik Profil Kesim & İşleme",
    badge: "Milimetrik Hassasiyet",
    desc: "Fıratpen Selenit 75, Redonit 85 ve Elegans profiller, bilgisayar destekli çift kafa CNC kesim makinelerinde 45° gönyesinde sıfır hata toleransı ile kesilir ve su tahliye kanalları açılır.",
  },
  {
    icon: Flame,
    title: "Galvanizli Çelik Destek Sacı & 4 Köşe Kaynak",
    badge: "Maksimum Statik Mukavemet",
    desc: "Rüzgar yüküne ve esnemeye karşı tüm ana profillerin içerisine TS EN standartlarında galvanizli çelik destek sacı vidalanır; CNC kaynak ve köşe temizleme hattında pürüzsüzce birleştirilir.",
  },
  {
    icon: Layers,
    title: "EPDM Conta, İspanyolet Donanım & Isıcam",
    badge: "Tam Sızdırmazlık",
    desc: "Çift açılım güvenlikli ispanyolet mekanizmaları, güneş ve soğukta sertleşmeyen TPE/EPDM contalar ve argon gazlı Isıcam S / K üniteleri ile maksimum ısı ve ses yalıtımı sağlanır.",
  },
  {
    icon: Wrench,
    title: "Lazer Terazi ile Yerinde Uzman Montaj",
    badge: "Adana & Çukurova Saha Ekibi",
    desc: "Üretimi ve kalite kontrolü tamamlanan doğrama ve cam balkon sistemlerimiz, kendi montaj araçlarımızla adresinize sevk edilerek lazer terazi ve tam izolasyonla monte edilir.",
  },
];

export const ProductionTech = () => {
  return (
    <section className="relative py-24 overflow-hidden bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 overflow-hidden">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-14 gap-6">
          <div className="space-y-4 max-w-2xl">
            <span className="inline-block text-xs font-mono uppercase tracking-[0.2em] text-sky-700 font-bold bg-sky-100 px-3.5 py-1.5 rounded-full border border-sky-200">
              CNC Üretim & Montaj Teknolojimiz
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 break-words">
              CNC Otomasyonlu <span className="text-gradient italic">PVC Doğrama</span> & Cam Balkon İmalatı
            </h2>
          </div>
          <p className="text-slate-600 max-w-md text-sm sm:text-base leading-relaxed font-normal">
            Adana Seyhan Gülbahçesi Mahallesi'ndeki üretim tesisimizde Fıratpen kalite standartlarına uygun CNC kesim, kaynak, donanım montajı ve kalite kontrol süreçlerini titizlikle uyguluyoruz.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-center">
          {/* Left: Production Showcase Card */}
          <div className="lg:col-span-6">
            <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-xl relative group overflow-hidden">
              <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 relative aspect-[4/3]">
                <img
                  src={productionHeroImg}
                  alt="Acarpen Fıratpen PVC Pencere ve Cam Balkon Üretim Merkezi Seyhan Adana"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/30 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white space-y-2">
                  <span className="inline-block text-[10px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-full bg-sky-500 text-slate-950 font-extrabold">
                    Gülbahçesi Mah. Seyhan / Adana
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold">
                    Acarpen — Fıratpen Yetkili Üretici Bayi İmalat Hattı
                  </h3>
                  <p className="text-xs text-slate-200">
                    Selenit 75 • Redonit 85 • Elegans • Hebeschiebe Sürme • Isıcamlı Cam Balkon
                  </p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
                {[
                  { label: "Profil Standardı", val: "TS EN 12608" },
                  { label: "Yalıtım Serisi", val: "75mm / 85mm" },
                  { label: "Destek Sacı", val: "Galvaniz Çelik" },
                  { label: "Garanti", val: "Fıratpen Güvencesi" },
                ].map((b) => (
                  <div
                    key={b.label}
                    className="rounded-xl bg-slate-50 border border-slate-200 p-2.5 text-center"
                  >
                    <div className="text-[10px] text-slate-500 uppercase font-mono font-semibold">{b.label}</div>
                    <div className="text-xs font-bold text-sky-700 mt-0.5">{b.val}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: 4 Core Production Pillars */}
          <div className="lg:col-span-6 space-y-4">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md mb-4">
              <div className="flex items-center gap-3 mb-2">
                <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0" />
                <span className="text-xs font-mono uppercase tracking-wider text-emerald-700 font-bold">
                  Acarpen Kalite & Mühendislik Standartları
                </span>
              </div>
              <h3 className="font-serif text-2xl font-bold text-slate-900 mb-2">
                Ölçüden Montaja 4 Aşamalı Kusursuz Üretim
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                Konut, villa ve toplu inşaat projelerinde yıllarca sarkma yapmayan, su ve rüzgar geçirmeyen Fıratpen doğrama ve cam balkon sistemleri üretiyoruz.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {productionPillars.map((pillar) => {
                const Icon = pillar.icon;
                return (
                  <div
                    key={pillar.title}
                    className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-sky-400 transition-all duration-300 flex flex-col justify-between shadow-sm hover:shadow-md"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <div className="h-10 w-10 rounded-xl bg-sky-50 border border-sky-200 grid place-items-center text-sky-600 shrink-0">
                          <Icon className="h-5 w-5" />
                        </div>
                        <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 font-semibold">
                          {pillar.badge}
                        </span>
                      </div>
                      <h4 className="font-serif text-base font-bold text-slate-900 mb-1.5">
                        {pillar.title}
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed font-normal">
                        {pillar.desc}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-[11px] font-bold text-emerald-700">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                      <span>TSE & Fıratpen Kalite Onaylı</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-between gap-4 bg-sky-50 rounded-2xl p-4 border border-sky-200">
              <div className="text-xs text-slate-800 font-medium">
                <strong className="text-slate-900 font-bold">Toplu Konut & Villa Projeleri:</strong> Mimari keşif ve metraj teklifi için teknik ekibimizle görüşün.
              </div>
              <Link to="/uretim-teknolojisi">
                <Button size="sm" className="rounded-full bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-sm">
                  Üretim Detayları
                  <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
