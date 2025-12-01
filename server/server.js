import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
app.use(cors());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000", // Vite dev server port
    methods: ["GET", "POST"]
  }
});

// Game State
const rooms = new Map();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('create_room', ({ category, username }) => {
    const roomId = Math.random().toString(36).substring(2, 8).toUpperCase();

    rooms.set(roomId, {
      id: roomId,
      host: socket.id,
      category,
      players: [{ id: socket.id, username, score: 0 }],
      gameState: 'LOBBY', // LOBBY, PLAYING, FINISHED
      currentQuestionIndex: 0,
      questions: [],
      answers: {} // { questionIndex: { playerId: answer } }
    });

    socket.join(roomId);
    socket.emit('room_created', roomId);
    io.to(roomId).emit('update_players', rooms.get(roomId).players);
    console.log(`Room ${roomId} created by ${username}`);
  });

  socket.on('join_room', ({ roomId, username }) => {
    const room = rooms.get(roomId);
    if (room && room.gameState === 'LOBBY') {
      room.players.push({ id: socket.id, username, score: 0 });
      socket.join(roomId);

      // Send current room state to the joiner
      socket.emit('joined_room', {
        roomId,
        category: room.category,
        host: room.host === socket.id
      });

      // Notify everyone in room
      io.to(roomId).emit('update_players', room.players);
      console.log(`${username} joined room ${roomId}`);
    } else {
      socket.emit('error', 'Room not found or game already started');
    }
  });

  socket.on('start_game', ({ roomId, questions }) => {
    const room = rooms.get(roomId);
    if (room && room.host === socket.id) {
      room.questions = questions;
      room.gameState = 'PLAYING';
      room.currentQuestionIndex = 0;

      io.to(roomId).emit('game_started', questions[0]);
      console.log(`Game started in room ${roomId}`);
    }
  });

  socket.on('submit_answer', ({ roomId, answer, isCorrect }) => {
    const room = rooms.get(roomId);
    if (room && room.gameState === 'PLAYING') {
      const player = room.players.find(p => p.id === socket.id);
      if (player) {
        // Record answer
        if (!room.answers[room.currentQuestionIndex]) {
          room.answers[room.currentQuestionIndex] = {};
        }
        room.answers[room.currentQuestionIndex][socket.id] = answer;

        if (isCorrect) {
          player.score += 1;
        }

        // Check if all players have answered
        const answeredCount = Object.keys(room.answers[room.currentQuestionIndex]).length;
        if (answeredCount === room.players.length) {
          // All players answered, wait a bit then move to next or finish
          setTimeout(() => {
            if (room.currentQuestionIndex + 1 < room.questions.length) {
              room.currentQuestionIndex++;
              io.to(roomId).emit('next_question', room.questions[room.currentQuestionIndex]);
              io.to(roomId).emit('update_scores', room.players); // Send intermediate scores
            } else {
              room.gameState = 'FINISHED';
              io.to(roomId).emit('game_over', room.players);
            }
          }, 2000);
        }
      }
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    // Handle cleanup - remove player from rooms, delete empty rooms, etc.
    // For simplicity, we'll just leave it for now or do basic cleanup
    rooms.forEach((room, roomId) => {
      const playerIndex = room.players.findIndex(p => p.id === socket.id);
      if (playerIndex !== -1) {
        room.players.splice(playerIndex, 1);
        io.to(roomId).emit('update_players', room.players);
        if (room.players.length === 0) {
          rooms.delete(roomId);
        }
      }
    });
  });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
