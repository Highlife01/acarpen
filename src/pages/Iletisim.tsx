import { Navbar } from "@/components/site/Navbar";
import { Contact } from "@/components/site/Contact";
import { GoogleMapLocation } from "@/components/site/GoogleMapLocation";
import { Footer } from "@/components/site/Footer";
import { SEO } from "@/components/SEO";

export default function Iletisim() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 pt-28">
      <SEO
        title="İletişim, Adres & Ücretsiz Keşif | Acarpen — Seyhan / Adana Fıratpen Bayisi"
        description="Acarpen (Acar Pen İnşaat San. ve Tic. Ltd. Şti.) iletişim bilgileri: Gülbahçesi Mah. 13428 Sok. No:16/17 Seyhan / Adana. Telefon & WhatsApp: 0533 625 36 11."
        canonicalPath="/iletisim"
        schemaType="ContactPage"
        breadcrumbs={[{ name: "İletişim", path: "/iletisim" }]}
      />
      <Navbar />
      <section className="py-12 border-b border-slate-200 bg-gradient-to-b from-sky-50 via-white to-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <span className="inline-block text-xs font-mono uppercase tracking-[0.2em] text-sky-700 font-bold bg-sky-100/80 px-3.5 py-1.5 rounded-full border border-sky-200 mb-3">
            // İletişim, Teklif & Showroom
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl font-bold text-slate-900">
            Bize <span className="text-gradient italic">Ulaşın</span>
          </h1>
          <p className="mt-3 text-slate-600 max-w-2xl text-sm sm:text-base">
            GÜLBAHÇESİ MAH. 13428 SOK. NO:16/17 SEYHAN - SEYHAN / ADANA • Tel & WhatsApp: 0533 625 36 11
          </p>
        </div>
      </section>
      <Contact />
      <GoogleMapLocation />
      <Footer />
    </main>
  );
}
