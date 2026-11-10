import { useEffect, useState, type FormEvent } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Eye, EyeOff, Lock, LogIn } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { useAdmin } from "../auth";
import { ADMIN_BASE } from "../permissions";
import { ErrorBlock, Field, FullScreenLoader, InfoNote, Spinner, copperButtonClass, inputClass } from "../ui";

const MAX_ATTEMPTS = 5;
const LOCK_MS = 30_000;

// Yalnızca bellekte tutulur; sayfa yenilenince sıfırlanır (asıl koruma Firebase Auth tarafındadır).
const attempts = { failed: 0, lockedUntil: 0 };

const emailSchema = z.string().trim().email();

export default function Login() {
  const { user, staff, loading, notice, signIn, resetPassword } = useAdmin();
  const location = useLocation();
  const [mode, setMode] = useState<"login" | "reset">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [now, setNow] = useState(Date.now());

  const lockedFor = Math.max(0, Math.ceil((attempts.lockedUntil - now) / 1000));
  const locked = lockedFor > 0;

  useEffect(() => {
    if (!locked) return;
    const timer = window.setInterval(() => setNow(Date.now()), 500);
    return () => window.clearInterval(timer);
  }, [locked]);

  if (user && staff) {
    const from = (location.state as { from?: string } | null)?.from;
    const target = from && from.startsWith(ADMIN_BASE) && !from.startsWith(`${ADMIN_BASE}/login`) ? from : ADMIN_BASE;
    return <Navigate to={target} replace />;
  }
  if (loading && user) return <FullScreenLoader label="Yetkiler denetleniyor…" />;

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();
    if (busy) return;
    if (Date.now() < attempts.lockedUntil) {
      setNow(Date.now());
      return;
    }
    setInfo(null);
    if (!emailSchema.safeParse(email).success || password.length === 0) {
      setError("E-posta adresinizi ve şifrenizi girin.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await signIn(email, password);
      attempts.failed = 0;
    } catch (err) {
      attempts.failed += 1;
      if (attempts.failed >= MAX_ATTEMPTS) {
        attempts.failed = 0;
        attempts.lockedUntil = Date.now() + LOCK_MS;
        setNow(Date.now());
        setError("Çok fazla hatalı deneme yapıldı. Giriş 30 saniyeliğine kilitlendi.");
      } else {
        setError(err instanceof Error ? err.message : "Giriş yapılamadı. Lütfen tekrar deneyin.");
      }
    } finally {
      setBusy(false);
    }
  };

  const handleReset = async (event: FormEvent) => {
    event.preventDefault();
    if (busy) return;
    setInfo(null);
    if (!emailSchema.safeParse(email).success) {
      setError("Geçerli bir e-posta adresi girin.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await resetPassword(email);
      setInfo("Bu e-posta adresi sistemde kayıtlıysa şifre sıfırlama bağlantısı gönderildi. Gelen kutunuzu kontrol edin.");
      setMode("login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "İstek gönderilemedi. Lütfen tekrar deneyin.");
    } finally {
      setBusy(false);
    }
  };

  const switchMode = (next: "login" | "reset") => {
    setMode(next);
    setError(null);
    setInfo(null);
  };

  const linkButtonClass = "mx-auto block min-h-[40px] text-sm font-medium text-copper-dark underline-offset-4 hover:underline";

  return (
    <div className="flex min-h-screen items-center justify-center bg-night bg-blueprint px-4 py-10">
      <main className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lift sm:p-8">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-night text-copper" aria-hidden="true">
            <Lock className="h-5 w-5" />
          </span>
          <div>
            <p className="eyebrow">Acar Pen</p>
            <h1 className="text-xl font-extrabold">{mode === "login" ? "Yönetim Paneli Girişi" : "Şifre Sıfırlama"}</h1>
          </div>
        </div>

        <div className="mt-6 space-y-3" aria-live="polite">
          {notice && <ErrorBlock message={notice} />}
          {error && <ErrorBlock message={error} />}
          {locked && <ErrorBlock message={`Tekrar denemek için ${lockedFor} saniye bekleyin.`} />}
          {info && <InfoNote>{info}</InfoNote>}
        </div>

        {mode === "login" ? (
          <form className="mt-5 space-y-4" onSubmit={handleLogin} noValidate>
            <Field label="E-posta" required>
              {(control) => (
                <input
                  {...control}
                  type="email"
                  autoComplete="username"
                  inputMode="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass}
                  required
                />
              )}
            </Field>
            <Field label="Şifre" required>
              {(control) => (
                <div className="relative">
                  <input
                    {...control}
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`${inputClass} pr-12`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-lg text-slate2 hover:text-night"
                    aria-label={showPassword ? "Şifreyi gizle" : "Şifreyi göster"}
                    aria-pressed={showPassword}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
                  </button>
                </div>
              )}
            </Field>
            <Button type="submit" disabled={busy || locked} className={`h-11 w-full ${copperButtonClass}`}>
              {busy ? <Spinner /> : <LogIn aria-hidden="true" />}
              Giriş yap
            </Button>
            <button type="button" onClick={() => switchMode("reset")} className={linkButtonClass}>
              Şifremi unuttum
            </button>
          </form>
        ) : (
          <form className="mt-5 space-y-4" onSubmit={handleReset} noValidate>
            <p className="text-sm text-slate2">
              E-posta adresinizi girin; hesabınız varsa şifrenizi yenilemeniz için bir bağlantı gönderilir.
            </p>
            <Field label="E-posta" required>
              {(control) => (
                <input
                  {...control}
                  type="email"
                  autoComplete="username"
                  inputMode="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass}
                  required
                />
              )}
            </Field>
            <Button type="submit" disabled={busy} className={`h-11 w-full ${copperButtonClass}`}>
              {busy && <Spinner />}
              Sıfırlama bağlantısı gönder
            </Button>
            <button type="button" onClick={() => switchMode("login")} className={linkButtonClass}>
              Giriş ekranına dön
            </button>
          </form>
        )}

        <p className="mt-6 border-t border-border pt-4 text-center text-xs text-slate2">
          Bu alan yalnızca yetkili personel içindir. Güvenlik nedeniyle sayfa yenilendiğinde yeniden giriş yapmanız gerekir.
        </p>
      </main>
    </div>
  );
}
