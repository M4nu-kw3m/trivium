import React from 'react';
import { Player } from '../types';

interface LobbyProps {
    roomId: string;
    players: Player[];
    isHost: boolean;
    onStartGame: () => void;
}

const Lobby: React.FC<LobbyProps> = ({ roomId, players, isHost, onStartGame }) => {
    return (
        <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl max-w-md w-full border border-gray-700">
            <h2 className="text-3xl font-bold text-white mb-6 text-center font-orbitron">Lobby</h2>

            <div className="mb-8 text-center">
                <p className="text-gray-400 mb-2">Room Code</p>
                <div className="text-4xl font-mono text-cyan-400 font-bold tracking-wider bg-gray-900 py-3 rounded-lg border border-cyan-500/30">
                    {roomId}
                </div>
            </div>

            <div className="mb-8">
                <h3 className="text-xl text-white mb-4 font-semibold">Players ({players.length})</h3>
                <ul className="space-y-3">
                    {players.map((player) => (
                        <li key={player.id} className="flex items-center bg-gray-700 p-3 rounded-lg">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white font-bold mr-3">
                                {player.username.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-gray-200 font-medium">{player.username}</span>
                            {player.id === players[0].id && ( // Assuming first player is host for visual simplicity, though we pass isHost prop
                                <span className="ml-auto text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded border border-yellow-500/30">HOST</span>
                            )}
                        </li>
                    ))}
                </ul>
            </div>

            {isHost ? (
                <button
                    onClick={onStartGame}
                    className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold rounded-xl text-lg hover:from-cyan-400 hover:to-blue-400 transition-all duration-300 shadow-lg shadow-cyan-500/20 transform hover:scale-[1.02]"
                >
                    Start Game
                </button>
            ) : (
                <div className="text-center text-gray-400 animate-pulse">
                    Waiting for host to start...
                </div>
            )}
        </div>
    );
};

export default Lobby;
