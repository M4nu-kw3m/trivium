import React, { useEffect, useState } from 'react';
import { getLeaderboard, PlayerStats } from '../services/statsService';

interface LeaderboardProps {
  onBack: () => void;
}

const LeaderboardScreen: React.FC<LeaderboardProps> = ({ onBack }) => {
  const [leaderboard, setLeaderboard] = useState<PlayerStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const topPlayers = await getLeaderboard(20);
        setLeaderboard(topPlayers);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-cyan-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={onBack}
          className="mb-6 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg"
        >
          ← Back
        </button>

        <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 font-orbitron mb-8 text-center">
            Leaderboard
          </h1>

          {leaderboard.length === 0 ? (
            <p className="text-center text-gray-400">No players yet. Be the first!</p>
          ) : (
            <div className="space-y-2">
              {leaderboard.map((player, index) => (
                <div
                  key={player.uid}
                  className={`p-4 rounded-lg flex items-center justify-between border-2 transition-all ${
                    index === 0
                      ? 'bg-gradient-to-r from-yellow-600/20 to-yellow-400/10 border-yellow-500'
                      : index === 1
                      ? 'bg-gradient-to-r from-gray-400/20 to-gray-300/10 border-gray-400'
                      : index === 2
                      ? 'bg-gradient-to-r from-orange-600/20 to-orange-400/10 border-orange-500'
                      : 'bg-gray-900 border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="text-2xl font-bold w-8">
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                    </div>
                    <div>
                      <p className="text-white font-semibold">{player.email?.split('@')[0]}</p>
                      <p className="text-gray-400 text-sm">{player.totalGames} games played</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-cyan-400">{player.bestScore}</p>
                    <p className="text-gray-400 text-sm">best score</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeaderboardScreen;
