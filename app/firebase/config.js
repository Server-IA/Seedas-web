//config.js
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth, signInWithCustomToken } from "firebase/auth";
import { useAuth } from "@clerk/nextjs";
import { getToken } from "@clerk/nextjs"; 

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCW7L5a0CCwfsX_U8hpkQvN3I3SZBtWxRM",
  authDomain: "seedas-8a51b.firebaseapp.com",
  databaseURL: "https://seedas-8a51b-default-rtdb.firebaseio.com",
  projectId: "seedas-8a51b",
  storageBucket: "seedas-8a51b.firebasestorage.app",
  messagingSenderId: "591825253519",
  appId: "1:591825253519:web:eaa2e60c9e140d2abbacfa",
  measurementId: "G-RR47Z9Y462"
  
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Exportar servicios principales
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);


export { db, storage, auth, app };


// ✅ Hook que sincroniza Clerk con Firebase (cliente)
export function useClerkFirebaseSync() {
  const { isSignedIn, getToken } = useAuth();

  const connectClerkToFirebase = async () => {
    if (!isSignedIn) return;

    try {
      // Usa tu template real creado en Clerk: "integrationfirebase"
      const token = await getToken({ template: "integrationfirebase" });

      if (!token) throw new Error("No se pudo obtener token de Clerk.");

      await signInWithCustomToken(auth, token);
      console.log("✅ Clerk conectado con Firebase mediante template integrationfirebase");
    } catch (err) {
      console.error("❌ Error conectando Clerk con Firebase:", err);
    }
  };

  return { connectClerkToFirebase };
}