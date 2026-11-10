import { Navbar } from "@/components/site/Navbar";
import { Services } from "@/components/site/Services";
import { Footer } from "@/components/site/Footer";
import { SEO } from "@/components/SEO";
import { CheckCircle2, ArrowRight, FileDown, ShieldCheck, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { toast } from "sonner";

export default function Hizmetler() {
  const handleDownloadCatalog = () => {
    const specContent = `====================================================================
ACARPEN — FIRATPEN YETKİLİ ÜRETİCİ BAYİ TEKNİK ÜRÜN KATALOĞU (2026)
ACAR PEN İNŞAAT SANAYİ VE TİCARET LİMİTED ŞİRKETİ
Adres: Gülbahçesi Mah. 13428 Sok. No:16/17 Seyhan - Seyhan / ADANA
Telefon & WhatsApp: 0533 625 36 11 | Web: https://www.acarpen.com.tr
====================================================================

1. STANDART VE ÖZEL ÖLÇÜ PVC PENCERELER (70'lik & 75'lik Selenit / 85'lik Redonit)
- Sistem Genişliği: 70 mm / 75 mm / 85 mm Çok Odacıklı Fıratpen Profil
- Profil Et Kalınlığı: 2.5 mm - 3.0 mm (TS EN 12608-1)
- Destek Sacı: 1.00 mm - 1.50 mm Galvanizli Çelik Destek Sacı
- Cam Donanımı: 4+16+4 mm Isıcam (İsteğe bağlı Isıcam S / Isıcam K Solar Low-E)
- Renk Seçenekleri: Beyaz, Antrasit Gri, Altınmeşe, Maun, Ceviz
- Açılım Yönü & Aksesuar: Sağ / Sol Açılım, Tek Açılım / Çift Açılım / Vasistas
- Standart Hazır Ölçüler:
  * 40x40 cm & 50x50 cm (Banyo/WC Vasistas Pencere)
  * 75x100 cm, 100x100 cm, 120x120 cm, 140x140 cm, 150x140 cm, 200x140 cm
  * 130x130 cm, 200x210 cm, 220x210 cm (Ortadan Kanatlı PVC Pencere)
  * 160x200 cm, 160x210 cm, 180x210 cm (Bir Sabit Bir Açılır PVC Pencere)

2. PVC SÜRME PENCERELER & HEBESCHIEBE SÜRME KAPILAR
- 120x120 cm ve 140x120 cm Çift Kanat PVC Sürme Pencereler
- Fıratpen Zenia Hebeschiebe (Kaldır-Sür) 300 kg Kanat Kapasiteli Sistemler
- Özel Siyah/Gri EPDM Conta ve Fırçalı Yalıtım

3. PVC BALKON KAPILARI & PVC WC KAPILARI
- 85x198 cm ve 85x210 cm Isıcamlı PVC Pencere Balkon Kapıları
- 85x200 cm Neme ve Buhara Dayanıklı PVC WC & Banyo Kapıları

4. DÜZ, L VE U CAM BALKON SİSTEMLERİ
- 8 mm ve 10 mm Temperli veya Isıcamlı Katlanır, Sürme ve Motorlu Giyotin Cam Balkon
- Şeffaf, Füme, Bronz ve Reflekte Cam Alternatifleri

5. MONTAJ & İZOLASYON MALZEMELERİ VE SİNEKLİK
- Plise Sineklik, Menteşeli Sineklik, Pencere Kolları, PU Köpük, Silikon ve İzolasyon Mastikleri
====================================================================`;

    const blob = new Blob([specContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Acarpen-Firatpen-Urun-ve-Teknik-Sartname-Katalogu.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Acarpen Teknik Ürün Kataloğu ve Ölçü Tablosu indirildi!");
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 pt-28">
      <SEO
        title="Fıratpen, Winsa & Pimapen PVC Pencere, Kapı ve Cam Balkon Kataloğu | Acarpen Adana"
        description="Acarpen ürün kataloğu: Fıratpen, Winsa ve Pimapen 70/75/80 mm PVC Pencereler, PVC Balkon & WC Kapıları, Hebeschiebe Sürme Sistemler, 19 Renk & Renkli Isıcamlar ve Düz/L/U Cam Balkon."
        canonicalPath="/hizmetler"
        schemaType="CollectionPage"
        breadcrumbs={[{ name: "Ürünlerimiz", path: "/hizmetler" }]}
      />
      <Navbar />

      {/* Page Header */}
      <section className="py-14 border-b border-slate-200 bg-gradient-to-b from-sky-50 via-white to-slate-50">
        <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <span className="inline-block text-xs font-mono uppercase tracking-[0.2em] text-sky-700 font-bold bg-sky-100/80 px-3.5 py-1.5 rounded-full border border-sky-200 mb-3">
              // Acarpen — Fıratpen • Winsa • Pimapen Sistem Kataloğu
            </span>
            <h1 className="font-serif text-4xl sm:text-6xl font-bold text-slate-900 max-w-3xl">
              PVC Pencere, Kapı & <span className="text-gradient italic">Cam Balkon Çözümleri</span>
            </h1>
            <p className="mt-4 text-slate-600 max-w-2xl text-base sm:text-lg font-normal">
              Gülbahçesi Mah. Seyhan / Adana tesisimizde Fıratpen, Winsa ve Pimapen profil sistemleriyle standart ve özel ölçülerde üretilen PVC doğrama, sürme sistem ve cam balkon gruplarımız.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={handleDownloadCatalog}
              variant="outline"
              className="rounded-xl border-sky-300 bg-white text-sky-700 hover:bg-sky-50 font-bold h-11 shadow-sm"
            >
              <FileDown className="mr-2 h-4 w-4 text-sky-600" />
              Teknik Katalog & Ölçü Listesi İndir
            </Button>
            <Link to="/hesaplama">
              <Button className="rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold h-11 shadow-md">
                Pencere & Cam Balkon Hesapla
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Services />

      {/* Technical Comparison Table */}
      <section className="py-16 max-w-7xl mx-auto px-6">
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-sky-700 font-bold">
                // Mühendislik & Yalıtım Karşılaştırma Tablosu
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
                Fıratpen PVC & Cam Balkon Teknik Performans Değerleri
              </h2>
            </div>
            <div className="inline-flex items-center gap-2 text-xs text-emerald-700 font-bold bg-emerald-50 px-3.5 py-2 rounded-xl border border-emerald-200">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              TS EN 12608-1 & TSE EN 1279 Onaylı
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b-2 border-slate-200 text-slate-700 font-mono text-[11px] uppercase bg-slate-50">
                  <th className="py-3.5 px-4 font-bold">Sistem / Seri Adı</th>
                  <th className="py-3.5 px-4 font-bold">Profil & Odacık Yapısı</th>
                  <th className="py-3.5 px-4 font-bold">Destek Sacı & Cam</th>
                  <th className="py-3.5 px-4 font-bold">Renk & Açılım Seçenekleri</th>
                  <th className="py-3.5 px-4 font-bold">Tavsiye Edilen Kullanım</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700">
                <tr className="hover:bg-sky-50/40">
                  <td className="py-3.5 px-4 font-bold text-slate-900">70'lik Standart PVC Pencere (Garnet 70)</td>
                  <td className="py-3.5 px-4 font-mono">70 mm • 5 Odacıklı • 2.5mm Et</td>
                  <td className="py-3.5 px-4 text-emerald-700 font-bold">1.00mm+ Sac • 4+16+4 Isıcam</td>
                  <td className="py-3.5 px-4">Beyaz / Antrasit / Altınmeşe • Tek/Çift Açılım</td>
                  <td className="py-3.5 px-4">Hazır Ölçü Konut, Şantiye & Hızlı Yenileme</td>
                </tr>
                <tr className="hover:bg-sky-50/40">
                  <td className="py-3.5 px-4 font-bold text-sky-700">Fıratpen Selenit 75 Serisi</td>
                  <td className="py-3.5 px-4 font-mono">75 mm • 6 Odacıklı • 3 Contalı</td>
                  <td className="py-3.5 px-4 text-emerald-700 font-bold">1.20-1.50mm Sac • Isıcam S/K</td>
                  <td className="py-3.5 px-4">Tüm Lamine Renkler • Çift Açılım Güvenlik</td>
                  <td className="py-3.5 px-4">Yüksek Isı ve Ses Yalıtımlı Daire & Villalar</td>
                </tr>
                <tr className="hover:bg-sky-50/40">
                  <td className="py-3.5 px-4 font-bold text-emerald-700">Fıratpen Redonit 85 Premium</td>
                  <td className="py-3.5 px-4 font-mono">85 mm • 7 Odacıklı • 3 Contalı</td>
                  <td className="py-3.5 px-4 text-emerald-700 font-bold">1.50mm Sac • Üçlü Isıcam (Uw: 0.78)</td>
                  <td className="py-3.5 px-4">Antrasit / Altınmeşe / Maun • Çift Açılım</td>
                  <td className="py-3.5 px-4">Lüks Villa, Rezidans & Maksimum Enerji Tasarrufu</td>
                </tr>
                <tr className="hover:bg-sky-50/40">
                  <td className="py-3.5 px-4 font-bold text-slate-900">Çift Kanat PVC Sürme & Hebeschiebe</td>
                  <td className="py-3.5 px-4 font-mono">70/75 mm Çift Ray • EPDM Conta</td>
                  <td className="py-3.5 px-4 text-sky-700 font-bold">Çelik Takviyeli • 4+16+4 Isıcam</td>
                  <td className="py-3.5 px-4">120×120, 140×120 ve Özel Panoramik Ölçüler</td>
                  <td className="py-3.5 px-4">Balkon, Teras, Mutfak ve Bahçe Çıkışları</td>
                </tr>
                <tr className="hover:bg-sky-50/40">
                  <td className="py-3.5 px-4 font-bold text-slate-900">PVC Balkon & WC Kapıları</td>
                  <td className="py-3.5 px-4 font-mono">85×198, 85×200, 85×210 cm</td>
                  <td className="py-3.5 px-4 text-emerald-700 font-bold">4+16+4 Isıcam / Buzlu Cam + Lambri</td>
                  <td className="py-3.5 px-4">Sağ / Sol Açılım • Kilitli & Çift Açılım</td>
                  <td className="py-3.5 px-4">Balkon Kapıları, Banyo ve WC Kapıları</td>
                </tr>
                <tr className="hover:bg-sky-50/40">
                  <td className="py-3.5 px-4 font-bold text-amber-700">Düz, L ve U Cam Balkon Sistemleri</td>
                  <td className="py-3.5 px-4 font-mono">Alüminyum Damlalıklı Kasa</td>
                  <td className="py-3.5 px-4 text-amber-700 font-bold">8mm / 10mm Temperli veya Isıcamlı</td>
                  <td className="py-3.5 px-4">Şeffaf / Füme / Bronz • Katlanır / Giyotin</td>
                  <td className="py-3.5 px-4">Balkon, Teras, Kış Bahçesi ve Kafe Kapatma</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
              <CheckCircle2 className="h-4 w-4 text-sky-600" />
              <span>Standart hazır ölçüler veya özel proje ölçüleriniz için WhatsApp'tan anında fiyat alabilirsiniz.</span>
            </div>
            <a
              href="https://wa.me/905336253611?text=Merhaba%20Acarpen%2C%20%C3%BCr%C3%BCn%20katalo%C4%9Funuzdaki%20sistemler%20i%C3%A7in%20fiyat%20almak%20istiyorum."
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md">
                <MessageCircle className="mr-1.5 h-4 w-4" />
                WhatsApp: 0533 625 36 11
              </Button>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
