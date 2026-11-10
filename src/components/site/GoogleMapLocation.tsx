import { MapPin, Navigation, Phone, Clock, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";

export const GoogleMapLocation = () => {
  return (
    <section className="py-20 bg-slate-50 border-t border-slate-200 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-12 gap-8 items-stretch">
          {/* Left: Location & Logistics Info */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-8 border border-slate-200 shadow-lg flex flex-col justify-between space-y-6">
            <div>
              <span className="inline-block text-xs font-mono uppercase tracking-[0.2em] text-sky-700 font-bold bg-sky-50 px-3 py-1 rounded-full border border-sky-200 mb-3">
                // Üretim & Showroom Konumu
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 mb-3">
                Adana Seyhan <span className="text-gradient italic">Acarpen Merkezimiz</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6 font-normal">
                Gülbahçesi Mahallesi'ndeki üretim ve showroom merkezimizde Fıratpen PVC pencere ve kapı serilerini, renk kartelalarını ve cam balkon sistemlerimizi yakından inceleyebilirsiniz.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-3.5">
                  <div className="h-10 w-10 rounded-xl bg-sky-50 border border-sky-200 grid place-items-center text-sky-600 shrink-0">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 font-medium">Açık Adres</div>
                    <div className="text-sm font-bold text-slate-900">
                      GÜLBAHÇESİ MAH. 13428 SOK. NO:16/17 SEYHAN - SEYHAN / ADANA
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="h-10 w-10 rounded-xl bg-emerald-50 border border-emerald-200 grid place-items-center text-emerald-600 shrink-0">
                    <Truck className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 font-medium">Lojistik & Montaj Ağı</div>
                    <div className="text-sm font-bold text-slate-900">
                      Adana (Seyhan, Çukurova, Yüreğir, Sarıçam), Mersin, Osmaniye, Hatay & Çukurova Geneli
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="h-10 w-10 rounded-xl bg-amber-50 border border-amber-200 grid place-items-center text-amber-600 shrink-0">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 font-medium">Çalışma Saatleri</div>
                    <div className="text-sm font-bold text-slate-900">
                      Pazartesi – Cumartesi: 08:00 – 19:00
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-3">
              <a
                href="https://maps.google.com/?q=Gülbahçesi+Mah.+13428+Sok.+No:16/17+Seyhan+Adana"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1"
              >
                <Button className="w-full rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs h-11 shadow-md">
                  <Navigation className="mr-2 h-4 w-4" />
                  Google Haritalar'da Yol Tarifi Al
                </Button>
              </a>
              <a href="tel:+905336253611">
                <Button variant="outline" className="rounded-xl border-slate-300 bg-white text-slate-800 hover:bg-slate-50 text-xs font-bold h-11 px-4">
                  <Phone className="mr-1.5 h-4 w-4 text-sky-600" />
                  0533 625 36 11
                </Button>
              </a>
            </div>
          </div>

          {/* Right: Interactive Google Map Embed */}
          <div className="lg:col-span-7 rounded-3xl overflow-hidden border border-slate-200 min-h-[380px] relative bg-slate-100 shadow-lg">
            <iframe
              title="Acarpen Fıratpen Yetkili Bayi — Gülbahçesi Mah. 13428 Sok. No:16/17 Seyhan Adana Harita Konumu"
              src="https://www.google.com/maps?q=G%C3%BClbah%C3%A7esi+Mah.+13428+Sok.+No:16/17+Seyhan+Adana&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: "380px" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
