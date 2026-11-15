import { initializeApp, getApps, getApp } from "firebase/app";
import { initializeAppCheck, ReCaptchaV3Provider, type AppCheck } from "firebase/app-check";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAEa7XLZ7A0U42Hv622WChtHZfJqwLzbuo",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "advera-c8dd0.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "advera-c8dd0",
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "advera-c8dd0.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "929492188819",
  appId:
    import.meta.env.VITE_FIREBASE_APP_ID ||
    "1:929492188819:web:69374f0ebaadade9aed766",
  measurementId: import.meta.env.VITE_GA_MEASUREMENT_ID || "",
};

export const firebaseDatabaseId =
  import.meta.env.VITE_FIREBASE_DATABASE_ID || "acarpen";

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId
);

export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

const appCheckSiteKey = (import.meta.env.VITE_APPCHECK_SITE_KEY || "").trim();
export const isAppCheckConfigured = Boolean(appCheckSiteKey);

export let appCheck: AppCheck | null = null;
if (typeof window !== "undefined" && appCheckSiteKey) {
  try {
    appCheck = initializeAppCheck(app, {
      provider: new ReCaptchaV3Provider(appCheckSiteKey),
      isTokenAutoRefreshEnabled: true,
    });
  } catch {
    // App Check already initialized or unavailable in non-browser/test environment
  }
}

export const db = getFirestore(app, firebaseDatabaseId);
export const auth = getAuth(app);
