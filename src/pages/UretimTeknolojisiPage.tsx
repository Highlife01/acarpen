import { Navbar } from "@/components/site/Navbar";
import { ProductionTech } from "@/components/site/ProductionTech";
import { QualityProcessFlow } from "@/components/site/QualityProcessFlow";
import { Footer } from "@/components/site/Footer";
import { SEO } from "@/components/SEO";
import { Cpu, ShieldCheck, Layers, Flame, CheckCircle2, ArrowRight, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const machineSpecs = [
  {
    icon: Cpu,
    title: "CNC Otomatik PVC Profil Kesim Hattı",
    capacity: "70 mm / 75 mm / 85 mm Fıratpen Serileri",
    precision: "±0.1 mm Dijital Gönye Hassasiyeti",
    desc: "Selenit 75, Redonit 85, Elegance 80 ve 70'lik Fıratpen profiller bilgisayar destekli çift kafa kesim makinelerinde el değmeden 45° açı ile kesilir ve su tahliye kanalları açılır.",
  },
  {
    icon: Flame,
    title: "Galvanizli Çelik Destek Sacı & 4 Köşe Kaynak",
    capacity: "1.00 mm - 1.50 mm Korozyon Dirençli Sac",
    precision: "TS EN 12608-1 Mukavemet Standardı",
    desc: "Binanın kat yüksekliğine ve rüzgar yüküne uygun galvanizli çelik destek sacı tüm profillere vidalanır; dört köşe kaynak ve CNC köşe temizleme hattında birleştirilir.",
  },
  {
    icon: Layers,
    title: "4+16+4 Isıcam & EPDM Sızdırmazlık Donanımı",
    capacity: "Tek Açılım / Çift Açılım / Sürme Mekanizma",
    precision: "TSE EN 1279 Yalıtım Standardı",
    desc: "Siyah ve gri EPDM contalar, sağ/sol açılım ve çift açılım güvenlikli ispanyolet mekanizmaları ile 4+16+4 mm Isıcam üniteleri monte edilerek tam sızdırmazlık sağlanır.",
  },
  {
    icon: Wrench,
    title: "Cam Balkon, Panjur & Sineklik İmalat Parkuru",
    capacity: "Düz, L ve U Tipi Cam Balkon Sistemleri",
    precision: "8mm / 10mm Temperli & Isıcamlı",
    desc: "Katlanır, sürme ve Somfy motorlu giyotin cam balkon sistemleri ile poliüretan dolgulu motorlu panjur ve plise sineklikler kendi atölyemizde projenize özel üretilir.",
  },
];

export default function UretimTeknolojisiPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 pt-28 lg:pt-32">
      <SEO
        title="PVC Doğrama Üretim Teknolojimiz & Kalite Süreci | Acarpen Adana"
        description="Adana Seyhan Gülbahçesi Mah. Acarpen tesisimizde Fıratpen CNC profil kesim, çelik destek sacı, 4 köşe kaynak, 4+16+4 ısıcam ve cam balkon üretim teknolojileri."
        canonicalPath="/uretim-teknolojisi"
        keywords={[
          "adana pvc pencere üretimi",
          "fıratpen üretim bayisi adana",
          "cnc pvc köşe kaynak",
          "destek saclı pvc doğrama",
          "acarpen üretim merkezi",
        ]}
        breadcrumbs={[{ name: "Üretim & Kalite", path: "/uretim-teknolojisi" }]}
      />
      <Navbar />

      <section className="py-14 border-b border-slate-200 bg-gradient-to-b from-sky-50 via-white to-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <span className="inline-block text-xs font-mono uppercase tracking-[0.2em] text-sky-700 font-bold bg-sky-100/80 px-3.5 py-1.5 rounded-full border border-sky-200 mb-3">
            CNC Doğrama Otomasyonu & Kalite Standartlarımız
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl font-bold text-slate-900 max-w-4xl">
            Fıratpen Kalitesiyle <span className="text-gradient italic">Modern Üretim</span>
          </h1>
          <p className="mt-4 text-slate-600 max-w-2xl text-base sm:text-lg font-normal">
            Gülbahçesi Mah. 13428 Sok. No:16/17 Seyhan / Adana adresindeki üretim merkezimizde yüksek yalıtımlı PVC pencere, kapı, sürme sistem ve cam balkon imalatı gerçekleştiriyoruz.
          </p>
        </div>
      </section>

      <ProductionTech />

      <section className="py-20 max-w-7xl mx-auto px-6">
        <div className="max-w-3xl mb-12 space-y-3">
          <span className="text-xs font-mono uppercase tracking-[0.2em] text-sky-700 font-bold">
            İmalat Hattımız & Teknik Donanım
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900">
            4 Ana Üretim İstasyonumuz
          </h2>
          <p className="text-slate-600 text-sm sm:text-base font-normal">
            Hem standart hazır ölçülerde hem de B2B şantiye ve özel konut projelerinde standartlara tam uyumlu üretim altyapımız:
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {machineSpecs.map((m) => {
            const Icon = m.icon;
            return (
              <div
                key={m.title}
                className="bg-white rounded-3xl p-7 border border-slate-200 hover:border-sky-400 transition-all space-y-4 shadow-md"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-sky-50 border border-sky-200 grid place-items-center text-sky-600 shrink-0">
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="text-xs font-mono px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                    {m.precision}
                  </span>
                </div>

                <div>
                  <h3 className="font-serif text-2xl font-bold text-slate-900 mb-1">{m.title}</h3>
                  <div className="text-xs font-mono text-sky-700 font-semibold mb-3">{m.capacity}</div>
                  <p className="text-sm text-slate-600 leading-relaxed font-normal">{m.desc}</p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-600 font-semibold">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>TS EN 12608-1 & Fıratpen Üretici Bayi Kalite Kontrolü</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 bg-white rounded-3xl p-8 border border-slate-200 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <ShieldCheck className="h-10 w-10 text-sky-600 shrink-0 mt-1" />
            <div>
              <h3 className="font-serif text-2xl font-bold text-slate-900">
                Müteahhit, Bayi ve Şantiyeler İçin Toplu Sipariş & Düzenli Tedarik
              </h3>
              <p className="text-sm text-slate-600 mt-1 max-w-2xl font-normal">
                Konut projeleriniz ve şantiyeleriniz için ölçü listelerinizi gönderin; kat bazlı paketleme, termin ve montaj planlamasıyla teklif hazırlayalım.
              </p>
            </div>
          </div>
          <Link to="/hesaplama" className="shrink-0">
            <Button size="lg" className="rounded-full bg-sky-600 hover:bg-sky-700 text-white font-bold shadow-md">
              Ölçü Listesi Oluştur & Teklif Al
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      <QualityProcessFlow />
      <Footer />
    </main>
  );
}
