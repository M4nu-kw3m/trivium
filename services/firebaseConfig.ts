import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getAnalytics, logEvent } from 'firebase/analytics';

// Firebase configuration from your project
const firebaseConfig = {
  apiKey: "AIzaSyC_54nwj2XMhtevpOjtcNdje53tFUSlZX4",
  authDomain: "trivium1960.firebaseapp.com",
  projectId: "trivium1960",
  storageBucket: "trivium1960.appspot.com",
  messagingSenderId: "276143711712",
  appId: "1:276143711712:web:YOUR_APP_ID"
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
