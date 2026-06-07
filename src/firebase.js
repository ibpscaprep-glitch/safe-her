// A complete localStorage-based mock for Firebase Auth and Firestore,
// allowing the college demo to work offline/locally without real Firebase config!

// --- MOCK AUTHENTICATION SYSTEM ---

// In-memory callbacks for auth state changes
const authListeners = [];

// Helper to get raw users database
function getAuthUsers() {
  try {
    return JSON.parse(localStorage.getItem('safeher_mock_auth_users') || '{}');
  } catch (e) {
    console.error("Error reading mock auth users:", e);
    return {};
  }
}

// Helper to save raw users database
function saveAuthUsers(users) {
  try {
    localStorage.setItem('safeher_mock_auth_users', JSON.stringify(users));
  } catch (e) {
    console.error("Error saving mock auth users:", e);
  }
}

// Helper to get current signed-in user
function getCurrentUser() {
  try {
    const user = localStorage.getItem('safeher_mock_current_user');
    return user ? JSON.parse(user) : null;
  } catch (e) {
    console.error("Error reading current user:", e);
    return null;
  }
}

// Helper to set current signed-in user
function setCurrentUser(user) {
  try {
    if (user) {
      localStorage.setItem('safeher_mock_current_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('safeher_mock_current_user');
    }
  } catch (e) {
    console.error("Error setting current user:", e);
  }
  // Trigger listener updates
  authListeners.forEach(cb => {
    try {
      cb(user);
    } catch (e) {
      console.error("Error triggering auth state listener:", e);
    }
  });
}

export const auth = {
  get currentUser() {
    return getCurrentUser();
  }
};

export function createUserWithEmailAndPassword(authInstance, email, password) {
  return new Promise((resolve, reject) => {
    // Artificial small delay for realism
    setTimeout(() => {
      const users = getAuthUsers();
      const normalizedEmail = email.toLowerCase().trim();
      
      if (users[normalizedEmail]) {
        const err = new Error("This email address is already in use.");
        err.code = 'auth/email-already-in-use';
        return reject(err);
      }
      
      const uid = 'user_' + Math.random().toString(36).substring(2, 11);
      users[normalizedEmail] = {
        uid,
        email: normalizedEmail,
        password, // Simple local plain text storage for demo purposes
        displayName: null
      };
      saveAuthUsers(users);
      
      const user = { uid, email: normalizedEmail, displayName: null };
      setCurrentUser(user);
      resolve({ user });
    }, 400);
  });
}

export function signInWithEmailAndPassword(authInstance, email, password) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const users = getAuthUsers();
      const normalizedEmail = email.toLowerCase().trim();
      const userRecord = users[normalizedEmail];
      
      if (!userRecord || userRecord.password !== password) {
        const err = new Error("Invalid email or password.");
        err.code = 'auth/invalid-credential';
        return reject(err);
      }
      
      const user = { 
        uid: userRecord.uid, 
        email: userRecord.email, 
        displayName: userRecord.displayName 
      };
      setCurrentUser(user);
      resolve({ user });
    }, 400);
  });
}

export function signOut(authInstance) {
  return new Promise((resolve) => {
    setTimeout(() => {
      setCurrentUser(null);
      resolve();
    }, 200);
  });
}

export function onAuthStateChanged(authInstance, callback) {
  authListeners.push(callback);
  // Call immediately with current value (async to mimic Firebase)
  setTimeout(() => {
    callback(getCurrentUser());
  }, 0);
  
  // Return unsubscribe function
  return () => {
    const idx = authListeners.indexOf(callback);
    if (idx !== -1) authListeners.splice(idx, 1);
  };
}

export function updateProfile(user, { displayName }) {
  return new Promise((resolve, reject) => {
    if (!user) return reject(new Error("No user to update."));
    
    // Update local storage credentials
    const users = getAuthUsers();
    const normalizedEmail = user.email.toLowerCase().trim();
    if (users[normalizedEmail]) {
      users[normalizedEmail].displayName = displayName;
      saveAuthUsers(users);
    }
    
    // Update current user state
    const currentUser = getCurrentUser();
    if (currentUser && currentUser.uid === user.uid) {
      currentUser.displayName = displayName;
      setCurrentUser(currentUser);
    }
    
    resolve();
  });
}

export class GoogleAuthProvider {}

const MOCK_GOOGLE_USER = {
  uid: 'google_demo_user_123',
  email: 'demo_google@example.com',
  displayName: 'Google Demo User'
};

export function signInWithPopup(authInstance, provider) {
  return new Promise((resolve) => {
    setTimeout(() => {
      setCurrentUser(MOCK_GOOGLE_USER);
      resolve({ user: MOCK_GOOGLE_USER });
    }, 600);
  });
}

export function signInWithRedirect(authInstance, provider) {
  // Store redirect flag and reload page to simulate redirect flow
  try {
    localStorage.setItem('safeher_redirect_google_user', 'true');
  } catch (e) {
    console.error("Error setting redirect flag:", e);
  }
  window.location.reload();
  return Promise.resolve();
}

export function getRedirectResult(authInstance) {
  return new Promise((resolve) => {
    try {
      const isRedirect = localStorage.getItem('safeher_redirect_google_user');
      if (isRedirect === 'true') {
        localStorage.removeItem('safeher_redirect_google_user');
        setCurrentUser(MOCK_GOOGLE_USER);
        resolve({ user: MOCK_GOOGLE_USER });
      } else {
        resolve({ user: null });
      }
    } catch (e) {
      console.error("Error during redirect check:", e);
      resolve({ user: null });
    }
  });
}

// --- MOCK FIRESTORE DATABASE SYSTEM ---

export const db = {};

// Helper to get Firestore data map
function getFirestoreData() {
  try {
    return JSON.parse(localStorage.getItem('safeher_mock_firestore') || '{}');
  } catch (e) {
    console.error("Error reading firestore data:", e);
    return {};
  }
}

// Helper to save Firestore data map
function saveFirestoreData(data) {
  try {
    localStorage.setItem('safeher_mock_firestore', JSON.stringify(data));
  } catch (e) {
    console.error("Error saving firestore data:", e);
  }
}

export function doc(dbInstance, ...paths) {
  // Allow paths as strings or arrays of strings
  const path = paths.flatMap(p => typeof p === 'string' ? p.split('/') : p);
  return {
    type: 'doc',
    path
  };
}

export function collection(dbInstance, ...paths) {
  const path = paths.flatMap(p => typeof p === 'string' ? p.split('/') : p);
  return {
    type: 'collection',
    path
  };
}

export function setDoc(docRef, data) {
  return new Promise((resolve) => {
    const path = docRef.path;
    const docId = path[path.length - 1];
    const collectionPath = path.slice(0, -1).join('/');
    
    const dbData = getFirestoreData();
    if (!dbData[collectionPath]) dbData[collectionPath] = {};
    dbData[collectionPath][docId] = data;
    saveFirestoreData(dbData);
    
    resolve();
  });
}

export function getDoc(docRef) {
  return new Promise((resolve) => {
    const path = docRef.path;
    const docId = path[path.length - 1];
    const collectionPath = path.slice(0, -1).join('/');
    
    const dbData = getFirestoreData();
    const collectionData = dbData[collectionPath] || {};
    const docData = collectionData[docId];
    
    resolve({
      id: docId,
      exists: () => !!docData,
      data: () => docData ? { ...docData } : null
    });
  });
}

export function getDocs(collectionRef) {
  return new Promise((resolve) => {
    const collectionPath = collectionRef.path.join('/');
    const dbData = getFirestoreData();
    const collectionData = dbData[collectionPath] || {};
    
    const docs = Object.keys(collectionData).map(id => ({
      id,
      data: () => ({ ...collectionData[id] })
    }));
    
    resolve({
      size: docs.length,
      docs: docs,
      forEach: (callback) => docs.forEach(callback)
    });
  });
}

export function addDoc(collectionRef, data) {
  return new Promise((resolve) => {
    const collectionPath = collectionRef.path.join('/');
    const docId = 'doc_' + Math.random().toString(36).substring(2, 11);
    
    const dbData = getFirestoreData();
    if (!dbData[collectionPath]) dbData[collectionPath] = {};
    dbData[collectionPath][docId] = {
      ...data,
      id: docId
    };
    saveFirestoreData(dbData);
    
    resolve({
      id: docId,
      path: [...collectionRef.path, docId]
    });
  });
}

export function updateDoc(docRef, data) {
  return new Promise((resolve) => {
    const path = docRef.path;
    const docId = path[path.length - 1];
    const collectionPath = path.slice(0, -1).join('/');
    
    const dbData = getFirestoreData();
    if (dbData[collectionPath] && dbData[collectionPath][docId]) {
      dbData[collectionPath][docId] = {
        ...dbData[collectionPath][docId],
        ...data
      };
      saveFirestoreData(dbData);
    }
    
    resolve();
  });
}

export function deleteDoc(docRef) {
  return new Promise((resolve) => {
    const path = docRef.path;
    const docId = path[path.length - 1];
    const collectionPath = path.slice(0, -1).join('/');
    
    const dbData = getFirestoreData();
    if (dbData[collectionPath] && dbData[collectionPath][docId]) {
      delete dbData[collectionPath][docId];
      saveFirestoreData(dbData);
    }
    
    resolve();
  });
}

export function serverTimestamp() {
  return {
    toDate: () => new Date()
  };
}

export const analytics = null;

export default {
  auth,
  db,
  analytics
};
