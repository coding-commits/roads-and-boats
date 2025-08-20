const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const GameManager = require('./GameManager');
const { ACTION_TYPES } = require('../shared/gameTypes');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, '../dist')));
app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

const gameManager = new GameManager();

// Initialize the game manager
(async () => {
  await gameManager.init();
  console.log('Game manager initialized');
})();

io.on('connection', (socket) => {
  console.log(`Player connected: ${socket.id}`);
  
  socket.emit('connected', { playerId: socket.id });

  socket.on('create_game', (data) => {
    try {
      const gameId = uuidv4();
      const { maxPlayers = 4, roomName = '', playerName } = data;
      const game = gameManager.createGame(gameId, maxPlayers, roomName);
      
      if (game) {
        // Automatically add creator to the game
        const player = gameManager.addPlayerToGame(gameId, socket.id, playerName);
        
        if (player) {
          socket.join(gameId);
          socket.emit('game_created', { 
            gameId, 
            game: game.toJSON() 
          });
          console.log(`Game created: ${gameId} by ${playerName}`);
        } else {
          socket.emit('error', { message: 'Failed to join created game' });
        }
      } else {
        socket.emit('error', { message: 'Failed to create game' });
      }
    } catch (error) {
      console.error('Error creating game:', error);
      socket.emit('error', { message: 'Internal server error' });
    }
  });

  socket.on('join_game', (data) => {
    try {
      const { gameId, playerName } = data;
      const game = gameManager.getGame(gameId);
      
      if (!game) {
        socket.emit('error', { message: 'Game not found' });
        return;
      }
      
      const player = gameManager.addPlayerToGame(gameId, socket.id, playerName);
      
      if (player) {
        socket.join(gameId);
        socket.emit('joined_game', { 
          gameId, 
          playerId: socket.id,
          game: game.toJSON() 
        });
        
        io.to(gameId).emit('player_joined', { 
          player: player.toJSON(),
          game: game.toJSON() 
        });
        
        console.log(`Player ${playerName} joined game ${gameId}`);
      } else {
        socket.emit('error', { message: 'Failed to join game' });
      }
    } catch (error) {
      console.error('Error joining game:', error);
      socket.emit('error', { message: 'Internal server error' });
    }
  });

  socket.on('start_game', (data) => {
    try {
      const { gameId } = data;
      const game = gameManager.startGame(gameId);
      
      if (game) {
        io.to(gameId).emit('game_started', { 
          game: game.toJSON() 
        });
        console.log(`Game started: ${gameId}`);
      } else {
        socket.emit('error', { message: 'Failed to start game' });
      }
    } catch (error) {
      console.error('Error starting game:', error);
      socket.emit('error', { message: 'Internal server error' });
    }
  });

  socket.on('game_action', (data) => {
    try {
      const { gameId, action } = data;
      console.log('Received game_action:', action.type, 'from player:', action.playerId);
      const result = gameManager.executeAction(gameId, action);
      
      if (result.success) {
        const game = gameManager.getGame(gameId);
        io.to(gameId).emit('game_update', { 
          game: game.toJSON(),
          action: action 
        });
        
        if (result.phaseChanged) {
          io.to(gameId).emit('phase_changed', { 
            newPhase: game.currentPhase,
            turn: game.turn 
          });
        }
        
        if (game.isFinished) {
          io.to(gameId).emit('game_finished', { 
            winner: game.winner.toJSON(),
            finalScores: game.getAllPlayers().map(p => ({
              playerId: p.id,
              name: p.name,
              score: p.score
            }))
          });
        }
      } else {
        socket.emit('action_failed', { 
          action: action,
          reason: result.reason 
        });
      }
    } catch (error) {
      console.error('Error executing action:', error);
      socket.emit('error', { message: 'Internal server error' });
    }
  });

  socket.on('get_game_list', () => {
    try {
      const games = gameManager.getPublicGames();
      socket.emit('game_list', { games });
    } catch (error) {
      console.error('Error getting game list:', error);
      socket.emit('error', { message: 'Internal server error' });
    }
  });

  socket.on('disconnect', () => {
    try {
      console.log(`Player disconnected: ${socket.id}`);
      
      const gameId = gameManager.removePlayerFromAllGames(socket.id);
      if (gameId) {
        const game = gameManager.getGame(gameId);
        if (game) {
          socket.to(gameId).emit('player_left', { 
            playerId: socket.id,
            game: game.toJSON() 
          });
        }
      }
    } catch (error) {
      console.error('Error handling disconnect:', error);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Roads and Boats server running on port ${PORT}`);
});

module.exports = { app, server, io };