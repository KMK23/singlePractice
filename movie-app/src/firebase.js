import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDTQVLijdvhh_eSHnpGG2uryPF6idt1fk4",
  authDomain: "movieapp-8ac95.firebaseapp.com",
  projectId: "movieapp-8ac95",
  storageBucket: "movieapp-8ac95.firebasestorage.app",
  messagingSenderId: "1083364395725",
  appId: "1:1083364395725:web:cf402da4f795fea8f47784",
  measurementId: "G-HFF2RVD6K0",
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = getAnalytics(app);

// Google 프로바이더 설정
const googleProvider = new GoogleAuthProvider();

export { auth, db, analytics, googleProvider };
