import { MessageCircle, Phone } from "lucide-react";

export const FloatingWhatsApp = () => {
  const whatsappUrl =
    "https://wa.me/905336253611?text=Merhaba%20Acarpen%20(F%C4%B1ratpen%20Yetkili%20Bayi)%2C%20PVC%20pencere%2C%20kap%C4%B1%20ve%20cam%20balkon%20sistemleri%20hakk%C4%B1nda%20fiyat%20teklifi%20almak%20istiyorum.";

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-2.5">
      {/* Quick Phone Call Button (Mobile friendly) */}
      <a
        href="tel:+905336253611"
        aria-label="Hemen Ara: 0533 625 36 11"
        className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-slate-900/95 backdrop-blur-md border border-sky-400/40 text-white shadow-lg hover:border-sky-400 transition-all hover:-translate-y-0.5 text-xs font-semibold"
      >
        <Phone className="h-3.5 w-3.5 text-sky-400 animate-pulse" />
        <span>0533 625 36 11</span>
      </a>

      {/* WhatsApp Lead Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp Hızlı Fiyat & Sipariş Hattı: 0533 625 36 11"
        className="group flex items-center gap-2.5 pl-4 pr-5 py-3.5 rounded-full bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold text-xs sm:text-sm shadow-[0_10px_30px_rgba(16,185,129,0.45)] hover:shadow-[0_14px_38px_rgba(16,185,129,0.65)] transition-all duration-300 hover:-translate-y-0.5"
      >
        <div className="h-7 w-7 rounded-full bg-white/20 grid place-items-center">
          <MessageCircle className="h-4 w-4 fill-white text-white" />
        </div>
        <div className="text-left leading-tight">
          <span className="block text-[10px] uppercase tracking-wider text-emerald-100 font-mono">
            WhatsApp Teklif Hattı
          </span>
          <span>0533 625 36 11</span>
        </div>
      </a>
    </div>
  );
};
