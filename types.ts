export interface TriviaQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

export enum GameState {
  CATEGORY_SELECTION,
  LOBBY,
  PLAYING,
  FINISHED,
}

export interface Player {
  id: string;
  username: string;
  score: number;
}

export interface Room {
  id: string;
  host: string;
  category: string;
  players: Player[];
  gameState: 'LOBBY' | 'PLAYING' | 'FINISHED';
}
