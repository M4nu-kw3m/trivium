
import React from 'react';

import { Player } from '../types';

interface ScoreScreenProps {
  score: number;
  totalQuestions: number;
  onRestart: () => void;
  isMultiplayer?: boolean;
  players?: Player[];
}

const ScoreScreen: React.FC<ScoreScreenProps> = ({ score, totalQuestions, onRestart, isMultiplayer, players }) => {

  const percentage = Math.round((score / totalQuestions) * 100);

  const getFeedbackMessage = () => {
    if (percentage === 100) return "Perfect Score! You're a trivia legend!";
    if (percentage >= 80) return "Excellent! You really know your stuff.";
    if (percentage >= 50) return "Nice job! A solid performance.";
    if (percentage >= 20) return "Not bad! Keep practicing.";
    return "Better luck next time! Every expert was once a beginner.";
  };

  return (
    <div className="text-center bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 shadow-2xl shadow-cyan-500/10 animate-fade-in max-w-2xl w-full">
      <h2 className="text-4xl font-orbitron font-bold text-cyan-400 mb-4">
        {isMultiplayer ? "Game Over!" : "Game Over!"}
      </h2>

      {isMultiplayer && players ? (
        <div className="mb-8">
          <h3 className="text-2xl text-white mb-4 font-semibold">Leaderboard</h3>
          <div className="space-y-3">
            {[...players].sort((a, b) => b.score - a.score).map((player, index) => (
              <div key={player.id} className={`flex items-center justify-between p-4 rounded-lg ${player.username === players.find(p => p.score === score)?.username ? 'bg-cyan-900/50 border border-cyan-500/50' : 'bg-gray-700'}`}>
                <div className="flex items-center gap-4">
                  <span className="text-2xl font-bold text-gray-400">#{index + 1}</span>
                  <span className="text-xl text-white font-medium">{player.username}</span>
                </div>
                <span className="text-2xl font-bold text-cyan-400">{player.score} pts</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          <p className="text-xl text-gray-300 mb-2">Your Final Score:</p>
          <p className="text-7xl font-orbitron font-black text-white my-4">
            {score} <span className="text-4xl text-gray-400">/ {totalQuestions}</span>
          </p>
          <p className="text-2xl font-semibold text-yellow-400 mb-8">{getFeedbackMessage()}</p>
        </>
      )}

      <button
        onClick={onRestart}
        className="px-10 py-4 bg-cyan-500 text-gray-900 font-bold text-xl rounded-lg 
                   hover:bg-cyan-400 transition-all duration-300 transform hover:scale-105
                   shadow-lg shadow-cyan-500/30"
      >
        {isMultiplayer ? "Back to Menu" : "Play Again"}
      </button>
    </div>
  );
};

export default ScoreScreen;
