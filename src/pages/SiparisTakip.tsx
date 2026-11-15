import { useState, useEffect, useCallback } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import {
  fetchPublicOrderTrackingWithStatus,
  type PublicOrderTrackingItem,
} from "@/lib/adminStorage";
import {
  Search,
  PackageCheck,
  Scissors,
  Flame,
  Layers,
  Truck,
  Clock,
  KeyRound,
  FileText,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Phone,
} from "lucide-react";

const STAGES = [
  {
    key: "new",
    step: 1,
    title: "Sipariş & Ölçü Kaydı Alındı",
    desc: "Ölçü ve renk tercihleriniz Acarpen proje sistemine kaydedildi.",
    icon: FileText,
  },
  {
    key: "in_review",
    step: 2,
    title: "CNC Profil & Destek Sacı Kesimi",
    desc: "Fıratpen, Winsa & Pimapen profiller ve galvanizli çelik destek sacları CNC hattında kesiliyor.",
    icon: Scissors,
  },
  {
    key: "quoted",
    step: 3,
    title: "4 Köşe CNC Kaynak & Aksesuar",
    desc: "Köşe kaynak, temizleme, EPDM conta ve ispanyolet mekanizma montajı yapılıyor.",
    icon: Flame,
  },
  {
    key: "approved",
    step: 4,
    title: "4+16+4 Isıcam & Kalite Kontrol",
    desc: "Isıcam montajı ve kanat gönye kalite kontrol testleri tamamlandı.",
    icon: Layers,
  },
  {
    key: "shipped",
    step: 5,
    title: "Sevkiyat & Yerinde Montaj",
    desc: "Doğrama ve cam balkonlarınız montaj ekibimizle adresinize sevk edildi.",
    icon: Truck,
  },
  {
    key: "completed",
    step: 6,
    title: "Teslimat & Montaj Tamamlandı",
    desc: "PU köpük ve mastik izolasyonlu montaj tamamlanarak teslim edildi.",
    icon: PackageCheck,
  },
];

function getActiveStepIndex(item: PublicOrderTrackingItem): number {
  if (item.status === "cancelled") return 0;
  if (item.status === "completed") return 6;
  if (item.productionStage && item.productionStage >= 1 && item.productionStage <= 6) {
    return item.productionStage;
  }
  switch (item.status) {
    case "new":
      return 1;
    case "in_review":
      return 2;
    case "quoted":
      return 3;
    case "approved":
      return 4;
    default:
      return 1;
  }
}

export default function SiparisTakip() {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get("id") || "";
  const initialPin = searchParams.get("pin") || "";
  const [query, setQuery] = useState(initialQuery);
  const [trackingPin, setTrackingPin] = useState(initialPin);
  const [matches, setMatches] = useState<PublicOrderTrackingItem[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState<string>("");
  const [searched, setSearched] = useState(false);
  const [lookupError, setLookupError] = useState<string | null>(null);
  const [searchingRemote, setSearchingRemote] = useState(false);

  const handleSearchValue = useCallback(async (val: string, pinVal: string) => {
    const trimmed = val.trim();
    const cleanPin = pinVal.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
    if (!trimmed) return;

    if (cleanPin.length < 6) {
      setMatches([]);
      setSelectedOrderId("");
      setSearched(true);
      setLookupError(
        "Güvenlik amacıyla sipariş veya telefon numarasıyla birlikte 6 haneli Takip Güvenlik Kodunu (PIN) girmelisiniz."
      );
      return;
    }

    setSearchingRemote(true);
    setLookupError(null);
    try {
      const res = await fetchPublicOrderTrackingWithStatus(trimmed, cleanPin);
      if (!res.ok) {
        setMatches([]);
        setSelectedOrderId("");
        setLookupError(
          res.error || "Sipariş takip sunucusuna bağlanılamadı. Lütfen tekrar deneyin."
        );
      } else {
        setMatches(res.items);
        setSelectedOrderId(res.items[0]?.orderId || "");
      }
      setSearched(true);
    } finally {
      setSearchingRemote(false);
    }
  }, []);

  useEffect(() => {
    if (initialQuery && initialPin) {
      void handleSearchValue(initialQuery, initialPin);
    }
  }, [initialQuery, initialPin, handleSearchValue]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void handleSearchValue(query, trackingPin);
  };

  const matchedQuote =
    matches.find((m) => m.orderId === selectedOrderId) || matches[0] || null;
  const currentStep = matchedQuote ? getActiveStepIndex(matchedQuote) : 0;

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 pt-28 lg:pt-32">
      <SEO
        title="Canlı Sipariş & Üretim Takip Portalı | Acarpen Adana"
        description="Acarpen Fıratpen, Winsa ve Pimapen PVC pencere, kapı ve cam balkon siparişinizin CNC kesim, köşe kaynak, ısıcam ve montaj aşamalarını sipariş numaranız ve 6 haneli takip güvenlik kodunuzla canlı takip edin."
        canonicalPath="/siparis-takip"
        breadcrumbs={[{ name: "Sipariş Takip", path: "/siparis-takip" }]}
      />
      <Navbar />

      <section className="py-14 border-b border-slate-200 bg-gradient-to-b from-sky-50 via-white to-slate-50">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-4">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-100 border border-sky-200 text-xs font-mono uppercase tracking-widest text-sky-800 font-bold">
            <Clock className="h-3.5 w-3.5 text-sky-600" />
            Acarpen Çift Doğrulamalı İmalat İzleme
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-slate-900">
            Sipariş & Üretim <span className="text-gradient italic">Takip Portalı</span>
          </h1>
          <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto font-normal">
            Başvuru sonrası size verilen Sipariş/Teklif Numarası (veya Telefon Numarası) ile{" "}
            <strong className="text-slate-800">6 Haneli Takip Güvenlik Kodunuzu (PIN)</strong>{" "}
            girerek imalat aşamasını kişisel verileriniz korunarak anlık görüntüleyin.
          </p>

          <form onSubmit={handleSubmit} className="pt-4 max-w-2xl mx-auto flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="h-4 w-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Sipariş No (TKF-...) veya Telefon (05XX...)..."
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white border border-slate-300 text-slate-900 text-sm font-medium focus:outline-none focus:border-sky-600 shadow-sm"
              />
            </div>
            <div className="relative sm:w-44">
              <KeyRound className="h-4 w-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                maxLength={12}
                value={trackingPin}
                onChange={(e) => setTrackingPin(e.target.value.toUpperCase())}
                placeholder="Takip PIN *"
                aria-label="6 Haneli Takip Güvenlik Kodu"
                className="w-full pl-10 pr-3 py-3.5 rounded-2xl bg-white border border-slate-300 text-slate-900 font-mono uppercase tracking-widest text-sm font-bold focus:outline-none focus:border-sky-600 shadow-sm"
              />
            </div>
            <Button
              type="submit"
              disabled={searchingRemote}
              className="rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-bold px-7 h-12 shadow-md"
            >
              {searchingRemote ? "Sorgulanıyor..." : "Sorgula"}
            </Button>
          </form>
        </div>
      </section>

      <section className="py-14 max-w-6xl mx-auto px-6">
        {searched && !matchedQuote && (
          <div className="bg-white rounded-3xl p-8 border border-rose-200 text-center max-w-xl mx-auto space-y-4 shadow-md">
            <AlertCircle className="h-12 w-12 text-rose-500 mx-auto" />
            <h2 className="font-serif text-2xl font-bold text-slate-900">
              {lookupError ? "Doğrulama / Bağlantı Uyarısı" : "Kayıt Bulunamadı"}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              {lookupError ? (
                lookupError
              ) : (
                <>
                  Girdiğiniz <strong className="text-slate-900">"{query}"</strong> ve{" "}
                  <strong className="font-mono text-slate-900">PIN</strong> bilgisiyle eşleşen aktif
                  bir sipariş kaydı bulunamadı. Lütfen Sipariş Numaranızı ve 6 haneli PIN kodunuzu
                  kontrol edin.
                </>
              )}
            </p>
            <div className="pt-2">
              <a
                href="https://wa.me/905336253611?text=Merhaba%20Acarpen%2C%20sipari%C5%9F%20durumumu%20sorgulamak%20istiyorum."
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6">
                  WhatsApp Destek: 0533 625 36 11
                </Button>
              </a>
            </div>
          </div>
        )}

        {matches.length > 1 && matchedQuote && (
          <div className="mb-6 bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-700 mr-1">
              Bu doğrulamayla eşleşen siparişler ({matches.length}):
            </span>
            {matches.map((m) => (
              <button
                key={m.orderId}
                type="button"
                onClick={() => setSelectedOrderId(m.orderId)}
                className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold border transition-colors ${
                  m.orderId === matchedQuote.orderId
                    ? "bg-sky-600 text-white border-sky-600"
                    : "bg-slate-50 text-slate-700 border-slate-300 hover:border-sky-400"
                }`}
              >
                {m.orderId} • {m.date}
              </button>
            ))}
          </div>
        )}

        {matchedQuote && (
          <div className="space-y-8 animate-fade-up">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-lg grid md:grid-cols-3 gap-6">
              <div>
                <div className="text-[11px] font-mono uppercase text-sky-700 font-bold">
                  Sipariş / Teklif No
                </div>
                <div className="font-mono text-xl font-bold text-slate-900 mt-1">
                  {matchedQuote.orderId}
                </div>
                <div className="text-xs text-slate-500 mt-0.5">Kayıt Tarihi: {matchedQuote.date}</div>
              </div>
              <div>
                <div className="text-[11px] font-mono uppercase text-sky-700 font-bold">
                  Üretim Grubu (KVKK Korumalı)
                </div>
                <div className="font-bold text-base text-slate-900 mt-1">
                  {matchedQuote.systemCategory || "PVC Doğrama Sistemleri"}
                </div>
                <div className="text-xs text-emerald-700 font-medium mt-0.5">
                  Kişisel ve teknik ölçü detayları gizlilik amacıyla maskelenmiştir
                </div>
              </div>
              <div className="md:text-right">
                <div className="text-[11px] font-mono uppercase text-sky-700 font-bold">
                  Planlanan Termin / Kalite
                </div>
                <div className="font-serif text-xl font-extrabold text-slate-900 mt-1">
                  {matchedQuote.qualityHold
                    ? "Kalite İncelemesinde"
                    : matchedQuote.estimatedDeliveryDate || "Planlanıyor"}
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  Fıratpen, Winsa & Pimapen Yetkili Bayi Garantisi
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-lg">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-8 pb-4 border-b border-slate-100">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-slate-900">
                    Canlı Üretim & Montaj Durumu
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Gülbahçesi Mah. Seyhan / Adana Üretim Merkezi
                  </p>
                </div>
                {matchedQuote.status === "cancelled" ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 font-bold">
                    <AlertCircle className="h-4 w-4 text-rose-600" />
                    Sipariş İptal Edildi
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                    <ShieldCheck className="h-4 w-4 text-emerald-600" />
                    Aşama {currentStep} / 6 Aktif
                  </span>
                )}
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {STAGES.map((stage) => {
                  const Icon = stage.icon;
                  const isDone = stage.step <= currentStep;
                  const isCurrent = stage.step === currentStep;
                  return (
                    <div
                      key={stage.key}
                      className={`rounded-2xl p-5 border transition-all ${
                        isCurrent
                          ? "border-sky-500 bg-sky-50/70 shadow-md"
                          : isDone
                          ? "border-emerald-200 bg-emerald-50/40"
                          : "border-slate-200 bg-slate-50 opacity-60"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span
                          className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full ${
                            isCurrent
                              ? "bg-sky-600 text-white"
                              : isDone
                              ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                              : "bg-slate-200 text-slate-600"
                          }`}
                        >
                          {isCurrent ? "AKTİF İSTASYON" : isDone ? "TAMAMLANDI" : `ADIM 0${stage.step}`}
                        </span>
                        <Icon
                          className={`h-5 w-5 ${
                            isCurrent
                              ? "text-sky-600 animate-pulse"
                              : isDone
                              ? "text-emerald-600"
                              : "text-slate-400"
                          }`}
                        />
                      </div>
                      <h3 className="font-serif text-base font-bold text-slate-900 mb-1">
                        {stage.title}
                      </h3>
                      <p className="text-xs text-slate-600 leading-relaxed">{stage.desc}</p>
                    </div>
                  );
                })}
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                  <CheckCircle2 className="h-4 w-4 text-sky-600" />
                  <span>
                    Sevkiyat saati ve montaj randevusu için müşteri temsilcimizle görüşebilirsiniz.
                  </span>
                </div>
                <div className="flex gap-3">
                  <a href="tel:+905336253611">
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-full border-slate-300 text-slate-800 hover:bg-slate-100 text-xs font-bold"
                    >
                      <Phone className="h-3.5 w-3.5 mr-1.5 text-sky-600" />
                      0533 625 36 11
                    </Button>
                  </a>
                  <Link to="/hesaplama">
                    <Button
                      size="sm"
                      className="rounded-full bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs"
                    >
                      Yeni Ölçü Ekle
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
