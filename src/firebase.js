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

// Web app's Firebase configuration using Vite environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Check if Firebase config is missing
if (!firebaseConfig.projectId && typeof window !== 'undefined') {
  const errorMessage = `
    <div style="font-family: system-ui, -apple-system, sans-serif; padding: 2.5rem; max-width: 620px; margin: 4rem auto; border: 1px solid #fecaca; background: #fef2f2; color: #991b1b; border-radius: 16px; box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);">
      <h2 style="margin-top: 0; font-size: 1.5rem; font-weight: 700; color: #991b1b; margin-bottom: 0.75rem;">
        ⚠️ Missing Firebase Configuration
      </h2>
      <p style="font-size: 0.975rem; line-height: 1.6; color: #7f1d1d; margin-bottom: 1.25rem;">
        The application is missing its required Firebase environment variables. Without them, Firebase cannot initialize.
      </p>
      <p style="font-size: 0.95rem; font-weight: 600; color: #7f1d1d; margin-bottom: 0.5rem;">
        Please configure these exact environment variables in your Vercel Project Settings:
      </p>
      <pre style="background: #ffffff; padding: 1.25rem; border-radius: 8px; color: #1f2937; overflow-x: auto; font-family: ui-monospace, monospace; font-size: 0.85rem; border: 1px solid #f3f4f6; line-height: 1.5; margin-bottom: 1.5rem; box-shadow: inset 0 2px 4px 0 rgb(0 0 0 / 0.06);">
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
VITE_FIREBASE_MEASUREMENT_ID</pre>
      <p style="font-size: 0.925rem; line-height: 1.5; color: #7f1d1d; margin-bottom: 0;">
        💡 <strong>Note:</strong> After adding or updating variables in Vercel, go to the <strong>Deployments</strong> tab and select <strong>Redeploy</strong> for the changes to take effect.
      </p>
    </div>
  `;
  if (document.body) {
    document.body.innerHTML = errorMessage;
  } else {
    document.write(errorMessage);
  }
  throw new Error("Firebase Configuration is missing! Set your VITE_FIREBASE_* variables in Vercel.");
}

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
