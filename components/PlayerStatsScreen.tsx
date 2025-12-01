import React, { useEffect, useState } from 'react';
import { getPlayerStats, PlayerStats } from '../services/statsService';

interface PlayerStatsProps {
  uid: string;
  onBack: () => void;
}

const PlayerStatsScreen: React.FC<PlayerStatsProps> = ({ uid, onBack }) => {
  const [stats, setStats] = useState<PlayerStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const playerStats = await getPlayerStats(uid);
        setStats(playerStats);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [uid]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-cyan-400"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-gray-400 mb-4">No stats found. Play your first game!</p>
          <button
            onClick={onBack}
            className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg"
          >
            Back
          </button>
        </div>
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
            Your Stats
          </h1>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gray-900 p-4 rounded-lg border border-gray-700 text-center">
              <p className="text-gray-400 text-sm">Games Played</p>
              <p className="text-3xl font-bold text-cyan-400">{stats.totalGames}</p>
            </div>

            <div className="bg-gray-900 p-4 rounded-lg border border-gray-700 text-center">
              <p className="text-gray-400 text-sm">Best Score</p>
              <p className="text-3xl font-bold text-cyan-400">{stats.bestScore}/10</p>
            </div>

            <div className="bg-gray-900 p-4 rounded-lg border border-gray-700 text-center">
              <p className="text-gray-400 text-sm">Average Score</p>
              <p className="text-3xl font-bold text-cyan-400">{stats.averageScore.toFixed(1)}</p>
            </div>

            <div className="bg-gray-900 p-4 rounded-lg border border-gray-700 text-center">
              <p className="text-gray-400 text-sm">Total Score</p>
              <p className="text-3xl font-bold text-cyan-400">{stats.totalScore}</p>
            </div>
          </div>

          {stats.gamesPlayed.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-white mb-4">Recent Games</h2>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {stats.gamesPlayed.slice().reverse().map((game, index) => (
                  <div
                    key={index}
                    className="bg-gray-900 p-4 rounded-lg border border-gray-700 flex justify-between items-center"
                  >
                    <div>
                      <p className="text-white font-semibold">{game.category}</p>
                      <p className="text-gray-400 text-sm">
                        Score: {game.score}/{game.totalQuestions}
                      </p>
                    </div>
                    <p className="text-cyan-400 font-bold text-lg">
                      {((game.score / game.totalQuestions) * 100).toFixed(0)}%
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlayerStatsScreen;
