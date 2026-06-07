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
  apiKey: "AIzaSyCgHe2QH0x9_Ycfpl5UTTDByTa5Ntw5HEo",
  authDomain: "safe-her-85d85.firebaseapp.com",
  projectId: "safe-her-85d85",
  storageBucket: "safe-her-85d85.firebasestorage.app",
  messagingSenderId: "1017905368531",
  appId: "1:1017905368531:web:cc2cbb12d115a6cdb53326",
  measurementId: "G-Y3T1X90WDJ"
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
