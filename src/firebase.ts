import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCILlkH_SsIw2cj3Bqj_PoYqHXaev8dKKw",
  authDomain: "zhopy-bd8c4.firebaseapp.com",
  projectId: "zhopy-bd8c4",
  storageBucket: "zhopy-bd8c4.firebasestorage.app",
  messagingSenderId: "592320407675",
  appId: "1:592320407675:web:cdec8b224941759387dade",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
