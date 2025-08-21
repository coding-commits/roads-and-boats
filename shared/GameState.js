import { GameBoard } from './GameBoard.js';
import { Player } from './Player.js';
import { GAME_PHASES } from './gameTypes.js';
import { HexCoordinate } from './hexUtils.js';
import { Resource } from './Resource.js';

export class GameState {
  constructor(gameId, maxPlayers = 4, roomName = '') {
    this.gameId = gameId;
    this.roomName = roomName || `Room ${gameId.substr(0, 8)}`;
    this.maxPlayers = maxPlayers;
    this.players = new Map();
    this.board = new GameBoard();
    this.currentPhase = GAME_PHASES.PRODUCTION;
    this.turn = 1;
    this.isStarted = false;
    this.isFinished = false;
    this.winner = null;
    this.wonderBlocks = 193;
    this.createdAt = Date.now();
    this.lastUpdated = Date.now();
    this.creatorId = null;
    this.readyPlayers = new Set();
  }

  addPlayer(player) {
    if (this.players.size >= this.maxPlayers) {
      return false;
    }
    
    if (this.isStarted) {
      return false;
    }
    
    // Set first player as creator
    if (this.players.size === 0) {
      this.creatorId = player.id;
    }
    
    this.players.set(player.id, player);
    this.lastUpdated = Date.now();
    return true;
  }

  removePlayer(playerId) {
    const removed = this.players.delete(playerId);
    if (removed) {
      this.readyPlayers.delete(playerId);
      
      // If creator leaves, assign new creator
      if (this.creatorId === playerId && this.players.size > 0) {
        this.creatorId = this.getAllPlayers()[0].id;
      }
      
      this.lastUpdated = Date.now();
    }
    return removed;
  }

  getPlayer(playerId) {
    return this.players.get(playerId);
  }

  getAllPlayers() {
    return Array.from(this.players.values());
  }

  setPlayerReady(playerId, ready = true) {
    if (ready) {
      this.readyPlayers.add(playerId);
    } else {
      this.readyPlayers.delete(playerId);
    }
    this.lastUpdated = Date.now();
  }

  isPlayerReady(playerId) {
    return this.readyPlayers.has(playerId);
  }

  allPlayersReady() {
    return this.players.size >= 2 && 
           this.players.size === this.readyPlayers.size;
  }

  canStart() {
    return this.players.size >= 2 && !this.isStarted && this.allPlayersReady();
  }

  start() {
    if (!this.canStart()) {
      return false;
    }
    
    this.isStarted = true;
    this.initializePlayerPositions();
    this.lastUpdated = Date.now();
    return true;
  }

  initializePlayerPositions() {
    const players = this.getAllPlayers();
    
    // Find suitable land hexes for starting positions
    const landHexes = this.board.findLandHexes();
    const startingPositions = this.selectStartingPositions(landHexes, players.length);
    
    players.forEach((player, index) => {
      const startPos = startingPositions[index];
      
      // Position transporters at starting location
      player.transporters.forEach(transporter => {
        transporter.position = startPos;
      });
      
      // Place starting resources on the home hex
      this.placeStartingResources(player, startPos);
    });
  }
  
  selectStartingPositions(landHexes, playerCount) {
    // Fallback positions if board doesn't have suitable hexes
    const fallbackPositions = [
      new HexCoordinate(2, 2),
      new HexCoordinate(17, 2),
      new HexCoordinate(2, 17),
      new HexCoordinate(17, 17)
    ];
    
    if (!landHexes || landHexes.length < playerCount) {
      console.warn('Not enough land hexes found, using fallback positions');
      return fallbackPositions.slice(0, playerCount);
    }
    
    // Select well-spaced starting positions from land hexes
    const selectedPositions = [];
    const minDistance = 5; // Minimum distance between players
    
    for (let i = 0; i < playerCount && selectedPositions.length < playerCount; i++) {
      const candidate = landHexes[i * Math.floor(landHexes.length / playerCount)];
      
      // Check if candidate is far enough from existing positions
      const tooClose = selectedPositions.some(pos => 
        Math.abs(candidate.q - pos.q) + Math.abs(candidate.r - pos.r) < minDistance
      );
      
      if (!tooClose) {
        selectedPositions.push(candidate);
      } else if (selectedPositions.length < fallbackPositions.length) {
        selectedPositions.push(fallbackPositions[selectedPositions.length]);
      }
    }
    
    return selectedPositions.length >= playerCount ? selectedPositions : fallbackPositions.slice(0, playerCount);
  }
  
  placeStartingResources(player, homeHex) {
    const hex = this.board.getHex(homeHex);
    if (hex) {
      // Initialize resources array if it doesn't exist
      hex.resources = hex.resources || [];
      
      // Add starting resources to the home hex
      hex.resources.push(Resource.wood(3));   // 3 wood
      hex.resources.push(Resource.stone(2));  // 2 bricks (stone)
      
      console.log(`Placed starting resources on hex (${homeHex.q}, ${homeHex.r}) for player ${player.name}`);
      // Note: 2 geese and 3 mules are properties of the player, not hex resources
    } else {
      console.error(`Could not find home hex (${homeHex.q}, ${homeHex.r}) for player ${player.name}`);
    }
  }

  nextPhase() {
    const phases = Object.values(GAME_PHASES);
    const currentIndex = phases.indexOf(this.currentPhase);
    
    if (currentIndex === phases.length - 1) {
      this.currentPhase = phases[0];
      this.turn++;
      this.resetPlayersForNewTurn();
    } else {
      this.currentPhase = phases[currentIndex + 1];
    }
    
    this.lastUpdated = Date.now();
  }

  resetPlayersForNewTurn() {
    this.getAllPlayers().forEach(player => {
      player.resetForNewTurn();
    });
  }

  allPlayersReady() {
    const players = this.getAllPlayers();
    return players.length > 0 && players.every(player => player.isReady);
  }

  executeProductionPhase() {
    this.getAllPlayers().forEach(player => {
      player.buildings.forEach(building => {
        if (building.canProduce()) {
          const producedResources = building.produce();
          const hex = this.board.getHex(building.position);
          if (hex) {
            hex.resources.push(...producedResources);
          }
        }
      });
    });
  }

  checkWinCondition() {
    if (this.wonderBlocks <= 0) {
      const players = this.getAllPlayers();
      let maxScore = -1;
      let winner = null;
      
      players.forEach(player => {
        const score = player.calculateScore();
        if (score > maxScore) {
          maxScore = score;
          winner = player;
        }
      });
      
      this.isFinished = true;
      this.winner = winner;
      return true;
    }
    
    return false;
  }

  validateAction(action, player) {
    if (!this.isStarted || this.isFinished) {
      return { valid: false, reason: 'Game not in progress' };
    }
    
    if (!player) {
      return { valid: false, reason: 'Player not found' };
    }
    
    switch (action.type) {
      case 'move_transporter':
        return this.validateMoveTransporter(action, player);
      case 'load_resource':
        return this.validateLoadResource(action, player);
      case 'unload_resource':
        return this.validateUnloadResource(action, player);
      case 'build_structure':
        return this.validateBuildStructure(action, player);
      case 'build_road':
        return this.validateBuildRoad(action, player);
      default:
        return { valid: true };
    }
  }

  validateMoveTransporter(action, player) {
    if (this.currentPhase !== GAME_PHASES.MOVEMENT) {
      return { valid: false, reason: 'Not movement phase' };
    }
    
    const transporter = player.getTransporter(action.data.transporterId);
    if (!transporter) {
      return { valid: false, reason: 'Transporter not found' };
    }
    
    if (!transporter.canMove()) {
      return { valid: false, reason: 'Transporter has no movement remaining' };
    }
    
    const fromHex = HexCoordinate.fromAxial(...action.data.fromHex.split(',').map(Number));
    const toHex = HexCoordinate.fromAxial(...action.data.toHex.split(',').map(Number));
    
    if (!this.board.canMove(fromHex, toHex, transporter.type)) {
      return { valid: false, reason: 'Invalid move for this transporter type' };
    }
    
    return { valid: true };
  }

  validateLoadResource(action, player) {
    if (this.currentPhase !== GAME_PHASES.MOVEMENT) {
      return { valid: false, reason: 'Not movement phase' };
    }
    
    const transporter = player.getTransporter(action.data.transporterId);
    if (!transporter) {
      return { valid: false, reason: 'Transporter not found' };
    }
    
    const fromHex = HexCoordinate.fromAxial(...action.data.fromHex.split(',').map(Number));
    const hex = this.board.getHex(fromHex);
    if (!hex) {
      return { valid: false, reason: 'Hex not found' };
    }
    
    const resourceIndex = hex.resources.findIndex(r => 
      r.type === action.data.resourceType && r.quantity >= action.data.quantity
    );
    
    if (resourceIndex === -1) {
      return { valid: false, reason: 'Resource not available' };
    }
    
    return { valid: true };
  }

  validateUnloadResource(action, player) {
    if (this.currentPhase !== GAME_PHASES.MOVEMENT) {
      return { valid: false, reason: 'Not movement phase' };
    }
    
    const transporter = player.getTransporter(action.data.transporterId);
    if (!transporter) {
      return { valid: false, reason: 'Transporter not found' };
    }
    
    if (!transporter.cargo.has(action.data.resourceType, action.data.quantity)) {
      return { valid: false, reason: 'Transporter does not have enough resources' };
    }
    
    return { valid: true };
  }

  validateBuildStructure(action, player) {
    if (this.currentPhase !== GAME_PHASES.BUILDING) {
      return { valid: false, reason: 'Not building phase' };
    }
    
    return { valid: true };
  }

  validateBuildRoad(action, player) {
    if (this.currentPhase !== GAME_PHASES.BUILDING) {
      return { valid: false, reason: 'Not building phase' };
    }
    
    return { valid: true };
  }

  toJSON() {
    return {
      gameId: this.gameId,
      roomName: this.roomName,
      maxPlayers: this.maxPlayers,
      players: Array.from(this.players.entries()),
      board: this.board.toJSON(),
      currentPhase: this.currentPhase,
      turn: this.turn,
      isStarted: this.isStarted,
      isFinished: this.isFinished,
      winner: this.winner ? this.winner.toJSON() : null,
      wonderBlocks: this.wonderBlocks,
      createdAt: this.createdAt,
      lastUpdated: this.lastUpdated,
      creatorId: this.creatorId,
      readyPlayers: Array.from(this.readyPlayers)
    };
  }

  static fromJSON(data) {
    const gameState = new GameState(data.gameId, data.maxPlayers, data.roomName);
    gameState.players = new Map(data.players.map(([id, playerData]) => [id, Player.fromJSON(playerData)]));
    gameState.board = GameBoard.fromJSON(data.board);
    gameState.currentPhase = data.currentPhase;
    gameState.turn = data.turn;
    gameState.isStarted = data.isStarted;
    gameState.isFinished = data.isFinished;
    gameState.winner = data.winner ? Player.fromJSON(data.winner) : null;
    gameState.wonderBlocks = data.wonderBlocks;
    gameState.createdAt = data.createdAt;
    gameState.lastUpdated = data.lastUpdated;
    gameState.creatorId = data.creatorId;
    gameState.readyPlayers = new Set(data.readyPlayers || []);
    return gameState;
  }
}