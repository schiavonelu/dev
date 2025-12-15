// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FB_API_KEY,
  authDomain: import.meta.env.VITE_FB_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FB_PROJECT_ID,
  appId: import.meta.env.VITE_FB_APP_ID,
  // opzionale se usi Storage
  storageBucket: import.meta.env.VITE_FB_STORAGE_BUCKET,
};

// Avviso utile in dev se manca qualcosa
for (const [k, v] of Object.entries(firebaseConfig)) {
  if (!v) console.error(`[firebase] Missing env: ${k}`);
}

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// (facoltativo) Analytics solo se supportato
export async function initAnalytics() {
  if (typeof window === "undefined") return null;
  try {
    const { isSupported, getAnalytics } = await import("firebase/analytics");
    if (await isSupported()) return getAnalytics(app);
  } catch (err) {
    console.warn("[firebase] analytics not available", err?.message || err);
  }
  return null;
}
