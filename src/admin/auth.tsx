import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  type User,
} from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { Navigate, useLocation } from "react-router-dom";
import { ShieldAlert } from "lucide-react";
import { getAuthInstance, getDb, isFirebaseConfigured } from "@/lib/firebase";
import type { Role, StaffUser } from "@/lib/types";
import { isRole } from "./data";
import { ADMIN_BASE, PAGE_ROLES, type PageKey } from "./permissions";
import { FullScreenLoader } from "./ui";

export const ACCESS_DENIED_MESSAGE = "Bu hesabın yönetim paneline erişim yetkisi yok.";
const IDLE_LIMIT_MS = 30 * 60 * 1000;
const IDLE_MESSAGE = "Uzun süre işlem yapılmadığı için oturumunuz kapatıldı. Lütfen tekrar giriş yapın.";

interface AdminContextValue {
  user: User | null;
  staff: StaffUser | null;
  loading: boolean;
  /** Oturumun neden kapandığını açıklayan mesaj (yetki yok, süre doldu vb.) */
  notice: string | null;
  clearNotice: () => void;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  can: (roles: Role[]) => boolean;
}

const AdminContext = createContext<AdminContextValue | null>(null);

/** Hesabın var olup olmadığını belli etmeyen genel hata metinleri. */
function signInErrorMessage(err: unknown): string {
  const code = (err as { code?: string } | null)?.code ?? "";
  if (code === "auth/network-request-failed") return "Bağlantı kurulamadı. İnternet bağlantınızı kontrol edin.";
  if (code === "auth/too-many-requests") return "Çok fazla deneme yapıldı. Lütfen bir süre sonra tekrar deneyin.";
  return "E-posta veya şifre hatalı.";
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [staff, setStaff] = useState<StaffUser | null>(null);
  const [ready, setReady] = useState(!isFirebaseConfigured);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    if (!isFirebaseConfigured) return;
    const auth = getAuthInstance();
    let unsubscribeDoc: (() => void) | null = null;

    const deny = (message: string) => {
      setNotice(message);
      setStaff(null);
      void firebaseSignOut(auth).catch((err) => console.error("Oturum kapatılamadı", err));
    };

    const unsubscribeAuth = onAuthStateChanged(auth, (nextUser) => {
      unsubscribeDoc?.();
      unsubscribeDoc = null;
      setStaff(null);
      setUser(nextUser);
      setReady(true);
      if (!nextUser) return;

      // Yetki belgesi canlı izlenir: hesap pasife alınırsa oturum hemen kapanır.
      unsubscribeDoc = onSnapshot(
        doc(getDb(), "users", nextUser.uid),
        (snap) => {
          if (!snap.exists() && snap.metadata.fromCache) return;
          const data = snap.data();
          if (!snap.exists() || !data || data.active !== true || !isRole(data.role)) {
            deny(ACCESS_DENIED_MESSAGE);
            return;
          }
          setStaff({
            uid: nextUser.uid,
            email: String(data.email || nextUser.email || ""),
            displayName: String(data.displayName || nextUser.email || "Kullanıcı"),
            role: data.role,
            active: true,
          });
        },
        (err) => {
          console.error("Yetki belgesi okunamadı", err);
          const code = (err as { code?: string }).code ?? "";
          deny(
            code === "permission-denied"
              ? ACCESS_DENIED_MESSAGE
              : "Hesap bilgileri okunamadı. Bağlantınızı kontrol edip tekrar giriş yapın.",
          );
        },
      );
    });

    return () => {
      unsubscribeDoc?.();
      unsubscribeAuth();
    };
  }, []);

  // 30 dakika boyunca işaretçi/klavye etkinliği olmazsa oturum kapatılır.
  const lastActivity = useRef(Date.now());
  const uid = user?.uid ?? null;
  useEffect(() => {
    if (!uid) return;
    lastActivity.current = Date.now();
    const touch = () => {
      lastActivity.current = Date.now();
    };
    const check = () => {
      if (Date.now() - lastActivity.current >= IDLE_LIMIT_MS) {
        setNotice(IDLE_MESSAGE);
        void firebaseSignOut(getAuthInstance()).catch((err) => console.error("Oturum kapatılamadı", err));
      }
    };
    const events: (keyof WindowEventMap)[] = ["pointerdown", "pointermove", "keydown", "wheel", "touchstart"];
    events.forEach((name) => window.addEventListener(name, touch, { passive: true }));
    document.addEventListener("visibilitychange", check);
    const timer = window.setInterval(check, 30_000);
    return () => {
      events.forEach((name) => window.removeEventListener(name, touch));
      document.removeEventListener("visibilitychange", check);
      window.clearInterval(timer);
    };
  }, [uid]);

  const signIn = useCallback(async (email: string, password: string) => {
    setNotice(null);
    try {
      await signInWithEmailAndPassword(getAuthInstance(), email.trim(), password);
    } catch (err) {
      throw new Error(signInErrorMessage(err));
    }
  }, []);

  const signOut = useCallback(async () => {
    setNotice(null);
    await firebaseSignOut(getAuthInstance());
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    try {
      await sendPasswordResetEmail(getAuthInstance(), email.trim());
    } catch (err) {
      const code = (err as { code?: string } | null)?.code ?? "";
      if (code === "auth/network-request-failed") {
        throw new Error("Bağlantı kurulamadı. İnternet bağlantınızı kontrol edin.");
      }
      if (code === "auth/too-many-requests") {
        throw new Error("Çok fazla deneme yapıldı. Lütfen bir süre sonra tekrar deneyin.");
      }
      // Diğer hatalar (ör. kayıtlı olmayan e-posta) bilinçli olarak gizlenir.
      console.warn("Şifre sıfırlama isteği tamamlanamadı", code);
    }
  }, []);

  const role = staff?.role ?? null;
  const can = useCallback((roles: Role[]) => role !== null && roles.includes(role), [role]);
  const clearNotice = useCallback(() => setNotice(null), []);

  const value = useMemo<AdminContextValue>(
    () => ({
      user,
      staff,
      loading: !ready || (user !== null && staff === null),
      notice,
      clearNotice,
      signIn,
      signOut,
      resetPassword,
      can,
    }),
    [user, staff, ready, notice, clearNotice, signIn, signOut, resetPassword, can],
  );

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdmin(): AdminContextValue {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin yalnızca AuthProvider içinde kullanılabilir.");
  return ctx;
}

/** Oturum yoksa giriş sayfasına yönlendirir. */
export function RequireAuth({ children }: { children: ReactNode }) {
  const { user, staff, loading } = useAdmin();
  const location = useLocation();
  if (loading) return <FullScreenLoader label="Oturum denetleniyor…" />;
  if (!user || !staff) {
    return <Navigate to={`${ADMIN_BASE}/login`} replace state={{ from: `${location.pathname}${location.search}` }} />;
  }
  return <>{children}</>;
}

/** Rolün erişemediği sayfalarda "Yetkiniz yok" paneli gösterir. */
export function RequireRole({ page, children }: { page: PageKey; children: ReactNode }) {
  const { can } = useAdmin();
  if (!can(PAGE_ROLES[page])) return <NoAccess />;
  return <>{children}</>;
}

export function NoAccess() {
  return (
    <div className="card-surface mx-auto mt-10 max-w-lg p-8 text-center" role="alert">
      <ShieldAlert className="mx-auto h-10 w-10 text-copper-dark" aria-hidden="true" />
      <h1 className="mt-4 text-xl font-bold">Yetkiniz yok</h1>
      <p className="mt-2 text-sm text-slate2">
        Bu sayfayı görüntülemek için hesabınızın rolü yeterli değil. Erişim gerekiyorsa yöneticinizle görüşün.
      </p>
    </div>
  );
}
