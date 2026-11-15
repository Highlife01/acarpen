import React, { useEffect, useMemo, useState } from "react";
import {
  Globe,
  Search,
  CheckCircle2,
  AlertTriangle,
  Download,
  Bot,
  Activity,
  Phone,
  MessageCircle,
  Calculator,
  FileText,
  Sparkles,
  ExternalLink,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  SEO_KEYWORD_DATABASE,
  detectKeywordCannibalization,
  getKeywordClusterSummary,
  type KeywordClusterCode,
  type KeywordPriority,
  type SearchIntent,
  type SeoKeywordEntry,
} from "@/data/seoKeywordMap";
import { GEO_QUESTIONS_DATABASE } from "@/data/geoQuestionsData";
import { getCroStats, subscribeCroStats, type CroFunnelStats } from "@/lib/conversionTracker";
import { buildSeoKeywordsCsv, escapeCsvCell } from "@/lib/csvExport";
import type { VisitorTelemetryStats } from "@/lib/analytics";

interface SeoGeoModuleViewProps {
  telemetry: VisitorTelemetryStats;
}

type SeoTab = "overview" | "keywords" | "technical" | "geo_ai";
type GeoEngine = "ChatGPT" | "Gemini" | "Perplexity" | "Bing Copilot";
type GeoCheckStatus = "Ölçülmedi" | "Doğru Kaynaklandı" | "Kısmi / Eksik Bilgi" | "Görünmedi";

interface GeoVisibilityTestRow {
  id: string;
  prompt: string;
  engine: GeoEngine;
  status: GeoCheckStatus;
  brandMentioned: boolean;
  napAccurate: boolean;
  notes: string;
  testedAt: string;
}

const GEO_VISIBILITY_STORAGE_KEY = "acarpen_geo_visibility_log_v1";

const DEFAULT_GEO_TESTS: GeoVisibilityTestRow[] = [
  {
    id: "GEO-CHK-01",
    prompt: "Adana Seyhan güvenilir PVC pencere ve cam balkon firmaları hangileri?",
    engine: "ChatGPT",
    status: "Ölçülmedi",
    brandMentioned: false,
    napAccurate: false,
    notes: "Operatör tarafından canlı ChatGPT web araması ile doğrulanması bekleniyor.",
    testedAt: "Veri bekleniyor",
  },
  {
    id: "GEO-CHK-02",
    prompt: "Adana sıcak iklimi için Fıratpen Selenit 75 mi Redonit 85 mi seçilmeli?",
    engine: "Gemini",
    status: "Ölçülmedi",
    brandMentioned: false,
    napAccurate: false,
    notes: "Google Gemini AI Overviews / LLM yanıtı test kaydı bekleniyor.",
    testedAt: "Veri bekleniyor",
  },
  {
    id: "GEO-CHK-03",
    prompt: "Acarpen Adana adresi telefon numarası ve hizmet verdiği iller nelerdir?",
    engine: "Perplexity",
    status: "Ölçülmedi",
    brandMentioned: false,
    napAccurate: false,
    notes: "Perplexity kaynak atıfı (acarpen.com.tr / llms.txt) doğrulaması bekleniyor.",
    testedAt: "Veri bekleniyor",
  },
  {
    id: "GEO-CHK-04",
    prompt: "Çukurova bölgesine Mersin ve Hatay'a toplu şantiye PVC doğrama sevkiyatı yapan yerler",
    engine: "Bing Copilot",
    status: "Ölçülmedi",
    brandMentioned: false,
    napAccurate: false,
    notes: "IndexNow ve Bing dizinleme sonrası Copilot yanıtı kontrol edilecek.",
    testedAt: "Veri bekleniyor",
  },
];

function loadGeoTests(): GeoVisibilityTestRow[] {
  try {
    const raw = localStorage.getItem(GEO_VISIBILITY_STORAGE_KEY);
    if (!raw) return DEFAULT_GEO_TESTS;
    const parsed = JSON.parse(raw) as GeoVisibilityTestRow[];
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_GEO_TESTS;
  } catch {
    return DEFAULT_GEO_TESTS;
  }
}

const TECHNICAL_CHECKLIST_ITEMS = [
  {
    title: "Kanonik Domain & HTTPS Yönlendirmesi",
    detail: "https://www.acarpen.com.tr ana host olarak tanımlı; http ve çıplak/eski alan adları kanonik URL'e yönleniyor.",
    status: "Aktif (Kodda Doğrulandı)",
  },
  {
    title: "301 SEO Alias Yönlendirmeleri (firebase.json + İstemci)",
    detail: "35 eski ve varyant URL (/pvc-pencere-sistemleri, /firatpen-selenit-75, /bolgeler/adana vb.) kalıcı 301 ile hedef URL'lere taşındı.",
    status: "Aktif (35 Kural)",
  },
  {
    title: "Gerçek HTTP 404 Politikası (Soft-404 Temizliği)",
    detail: "firebase.json içindeki '** -> /index.html' kuralı kaldırıldı; bilinmeyen rotalar noindex/canonicalsız dist/404.html döndürüyor.",
    status: "Aktif (Canlı 404)",
  },
  {
    title: "/admin Portalı İndeks Koruması",
    detail: "robots.txt 'Disallow: /admin', X-Robots-Tag: noindex, nofollow, noarchive başlığı ve dist/admin/index.html meta etiketi aktif.",
    status: "Aktif (Korumalı)",
  },
  {
    title: "WebP Görsel Sıkıştırma & CLS Ölçü Niteliği",
    detail: "Tüm ürün ve proje görselleri WebP formatına dönüştürüldü; Hero LCP görseline loading='eager' ve fetchPriority='high' eklendi.",
    status: "Aktif (WebP)",
  },
  {
    title: "Doğrulanmamış İddia & Sahte Puan Temizliği",
    detail: "Resmî kaydı doğrulanamayan 'Yetkili Bayi', 'ISO 9001' ve sahte AggregateRating (4.9/148) kod ve JSON-LD'den temizlendi.",
    status: "Uyumlu (Temizlendi)",
  },
  {
    title: "Google Search Console & Bing Doğrulama Kodu",
    detail: "Boş content='' meta etiketleri temizlendi. Gerçek GSC/Bing/Yandex doğrulama anahtarları VITE_GSC_VERIFICATION env ile eklenmeyi bekliyor.",
    status: "Aksiyon Bekliyor",
  },
  {
    title: "Resmî Bayilik Belgelerinin Doğrulanması",
    detail: "Fıratpen, Winsa veya Pimapen yetkili üretici sertifikası işletme sahibince sağlanırsa ilgili marka için belgeye dayalı ibare açılabilir.",
    status: "Sahip Onayı Bekliyor",
  },
];

export const SeoGeoModuleView: React.FC<SeoGeoModuleViewProps> = ({ telemetry }) => {
  const [activeTab, setActiveTab] = useState<SeoTab>("overview");
  const [croStats, setCroStats] = useState<CroFunnelStats>(() => getCroStats());

  // Keyword manager filters
  const [kwSearch, setKwSearch] = useState("");
  const [kwCluster, setKwCluster] = useState<KeywordClusterCode | "ALL">("ALL");
  const [kwIntent, setKwIntent] = useState<SearchIntent | "ALL">("ALL");
  const [kwPriority, setKwPriority] = useState<KeywordPriority | "ALL">("ALL");
  const [kwCity, setKwCity] = useState<string>("ALL");

  // GEO visibility test log
  const [geoTests, setGeoTests] = useState<GeoVisibilityTestRow[]>(() => loadGeoTests());

  useEffect(() => {
    const unsub = subscribeCroStats(setCroStats);
    return () => unsub();
  }, []);

  const cannibalizationFindings = useMemo(() => detectKeywordCannibalization(), []);
  const clusterSummaries = useMemo(() => getKeywordClusterSummary(), []);

  const distinctCities = useMemo(() => {
    const set = new Set(SEO_KEYWORD_DATABASE.map((k) => k.targetCity));
    return Array.from(set).sort();
  }, []);

  const filteredKeywords = useMemo<SeoKeywordEntry[]>(() => {
    const q = kwSearch.trim().toLowerCase();
    return SEO_KEYWORD_DATABASE.filter((entry) => {
      if (kwCluster !== "ALL" && entry.cluster !== kwCluster) return false;
      if (kwIntent !== "ALL" && entry.intent !== kwIntent) return false;
      if (kwPriority !== "ALL" && entry.priority !== kwPriority) return false;
      if (kwCity !== "ALL" && entry.targetCity !== kwCity) return false;
      if (!q) return true;
      return (
        entry.keyword.toLowerCase().includes(q) ||
        entry.targetLandingPage.toLowerCase().includes(q) ||
        entry.targetDistrict.toLowerCase().includes(q) ||
        entry.id.toLowerCase().includes(q)
      );
    });
  }, [kwSearch, kwCluster, kwIntent, kwPriority, kwCity]);

  const handleDownloadKeywordsCsv = () => {
    const csv = buildSeoKeywordsCsv(filteredKeywords);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `acarpen_seo_anahtar_kelimeler_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`${filteredKeywords.length} anahtar kelime güvenli CSV olarak indirildi.`);
  };

  const handleUpdateGeoRow = (id: string, patch: Partial<GeoVisibilityTestRow>) => {
    const next = geoTests.map((row) =>
      row.id === id
        ? {
            ...row,
            ...patch,
            testedAt: new Date().toLocaleDateString("tr-TR"),
          }
        : row
    );
    setGeoTests(next);
    try {
      localStorage.setItem(GEO_VISIBILITY_STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore storage errors
    }
  };

  const handleExportGeoCsv = () => {
    const headers = [
      "Test ID",
      "Motor",
      "Test Sorgusu",
      "Durum",
      "Acarpen Atifi Var",
      "NAP (Adres/Tel) Dogru",
      "Test Tarihi",
      "Operator Notu",
    ];
    const rows = geoTests.map((r) =>
      [
        r.id,
        r.engine,
        r.prompt,
        r.status,
        r.brandMentioned ? "EVET" : "HAYIR",
        r.napAccurate ? "EVET" : "HAYIR",
        r.testedAt,
        r.notes,
      ]
        .map(escapeCsvCell)
        .join(",")
    );
    const csv = "\uFEFF" + [headers.map(escapeCsvCell).join(","), ...rows].join("\r\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `acarpen_geo_ai_gorunurluk_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("GEO (AI Arama) test kaydı CSV olarak indirildi.");
  };

  const totalCroActions =
    croStats.whatsappClicks +
    croStats.phoneClicks +
    croStats.quoteSubmits +
    croStats.calculatorUses +
    croStats.orderLookups +
    croStats.regionCtaClicks +
    croStats.catalogDownloads;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-wider text-sky-400 font-bold mb-1">
            <Globe className="h-3.5 w-3.5" />
            SEO + GEO + Yerel Arama &amp; CRO Yönetim Merkezi
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">
            Organik Görünürlük, {SEO_KEYWORD_DATABASE.length} Anahtar Kelime ve Dönüşüm İzleme
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-3xl">
            Dış Google Search Console / SERP verileri bağlanana kadar dış metrikler şeffaf biçimde{" "}
            <strong className="text-amber-300">&ldquo;Veri bekleniyor&rdquo;</strong> olarak gösterilir; ziyaretçi ve CRO dönüşüm sayıları yalnızca KVKK çerez onayı verildiğinde cihaz bazlı ölçülür.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <a href="/sitemap.xml" target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="sm" className="border-slate-700 text-slate-200 hover:text-white text-xs">
              <ExternalLink className="h-3.5 w-3.5 mr-1.5" /> sitemap.xml
            </Button>
          </a>
          <a href="/llms.txt" target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="sm" className="border-slate-700 text-slate-200 hover:text-white text-xs">
              <Bot className="h-3.5 w-3.5 mr-1.5" /> llms.txt
            </Button>
          </a>
          <Button
            size="sm"
            onClick={handleDownloadKeywordsCsv}
            className="bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs"
          >
            <Download className="h-3.5 w-3.5 mr-1.5" />
            Anahtar Kelime CSV ({filteredKeywords.length})
          </Button>
        </div>
      </div>

      {/* Sub-navigation Tabs */}
      <div className="flex flex-wrap gap-2 bg-slate-900/70 p-2 rounded-2xl border border-slate-800">
        {[
          { id: "overview" as const, label: "Genel Bakış & CRO Dönüşümleri", icon: Activity },
          { id: "keywords" as const, label: `Anahtar Kelimeler (${SEO_KEYWORD_DATABASE.length})`, icon: Search },
          { id: "technical" as const, label: "Teknik SEO & QA Listesi", icon: CheckCircle2 },
          { id: "geo_ai" as const, label: `GEO (AI Arama) & ${GEO_QUESTIONS_DATABASE.length} Soru`, icon: Sparkles },
        ].map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                active
                  ? "bg-sky-600 text-white shadow-md"
                  : "text-slate-300 hover:text-white hover:bg-slate-800"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW & CRO */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
              <div className="text-[11px] font-mono uppercase text-slate-400 font-bold">Prerender Rotalar</div>
              <div className="text-3xl font-extrabold text-white mt-1">27 + 2</div>
              <div className="text-xs text-emerald-400 mt-1 font-medium">
                27 kamusal sayfa + /admin (noindex) + /404
              </div>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
              <div className="text-[11px] font-mono uppercase text-slate-400 font-bold">Anahtar Kelime Havuzu</div>
              <div className="text-3xl font-extrabold text-sky-400 mt-1">{SEO_KEYWORD_DATABASE.length}</div>
              <div className="text-xs text-slate-400 mt-1">
                Yamyamlaşma (Cannibalization):{" "}
                <strong className={cannibalizationFindings.length === 0 ? "text-emerald-400" : "text-amber-400"}>
                  {cannibalizationFindings.length}
                </strong>
              </div>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
              <div className="text-[11px] font-mono uppercase text-slate-400 font-bold">GEO Soru-Cevap Bankası</div>
              <div className="text-3xl font-extrabold text-emerald-400 mt-1">{GEO_QUESTIONS_DATABASE.length}</div>
              <div className="text-xs text-slate-400 mt-1">/rehber üzerinde aranabilir hub aktif</div>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
              <div className="text-[11px] font-mono uppercase text-slate-400 font-bold">GSC &amp; SERP Durumu</div>
              <div className="text-lg font-extrabold text-amber-300 mt-2">Veri bekleniyor</div>
              <div className="text-xs text-slate-400 mt-1">Canlı GSC API / mülk doğrulaması gerektirir</div>
            </div>
          </div>

          {/* CRO Funnel Live Counters */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-extrabold text-white">
                  Rıza Kontrollü CRO Dönüşüm &amp; Tarayıcı Telemetrisi
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Bu tarayıcı oturumunda toplam <strong className="text-white">{telemetry.totalPageviews}</strong> sayfa görüntüleme ve{" "}
                  <strong className="text-emerald-400">{totalCroActions}</strong> dönüşüm aksiyonu kaydedildi.
                </p>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setCroStats(getCroStats())}
                className="border-slate-700 text-slate-300 text-xs"
              >
                <RefreshCw className="h-3.5 w-3.5 mr-1.5" /> Yenile
              </Button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
              {[
                { label: "WhatsApp Tık", val: croStats.whatsappClicks, icon: MessageCircle, color: "text-emerald-400" },
                { label: "Telefon Ara", val: croStats.phoneClicks, icon: Phone, color: "text-sky-400" },
                { label: "Form Gönderimi", val: croStats.quoteSubmits, icon: FileText, color: "text-indigo-400" },
                { label: "Ölçü Robotu", val: croStats.calculatorUses, icon: Calculator, color: "text-amber-400" },
                { label: "Sipariş Sorgu", val: croStats.orderLookups, icon: Search, color: "text-cyan-400" },
                { label: "Bölge CTA", val: croStats.regionCtaClicks, icon: Globe, color: "text-violet-400" },
                { label: "Katalog/PDF", val: croStats.catalogDownloads, icon: Download, color: "text-rose-400" },
              ].map((m) => {
                const Icon = m.icon;
                return (
                  <div key={m.label} className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5">
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                      <span>{m.label}</span>
                      <Icon className={`h-3.5 w-3.5 ${m.color}`} />
                    </div>
                    <div className={`text-2xl font-extrabold font-mono ${m.color}`}>{m.val}</div>
                  </div>
                );
              })}
            </div>

            {croStats.recentEvents.length > 0 && (
              <div className="overflow-x-auto pt-2">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                      <th className="py-2 pr-3">Zaman</th>
                      <th className="py-2 pr-3">Olay Türü</th>
                      <th className="py-2 pr-3">Etiket</th>
                      <th className="py-2">Sayfa</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/70 text-slate-300">
                    {croStats.recentEvents.slice(0, 10).map((ev) => (
                      <tr key={ev.id}>
                        <td className="py-2 pr-3 font-mono text-[11px] text-slate-400">
                          {new Date(ev.timestamp).toLocaleTimeString("tr-TR")}
                        </td>
                        <td className="py-2 pr-3 font-mono text-sky-400">{ev.type}</td>
                        <td className="py-2 pr-3">{ev.label}</td>
                        <td className="py-2 font-mono text-slate-400">{ev.path}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: 300+ KEYWORDS & CANNIBALIZATION */}
      {activeTab === "keywords" && (
        <div className="space-y-6">
          {/* Cluster Summary Strip */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {clusterSummaries.map((c) => (
              <button
                key={c.code}
                type="button"
                onClick={() => setKwCluster(kwCluster === c.code ? "ALL" : c.code)}
                className={`text-left p-3.5 rounded-xl border transition-all ${
                  kwCluster === c.code
                    ? "bg-sky-950/60 border-sky-500 text-white"
                    : "bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="truncate pr-2">{c.label}</span>
                  <span className="font-mono text-sky-400 shrink-0">{c.count}</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  P0 Acil: <strong className="text-amber-300">{c.p0Count}</strong> • {c.pages.length} URL
                </div>
              </button>
            ))}
          </div>

          {/* Filter Bar */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <input
              type="search"
              value={kwSearch}
              onChange={(e) => setKwSearch(e.target.value)}
              placeholder="Sorgu, ilçe veya URL ara..."
              className="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-sky-500"
            />
            <select
              value={kwIntent}
              onChange={(e) => setKwIntent(e.target.value as SearchIntent | "ALL")}
              className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs"
            >
              <option value="ALL">Tüm Niyetler</option>
              <option value="ticari">Ticari (Fiyat/Teklif)</option>
              <option value="islem">İşlemsel (Hesapla/Sipariş)</option>
              <option value="bilgi">Bilgi (Nasıl/Nedir)</option>
              <option value="navigasyon">Navigasyon (Adres/Marka)</option>
            </select>
            <select
              value={kwPriority}
              onChange={(e) => setKwPriority(e.target.value as KeywordPriority | "ALL")}
              className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs"
            >
              <option value="ALL">Tüm Öncelikler</option>
              <option value="P0">P0 (Kritik Adana & Ticari)</option>
              <option value="P1">P1 (Yüksek Bölge & Ürün)</option>
              <option value="P2">P2 (Orta Semantik)</option>
              <option value="P3">P3 (Destekleyici)</option>
            </select>
            <select
              value={kwCity}
              onChange={(e) => setKwCity(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs"
            >
              <option value="ALL">Tüm İller</option>
              {distinctCities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <Button
              type="button"
              size="sm"
              onClick={handleDownloadKeywordsCsv}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
            >
              <Download className="h-3.5 w-3.5 mr-1.5" /> CSV İndir ({filteredKeywords.length})
            </Button>
          </div>

          {/* Keywords Table */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden">
            <div className="px-5 py-3 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>
                Listelenen: <strong className="text-white">{filteredKeywords.length}</strong> /{" "}
                {SEO_KEYWORD_DATABASE.length} anahtar kelime (ilk 100 satır gösteriliyor, tamamı CSV ile indirilebilir)
              </span>
              <span className="font-mono text-emerald-400">
                Yamyamlaşma Çakışması: {cannibalizationFindings.length}
              </span>
            </div>
            <div className="overflow-x-auto max-h-[540px]">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="sticky top-0 bg-slate-950 text-slate-400 uppercase text-[10px]">
                  <tr>
                    <th className="py-3 px-4">ID</th>
                    <th className="py-3 px-4">Anahtar Kelime</th>
                    <th className="py-3 px-4">Küme</th>
                    <th className="py-3 px-4">Niyet / Seviye</th>
                    <th className="py-3 px-4">İl / İlçe</th>
                    <th className="py-3 px-4">Hedef Sayfa</th>
                    <th className="py-3 px-4">GSC / Hacim</th>
                    <th className="py-3 px-4">Öncelik</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-slate-200">
                  {filteredKeywords.slice(0, 100).map((entry) => (
                    <tr key={entry.id} className="hover:bg-slate-800/40">
                      <td className="py-2.5 px-4 font-mono text-[11px] text-slate-400">{entry.id}</td>
                      <td className="py-2.5 px-4 font-semibold text-white">{entry.keyword}</td>
                      <td className="py-2.5 px-4 text-slate-300">{entry.clusterLabel}</td>
                      <td className="py-2.5 px-4 font-mono text-[11px]">
                        <span className="text-sky-400">{entry.intent}</span> • {entry.tier}
                      </td>
                      <td className="py-2.5 px-4 text-slate-300">
                        {entry.targetCity} / {entry.targetDistrict}
                      </td>
                      <td className="py-2.5 px-4 font-mono text-[11px] text-emerald-400">
                        {entry.targetLandingPage}
                      </td>
                      <td className="py-2.5 px-4 text-[11px] text-amber-300">Veri bekleniyor</td>
                      <td className="py-2.5 px-4 font-mono font-bold">
                        <span
                          className={`px-2 py-0.5 rounded ${
                            entry.priority === "P0"
                              ? "bg-rose-500/20 text-rose-300"
                              : entry.priority === "P1"
                              ? "bg-amber-500/20 text-amber-300"
                              : "bg-slate-800 text-slate-300"
                          }`}
                        >
                          {entry.priority}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: TECHNICAL SEO QA CHECKLIST */}
      {activeTab === "technical" && (
        <div className="grid md:grid-cols-2 gap-4">
          {TECHNICAL_CHECKLIST_ITEMS.map((item) => {
            const isPending = item.status.includes("Bekliyor");
            return (
              <div
                key={item.title}
                className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-2"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2 font-bold text-white text-sm">
                    {isPending ? (
                      <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    )}
                    <span>{item.title}</span>
                  </div>
                  <span
                    className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full shrink-0 ${
                      isPending
                        ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                        : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed pl-6">{item.detail}</p>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 4: GEO AI VISIBILITY TEST LOG */}
      {activeTab === "geo_ai" && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-extrabold text-white">
                Yapay Zekâ (GEO) Görünürlük Test Kaydı
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                ChatGPT, Gemini, Perplexity ve Bing Copilot üzerinde sorgular test edildiğinde gerçek gözlemleri burada işaretleyip CSV raporlayabilirsiniz.
              </p>
            </div>
            <Button
              size="sm"
              onClick={handleExportGeoCsv}
              className="bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs"
            >
              <Download className="h-3.5 w-3.5 mr-1.5" /> GEO Raporu İndir (CSV)
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                  <th className="py-3 px-3">ID / Motor</th>
                  <th className="py-3 px-3">Test Edilen Soru</th>
                  <th className="py-3 px-3">Gözlem Durumu</th>
                  <th className="py-3 px-3">Marka Atıfı</th>
                  <th className="py-3 px-3">NAP Doğruluğu</th>
                  <th className="py-3 px-3">Tarih &amp; Not</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-200">
                {geoTests.map((row) => (
                  <tr key={row.id} className="align-top">
                    <td className="py-3 px-3">
                      <div className="font-mono text-[11px] text-sky-400 font-bold">{row.id}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{row.engine}</div>
                    </td>
                    <td className="py-3 px-3 max-w-xs font-medium text-white">{row.prompt}</td>
                    <td className="py-3 px-3">
                      <select
                        value={row.status}
                        onChange={(e) =>
                          handleUpdateGeoRow(row.id, { status: e.target.value as GeoCheckStatus })
                        }
                        className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white text-[11px]"
                      >
                        <option value="Ölçülmedi">Ölçülmedi</option>
                        <option value="Doğru Kaynaklandı">Doğru Kaynaklandı</option>
                        <option value="Kısmi / Eksik Bilgi">Kısmi / Eksik Bilgi</option>
                        <option value="Görünmedi">Görünmedi</option>
                      </select>
                    </td>
                    <td className="py-3 px-3">
                      <input
                        type="checkbox"
                        checked={row.brandMentioned}
                        onChange={(e) =>
                          handleUpdateGeoRow(row.id, { brandMentioned: e.target.checked })
                        }
                        aria-label={`${row.id} marka atıfı`}
                      />
                    </td>
                    <td className="py-3 px-3">
                      <input
                        type="checkbox"
                        checked={row.napAccurate}
                        onChange={(e) =>
                          handleUpdateGeoRow(row.id, { napAccurate: e.target.checked })
                        }
                        aria-label={`${row.id} NAP doğruluğu`}
                      />
                    </td>
                    <td className="py-3 px-3">
                      <div className="text-[10px] font-mono text-slate-400 mb-1">{row.testedAt}</div>
                      <input
                        type="text"
                        value={row.notes}
                        onChange={(e) => handleUpdateGeoRow(row.id, { notes: e.target.value })}
                        className="w-56 px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 text-[11px]"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
