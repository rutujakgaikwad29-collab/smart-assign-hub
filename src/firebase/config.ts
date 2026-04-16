import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const PLACEHOLDER_VALUES = new Set([
  "YOUR_API_KEY",
  "YOUR_PROJECT.firebaseapp.com",
  "YOUR_PROJECT_ID",
  "YOUR_PROJECT.appspot.com",
  "YOUR_SENDER_ID",
  "YOUR_APP_ID",
]);

function normalize(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function isPlaceholder(value: string) {
  return !value || PLACEHOLDER_VALUES.has(value) || value.startsWith("your_");
}

function readFirebaseConfig() {
  return {
    apiKey: normalize(import.meta.env.VITE_FIREBASE_API_KEY),
    authDomain: normalize(import.meta.env.VITE_FIREBASE_AUTH_DOMAIN),
    projectId: normalize(import.meta.env.VITE_FIREBASE_PROJECT_ID),
    storageBucket: normalize(import.meta.env.VITE_FIREBASE_STORAGE_BUCKET),
    messagingSenderId: normalize(import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID),
    appId: normalize(import.meta.env.VITE_FIREBASE_APP_ID),
  };
}

export const firebaseConfig = readFirebaseConfig();

export const isFirebaseConfigured = ![
  firebaseConfig.apiKey,
  firebaseConfig.authDomain,
  firebaseConfig.projectId,
  firebaseConfig.storageBucket,
  firebaseConfig.messagingSenderId,
  firebaseConfig.appId,
].some(isPlaceholder);

export const firebaseConfigMessage = isFirebaseConfigured
  ? ""
  : "Firebase is not configured. Add valid VITE_FIREBASE_* values to .env and restart the dev server.";

if (import.meta.env.DEV && !isFirebaseConfigured) {
  console.warn(firebaseConfigMessage);
}

// Prevent duplicate app initialization (happens with SSR/HMR)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
