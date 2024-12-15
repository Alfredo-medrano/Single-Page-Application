// Importamos las funciones necesarias del SDK de Firebase
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Configuración de Firebase para tu proyecto
const firebaseConfig = {
  apiKey: "AIzaSyC0kkzOi4zl4crvjdJlBxdTF4LxvXPEwTo",
  authDomain: "kodigo-music-daafb.firebaseapp.com",
  projectId: "kodigo-music-daafb",
  storageBucket: "kodigo-music-daafb.firebasestorage.app",
  messagingSenderId: "899968193370",
  appId: "1:899968193370:web:65ab369860de7e1b895963",
  measurementId: "G-VLG2NCNV2B",
};

// Inicializamos Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

// Inicializamos Auth
export const auth = getAuth(app);
export default app;
