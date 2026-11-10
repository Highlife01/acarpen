import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { SEO } from "@/components/SEO";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
      <SEO
        title="Sayfa Bulunamadı (404) | Acarpen — Adana Fıratpen Yetkili Bayi"
        description="Aradığınız sayfa taşınmış veya kaldırılmış olabilir. Acarpen ana sayfasına dönerek PVC pencere, kapı ve cam balkon ürünlerimizi inceleyebilirsiniz."
        canonicalPath="/404"
      />
      <div className="text-center max-w-md bg-white p-8 rounded-3xl border border-slate-200 shadow-lg">
        <h1 className="mb-3 font-serif text-5xl font-bold text-sky-600">404</h1>
        <p className="mb-6 text-lg font-semibold text-slate-800">Aradığınız sayfa bulunamadı</p>
        <Link
          to="/"
          className="inline-block rounded-full bg-sky-600 px-6 py-3 text-sm font-bold text-white hover:bg-sky-700 transition-colors"
        >
          Acarpen Ana Sayfaya Dön
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
