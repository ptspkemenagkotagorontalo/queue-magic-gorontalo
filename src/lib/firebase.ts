import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyDYkOM-b7b0fC3peRILiAGpBhmCWCUuyws",
  authDomain: "ptsp-bcd4e.firebaseapp.com",
  projectId: "ptsp-bcd4e",
  storageBucket: "ptsp-bcd4e.firebasestorage.app",
  messagingSenderId: "98418297936",
  appId: "1:98418297936:web:00d9a167aae0719b7cd555",
  measurementId: "G-7ZRJR0EBBQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);

export default app;