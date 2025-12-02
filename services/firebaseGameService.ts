import { collection, query, where, onSnapshot, Unsubscribe } from 'firebase/firestore';
import { db } from './firebaseConfig';
import { Room } from '../types';

export const subscribeToLiveGame = (
  onGameUpdate: (game: Room | null) => void
): Unsubscribe => {
  // Query for games where status is 'PLAYING'
  // We assume there's a 'games' collection. 
  // Note: This query might need an index depending on Firestore rules and composite queries,
  // but for a simple single-field equality, it should be fine.
  // We'll just take the first one found for now if multiple exist, 
  // or maybe we should listen to a specific "global" game if that's the intent.
  // Based on "check if the game is playing live", checking for ANY playing game seems appropriate.
  
  const gamesRef = collection(db, 'games');
  const q = query(gamesRef, where('gameState', '==', 'PLAYING'));

  const unsubscribe = onSnapshot(q, (snapshot) => {
    if (!snapshot.empty) {
      // Just take the first active game found
      const gameDoc = snapshot.docs[0];
      const gameData = gameDoc.data() as Room;
      // Ensure the ID is included
      const gameWithId = { ...gameData, id: gameDoc.id };
      onGameUpdate(gameWithId);
    } else {
      onGameUpdate(null);
    }
  }, (error) => {
    console.error("Error listening to live games:", error);
    onGameUpdate(null);
  });

  return unsubscribe;
};
