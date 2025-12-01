import {
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  query,
  where,
  getDocs,
  increment,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './firebaseConfig';

export interface PlayerStats {
  uid: string;
  email: string;
  totalGames: number;
  totalScore: number;
  averageScore: number;
  bestScore: number;
  gamesPlayed: Array<{
    category: string;
    score: number;
    totalQuestions: number;
    date: any;
  }>;
  createdAt: any;
  lastPlayedAt: any;
}

// Create or get player stats
export const initializePlayerStats = async (uid: string, email: string): Promise<void> => {
  try {
    const playerRef = doc(db, 'players', uid);
    const playerSnap = await getDoc(playerRef);

    if (!playerSnap.exists()) {
      await setDoc(playerRef, {
        uid,
        email,
        totalGames: 0,
        totalScore: 0,
        averageScore: 0,
        bestScore: 0,
        gamesPlayed: [],
        createdAt: serverTimestamp(),
        lastPlayedAt: null
      });
    }
  } catch (error) {
    console.error('Error initializing player stats:', error);
    throw error;
  }
};

// Save game result
export const saveGameResult = async (
  uid: string,
  category: string,
  score: number,
  totalQuestions: number
): Promise<void> => {
  try {
    const playerRef = doc(db, 'players', uid);
    const playerSnap = await getDoc(playerRef);

    if (playerSnap.exists()) {
      const currentData = playerSnap.data() as PlayerStats;
      const newTotalGames = currentData.totalGames + 1;
      const newTotalScore = currentData.totalScore + score;
      const newAverageScore = newTotalScore / newTotalGames;
      const newBestScore = Math.max(currentData.bestScore, score);

      await updateDoc(playerRef, {
        totalGames: newTotalGames,
        totalScore: newTotalScore,
        averageScore: parseFloat(newAverageScore.toFixed(2)),
        bestScore: newBestScore,
        gamesPlayed: [
          ...currentData.gamesPlayed,
          {
            category,
            score,
            totalQuestions,
            date: serverTimestamp()
          }
        ],
        lastPlayedAt: serverTimestamp()
      });
    }
  } catch (error) {
    console.error('Error saving game result:', error);
    throw error;
  }
};

// Get player stats
export const getPlayerStats = async (uid: string): Promise<PlayerStats | null> => {
  try {
    const playerRef = doc(db, 'players', uid);
    const playerSnap = await getDoc(playerRef);

    if (playerSnap.exists()) {
      return playerSnap.data() as PlayerStats;
    }
    return null;
  } catch (error) {
    console.error('Error getting player stats:', error);
    throw error;
  }
};

// Get leaderboard
export const getLeaderboard = async (limit: number = 10): Promise<PlayerStats[]> => {
  try {
    const q = query(collection(db, 'players'));
    const querySnapshot = await getDocs(q);
    
    const players: PlayerStats[] = [];
    querySnapshot.forEach((doc) => {
      players.push(doc.data() as PlayerStats);
    });

    // Sort by best score descending
    players.sort((a, b) => b.bestScore - a.bestScore);
    return players.slice(0, limit);
  } catch (error) {
    console.error('Error getting leaderboard:', error);
    throw error;
  }
};
