import { Navbar } from "@/components/site/Navbar";
import { Projects } from "@/components/site/Projects";
import { Stats } from "@/components/site/Stats";
import { Footer } from "@/components/site/Footer";
import { SEO } from "@/components/SEO";

export default function Projeler() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 pt-28 lg:pt-32">
      <SEO
        title="Referans Projelerimiz & Uygulamalar | Acarpen Adana Fıratpen Bayisi"
        description="Adana ve Çukurova genelinde tamamladığımız Fıratpen PVC pencere, balkon kapısı, çift kanat sürme, motorlu panjur ve Düz/L/U cam balkon referans projelerimiz."
        canonicalPath="/projeler"
        schemaType="CollectionPage"
        breadcrumbs={[{ name: "Referans Projeler", path: "/projeler" }]}
      />
      <Navbar />
      <section className="py-12 border-b border-slate-200 bg-gradient-to-b from-sky-50 via-white to-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <span className="inline-block text-xs font-mono uppercase tracking-[0.2em] text-sky-700 font-bold bg-sky-100/80 px-3.5 py-1.5 rounded-full border border-sky-200 mb-3">
            Mimari Portfolyo & Tamamlanan Uygulamalar
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl font-bold text-slate-900">
            Referans <span className="text-gradient italic">Projelerimiz</span>
          </h1>
          <p className="mt-4 text-slate-600 max-w-2xl text-base sm:text-lg font-normal">
            Adana ve çevre illerdeki toplu konut şantiyeleri, müstakil villalar ve daire yenileme projelerinde Acarpen kalitesiyle teslim ettiğimiz örnek çalışmalar.
          </p>
        </div>
      </section>
      <Stats />
      <Projects />
      <Footer />
    </main>
  );
}
