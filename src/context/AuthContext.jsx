import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  doc,
  setDoc,
  getDoc,
  auth,
  db
} from '../firebase';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sign up
  async function signup(email, password, name) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Update auth display name
    await updateProfile(user, { displayName: name });

    // Store profile in Firestore
    const userDocRef = doc(db, 'users', user.uid);
    const profileData = {
      uid: user.uid,
      name: name,
      email: email,
      createdAt: new Date().toISOString()
    };
    await setDoc(userDocRef, profileData);
    
    setUserProfile(profileData);
    return user;
  }

  // Login
  async function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  // Google Sign In / Registration
  async function loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    
    // Detect mobile device to bypass popup blockers
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    if (isMobile) {
      return signInWithRedirect(auth, provider);
    } else {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      const userDocRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(userDocRef);
      
      if (!docSnap.exists()) {
        const profileData = {
          uid: user.uid,
          name: user.displayName || 'User',
          email: user.email,
          createdAt: new Date().toISOString()
        };
        await setDoc(userDocRef, profileData);
        setUserProfile(profileData);
      } else {
        setUserProfile(docSnap.data());
      }
      return user;
    }
  }

  // Logout
  function logout() {
    setUserProfile(null);
    return signOut(auth);
  }

  useEffect(() => {
    // Process redirect result if redirected back from Google Sign-In
    getRedirectResult(auth)
      .then(async (result) => {
        if (result?.user) {
          const user = result.user;
          const userDocRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(userDocRef);
          
          if (!docSnap.exists()) {
            const profileData = {
              uid: user.uid,
              name: user.displayName || 'User',
              email: user.email,
              createdAt: new Date().toISOString()
            };
            await setDoc(userDocRef, profileData);
            setUserProfile(profileData);
          } else {
            setUserProfile(docSnap.data());
          }
        }
      })
      .catch((error) => {
        console.error("Error handling Google redirect result:", error);
      });

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        // Fetch profile details from Firestore
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(userDocRef);
          if (docSnap.exists()) {
            setUserProfile(docSnap.data());
          } else {
            // Backup profile if firestore doc does not exist
            const fallbackProfile = {
              uid: user.uid,
              name: user.displayName || 'User',
              email: user.email,
              createdAt: new Date().toISOString()
            };
            setUserProfile(fallbackProfile);
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
          setUserProfile({
            uid: user.uid,
            name: user.displayName || 'User',
            email: user.email,
          });
        }
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userProfile,
    signup,
    login,
    loginWithGoogle,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
