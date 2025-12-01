
import React, { useState, useEffect, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { GameState, TriviaQuestion, Player, Room } from './types';
import CategorySelector from './components/CategorySelector';
import QuestionCard from './components/QuestionCard';
import ScoreScreen from './components/ScoreScreen';
import Lobby from './components/Lobby';
import { fetchTriviaQuestions } from './services/geminiService';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.CATEGORY_SELECTION);
  const [questions, setQuestions] = useState<TriviaQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  // Multiplayer State
  const [isMultiplayer, setIsMultiplayer] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [roomId, setRoomId] = useState('');
  const [username, setUsername] = useState('');
  const [players, setPlayers] = useState<Player[]>([]);
  const [isHost, setIsHost] = useState(false);
  const [joinRoomId, setJoinRoomId] = useState('');

  useEffect(() => {
    if (isMultiplayer && !socket) {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
      const newSocket = io(backendUrl);
      setSocket(newSocket);

      newSocket.on('connect', () => {
        console.log('Connected to server');
      });

      newSocket.on('room_created', (id: string) => {
        setRoomId(id);
        setIsHost(true);
        setGameState(GameState.LOBBY);
      });

      newSocket.on('joined_room', (data: { roomId: string, category: string, host: boolean }) => {
        setRoomId(data.roomId);
        setSelectedCategory(data.category);
        setIsHost(data.host);
        setGameState(GameState.LOBBY);
      });

      newSocket.on('update_players', (updatedPlayers: Player[]) => {
        setPlayers(updatedPlayers);
      });

      newSocket.on('game_started', (firstQuestion: TriviaQuestion) => {
        setQuestions([firstQuestion]); // We'll append or update as we go, or just store current
        setCurrentQuestionIndex(0);
        setGameState(GameState.PLAYING);
      });

      newSocket.on('next_question', (question: TriviaQuestion) => {
        setQuestions(prev => [...prev, question]);
        setCurrentQuestionIndex(prev => prev + 1);
      });

      newSocket.on('update_scores', (updatedPlayers: Player[]) => {
        setPlayers(updatedPlayers);
      });

      newSocket.on('game_over', (finalPlayers: Player[]) => {
        setPlayers(finalPlayers);
        setGameState(GameState.FINISHED);
      });

      newSocket.on('error', (msg: string) => {
        setError(msg);
        setTimeout(() => setError(null), 3000);
      });

      return () => {
        newSocket.disconnect();
      };
    }
  }, [isMultiplayer]);

  const startSinglePlayer = useCallback(async (category: string) => {
    setIsLoading(true);
    setError(null);
    setSelectedCategory(category);
    try {
      const fetchedQuestions = await fetchTriviaQuestions(category);
      if (fetchedQuestions && fetchedQuestions.length > 0) {
        setQuestions(fetchedQuestions);
        setCurrentQuestionIndex(0);
        setScore(0);
        setGameState(GameState.PLAYING);
      } else {
        setError('Failed to load questions. Please try a different category.');
      }
    } catch (err) {
      setError('An error occurred while fetching questions. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createRoom = async (category: string) => {
    if (!username) {
      setError('Please enter a username first');
      return;
    }
    setIsLoading(true);
    setSelectedCategory(category);

    // In a real app, we might fetch questions on the server, but here we fetch on client and send to server
    try {
      const fetchedQuestions = await fetchTriviaQuestions(category);
      if (fetchedQuestions && fetchedQuestions.length > 0) {
        setQuestions(fetchedQuestions); // Host keeps full list
        socket?.emit('create_room', { category, username });
      } else {
        setError('Failed to load questions.');
      }
    } catch (e) {
      setError('Error generating questions');
    } finally {
      setIsLoading(false);
    }
  };

  const joinRoom = () => {
    if (!username || !joinRoomId) {
      setError('Please enter username and room code');
      return;
    }
    socket?.emit('join_room', { roomId: joinRoomId, username });
  };

  const handleHostStartGame = () => {
    if (socket && isHost) {
      socket.emit('start_game', { roomId, questions });
    }
  };

  const handleAnswer = (isCorrect: boolean, answer: string) => {
    if (isMultiplayer) {
      socket?.emit('submit_answer', { roomId, answer, isCorrect });
      // Optimistic update or wait for server? We'll wait for server for score, but show UI feedback
    } else {
      if (isCorrect) {
        setScore((prevScore) => prevScore + 1);
      }
      const nextQuestionIndex = currentQuestionIndex + 1;
      if (nextQuestionIndex < questions.length) {
        setTimeout(() => {
          setCurrentQuestionIndex(nextQuestionIndex);
        }, 1500);
      } else {
        setTimeout(() => {
          setGameState(GameState.FINISHED);
        }, 1500);
      }
    }
  };

  const restartGame = () => {
    setGameState(GameState.CATEGORY_SELECTION);
    setQuestions([]);
    setError(null);
    setIsMultiplayer(false);
    setRoomId('');
    setPlayers([]);
    if (socket) {
      socket.disconnect();
      setSocket(null);
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-screen">
          <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-cyan-400"></div>
          <p className="mt-4 text-xl font-orbitron">Loading...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-screen text-center">
          <p className="text-2xl text-red-500 font-semibold mb-4">{error}</p>
          <button
            onClick={() => setError(null)}
            className="px-8 py-3 bg-cyan-500 text-gray-900 font-bold rounded-lg hover:bg-cyan-400"
          >
            Dismiss
          </button>
        </div>
      )
    }

    switch (gameState) {
      case GameState.PLAYING:
        return (
          <QuestionCard
            question={questions[isMultiplayer ? questions.length - 1 : currentQuestionIndex]} // In multiplayer, we append questions
            onAnswer={(isCorrect, answer) => handleAnswer(isCorrect, answer)}
            questionNumber={isMultiplayer ? questions.length : currentQuestionIndex + 1}
            totalQuestions={isMultiplayer ? 5 : questions.length} // Hardcoded 5 for multiplayer display for now or pass from server
          />
        );
      case GameState.FINISHED:
        return (
          <ScoreScreen
            score={isMultiplayer ? players.find(p => p.id === socket?.id)?.score || 0 : score}
            totalQuestions={questions.length}
            onRestart={restartGame}
            isMultiplayer={isMultiplayer}
            players={players}
          />
        );
      case GameState.LOBBY:
        return (
          <Lobby
            roomId={roomId}
            players={players}
            isHost={isHost}
            onStartGame={handleHostStartGame}
          />
        );
      case GameState.CATEGORY_SELECTION:
      default:
        if (!isMultiplayer) {
          return (
            <div className="flex flex-col items-center space-y-6 w-full max-w-md">
              <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 font-orbitron mb-8 text-center">
                TRIVIUM
              </h1>
              <button
                onClick={() => startSinglePlayer('General Knowledge')} // Default or show selector
                className="w-full py-4 bg-gray-800 border border-gray-700 hover:border-cyan-500 text-white font-bold rounded-xl transition-all"
              >
                Single Player
              </button>
              <button
                onClick={() => setIsMultiplayer(true)}
                className="w-full py-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold rounded-xl hover:from-cyan-500 hover:to-blue-500 transition-all shadow-lg shadow-cyan-500/20"
              >
                Multiplayer
              </button>
            </div>
          );
        } else {
          // Multiplayer Setup Screen
          return (
            <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl max-w-md w-full border border-gray-700">
              <h2 className="text-2xl font-bold text-white mb-6 font-orbitron">Multiplayer Setup</h2>
              <input
                type="text"
                placeholder="Enter Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 text-white p-3 rounded-lg mb-6 focus:border-cyan-500 outline-none"
              />

              <div className="space-y-4">
                <div className="border-t border-gray-700 pt-4">
                  <p className="text-gray-400 mb-2 text-sm">Create New Game</p>
                  <CategorySelector onSelectCategory={createRoom} />
                </div>

                <div className="border-t border-gray-700 pt-4">
                  <p className="text-gray-400 mb-2 text-sm">Join Existing Game</p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Room Code"
                      value={joinRoomId}
                      onChange={(e) => setJoinRoomId(e.target.value.toUpperCase())}
                      className="flex-1 bg-gray-900 border border-gray-700 text-white p-3 rounded-lg focus:border-cyan-500 outline-none"
                    />
                    <button
                      onClick={joinRoom}
                      className="px-6 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-lg transition-colors"
                    >
                      Join
                    </button>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsMultiplayer(false)}
                className="mt-6 text-gray-500 hover:text-gray-300 text-sm w-full text-center"
              >
                Back to Menu
              </button>
            </div>
          );
        }
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 selection:bg-cyan-500 selection:text-black">
      <div className="w-full max-w-2xl mx-auto flex justify-center">
        {renderContent()}
      </div>
    </div>
  );
};

export default App;
