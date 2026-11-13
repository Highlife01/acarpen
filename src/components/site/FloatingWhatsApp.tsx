import { MessageCircle, Phone } from "lucide-react";

export const FloatingWhatsApp = () => {
  const whatsappUrl =
    "https://wa.me/905336253611?text=Merhaba%20Acarpen%20(F%C4%B1ratpen%20Yetkili%20Bayi)%2C%20PVC%20pencere%2C%20kap%C4%B1%20ve%20cam%20balkon%20sistemleri%20hakk%C4%B1nda%20fiyat%20teklifi%20almak%20istiyorum.";

  return (
    <div className="fixed bottom-4 right-4 z-40 flex flex-col items-end gap-2">
      {/* Quick Phone Call Button */}
      <a
        href="tel:+905336253611"
        aria-label="Hemen Ara: 0533 625 36 11"
        className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-full bg-slate-900/95 backdrop-blur-md border border-sky-400/40 text-white shadow-lg hover:border-sky-400 transition-all hover:-translate-y-0.5 text-xs font-semibold"
      >
        <Phone className="h-3.5 w-3.5 text-sky-400" />
        <span>0533 625 36 11</span>
      </a>

      {/* WhatsApp Lead Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp Hızlı Fiyat & Sipariş Hattı: 0533 625 36 11"
        className="group flex items-center gap-2.5 pl-3 pr-4 sm:pl-4 sm:pr-5 py-2.5 sm:py-3 rounded-full bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold text-xs sm:text-sm shadow-[0_10px_28px_rgba(16,185,129,0.4)] hover:shadow-[0_14px_34px_rgba(16,185,129,0.6)] transition-all duration-300 hover:-translate-y-0.5"
      >
        <div className="h-7 w-7 rounded-full bg-white/20 grid place-items-center shrink-0">
          <MessageCircle className="h-4 w-4 fill-white text-white" />
        </div>
        <div className="text-left leading-tight">
          <span className="hidden sm:block text-[10px] uppercase tracking-wider text-emerald-100 font-mono">
            WhatsApp Teklif Hattı
          </span>
          <span className="sm:hidden">WhatsApp</span>
          <span className="hidden sm:inline">0533 625 36 11</span>
        </div>
      </a>
    </div>
  );
};
