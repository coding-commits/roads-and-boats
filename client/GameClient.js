export class GameClient {
  constructor() {
    this.socket = null;
    this.playerId = null;
    this.playerName = '';
    this.currentGame = null;
    this.gameId = null;
    this.eventHandlers = new Map();
    this.isSinglePlayer = false;
  }

  connect() {
    this.socket = io();
    
    this.socket.on('connect', () => {
      console.log('Connected to server');
      this.emit('connected');
    });

    this.socket.on('connected', (data) => {
      this.playerId = data.playerId;
    });

    this.socket.on('game_created', (data) => {
      this.gameId = data.gameId;
      this.currentGame = data.game;
      this.emit('game_created', data);
    });

    this.socket.on('joined_game', (data) => {
      this.gameId = data.gameId;
      this.playerId = data.playerId;
      this.currentGame = data.game;
      this.emit('joined_game', data);
    });

    this.socket.on('game_started', (data) => {
      this.currentGame = data.game;
      this.emit('game_started', data);
    });

    this.socket.on('game_update', (data) => {
      this.currentGame = data.game;
      this.emit('game_update', data);
    });

    this.socket.on('phase_changed', (data) => {
      this.emit('phase_changed', data);
    });

    this.socket.on('game_finished', (data) => {
      this.emit('game_finished', data);
    });

    this.socket.on('player_joined', (data) => {
      this.currentGame = data.game;
      this.emit('player_joined', data);
    });

    this.socket.on('player_left', (data) => {
      this.currentGame = data.game;
      this.emit('player_left', data);
    });

    this.socket.on('action_failed', (data) => {
      this.emit('action_failed', data);
    });

    this.socket.on('error', (data) => {
      this.emit('error', data);
    });

    this.socket.on('game_list', (data) => {
      this.emit('game_list', data);
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from server');
      this.emit('disconnected');
    });
  }

  setPlayerName(name) {
    this.playerName = name;
  }

  createGame(maxPlayers = 4, roomName = '') {
    if (!this.socket) return;
    
    this.socket.emit('create_game', { 
      maxPlayers,
      roomName,
      playerName: this.playerName 
    });
  }

  toggleReady() {
    if (!this.socket || !this.gameId) return;
    
    console.log('toggleReady called, gameId:', this.gameId, 'playerId:', this.playerId);
    console.log('Current game state:', this.currentGame);
    
    // Check current ready state
    const isCurrentlyReady = this.currentGame && 
                            this.currentGame.readyPlayers && 
                            Array.isArray(this.currentGame.readyPlayers) && 
                            this.currentGame.readyPlayers.includes(this.playerId);
    
    const action = {
      type: 'toggle_ready',
      playerId: this.playerId,
      data: { ready: !isCurrentlyReady }
    };
    
    console.log('Sending toggle_ready action:', { 
      currentlyReady: isCurrentlyReady, 
      newState: !isCurrentlyReady,
      action: action 
    });
    
    this.socket.emit('game_action', { gameId: this.gameId, action });
  }

  joinGame(gameId) {
    if (!this.socket) return;
    
    this.socket.emit('join_game', { 
      gameId, 
      playerName: this.playerName 
    });
  }

  startGame() {
    if (!this.socket || !this.gameId) return;
    
    this.socket.emit('start_game', { gameId: this.gameId });
  }

  leaveGame() {
    if (!this.socket || !this.gameId) return;
    
    this.socket.emit('leave_game', { gameId: this.gameId });
    this.gameId = null;
    this.currentGame = null;
  }

  getGameList() {
    if (!this.socket) return;
    
    this.socket.emit('get_game_list');
  }

  moveTransporter(transporterId, fromHex, toHex) {
    if (!this.socket || !this.gameId) return;
    
    const action = {
      type: 'move_transporter',
      playerId: this.playerId,
      data: {
        transporterId,
        fromHex: `${fromHex.q},${fromHex.r}`,
        toHex: `${toHex.q},${toHex.r}`
      }
    };
    
    this.socket.emit('game_action', { gameId: this.gameId, action });
  }

  loadResource(transporterId, resourceType, quantity, fromHex) {
    if (!this.socket || !this.gameId) return;
    
    const action = {
      type: 'load_resource',
      playerId: this.playerId,
      data: {
        transporterId,
        resourceType,
        quantity,
        fromHex: `${fromHex.q},${fromHex.r}`
      }
    };
    
    this.socket.emit('game_action', { gameId: this.gameId, action });
  }

  unloadResource(transporterId, resourceType, quantity, toHex) {
    if (!this.socket || !this.gameId) return;
    
    const action = {
      type: 'unload_resource',
      playerId: this.playerId,
      data: {
        transporterId,
        resourceType,
        quantity,
        toHex: `${toHex.q},${toHex.r}`
      }
    };
    
    this.socket.emit('game_action', { gameId: this.gameId, action });
  }

  buildStructure(buildingType, position, cost) {
    if (!this.socket || !this.gameId) return;
    
    const action = {
      type: 'build_structure',
      playerId: this.playerId,
      data: {
        buildingType,
        position: `${position.q},${position.r}`,
        cost
      }
    };
    
    this.socket.emit('game_action', { gameId: this.gameId, action });
  }

  buildRoad(fromHex, toHex) {
    if (!this.socket || !this.gameId) return;
    
    const action = {
      type: 'build_road',
      playerId: this.playerId,
      data: {
        fromHex: `${fromHex.q},${fromHex.r}`,
        toHex: `${toHex.q},${toHex.r}`,
        cost: [{ type: 'stone', quantity: 1 }]
      }
    };
    
    this.socket.emit('game_action', { gameId: this.gameId, action });
  }

  endPhase() {
    if (!this.socket || !this.gameId) return;
    
    const action = {
      type: 'end_phase',
      playerId: this.playerId,
      data: {}
    };
    
    this.socket.emit('game_action', { gameId: this.gameId, action });
  }

  researchTechnology(technology) {
    if (!this.socket || !this.gameId) return;
    
    const action = {
      type: 'research_technology',
      playerId: this.playerId,
      data: { technology }
    };
    
    this.socket.emit('game_action', { gameId: this.gameId, action });
  }

  on(event, handler) {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, []);
    }
    this.eventHandlers.get(event).push(handler);
  }

  off(event, handler) {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index !== -1) {
        handlers.splice(index, 1);
      }
    }
  }

  emit(event, data) {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      handlers.forEach(handler => handler(data));
    }
  }

  createSinglePlayerGame() {
    // Import required classes
    import('../shared/GameState.js').then(({ GameState }) => {
      import('../shared/Player.js').then(({ Player }) => {
        this.isSinglePlayer = true;
        this.gameId = 'single-player-' + Math.random().toString(36).substr(2, 9);
        this.playerId = 'player-0';
        
        // Create game state for single player (max 1 player)
        this.currentGame = new GameState(this.gameId, 1, 'Single Player Game');
        
        // Create only one player
        const player = new Player('player-0', this.playerName || 'Player', this.getPlayerColor(0));
        this.currentGame.addPlayer(player);
        
        // Start the game
        this.currentGame.start();
        
        // Make sure the game is properly serialized for the renderer
        this.emit('game_started', { game: this.currentGame.toJSON() });
      });
    });
  }

  getPlayerColor(index) {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'];
    return colors[index] || '#000000';
  }

  nextTurn() {
    if (!this.isSinglePlayer) return;
    
    // In single player mode, just advance to the next turn/phase
    // Reset the single player for the new turn
    const players = this.currentGame.getAllPlayers();
    if (players.length > 0) {
      players[0].resetForNewTurn();
    }
    
    this.emit('game_update', { game: this.currentGame.toJSON() });
  }

  endPhase() {
    if (this.isSinglePlayer) {
      // In single player mode, advance to next phase immediately
      this.currentGame.nextPhase();
      
      if (this.currentGame.currentPhase === 'production') {
        this.currentGame.executeProductionPhase();
      }
      
      // Reset the player for the new phase
      this.nextTurn();
      
      if (this.currentGame.checkWinCondition()) {
        this.emit('game_finished', { 
          winner: this.currentGame.winner,
          finalScores: this.currentGame.getAllPlayers().map(p => ({
            playerId: p.id,
            name: p.name,
            score: p.score
          }))
        });
      }
    } else {
      // Normal multiplayer logic
      const action = {
        type: 'end_phase',
        playerId: this.playerId,
        data: {}
      };
      
      this.socket.emit('game_action', { gameId: this.gameId, action });
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.playerId = null;
    this.currentGame = null;
    this.gameId = null;
    this.isSinglePlayer = false;
  }
}