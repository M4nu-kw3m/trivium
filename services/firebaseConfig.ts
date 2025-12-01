import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getAnalytics, logEvent } from 'firebase/analytics';

// Firebase configuration from your project
const firebaseConfig = {
  apiKey: "AIzaSyDpQKR-N9RVOKSVZszOtrs4WwW2vo7_rVw",
  authDomain: "trivium1960.firebaseapp.com",
  projectId: "trivium1960",
  storageBucket: "trivium1960.firebasestorage.app",
  messagingSenderId: "276143711712",
  appId: "1:276143711712:web:da2270e4afbbd7856ff785",
  measurementId: "G-DJ94TG4BWB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Initialize Cloud Firestore
export const db = getFirestore(app);

// Initialize Firebase Analytics
export const analytics = getAnalytics(app);

// Analytics helper functions
export const logGameStart = (category: string, isMultiplayer: boolean) => {
  logEvent(analytics, 'game_start', {
    category,
    game_type: isMultiplayer ? 'multiplayer' : 'single_player',
    timestamp: new Date().toISOString()
  });
};

export const logGameEnd = (score: number, totalQuestions: number, isMultiplayer: boolean) => {
  logEvent(analytics, 'game_end', {
    score,
    total_questions: totalQuestions,
    game_type: isMultiplayer ? 'multiplayer' : 'single_player',
    timestamp: new Date().toISOString()
  });
};

export const logCategorySelected = (category: string) => {
  logEvent(analytics, 'category_selected', {
    category,
    timestamp: new Date().toISOString()
  });
};

export default app;
