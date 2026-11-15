import { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import introLogo from "@/assets/acarpen-intro-logo.png";

const INTRO_SESSION_KEY = "acarpen_intro_seen";
const REVEAL_DELAY_MS = 1650;
const UNMOUNT_DELAY_MS = 2250;

function readInitialIntroVisibility(pathname: string, search: string): boolean {
  if (typeof window === "undefined") return false;
  if (pathname.startsWith("/admin")) return false;

  try {
    const params = new URLSearchParams(search);
    if (params.get("intro") === "1") return true;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      window.sessionStorage?.setItem(INTRO_SESSION_KEY, "1");
      return false;
    }
    if (window.sessionStorage?.getItem(INTRO_SESSION_KEY) === "1") {
      return false;
    }
  } catch {
    return false;
  }

  return true;
}

export function SiteIntro() {
  const location = useLocation();
  const [visible, setVisible] = useState<boolean>(() =>
    readInitialIntroVisibility(location.pathname, location.search)
  );
  const [exiting, setExiting] = useState(false);

  const dismissIntro = useCallback(() => {
    try {
      window.sessionStorage?.setItem(INTRO_SESSION_KEY, "1");
    } catch {
      // Ignore storage access restrictions
    }
    setExiting(true);
  }, []);

  useEffect(() => {
    if (location.pathname.startsWith("/admin")) {
      setVisible(false);
      return;
    }
    const params = new URLSearchParams(location.search);
    if (params.get("intro") === "1") {
      setExiting(false);
      setVisible(true);
    }
  }, [location.pathname, location.search]);

  useEffect(() => {
    if (!visible) return;

    try {
      window.sessionStorage?.setItem(INTRO_SESSION_KEY, "1");
    } catch {
      // Ignore storage restrictions
    }

    const revealTimer = window.setTimeout(() => {
      setExiting(true);
    }, REVEAL_DELAY_MS);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        dismissIntro();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.clearTimeout(revealTimer);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [visible, dismissIntro]);

  useEffect(() => {
    if (!visible || !exiting) return;
    const hideTimer = window.setTimeout(() => {
      setVisible(false);
    }, UNMOUNT_DELAY_MS - REVEAL_DELAY_MS);

    return () => {
      window.clearTimeout(hideTimer);
    };
  }, [visible, exiting]);

  if (!visible || location.pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <div
      data-testid="acarpen-site-intro"
      role="dialog"
      aria-modal="true"
      aria-label="Acarpen Açılış İntrosu"
      onClick={dismissIntro}
      className={`fixed inset-0 z-[120] flex items-center justify-center overflow-hidden transition-opacity duration-500 ${
        exiting ? "pointer-events-none" : "cursor-pointer"
      }`}
    >
      {/* Sol ve Sağ Mimari Kanat Perdeleri (Açılarak siteyi ortaya çıkarır) */}
      <div
        aria-hidden="true"
        className={`absolute inset-y-0 left-0 w-1/2 bg-[#040f26] border-r border-sky-400/25 shadow-[12px_0_40px_rgba(0,157,255,0.2)] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          exiting ? "-translate-x-full" : "translate-x-0"
        }`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_45%,rgba(0,157,255,0.2),transparent_65%)]" />
      </div>
      <div
        aria-hidden="true"
        className={`absolute inset-y-0 right-0 w-1/2 bg-[#040f26] border-l border-sky-400/25 shadow-[-12px_0_40px_rgba(0,157,255,0.2)] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          exiting ? "translate-x-full" : "translate-x-0"
        }`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_55%,rgba(0,157,255,0.2),transparent_65%)]" />
      </div>

      {/* Merkez Aydınlık Logo Sahnesi */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative z-10 mx-4 flex max-w-[460px] flex-col items-center rounded-3xl border border-sky-300/40 bg-white/98 px-7 py-8 sm:px-11 sm:py-10 shadow-[0_30px_90px_-15px_rgba(0,157,255,0.45)] transition-all duration-500 ${
          exiting ? "scale-95 opacity-0" : "acarpen-intro-card-in scale-100 opacity-100"
        }`}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl"
        >
          <div className="acarpen-intro-beam h-full w-1/3 bg-gradient-to-r from-transparent via-sky-200/35 to-transparent" />
        </div>

        <img
          src={introLogo}
          alt="ACARPEN PVC Pencere Kapı Cam Balkon Logosu"
          width={960}
          height={720}
          loading="eager"
          decoding="sync"
          className="acarpen-intro-logo-in relative z-10 h-auto w-[250px] sm:w-[320px] select-none object-contain"
        />

        <div className="mt-4 flex flex-col items-center gap-1.5 text-center">
          <p className="font-display text-[11px] sm:text-xs font-extrabold uppercase tracking-[0.2em] text-[#05122b]">
            FIRATPEN • WINSA • PİMAPEN
          </p>
          <p className="text-xs font-medium tracking-[-0.005em] text-slate-600">
            Adana CNC PVC Doğrama &amp; Cam Balkon Üretim Merkezi
          </p>
        </div>

        {/* Zarif ilerleme çizgisi */}
        <div className="mt-5 h-1 w-48 overflow-hidden rounded-full bg-slate-200">
          <div className="acarpen-intro-progress h-full rounded-full bg-gradient-to-r from-[#05122b] via-[#009dff] to-[#05122b]" />
        </div>

        <button
          type="button"
          onClick={dismissIntro}
          aria-label="Giriş animasyonunu atla"
          className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-4 py-1.5 font-display text-xs font-semibold tracking-tight text-slate-700 transition hover:border-sky-400 hover:bg-sky-50 hover:text-[#05122b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
        >
          Girişi Atla
          <span aria-hidden="true">→</span>
        </button>
      </div>
    </div>
  );
}

export default SiteIntro;
