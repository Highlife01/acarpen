import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, HelpCircle, ArrowRight, Sparkles } from "lucide-react";
import {
  GEO_QUESTIONS_DATABASE,
  GEO_QUESTION_CATEGORIES,
  type GeoQuestionCategory,
} from "@/data/geoQuestionsData";

export const GeoQuestionHub = () => {
  const [selectedCategory, setSelectedCategory] = useState<GeoQuestionCategory | "Tümü">("Tümü");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredQuestions = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return GEO_QUESTIONS_DATABASE.filter((entry) => {
      if (selectedCategory !== "Tümü" && entry.category !== selectedCategory) {
        return false;
      }
      if (!q) return true;
      return (
        entry.question.toLowerCase().includes(q) ||
        entry.answer.toLowerCase().includes(q) ||
        entry.category.toLowerCase().includes(q)
      );
    });
  }, [selectedCategory, searchTerm]);

  return (
    <section
      id="geo-soru-cevap-havuzu"
      className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-lg space-y-6"
    >
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 border-b border-slate-100 pb-6">
        <div className="space-y-2 max-w-3xl">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-[0.14em] text-sky-700 font-bold bg-sky-50 px-3 py-1 rounded-full border border-sky-200">
            <Sparkles className="h-3.5 w-3.5 text-sky-600" />
            GEO &amp; Teknik Bilgi Bankası • {GEO_QUESTIONS_DATABASE.length} Sık Sorulan Soru
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            PVC Pencere, Cam Balkon ve Bölgesel Uygulamalar Hakkında{" "}
            <span className="text-gradient">Tüm Merak Edilenler</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Profil kalınlığı, destek sacı, Solar Low-E ısıcam, Fıratpen / Winsa / Pimapen farkları, katlanır ve giyotin cam balkon detayları ile 7 il sevkiyat süreçleri hakkında doğrulanmış teknik yanıtlar.
          </p>
        </div>

        <div className="relative w-full lg:w-80 shrink-0">
          <Search className="h-4 w-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Soru veya konu ara (örn. Selenit, 10mm)..."
            aria-label="Teknik soru havuzunda ara"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs sm:text-sm focus:outline-none focus:border-sky-600 focus:bg-white"
          />
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setSelectedCategory("Tümü")}
          className={`text-xs font-bold px-3.5 py-1.5 rounded-full border transition-colors ${
            selectedCategory === "Tümü"
              ? "bg-sky-600 text-white border-sky-600 shadow-sm"
              : "bg-slate-50 text-slate-700 border-slate-200 hover:border-sky-300 hover:bg-white"
          }`}
        >
          Tümü ({GEO_QUESTIONS_DATABASE.length})
        </button>
        {GEO_QUESTION_CATEGORIES.map((cat) => {
          const count = GEO_QUESTIONS_DATABASE.filter((item) => item.category === cat).length;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs font-bold px-3.5 py-1.5 rounded-full border transition-colors ${
                selectedCategory === cat
                  ? "bg-sky-600 text-white border-sky-600 shadow-sm"
                  : "bg-slate-50 text-slate-700 border-slate-200 hover:border-sky-300 hover:bg-white"
              }`}
            >
              {cat} ({count})
            </button>
          );
        })}
      </div>

      {/* Search Count Indicator */}
      <div className="text-xs font-mono text-slate-500 font-semibold">
        Gösterilen teknik yanıt: <span className="text-sky-700">{filteredQuestions.length}</span> /{" "}
        {GEO_QUESTIONS_DATABASE.length}
      </div>

      {/* Q&A Grid */}
      {filteredQuestions.length === 0 ? (
        <div className="rounded-2xl bg-slate-50 border border-slate-200 p-8 text-center text-sm text-slate-600">
          Aramanızla eşleşen soru bulunamadı. Filtreleri temizleyebilir veya{" "}
          <Link to="/iletisim" className="text-sky-700 font-bold underline">
            teknik ekibimize doğrudan sorabilirsiniz
          </Link>
          .
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {filteredQuestions.map((entry) => (
            <article
              key={entry.id}
              className="rounded-2xl bg-slate-50/80 border border-slate-200 p-5 hover:border-sky-300 hover:bg-white transition-all flex flex-col justify-between gap-3"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-white border border-slate-200 text-sky-700 font-bold">
                    {entry.category}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 font-semibold">
                    {entry.id}
                  </span>
                </div>
                <h3 className="font-serif text-base font-bold text-slate-900 flex items-start gap-2 leading-snug">
                  <HelpCircle className="h-4 w-4 text-sky-600 shrink-0 mt-1" />
                  <span>{entry.question}</span>
                </h3>
                <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed pl-6">
                  {entry.answer}
                </p>
              </div>
              <div className="pl-6 pt-2 border-t border-slate-200/70 flex items-center justify-between">
                <Link
                  to={entry.targetUrl}
                  className="inline-flex items-center gap-1 text-xs font-bold text-sky-700 hover:text-sky-900 transition-colors"
                >
                  <span>{entry.targetLabel}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <Link
                  to="/hesaplama"
                  className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-900"
                >
                  Ölçü &amp; Teklif →
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};
