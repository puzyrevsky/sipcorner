// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Твоя конфигурация Firebase
const firebaseConfig = {
  apiKey: "AIzaSyByoei5Vd_BoXTwQRtBB8mjA5qq2OapSxw",
  authDomain: "sipcorner.firebaseapp.com",
  projectId: "sipcorner",
  storageBucket: "sipcorner.firebasestorage.app",
  messagingSenderId: "375760377185",
  appId: "1:375760377185:web:ef44bc7133761d29eaa120",
  measurementId: "G-BD3H6QE1CW"
};

// Инициализация Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app); // 👈 инициализируй Firestore

export { auth, db }; // 👈 экспортируй db вместе с auth
