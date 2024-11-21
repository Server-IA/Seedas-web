// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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


const app = initializeApp(firebaseConfig);


const db = getFirestore(app);  
const storage = getStorage(app);  

// Export db and storage  
export { db, storage };  