import { initializeApp, getApps } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { isClient } from "@/utils";

const firebaseConfig: FirebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

if (!getApps.length) {
  const app = initializeApp(firebaseConfig);

  // I am checking for any missing configuration IDs.
  (Object.keys(firebaseConfig) as Array<keyof FirebaseConfig>).forEach(key => {
    const value = firebaseConfig[key];

    if (!value) {
      console.error(`Missing Firebase config value for "${key}"`);
      throw new Error(`Missing Firebase config value for "${key}"`);
    }
  });

  if (isClient()) {
    if ("measurementId" in firebaseConfig) {
      console.error(firebaseConfig);
      const analytics = getAnalytics(app);
    }
  }
}
