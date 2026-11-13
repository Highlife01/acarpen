import { useParams, Link } from "react-router-dom";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { projectsData } from "@/components/site/Projects";
import {
  MapPin,
  Calendar,
  ArrowLeft,
  CheckCircle2,
  FileDown,
  Calculator,
  Building2,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const project = projectsData.find((p) => p.slug === slug) || projectsData[0];

  const handleDownloadSpec = () => {
    const specContent = `====================================================================
ACARPEN — FIRATPEN YETKİLİ ÜRETİCİ BAYİ MİMARİ PROJE ŞARTNAMESİ
ACAR PEN İNŞAAT SANAYİ VE TİCARET LİMİTED ŞİRKETİ
====================================================================
Proje Adı        : ${project.title}
Konum            : ${project.location}
Teslim Yılı      : ${project.year}
Kategori         : ${project.category}
Kapsam           : ${project.area}
Teknik Reçete    : ${project.spec}
--------------------------------------------------------------------
1. PROJE ÖZETİ:
${project.summary}

2. MİMARİ İHTİYAÇ & ZORLUK:
${project.challenge}

3. ACARPEN MÜHENDİSLİK ÇÖZÜMÜ:
${project.solution}

4. PERFORMANS METRİKLERİ:
${project.metrics.map((m) => `- ${m.label}: ${m.val}`).join("\n")}

--------------------------------------------------------------------
Merkez & Showroom: Gülbahçesi Mah. 13428 Sok. No:16/17 Seyhan / ADANA
Telefon & WhatsApp: 0533 625 36 11 | Web: https://www.acarpen.com.tr
====================================================================`;

    const blob = new Blob([specContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${project.slug}-teknik-sartname.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(`${project.title} teknik şartnamesi indirildi!`);
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 pt-28 lg:pt-32">
      <SEO
        title={`${project.title} (${project.location}) | Acarpen Referans Projeler`}
        description={project.summary}
        canonicalPath={`/projeler/${project.slug}`}
        breadcrumbs={[
          { name: "Referans Projeler", path: "/projeler" },
          { name: project.title, path: `/projeler/${project.slug}` },
        ]}
      />
      <Navbar />

      <section className="py-12 max-w-7xl mx-auto px-6">
        <Link
          to="/projeler"
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-sky-700 hover:text-sky-800 mb-6 font-bold"
        >
          <ArrowLeft className="h-4 w-4" />
          Tüm Referans Projelere Dön
        </Link>

        <div className="grid lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-7 space-y-6">
            <div className="rounded-3xl overflow-hidden border border-slate-200 shadow-xl relative aspect-[16/10] bg-slate-100">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 flex flex-wrap items-center justify-between gap-3">
                <span className="px-3.5 py-1.5 rounded-full bg-white/95 text-sky-800 border border-slate-200 text-xs font-mono font-bold shadow-sm">
                  {project.category}
                </span>
                <span className="px-3.5 py-1.5 rounded-full bg-slate-900/85 text-white border border-white/20 text-xs font-mono font-bold">
                  {project.spec}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {project.metrics.map((m) => (
                <div key={m.label} className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
                  <div className="text-[10px] font-mono uppercase text-slate-500 font-semibold">{m.label}</div>
                  <div className="text-sm font-bold text-slate-900 mt-1">{m.val}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 bg-white rounded-3xl p-7 sm:p-9 border border-slate-200 shadow-lg space-y-6">
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 font-medium">
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-sky-600" />
                {project.location}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-sky-600" />
                Teslim: {project.year}
              </span>
              <span className="flex items-center gap-1.5">
                <Building2 className="h-4 w-4 text-emerald-600" />
                {project.area}
              </span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 leading-tight">
              {project.title}
            </h1>

            <p className="text-sm text-slate-600 leading-relaxed font-normal">{project.summary}</p>

            <div className="space-y-4 pt-2 border-t border-slate-100">
              <div>
                <h3 className="text-xs font-mono uppercase tracking-wider text-sky-700 font-bold mb-1">
                  Mimari İhtiyaç & Beklenti
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  {project.challenge}
                </p>
              </div>
              <div>
                <h3 className="text-xs font-mono uppercase tracking-wider text-emerald-700 font-bold mb-1">
                  Acarpen & Fıratpen Çözümü
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  {project.solution}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-3">
              <div className="flex items-center gap-2 text-xs text-emerald-700 font-bold">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span>TS EN 12608-1 Fıratpen Profil & 4+16+4 Isıcam Garantili</span>
              </div>

              <div className="grid sm:grid-cols-2 gap-3 pt-2">
                <Link to="/hesaplama" className="w-full">
                  <Button className="w-full rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs h-11 shadow-md">
                    <Calculator className="mr-1.5 h-4 w-4" />
                    Benzer Proje Fiyatla
                  </Button>
                </Link>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleDownloadSpec}
                  className="w-full rounded-xl border-slate-300 bg-slate-50 text-slate-800 hover:bg-slate-100 text-xs font-bold h-11"
                >
                  <FileDown className="mr-1.5 h-4 w-4 text-sky-600" />
                  Teknik Şartname İndir
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
