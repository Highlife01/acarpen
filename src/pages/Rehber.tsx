import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { SEO, FAQItem } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  BookOpen,
  ThermometerSun,
  ShieldCheck,
  Volume2,
  Sun,
  Calculator,
  CheckCircle2,
  ArrowRight,
  HelpCircle,
  FileSpreadsheet,
  Award,
} from "lucide-react";

const guideFaqs: FAQItem[] = [
  {
    question: "Fıratpen, Winsa ve Pimapen profil serileri arasındaki temel özellikler nelerdir?",
    answer:
      "Acarpen'de her üç lider markanın da üst segment serileri CNC hassasiyetiyle üretilir: Fıratpen'de Selenit 75 (75 mm, 6 odacıklı) ve Redonit 85 (85 mm, 7 odacıklı); Winsa'da Dorado 76, Safir 76 (76 mm, 5 odacıklı, 3 contalı) ve Revotech (84 mm, 7 odacıklı); Pimapen'de ise Nirvana (80 mm, 6 odacıklı, 3 contalı) ve Carisma (70 mm, 5 odacıklı) konut ve villa ihtiyaçlarına göre seçilebilir.",
  },
  {
    question: "PVC pencere siparişinde hangi seçenekler belirlenmelidir?",
    answer:
      "Sipariş verirken 4 temel unsuru belirlemeniz yeterlidir: 1) En x Boy ölçüsü (Standart hazır ölçü veya özel ölçü), 2) Renk seçimi (Beyaz, Antrasit Gri, Altınmeşe vb. 19 alternatif), 3) Açılım Yönü (Sağ Açılım / Sol Açılım / Sürme), 4) Aksesuar Tipi (Tek Açılım / Çift Açılım / Vasistas).",
  },
  {
    question: "Çift açılım aksesuarın tek açılıma göre avantajı nedir?",
    answer:
      "Tek açılım pencereler yalnızca yana doğru tam açılırken, çift açılım mekanizmalı pencereler hem yana tam açılır hem de üstten vasistas (havalandırma) konumunda aralanabilir. Bu sayede yağmurlu havalarda su almadan ve çocuk güvenliğini koruyarak güvenli havalandırma sağlar.",
  },
  {
    question: "PVC doğrama içinde galvanizli çelik destek sacı neden zorunludur?",
    answer:
      "PVC profillerin rüzgar yüküne karşı esnememesi, menteşe vidalarının zamanla gevşememesi ve özellikle Antrasit Gri / Altınmeşe gibi koyu renkli profillerin güneş ısısında genleşip çalışmaması için profil içerisine 1.00 mm - 1.50 mm galvanizli çelik destek sacı konulması hayati önem taşır.",
  },
  {
    question: "Düz, L ve U tipi balkonlarda hangi cam balkon sistemi tercih edilmelidir?",
    answer:
      "Düz balkonlarda katlanır veya eşikli/eşiksiz sürme sistemler; L ve U tipi köşe dönüşlü balkonlarda ise köşe birleşim profilli ve paslanmaz çift rulmanlı 8 mm veya 10 mm temperli (veya ısıcamlı) katlanır cam balkon sistemleri tercih edilmelidir.",
  },
];

export default function Rehber() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 pt-28">
      <SEO
        title="Teknik PVC Pencere, Profil Serileri & Cam Balkon Seçim Rehberi | Acarpen Adana"
        description="Fıratpen 70'lik, Selenit 75 ve Redonit 85 PVC pencere karşılaştırması, standart hazır pencere ölçüleri, destek sacı, 4+16+4 ısıcam ve cam balkon seçim kılavuzu."
        canonicalPath="/rehber"
        schemaType="TechArticle"
        keywords={[
          "pvc pencere seçim rehberi",
          "70 lik pvc pencere özellikleri",
          "fıratpen selenit 75 özellikleri",
          "tek açılım çift açılım farkı",
          "standart pvc pencere ölçüleri",
          "cam balkon seçim rehberi",
        ]}
        faqs={guideFaqs}
        breadcrumbs={[{ name: "Teknik PVC & Cam Balkon Rehberi", path: "/rehber" }]}
      />
      <Navbar />

      <section className="py-16 bg-gradient-to-b from-sky-50 via-white to-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-100 border border-sky-200 text-xs font-mono uppercase tracking-wider text-sky-800 font-bold mb-4">
            <BookOpen className="h-3.5 w-3.5 text-sky-600" />
            Acarpen Teknik Bilgi Bankası & Seçim Kılavuzu
          </div>
          <h1 className="font-serif text-4xl sm:text-6xl font-bold text-slate-900 tracking-tight max-w-4xl">
            PVC Pencere, Kapı ve <span className="text-gradient italic">Cam Balkon Rehberi</span>
          </h1>
          <p className="geo-summary mt-4 text-slate-700 max-w-3xl text-base sm:text-lg leading-relaxed font-normal bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <strong>Hızlı Teknik Özet:</strong> Dayanımı ve yalıtımı dengeli bir PVC pencere sisteminde; <strong>70 mm veya 75 mm profil genişliği</strong>, minimum <strong>1.00 mm - 1.50 mm galvanizli çelik destek sacı</strong>, <strong>2.5 mm - 3.0 mm profil et kalınlığı</strong> ve <strong>4+16+4 mm Isıcam</strong> kombinasyonu temel standarttır.
          </p>
        </div>
      </section>

      <section className="py-16 max-w-7xl mx-auto px-6">
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-sky-700 font-bold flex items-center gap-1.5">
                <FileSpreadsheet className="h-4 w-4 text-sky-600" />
                Mühendislik & Ürün Karşılaştırma Tablosu
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
                PVC Pencere Serileri, Sürme ve Kapı Sistemleri Matrisi
              </h2>
            </div>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3.5 py-2 rounded-xl">
              <Award className="h-4 w-4 text-emerald-600" /> TS EN 12608-1 & TSE EN 1279
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b-2 border-slate-200 text-slate-800 uppercase text-[11px] tracking-wider font-bold bg-slate-50">
                  <th className="py-3.5 px-4">Sistem / Ürün Grubu</th>
                  <th className="py-3.5 px-4">Profil & Destek Sacı</th>
                  <th className="py-3.5 px-4">Cam Kombinasyonu</th>
                  <th className="py-3.5 px-4">Popüler Standart Ölçüler (cm)</th>
                  <th className="py-3.5 px-4">Açılım & Renk Alternatifi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700">
                <tr className="hover:bg-sky-50/40">
                  <td className="py-3.5 px-4 font-bold text-slate-900">1 Bölmeli & Standart PVC Pencere</td>
                  <td className="py-3.5 px-4 font-mono">70mm / 75mm • 1.00mm+ Sac</td>
                  <td className="py-3.5 px-4 font-bold text-emerald-700">4+16+4 mm Isıcam</td>
                  <td className="py-3.5 px-4 font-mono">40×40, 50×50, 75×100, 100×100, 120×120, 140×140, 150×140</td>
                  <td className="py-3.5 px-4">Sağ/Sol • Tek/Çift Açılım • 19 Renk</td>
                </tr>
                <tr className="hover:bg-sky-50/40">
                  <td className="py-3.5 px-4 font-bold text-sky-700">Ortadan Kanatlı PVC Pencere</td>
                  <td className="py-3.5 px-4 font-mono">70mm / 75mm • 1.20mm+ Sac</td>
                  <td className="py-3.5 px-4 font-bold text-emerald-700">4+16+4 mm Isıcam S / K</td>
                  <td className="py-3.5 px-4 font-mono">130×130, 200×140, 200×210, 220×210</td>
                  <td className="py-3.5 px-4">Simetrik Kanat • Tek/Çift Açılım</td>
                </tr>
                <tr className="hover:bg-sky-50/40">
                  <td className="py-3.5 px-4 font-bold text-emerald-700">Bir Sabit Bir Açılır PVC Pencere</td>
                  <td className="py-3.5 px-4 font-mono">70mm / 75mm • 1.20mm+ Sac</td>
                  <td className="py-3.5 px-4 font-bold text-emerald-700">4+16+4 mm Isıcam</td>
                  <td className="py-3.5 px-4 font-mono">160×200, 160×210, 180×210</td>
                  <td className="py-3.5 px-4">Fransız Balkon & Salon Cepheleri</td>
                </tr>
                <tr className="hover:bg-sky-50/40">
                  <td className="py-3.5 px-4 font-bold text-slate-900">Çift Kanat PVC Sürme Pencere</td>
                  <td className="py-3.5 px-4 font-mono">70/75mm Çift Ray Sürme</td>
                  <td className="py-3.5 px-4 font-bold text-sky-700">4+16+4 mm Isıcam</td>
                  <td className="py-3.5 px-4 font-mono">120×120, 140×120 ve Özel Sürme Ölçüleri</td>
                  <td className="py-3.5 px-4">EPDM Contalı & Fırçalı Ray Sistemi</td>
                </tr>
                <tr className="hover:bg-sky-50/40">
                  <td className="py-3.5 px-4 font-bold text-slate-900">PVC Balkon Kapısı & WC Kapısı</td>
                  <td className="py-3.5 px-4 font-mono">70mm / 75mm Kapı Profili</td>
                  <td className="py-3.5 px-4 font-bold text-emerald-700">4+16+4 Isıcam / Buzlu Cam</td>
                  <td className="py-3.5 px-4 font-mono">85×198, 85×210 (Balkon) • 85×200 (WC)</td>
                  <td className="py-3.5 px-4">Sağ/Sol • Tek/Çift Açılım & Kilitli</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="py-8 max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-7">
          {[
            {
              icon: Sun,
              title: "1. Adana İkliminde Profil & Cam Seçimi",
              subtitle: "Fıratpen Selenit 75 + Isıcam K (Solar Low-E)",
              desc: "Adana ve Çukurova'da yaz sıcakları gölgede +40°C'yi aşmaktadır. 6 odacıklı ve 3 contalı Fıratpen Selenit 75 doğramalar ile güneş ısısını %40 kesen 4+16+4 Isıcam K kombinasyonu klima elektrik tüketimini yarı yarıya düşürür.",
              bullets: [
                "UV güneş ışınlarına dayanıklı kurşunsuz PVC formülü",
                "19 farklı lamine renk seçeneğinde solmaz folyo garantisi",
                "EPDM contalar ile sıcak rüzgar ve toz sızdırmazlığı",
              ],
            },
            {
              icon: ShieldCheck,
              title: "2. Destek Sacı ve Profil Et Kalınlığı",
              subtitle: "1.00 mm - 1.50 mm Galvanizli Çelik Destek Sacı",
              desc: "Bir PVC pencerenin yıllarca sarkmadan çalışmasını sağlayan en önemli bileşen profilin içindeki galvanizli çelik destek sacıdır. Acarpen'de üretilen tüm pencerelerde standartlara uygun destek sacı eksiksiz kullanılır.",
              bullets: [
                "2.5 mm - 3.0 mm profil et kalınlığı ile yüksek köşe kaynak mukavemeti",
                "Menteşe ve karşılık vidalarının doğrudan çelik saca tutunması",
                "Yüksek katlarda rüzgar basıncına karşı esnemeyen gövde",
              ],
            },
            {
              icon: Volume2,
              title: "3. Açılım Yönü ve Aksesuar Tercihi",
              subtitle: "Sağ / Sol Açılım & Tek / Çift Açılım İspanyolet",
              desc: "Odanızın yerleşimine göre kanadın sağa veya sola açılmasını seçebilirsiniz. Çift açılım aksesuar sayesinde pencerenizi üstten vasistas konumunda aralayarak güvenli ve konforlu havalandırma sağlayabilirsiniz.",
              bullets: [
                "85×200 cm WC kapılarında buzlu cam ve suya dayanıklı lambri",
                "120×120 ve 140×120 dar alanlarda yer kazandıran çift kanat sürme",
                "Geniş salonlarda 160×200 ve 180×210 bir sabit bir açılır modeller",
              ],
            },
            {
              icon: ThermometerSun,
              title: "4. Montaj & İzolasyon Malzemeleri",
              subtitle: "PU Köpük, Silikon ve Dış Cephe Mastikleri",
              desc: "En kaliteli pencere bile hatalı montaj yapılırsa su ve hava sızdırır. Montaj aşamasında poliüretan köpük, nötr silikon ve UV dayanımlı akrilik dış cephe mastikleri ile duvar-kasa birleşimi tam izole edilir.",
              bullets: [
                "Lazer terazi ile milimetrik شاقول (şakul) ve gönye kontrolü",
                "Alüminyum damlalıklı ve paslanmaz rulmanlı Düz/L/U cam balkon",
                "Plise sineklik ve motorlu panjur ile tam entegre kurulum",
              ],
            },
          ].map((card, i) => {
            const Icon = card.icon;
            return (
              <div key={i} className="bg-white rounded-3xl p-7 sm:p-8 border border-slate-200 shadow-md flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3.5 mb-5">
                    <div className="h-12 w-12 rounded-2xl bg-sky-50 border border-sky-200 grid place-items-center text-sky-600 shrink-0">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-serif text-xl font-bold text-slate-900">{card.title}</h3>
                      <span className="text-xs font-mono text-sky-700 font-semibold">{card.subtitle}</span>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-5">{card.desc}</p>
                </div>

                <ul className="space-y-2 pt-4 border-t border-slate-100">
                  {card.bullets.map((b) => (
                    <li key={b} className="flex items-center gap-2 text-xs font-semibold text-slate-800">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      <section className="py-16 max-w-5xl mx-auto px-6">
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-sky-700 font-bold">
            <HelpCircle className="h-4 w-4 text-sky-600" />
            Sıkça Sorulan Teknik Sorular
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 mt-2">
            PVC Pencere & Cam Balkon Hakkında Merak Edilenler
          </h2>
        </div>

        <div className="space-y-4">
          {guideFaqs.map((faq, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <h3 className="font-serif text-lg font-bold text-slate-900 mb-2 flex items-start gap-2.5">
                <span className="text-sky-600 font-mono text-sm mt-0.5">Q{idx + 1}.</span>
                <span>{faq.question}</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-7">{faq.answer}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-gradient-to-r from-sky-600 to-sky-700 rounded-3xl p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div>
            <h3 className="font-serif text-2xl font-bold">Ölçülerinizi Belirlediniz mi?</h3>
            <p className="text-xs sm:text-sm text-sky-100 mt-1">
              Pencere ve cam balkon ölçü robotumuzda renk ve açılım yönü seçerek hemen teklif isteyin.
            </p>
          </div>
          <Link to="/hesaplama" className="shrink-0">
            <Button size="lg" className="rounded-full bg-white text-sky-900 hover:bg-sky-50 font-extrabold text-xs sm:text-sm px-7">
              <Calculator className="mr-2 h-4 w-4 text-sky-600" />
              Ölçü Robotuna Git
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
