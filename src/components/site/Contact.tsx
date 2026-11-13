import { useState } from "react";
import { Phone, Mail, MapPin, Clock, Send, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { addAdminQuote, addAdminMessage } from "@/lib/adminStorage";

export const Contact = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [glassType, setGlassType] = useState("70'lik / 75'lik Fıratpen PVC Pencere (4+16+4 Isıcam)");
  const [details, setDetails] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      toast.error("Lütfen adınızı ve telefon numaranızı giriniz.");
      return;
    }

    setLoading(true);

    const created = addAdminQuote({
      customerName: name.trim(),
      phone: phone.trim(),
      city: "Adana (İletişim Formu)",
      glassType,
      thickness: "Beyaz / Antrasit / Altınmeşe • 4+16+4 Isıcam",
      dimensions: details.trim() ? details.trim().slice(0, 60) : "Keşif / Ölçü Bekleniyor",
      totalArea: 10,
      estimatedPrice: 0,
      status: "new",
    });

    addAdminMessage({
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim() || "-",
      subject: `Teklif Talebi: ${glassType}`,
      message: details.trim() || "İletişim formu üzerinden keşif/fiyat talebi gönderildi.",
    });

    setTimeout(() => {
      setLoading(false);
      toast.success(
        `Talebiniz (#${created.id}) Acarpen sistemine kaydedildi! Satış temsilcimiz en kısa sürede sizi arayacaktır.`
      );
      setName("");
      setPhone("");
      setEmail("");
      setDetails("");
    }, 400);
  };

  const handleSendWhatsAppDirect = () => {
    const text = encodeURIComponent(
      `Merhaba Acarpen (Fıratpen Yetkili Bayi),\nWeb siteniz üzerinden teklif/keşif talebi iletiyorum:\n\n` +
        `• Ad Soyad / Firma: ${name || "-"}\n` +
        `• Telefon: ${phone || "-"}\n` +
        `• Ürün / Kategori: ${glassType}\n` +
        `• Ölçü & Notlar: ${details || "Belirtilmedi"}`
    );
    window.open(`https://wa.me/905336253611?text=${text}`, "_blank");
  };

  return (
    <section id="iletisim" className="relative py-24 overflow-hidden bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 overflow-hidden">
        <div className="grid lg:grid-cols-5 gap-10">
          {/* Left info */}
          <div className="lg:col-span-2 space-y-6">
            <span className="inline-block text-xs font-mono uppercase tracking-[0.2em] text-sky-700 font-bold bg-sky-100/80 px-3.5 py-1.5 rounded-full border border-sky-200">
              İletişim & Ücretsiz Keşif
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 break-words">
              Projeniz İçin <span className="text-gradient italic">Teklif Alın</span>
            </h2>
            <p className="text-slate-600 leading-relaxed text-sm sm:text-base font-normal">
              Standart hazır ölçü veya özel ölçü PVC pencere, balkon kapısı, WC kapısı, sürme sistem, cam balkon ve toplu şantiye siparişleriniz için bize ulaşın.
            </p>

            <div className="space-y-3.5 pt-2">
              {[
                {
                  icon: Phone,
                  label: "Telefon & WhatsApp Sipariş Hattı",
                  value: "0533 625 36 11",
                  href: "tel:+905336253611",
                },
                {
                  icon: MessageCircle,
                  label: "WhatsApp Hızlı Teklif & Ölçü Hattı",
                  value: "0533 625 36 11 (Tıkla & Yaz)",
                  href: "https://wa.me/905336253611?text=Merhaba%20Acarpen%2C%20PVC%20pencere%20ve%20cam%20balkon%20i%C3%A7in%20fiyat%20almak%20istiyorum.",
                },
                {
                  icon: Mail,
                  label: "Kurumsal E-Posta",
                  value: "info@acarpen.com.tr",
                  href: "mailto:info@acarpen.com.tr",
                },
                {
                  icon: MapPin,
                  label: "Üretim & Showroom Adresi",
                  value: "Gülbahçesi Mah. 13428 Sok. No:16/17 Seyhan - Seyhan / ADANA",
                  href: "https://maps.google.com/?q=Gülbahçesi+Mah.+13428+Sok.+No:16/17+Seyhan+Adana",
                },
                {
                  icon: Clock,
                  label: "Çalışma Saatleri",
                  value: "Pzt – Cmt: 08:00 – 19:00",
                },
              ].map((item) => {
                const Icon = item.icon;
                const Wrapper = item.href ? "a" : "div";
                return (
                  <Wrapper
                    key={item.label}
                    {...(item.href ? { href: item.href, target: item.href.startsWith("http") ? "_blank" : undefined, rel: "noopener noreferrer" } : {})}
                    className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-slate-200 hover:border-sky-400 transition-colors shadow-sm"
                  >
                    <div className="h-11 w-11 rounded-xl bg-sky-50 border border-sky-200 grid place-items-center text-sky-600 shrink-0">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 font-medium">{item.label}</div>
                      <div className="font-bold text-slate-900 text-sm sm:text-base mt-0.5">{item.value}</div>
                    </div>
                  </Wrapper>
                );
              })}
            </div>
          </div>

          {/* Right form */}
          <form
            onSubmit={handleSubmit}
            className="lg:col-span-3 bg-white rounded-3xl p-8 sm:p-10 space-y-6 border border-slate-200 shadow-xl"
          >
            <div className="border-b border-slate-100 pb-4">
              <h3 className="font-serif text-2xl font-bold text-slate-900">Hızlı Fiyat & Keşif Talep Formu</h3>
              <p className="text-xs text-slate-500 mt-1 font-normal">
                Ölçülerinizi, renk (Beyaz / Antrasit / Altınmeşe) ve açılım tercihlerinizi yazın; hemen teklif hazırlayalım.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-2">
                  Ad Soyad / Firma *
                </label>
                <input
                  required
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Adınız Soyadınız veya İnşaat Firması"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-sky-600 focus:bg-white transition-colors text-sm font-medium"
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-2">
                  Telefon *
                </label>
                <input
                  required
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="05XX XXX XX XX"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-sky-600 focus:bg-white transition-colors text-sm font-medium"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-2">
                  E-Posta (Opsiyonel)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ornek@firma.com"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-sky-600 focus:bg-white transition-colors text-sm font-medium"
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-2">
                  Ürün Kategorisi
                </label>
                <select
                  value={glassType}
                  onChange={(e) => setGlassType(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-sky-600 focus:bg-white transition-colors text-sm font-semibold"
                >
                  <option className="bg-white">70'lik / 75'lik Fıratpen PVC Pencere (4+16+4 Isıcam)</option>
                  <option className="bg-white">Ortadan Kanatlı / Bir Sabit Bir Açılır PVC Pencere</option>
                  <option className="bg-white">Çift Kanat PVC Sürme Pencere & Hebeschiebe</option>
                  <option className="bg-white">PVC Balkon Kapısı (85×198 / 85×210) & WC Kapısı (85×200)</option>
                  <option className="bg-white">Düz, L ve U Katlanır / Sürme Cam Balkon</option>
                  <option className="bg-white">Motorlu Panjur, Plise Sineklik & Montaj Malzemeleri</option>
                  <option className="bg-white">B2B Müteahhit / Şantiye Toplu Sipariş</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-2">
                Ölçüler, Renk & Açılım Detayları
              </label>
              <textarea
                rows={4}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Örn: 4 adet 120x120, 2 adet 150x140 pencere, 1 adet 85x210 balkon kapısı; Antrasit Gri, Çift Açılım..."
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-sky-600 focus:bg-white transition-colors resize-none text-sm font-medium"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-3 pt-1">
              <Button
                type="submit"
                size="lg"
                disabled={loading}
                className="w-full rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold h-12 shadow-md text-xs sm:text-sm"
              >
                <Send className="mr-2 h-4 w-4" />
                {loading ? "Kaydediliyor..." : "Teklif Talebini Gönder"}
              </Button>

              <Button
                type="button"
                size="lg"
                onClick={handleSendWhatsAppDirect}
                className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-12 shadow-md text-xs sm:text-sm"
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                WhatsApp: 0533 625 36 11
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};
