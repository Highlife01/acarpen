import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "./context/LanguageContext";
import { CookieConsent } from "@/components/site/CookieConsent";
import { trackPageView } from "@/lib/analytics";
import Index from "./pages/Index.tsx";
import Hizmetler from "./pages/Hizmetler.tsx";
import Projeler from "./pages/Projeler.tsx";
import ProjectDetail from "./pages/ProjectDetail.tsx";
import Hakkimizda from "./pages/Hakkimizda.tsx";
import Iletisim from "./pages/Iletisim.tsx";
import Hesaplama from "./pages/Hesaplama.tsx";
import SiparisTakip from "./pages/SiparisTakip.tsx";
import UretimTeknolojisiPage from "./pages/UretimTeknolojisiPage.tsx";
import Rehber from "./pages/Rehber.tsx";
import Bolgeler from "./pages/Bolgeler.tsx";
import BolgeDetay from "./pages/BolgeDetay.tsx";
import AdminDashboard from "./pages/AdminDashboard.tsx";
import CiftCam from "./pages/products/CiftCam.tsx";
import TemperliCam from "./pages/products/TemperliCam.tsx";
import BalkonCami from "./pages/products/BalkonCami.tsx";
import JaluziliIsicam from "./pages/products/JaluziliIsicam.tsx";
import DisCepheCamlari from "./pages/products/DisCepheCamlari.tsx";
import LamineCam from "./pages/products/LamineCam.tsx";
import RenkliCamlar from "./pages/products/RenkliCamlar.tsx";
import NotFound from "./pages/NotFound.tsx";

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
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </LanguageProvider>
);

export default App;
