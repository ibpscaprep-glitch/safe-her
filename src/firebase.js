import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult
} from 'firebase/auth';
import { 
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp
} from 'firebase/firestore';

// Web app's Firebase configuration hardcoded for easy Vercel deployment
const firebaseConfig = {
  apiKey: "AIzaSyAdENgUCX-WZZTHAIc2vvqLZt3xiVUMcAk",
  authDomain: "safe-her-d5e38.firebaseapp.com",
  projectId: "safe-her-d5e38",
  storageBucket: "safe-her-d5e38.firebasestorage.app",
  messagingSenderId: "1036927107488",
  appId: "1:1036927107488:web:73a74884281059acd6e4c5",
  measurementId: "G-T8BGSZMNK7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = typeof window !== 'undefined' && firebaseConfig.measurementId ? getAnalytics(app) : null;

// Re-export Auth functions
export {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult
};

// Re-export Firestore functions
export {
  doc,
  setDoc,
  getDoc,
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp
};

export default {
  auth,
  db
};
