import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, KeyRound, Eye, EyeOff, Sun, Moon, LogOut, AlertTriangle } from "lucide-react";
import { signInWithEmailAndPassword, sendPasswordResetEmail, signOut } from "firebase/auth";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/SEO";
import { Logo } from "@/components/site/Logo";
import { auth, isFirebaseConfigured } from "@/lib/firebase";
import { setLiveSession, type AdminAuthState } from "@/lib/adminStorage";

interface AdminLoginGateProps {
  authState: AdminAuthState;
  lightTheme: boolean;
  onToggleTheme: () => void;
}

export const AdminLoginGate: React.FC<AdminLoginGateProps> = ({
  authState,
  lightTheme,
  onToggleTheme,
}) => {
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const themeClass = lightTheme ? "admin-light-theme" : "admin-dark-theme";
  const isSignedIn = Boolean(authState.sessionUid);
  const isResolving = isSignedIn && !authState.authResolved;
  const isUnauthorized = isSignedIn && authState.authResolved && !authState.isAuthorizedStaff;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    const email = emailInput.trim();
    const pass = passwordInput;
    if (!email || !pass) {
      setLoginError("Lütfen yetkili e-posta adresinizi ve parolanızı giriniz.");
      return;
    }

    if (!isFirebaseConfigured) {
      setLoginError("Firebase yapılandırması bulunamadığı için oturum açılamıyor.");
      return;
    }

    setIsAuthenticating(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, email, pass);
      setLiveSession(cred.user.uid);
      toast.success("Oturum doğrulandı, yetki profili yükleniyor...");
    } catch {
      setLoginError("E-posta veya parola hatalı. Yetkili hesabınız yoksa yöneticinize başvurun.");
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handlePasswordReset = async () => {
    const email = emailInput.trim();
    if (!email) {
      toast.error("Lütfen önce e-posta adresinizi giriniz.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.");
    } catch {
      toast.error("Şifre sıfırlama e-postası gönderilemedi.");
    }
  };

  const handleUnauthorizedSignOut = async () => {
    try {
      if (isFirebaseConfigured) {
        await signOut(auth);
      }
    } catch {
      // Ignore signout error
    }
    setLiveSession(null);
    toast.info("Oturum kapatıldı.");
  };

  return (
    <div
      className={`admin-shell min-h-screen bg-slate-950 flex items-center justify-center p-6 text-slate-100 ${themeClass}`}
    >
      <SEO
        title="Yönetim Paneli Girişi | Acarpen"
        description="Acarpen yetkili personel ERP ve CRM yönetim paneli giriş ekranı."
        noindex
      />
      <div className="admin-login-card max-w-md w-full rounded-3xl bg-slate-900 border-2 border-slate-700 p-8 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <Link to="/" className="text-xs font-bold text-sky-500 hover:underline flex items-center gap-1">
            ← Web Sitesine Dön
          </Link>
          <button
            type="button"
            onClick={onToggleTheme}
            className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-200 text-xs font-bold flex items-center gap-1.5"
          >
            {lightTheme ? (
              <>
                <Sun className="h-3.5 w-3.5 text-amber-500" />
                <span>Aydınlık Mod</span>
              </>
            ) : (
              <>
                <Moon className="h-3.5 w-3.5 text-sky-400" />
                <span>Koyu Mod</span>
              </>
            )}
          </button>
        </div>

        <div className="text-center space-y-2.5">
          <Logo
            size="lg"
            layout="stacked"
            theme={lightTheme ? "light" : "dark"}
            showSubtitle={true}
            className="mx-auto"
          />
          <h1 className="text-xl font-extrabold text-white pt-1">Acarpen Yönetim Paneli</h1>
          <p className="text-xs text-slate-300 leading-relaxed">
            Teklif, Sipariş, Atölye Üretim, Kasa/Çek ve Müşteri Mesajları Yönetim Ekranı
          </p>
        </div>

        {isResolving ? (
          <div className="py-10 text-center space-y-3">
            <div className="h-8 w-8 rounded-full border-2 border-sky-500 border-t-transparent animate-spin mx-auto" />
            <p className="text-sm font-semibold text-slate-200">
              Backend personel rolü ve yetki matrisi doğrulanıyor...
            </p>
          </div>
        ) : isUnauthorized ? (
          <div className="space-y-4 p-4 rounded-2xl bg-rose-950/40 border border-rose-500/40 text-center">
            <AlertTriangle className="h-10 w-10 text-rose-400 mx-auto" />
            <h2 className="text-base font-bold text-white">Yetkisiz Hesap / Tanımsız Personel</h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Bu Firebase Authentication hesabının aktif bir Acarpen ERP personel kaydı
              (<code className="text-sky-300">users/&#123;uid&#125;</code>) veya yetki talebi
              bulunmamaktadır.
            </p>
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-300 break-all">
              UID: {authState.sessionUid}
            </div>
            <Button
              type="button"
              onClick={handleUnauthorizedSignOut}
              className="w-full h-11 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs"
            >
              <LogOut className="h-4 w-4 mr-1.5" />
              Oturumu Kapat
            </Button>
          </div>
        ) : (
          <form onSubmit={handleLogin} className="space-y-4 text-sm">
            <div>
              <label htmlFor="admin-email" className="text-xs font-bold text-slate-300 block mb-1.5">
                Yetkili E-Posta Adresi
              </label>
              <input
                id="admin-email"
                type="email"
                required
                autoComplete="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="yetkili@acarpen.com.tr"
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border-2 border-slate-700 text-white text-sm"
              />
            </div>

            <div>
              <label htmlFor="admin-password" className="text-xs font-bold text-slate-300 block mb-1.5">
                Parola
              </label>
              <div className="relative">
                <input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Parolanızı girin"
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border-2 border-slate-700 text-white pr-11 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-sky-500"
                  title={showPassword ? "Parolayı Gizle" : "Parolayı Göster"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {loginError && (
              <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500 text-rose-400 text-xs font-bold">
                {loginError}
              </div>
            )}

            <Button
              type="submit"
              disabled={isAuthenticating}
              className="w-full h-12 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-sm shadow-lg"
            >
              <KeyRound className="h-4 w-4 mr-2" />
              {isAuthenticating ? "Giriş Yapılıyor..." : "Panele Giriş Yap"}
            </Button>

            <button
              type="button"
              onClick={handlePasswordReset}
              className="w-full text-center text-slate-400 hover:text-sky-500 underline text-xs font-semibold pt-1"
            >
              Parolamı Unuttum (E-Posta ile Sıfırla)
            </button>

            <div className="pt-2 border-t border-slate-800/80 flex items-center gap-2 text-[11px] text-slate-400">
              <ShieldCheck className="h-4 w-4 text-sky-400 shrink-0" />
              <span>
                Hesaplar yalnızca Firebase Authentication ve Firestore yetki kayıtları ile açılır.
              </span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
