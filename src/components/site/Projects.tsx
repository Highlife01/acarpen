import { MapPin, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import projectPlaza from "@/assets/proje-cukurova-konut-pvc.jpg";
import projectVilla from "@/assets/proje-seyhan-cam-balkon.jpg";
import projectTech from "@/assets/proje-villa-altinmese-panjur.jpg";

export const projectsData = [
  {
    slug: "mersin-tower-plaza",
    image: projectPlaza,
    title: "Çukurova Prestij Konutları — Toplu PVC Doğrama",
    location: "Çukurova, Adana",
    category: "Fıratpen Selenit 75 & Balkon Kapıları",
    area: "140 Daire",
    year: "2025",
    spec: "75mm Antrasit Gri PVC + 4+16+4 Isıcam K",
    summary:
      "140 dairelik konut projesinde tüm salon, oda pencereleri ve 85×210 cm balkon kapıları Fıratpen Selenit 75 Antrasit Gri seri ve 4+16+4 Isıcam Konfor ile tamamlanmıştır.",
    challenge:
      "Adana'nın yüksek yaz sıcaklarında klima yükünü azaltmak ve şantiye termin planına uygun düzenli sevkiyat sağlamak.",
    solution:
      "1.5 mm galvanizli çelik destek saclı Fıratpen profiller, çift açılım ispanyolet aksesuarları ve Solar Low-E Isıcam ile kat bazlı paketli teslimat ve montaj yapıldı.",
    metrics: [
      { label: "Toplam Kapsam", val: "140 Daire / 980 Doğrama" },
      { label: "Profil Serisi", val: "Fıratpen Selenit 75 (Antrasit)" },
      { label: "Isı Yalıtımı (Uw)", val: "1.1 W/m²K (4+16+4 Isıcam)" },
      { label: "Montaj & İzolasyon", val: "PU Köpük + Dış Cephe Mastik" },
    ],
  },
  {
    slug: "seyhan-modern-rezidans",
    image: projectVilla,
    title: "Seyhan Panorama Evleri — Düz & L Cam Balkon",
    location: "Seyhan, Adana",
    category: "Katlanır & Sürme Cam Balkon",
    area: "85 Daire",
    year: "2025",
    spec: "10 mm Füme Temperli L Tipi Cam Balkon",
    summary:
      "Seyhan'daki 85 dairelik rezidans projesinin L tipi köşe balkonları, 10 mm füme temperli katlanır cam balkon ve alüminyum damlalıklı profil sistemiyle kapatılmıştır.",
    challenge:
      "Yüksek katlarda rüzgar yüküne ve yağmur sızıntısına karşı tam koruma sağlamak.",
    solution:
      "Çift rulmanlı paslanmaz tekerlekler, köşe dönüş profilleri ve UV dayanımlı şeffaf/alüminyum fitillerle dört mevsim sızdırmaz yaşam alanı oluşturuldu.",
    metrics: [
      { label: "Uygulama Tipi", val: "L Tipi & Düz Katlanır Cam Balkon" },
      { label: "Cam Kalınlığı", val: "10 mm Füme Temperli" },
      { label: "Profil Rengi", val: "Antrasit Gri Alüminyum Kasa" },
      { label: "Teslim Süresi", val: "25 İş Günü" },
    ],
  },
  {
    slug: "cukurova-panoramik-villa",
    image: projectTech,
    title: "Göl Mahallesi Lüks Villa — Sürme & Motorlu Panjur",
    location: "Çukurova, Adana",
    category: "Hebeschiebe Sürme & Somfy Panjur",
    area: "12 Müstakil Villa",
    year: "2026",
    spec: "Altınmeşe PVC Sürme + Motorlu Panjur + Plise Sineklik",
    summary:
      "Müstakil villa projesinde bahçe ve havuz terası geçişleri için Fıratpen Hebeschiebe sürme sistemler, uzaktan kumandalı motorlu panjur ve plise sineklikler uygulandı.",
    challenge:
      "Geniş teras açıklıklarında kesintisiz manzara sağlarken güneş kontrolü ve haşere korumasını tek sistemde çözmek.",
    solution:
      "Altınmeşe lamine Fıratpen sürme doğramalar, poliüretan dolgulu motorlu alüminyum panjur ve akordiyon plise sinekliklerle anahtar teslim montaj yapıldı.",
    metrics: [
      { label: "Proje Kapsamı", val: "12 Villa Tam Doğrama Paketi" },
      { label: "Sürme Sistemi", val: "Fıratpen Hebeschiebe & Çift Kanat" },
      { label: "Panjur Otomasyonu", val: "Somfy Uzaktan Kumandalı" },
      { label: "Renk Seçimi", val: "Altınmeşe (Golden Oak) Lamine" },
    ],
  },
];

export const Projects = () => {
  return (
    <section id="projeler" className="relative py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div className="space-y-4 max-w-2xl">
            <span className="inline-block text-xs font-mono uppercase tracking-[0.2em] text-sky-700 font-bold bg-sky-100/80 px-3.5 py-1.5 rounded-full border border-sky-200">
              Seçkin Referanslar & Uygulamalar
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 break-words">
              İmza Attığımız <span className="text-gradient italic">Örnek Projeler</span>
            </h2>
          </div>
          <div className="space-y-3 max-w-md">
            <p className="text-slate-600 text-sm sm:text-base font-normal">
              Adana ve Çukurova genelinde toplu konut şantiyeleri, müstakil villalar ve daire yenileme projelerinde Acarpen kalitesiyle tamamlanan uygulamalarımız.
            </p>
            <Link to="/projeler" className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-600 hover:text-sky-700">
              Tüm Referans Projeleri İncele <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-7">
          {projectsData.map((p) => (
            <Link
              to={`/projeler/${p.slug}`}
              key={p.slug}
              className="group relative rounded-3xl overflow-hidden border border-slate-200 hover:border-sky-400 bg-white flex flex-col justify-between transition-all duration-500 hover:-translate-y-1.5 shadow-md hover:shadow-xl"
            >
              <div>
                <div className="aspect-[4/3] overflow-hidden relative bg-slate-100">
                  <img
                    src={p.image}
                    alt={p.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/75 via-slate-900/20 to-transparent" />
                  <span className="absolute top-4 left-4 text-xs font-mono uppercase tracking-wider px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-sky-700 border border-slate-200 font-bold shadow-sm">
                    {p.category}
                  </span>
                  <span className="absolute top-4 right-4 text-xs font-mono px-2.5 py-1 rounded-full bg-slate-900/85 text-white border border-white/20 font-semibold">
                    {p.area}
                  </span>
                </div>

                <div className="p-6 sm:p-7">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-2 font-medium">
                    <MapPin className="h-3.5 w-3.5 text-sky-600" />
                    <span>{p.location}</span>
                    <span className="mx-1">•</span>
                    <span>{p.year}</span>
                  </div>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-slate-900 mb-2.5 group-hover:text-sky-600 transition-colors">
                    {p.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4 line-clamp-3 font-normal">
                    {p.summary}
                  </p>
                </div>
              </div>

              <div className="px-6 sm:px-7 pb-6 pt-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/70">
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-700 font-bold">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span className="truncate max-w-[210px]">{p.spec}</span>
                </div>
                <div className="h-9 w-9 rounded-full bg-sky-50 border border-sky-200 grid place-items-center text-sky-600 group-hover:bg-sky-600 group-hover:text-white transition-all shrink-0">
                  <ArrowUpRight className="h-4 w-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link to="/projeler">
            <Button variant="outline" className="rounded-full border-sky-300 bg-sky-50 text-sky-700 hover:bg-sky-100 px-7 font-bold">
              Proje Detayları ve Uygulama Örneklerini Gör
              <ArrowUpRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
