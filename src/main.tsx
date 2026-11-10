import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Eski PWA Service Worker önbelleğini (workbox-precache) ve sahte/eski JS paketlerini tamamen temizle
if (typeof window !== "undefined") {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .getRegistrations()
      .then((regs) => {
        regs.forEach((reg) => {
          reg.unregister().catch(() => {});
        });
      })
      .catch(() => {});
  }
  if ("caches" in window) {
    caches
      .keys()
      .then((keys) => {
        keys.forEach((key) => {
          caches.delete(key).catch(() => {});
        });
      })
      .catch(() => {});
  }
}

createRoot(document.getElementById("root")!).render(<App />);
