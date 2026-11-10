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
import { Contact } from "@/components/site/Contact";
import { GoogleMapLocation } from "@/components/site/GoogleMapLocation";
import { Footer } from "@/components/site/Footer";
import { FloatingWhatsApp } from "@/components/site/FloatingWhatsApp";
import { SEO, FAQItem } from "@/components/SEO";

const homeFaqs: FAQItem[] = [
  {
    question: "Acarpen Fıratpen yetkili üretici bayisi midir ve adresi nerededir?",
    answer:
      "Evet, Acarpen (Acar Pen İnşaat Sanayi ve Ticaret Ltd. Şti.), Fıratpen resmi yetkili üretici bayisidir. Üretim ve showroom merkezimiz Gülbahçesi Mah. 13428 Sok. No:16/17 Seyhan / Adana adresinde hizmet vermektedir.",
  },
  {
    question: "Hangi PVC pencere ve kapı serilerini üretiyorsunuz?",
    answer:
      "70'lik ve 75'lik Fıratpen Selenit 75, Elegance 80 ve Redonit 85 serileriyle; standart hazır ölçülerde ve özel ölçülerde 1 bölmeli pencereler, ortadan kanatlı pencereler, bir sabit bir açılır pencereler, çift kanat PVC sürme pencereler, 85×198 / 85×210 balkon kapıları ve 85×200 WC kapıları üretiyoruz.",
  },
  {
    question: "PVC pencerelerde hangi teknik özellikler ve seçenekler sunuluyor?",
    answer:
      "70 mm ve 75 mm sistem genişliği, 1.00 mm - 1.50 mm galvanizli destek sacı, 2.5 mm - 3.0 mm profil et kalınlığı ve 4+16+4 ısıcam standardı sunuyoruz. 19 farklı lamine renk seçeneği; Sağ/Sol açılım yönü ve Tek Açılım / Çift Açılım aksesuar alternatifleri mevcuttur.",
  },
  {
    question: "Müteahhitler ve şantiyeler için B2B toplu sipariş ve düzenli tedarik yapıyor musunuz?",
    answer:
      "Evet. Müteahhitler, bayiler, şantiyeler ve konut projeleri için toplu sipariş ve düzenli tedarik modelleriyle destek sunuyoruz. Sipariş adetleri ve sevkiyat planına göre üretim ve montaj süreci yapılandırılmaktadır.",
  },
  {
    question: "Nasıl fiyat teklifi ve ücretsiz keşif alabilirim?",
    answer:
      "Web sitemizdeki Pencere & Cam Balkon Yapılandırıcı üzerinden ölçü, renk ve açılım yönü seçerek veya 0533 625 36 11 numaralı WhatsApp hattımızdan bize ulaşarak anında fiyat teklifi ve ücretsiz keşif talep edebilirsiniz.",
  },
];

const Index = () => {
  return (
    <main className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <SEO
        title="Acarpen | Adana Fıratpen Yetkili Üretici Bayi — PVC Pencere, Kapı, Sürme & Cam Balkon"
        description="Acarpen (Gülbahçesi Mah. 13428 Sok. No:16/17 Seyhan / Adana), Fıratpen Yetkili Üretici Bayisi olarak 70'lik & 75'lik PVC Pencereler, Balkon Kapıları, WC Kapıları, Çift Kanat Sürme Sistemler ve Düz/L/U Cam Balkon üretimi yapmaktadır."
        canonicalPath="/"
        keywords={[
          "acarpen",
          "adana fıratpen bayisi",
          "fıratpen adana",
          "adana pvc pencere",
          "pvc balkon kapısı",
          "pvc sürme pencere",
          "cam balkon adana",
          "selenit 75 adana",
          "seyhan pvc doğrama",
        ]}
        faqs={homeFaqs}
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
      <Contact />
      <GoogleMapLocation />
      <Footer />
      <FloatingWhatsApp />
    </main>
  );
};

export default Index;
