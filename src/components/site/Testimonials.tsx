import { Star, Quote, Building2, CheckCircle2 } from "lucide-react";

const testimonials = [
  {
    name: "Müh. Kemalettin Özkan",
    role: "Şantiye Şefi",
    company: "Özkanlar Yapı & İnşaat (Adana)",
    rating: 5,
    comment:
      "Toplu konut projemiz için 100×100, 120×120, 150×140 standart pencereler ve 85×210 balkon kapılarında Acarpen ile çalıştık. 70'lik ve 75'lik Fıratpen sistemlerin et kalınlığı, destek sacı ve 4+16+4 ısıcam kalitesi tam şartnamemize uygundu. Termin planına birebir uydular.",
    projectTag: "B2B Toplu Konut PVC Doğrama Tedariki",
  },
  {
    name: "Mimar Selin Aksoy",
    role: "Proje Koordinatörü",
    company: "Aksoy Mimarlık (Çukurova)",
    rating: 5,
    comment:
      "Villa projelerimizde Antrasit Gri ve Altınmeşe renk Fıratpen Selenit 75 doğramalar ile çift kanat sürme kapıları Acarpen'den temin ediyoruz. Ölçüden montaja tek muhatap olmaları ve PU köpük/mastik izolasyon işçilikleri gerçekten kusursuz.",
    projectTag: "Antrasit Gri PVC & Sürme Sistemler",
  },
  {
    name: "Ahmet & Derya Yılmaz",
    role: "Konut Sahibi",
    company: "Seyhan / Adana",
    rating: 5,
    comment:
      "Evimizin tüm pencerelerini çift açılımlı Fıratpen ile yeniledik ve L tipi balkonumuza füme cam balkon yaptırdık. Hem cadde gürültüsü tamamen kesildi hem de Adana sıcağında klima performansımız çok fark etti. Acarpen ekibine teşekkür ederiz.",
    projectTag: "Ev Pencere Yenileme & L Cam Balkon",
  },
];

export const Testimonials = () => {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-14 gap-6">
          <div className="space-y-4 max-w-2xl">
            <span className="inline-block text-xs font-mono uppercase tracking-[0.2em] text-sky-700 font-bold bg-sky-50 px-3.5 py-1.5 rounded-full border border-sky-200">
              // Müşteri & Müteahhit Yorumları
            </span>
            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-slate-900">
              İş Ortaklarımızın <span className="text-gradient italic">Acarpen Deneyimi</span>
            </h2>
          </div>
          <p className="text-slate-600 max-w-md text-sm sm:text-base font-normal">
            Adana ve çevre illerdeki inşaat firmaları, mimarlar ve konut sahiplerinin üretim ve montaj kalitemiz hakkındaki değerlendirmeleri.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-7">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="bg-slate-50 rounded-3xl p-7 border border-slate-200 hover:border-sky-300 hover:bg-white transition-all duration-300 flex flex-col justify-between shadow-sm hover:shadow-xl"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-1 text-amber-500">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <Quote className="h-8 w-8 text-sky-200" />
                </div>

                <p className="text-slate-700 text-sm leading-relaxed mb-6 italic font-normal">
                  "{t.comment}"
                </p>
              </div>

              <div className="pt-5 border-t border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-serif font-bold text-slate-900 text-base">{t.name}</div>
                    <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5 font-medium">
                      <Building2 className="h-3 w-3 text-sky-600" />
                      <span>{t.role} — {t.company}</span>
                    </div>
                  </div>
                </div>
                <div className="inline-flex items-center gap-1.5 text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 font-semibold">
                  <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                  <span>{t.projectTag}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
