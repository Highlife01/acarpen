import { useEffect, lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "./context/LanguageContext";
import { CookieConsent } from "@/components/site/CookieConsent";
import { trackPageView } from "@/lib/analytics";
import Index from "./pages/Index.tsx";

const Hizmetler = lazy(() => import("./pages/Hizmetler.tsx"));
const Projeler = lazy(() => import("./pages/Projeler.tsx"));
const ProjectDetail = lazy(() => import("./pages/ProjectDetail.tsx"));
const Hakkimizda = lazy(() => import("./pages/Hakkimizda.tsx"));
const Iletisim = lazy(() => import("./pages/Iletisim.tsx"));
const Hesaplama = lazy(() => import("./pages/Hesaplama.tsx"));
const SiparisTakip = lazy(() => import("./pages/SiparisTakip.tsx"));
const UretimTeknolojisiPage = lazy(() => import("./pages/UretimTeknolojisiPage.tsx"));
const Rehber = lazy(() => import("./pages/Rehber.tsx"));
const Bolgeler = lazy(() => import("./pages/Bolgeler.tsx"));
const BolgeDetay = lazy(() => import("./pages/BolgeDetay.tsx"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard.tsx"));
const CiftCam = lazy(() => import("./pages/products/CiftCam.tsx"));
const TemperliCam = lazy(() => import("./pages/products/TemperliCam.tsx"));
const BalkonCami = lazy(() => import("./pages/products/BalkonCami.tsx"));
const JaluziliIsicam = lazy(() => import("./pages/products/JaluziliIsicam.tsx"));
const DisCepheCamlari = lazy(() => import("./pages/products/DisCepheCamlari.tsx"));
const LamineCam = lazy(() => import("./pages/products/LamineCam.tsx"));
const RenkliCamlar = lazy(() => import("./pages/products/RenkliCamlar.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));

const queryClient = new QueryClient();

const RouteTracker = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    const timer = setTimeout(() => {
      trackPageView(location.pathname, document.title || "Acarpen — Fıratpen Yetkili Üretici Bayi");
    }, 150);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  if (location.pathname.startsWith("/admin")) {
    return null;
  }

  return <CookieConsent />;
};

const App = () => (
  <LanguageProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <RouteTracker />
          <Suspense fallback={<div className="min-h-screen bg-slate-50" />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/hizmetler" element={<Hizmetler />} />
              <Route path="/urunler/cift-cam" element={<CiftCam />} />
              <Route path="/urunler/temperli-cam" element={<TemperliCam />} />
              <Route path="/urunler/balkon-cami" element={<BalkonCami />} />
              <Route path="/urunler/jaluzili-isicam" element={<JaluziliIsicam />} />
              <Route path="/urunler/dis-cephe-camlari" element={<DisCepheCamlari />} />
              <Route path="/urunler/lamine-cam" element={<LamineCam />} />
              <Route path="/urunler/renkli-camlar" element={<RenkliCamlar />} />

              <Route path="/projeler" element={<Projeler />} />
              <Route path="/projeler/:slug" element={<ProjectDetail />} />
              <Route path="/uretim-teknolojisi" element={<UretimTeknolojisiPage />} />
              <Route path="/rehber" element={<Rehber />} />
              <Route path="/bolgeler" element={<Bolgeler />} />
              <Route path="/bolgeler/:slug" element={<BolgeDetay />} />
              <Route path="/hakkimizda" element={<Hakkimizda />} />
              <Route path="/iletisim" element={<Iletisim />} />
              <Route path="/hesaplama" element={<Hesaplama />} />
              <Route path="/siparis-takip" element={<SiparisTakip />} />

              <Route path="/admin" element={<AdminDashboard />} />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </LanguageProvider>
);

export default App;
