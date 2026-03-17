import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

firebase config

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

// Automatically sign in users anonymously so they can save books without an explicit login flow
const ensureAnonymousAuth = () => {
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      signInAnonymously(auth).catch((err) => {
        console.error("Anonymous sign-in failed", err);
      });
    }
  });
};

ensureAnonymousAuth();
