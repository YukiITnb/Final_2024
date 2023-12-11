import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD6eTm0Avu_KYRyk0gXcWtxNTMNPtdUjnQ",
  authDomain: "habit-tracker-pj.firebaseapp.com",
  projectId: "habit-tracker-pj",
  storageBucket: "habit-tracker-pj.appspot.com",
  messagingSenderId: "502134493999",
  appId: "1:502134493999:web:a422b1c70fe43a5a17c7da",
  measurementId: "G-HBYYDNW3G4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore();

export {auth,db};