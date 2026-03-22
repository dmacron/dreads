import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCC1otuJW0JE1i6iJu4ITVx_w3DDNlNSXQ",
  authDomain: "dreads-515e8.firebaseapp.com",
  projectId: "dreads-515e8",
  storageBucket: "dreads-515e8.firebasestorage.app",
  messagingSenderId: "1044081879327",
  appId: "1:1044081879327:web:d6f97e0b10d98fa919e82a"
};

// Initialize Firebase
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
