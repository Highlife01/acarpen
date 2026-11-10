import { Navbar } from "@/components/site/Navbar";
import { Hero } from "@/components/site/Hero";
import { TrustCertifications } from "@/components/site/TrustCertifications";
import { Stats } from "@/components/site/Stats";
import { Services } from "@/components/site/Services";
import { WhyAcarpen } from "@/components/site/WhyAcarpen";
import { ProductionTech } from "@/components/site/ProductionTech";
import { QualityProcessFlow } from "@/components/site/QualityProcessFlow";
import { Projects } from "@/components/site/Projects";
import { Testimonials } from "@/components/site/Testimonials";
import { SeoGeoFaqSection, HOME_GEO_FAQS } from "@/components/site/SeoGeoFaqSection";
import { Contact } from "@/components/site/Contact";
import { GoogleMapLocation } from "@/components/site/GoogleMapLocation";
import { Footer } from "@/components/site/Footer";
import { FloatingWhatsApp } from "@/components/site/FloatingWhatsApp";
import { SEO } from "@/components/SEO";

const Index = () => {
  return (
    <main className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <SEO
        title="Acarpen | Adana Fıratpen, Winsa & Pimapen PVC Pencere, Kapı, Sürme ve Cam Balkon"
        description="Acarpen (Gülbahçesi Mah. 13428 Sok. No:16/17 Seyhan / Adana); Fıratpen, Winsa ve Pimapen PVC Pencere Sistemleri, Balkon & WC Kapıları, Renkli Isıcamlar, Hebeschiebe Sürme ve Düz/L/U Cam Balkon üretimi yapmaktadır."
        canonicalPath="/"
        keywords={[
          "acarpen",
          "adana fıratpen bayisi",
          "adana winsa bayisi",
          "adana pimapen",
          "winsa pvc pencere adana",
          "pimapen nirvana adana",
          "winsa dorado 76",
          "fıratpen adana",
          "adana pvc pencere",
          "seyhan pvc doğrama",
          "çukurova cam balkon",
          "pvc balkon kapısı",
          "pvc sürme pencere",
          "cam balkon adana",
          "selenit 75 adana",
          "pvc pencere renkli cam",
        ]}
        faqs={HOME_GEO_FAQS}
      />
      <Navbar />
      <Hero />
      <TrustCertifications />
      <Stats />
      <Services />
      <WhyAcarpen />
      <ProductionTech />
      <QualityProcessFlow />
      <Projects />
      <Testimonials />
      <SeoGeoFaqSection />
      <Contact />
      <GoogleMapLocation />
      <Footer />
      <FloatingWhatsApp />
    </main>
  );
};

export default Index;
