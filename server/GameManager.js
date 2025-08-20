const path = require('path');
const { pathToFileURL } = require('url');

// Use dynamic imports for ES modules
let GameState, Player, GameAction;

const initModules = async () => {
  const gameStateModule = await import(pathToFileURL(path.resolve(__dirname, '../shared/GameState.js')).href);
  const playerModule = await import(pathToFileURL(path.resolve(__dirname, '../shared/Player.js')).href);
  const actionsModule = await import(pathToFileURL(path.resolve(__dirname, '../shared/GameActions.js')).href);
  
  GameState = gameStateModule.GameState;
  Player = playerModule.Player;
  GameAction = actionsModule.GameAction;
};

class GameManager {
  constructor() {
    this.games = new Map();
    this.playerGameMap = new Map();
    this.initialized = false;
  }

  async init() {
    if (!this.initialized) {
      await initModules();
      this.initialized = true;
    }
  }

  createGame(gameId, maxPlayers = 4, roomName = '') {
    if (this.games.has(gameId)) {
      return null;
    }

    const gameState = new GameState(gameId, maxPlayers, roomName);
    this.games.set(gameId, gameState);
    return gameState;
  }

  getGame(gameId) {
    return this.games.get(gameId);
  }

  deleteGame(gameId) {
    const game = this.games.get(gameId);
    if (game) {
      game.getAllPlayers().forEach(player => {
        this.playerGameMap.delete(player.id);
      });
      this.games.delete(gameId);
      return true;
    }
    return false;
  }

  addPlayerToGame(gameId, playerId, playerName) {
    const game = this.getGame(gameId);
    if (!game) {
      return null;
    }

    if (this.playerGameMap.has(playerId)) {
      return null;
    }

    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'];
    const usedColors = game.getAllPlayers().map(p => p.color);
    const availableColor = colors.find(color => !usedColors.includes(color)) || '#000000';

    const player = new Player(playerId, playerName, availableColor);
    
    if (game.addPlayer(player)) {
      this.playerGameMap.set(playerId, gameId);
      return player;
    }
    
    return null;
  }

  removePlayerFromGame(gameId, playerId) {
    const game = this.getGame(gameId);
    if (!game) {
      return false;
    }

    const removed = game.removePlayer(playerId);
    if (removed) {
      this.playerGameMap.delete(playerId);
      
      if (game.getAllPlayers().length === 0) {
        this.deleteGame(gameId);
      }
      
      return true;
    }
    
    return false;
  }

  removePlayerFromAllGames(playerId) {
    const gameId = this.playerGameMap.get(playerId);
    if (gameId) {
      this.removePlayerFromGame(gameId, playerId);
      return gameId;
    }
    return null;
  }

  startGame(gameId) {
    const game = this.getGame(gameId);
    if (!game) {
      return null;
    }

    if (game.start()) {
      return game;
    }
    
    return null;
  }

  executeAction(gameId, actionData) {
    const game = this.getGame(gameId);
    if (!game) {
      return { success: false, reason: 'Game not found' };
    }

    const action = GameAction.fromJSON(actionData);
    const player = game.getPlayer(action.playerId);
    
    const validation = game.validateAction(action, player);
    if (!validation.valid) {
      return { success: false, reason: validation.reason };
    }

    let phaseChanged = false;

    try {
      switch (action.type) {
        case 'move_transporter':
          this.executeMoveTransporter(game, action, player);
          break;
          
        case 'load_resource':
          this.executeLoadResource(game, action, player);
          break;
          
        case 'unload_resource':
          this.executeUnloadResource(game, action, player);
          break;
          
        case 'build_structure':
          this.executeBuildStructure(game, action, player);
          break;
          
        case 'build_road':
          this.executeBuildRoad(game, action, player);
          break;
          
        case 'toggle_ready':
          console.log('Processing toggle_ready action:', action);
          console.log('Before - Ready players:', Array.from(game.readyPlayers));
          game.setPlayerReady(action.playerId, action.data.ready);
          console.log('After - Ready players:', Array.from(game.readyPlayers));
          console.log('Game JSON ready players:', Array.from(game.readyPlayers));
          break;
          
        case 'end_phase':
          player.markReady();
          if (game.allPlayersReady()) {
            if (game.currentPhase === 'production') {
              game.executeProductionPhase();
            }
            game.nextPhase();
            phaseChanged = true;
            
            if (game.checkWinCondition()) {
              // Game ended
            }
          }
          break;
          
        default:
          return { success: false, reason: 'Unknown action type' };
      }

      return { success: true, phaseChanged };
      
    } catch (error) {
      console.error('Error executing action:', error);
      return { success: false, reason: 'Action execution failed' };
    }
  }

  executeMoveTransporter(game, action, player) {
    const transporter = player.getTransporter(action.data.transporterId);
    const toHexParts = action.data.toHex.split(',').map(Number);
    const toHex = { q: toHexParts[0], r: toHexParts[1] };
    
    transporter.move(toHex);
  }

  executeLoadResource(game, action, player) {
    const transporter = player.getTransporter(action.data.transporterId);
    const fromHexParts = action.data.fromHex.split(',').map(Number);
    const fromHex = { q: fromHexParts[0], r: fromHexParts[1] };
    const hex = game.board.getHex(fromHex);
    
    if (hex) {
      const resourceIndex = hex.resources.findIndex(r => 
        r.type === action.data.resourceType && r.quantity >= action.data.quantity
      );
      
      if (resourceIndex !== -1) {
        const resource = hex.resources[resourceIndex];
        if (resource.quantity === action.data.quantity) {
          hex.resources.splice(resourceIndex, 1);
        } else {
          resource.quantity -= action.data.quantity;
        }
        
        const loadedResource = { 
          type: action.data.resourceType, 
          quantity: action.data.quantity 
        };
        transporter.loadResource(loadedResource);
      }
    }
  }

  executeUnloadResource(game, action, player) {
    const transporter = player.getTransporter(action.data.transporterId);
    const toHexParts = action.data.toHex.split(',').map(Number);
    const toHex = { q: toHexParts[0], r: toHexParts[1] };
    const hex = game.board.getHex(toHex);
    
    if (hex && transporter.unloadResource(action.data.resourceType, action.data.quantity)) {
      const unloadedResource = { 
        type: action.data.resourceType, 
        quantity: action.data.quantity 
      };
      hex.resources.push(unloadedResource);
    }
  }

  executeBuildStructure(game, action, player) {
    // Implementation for building structures
    // This would check resources, build costs, etc.
  }

  executeBuildRoad(game, action, player) {
    const fromHexParts = action.data.fromHex.split(',').map(Number);
    const toHexParts = action.data.toHex.split(',').map(Number);
    const fromHex = { q: fromHexParts[0], r: fromHexParts[1] };
    const toHex = { q: toHexParts[0], r: toHexParts[1] };
    
    // Check if player has stone resources for road building
    game.board.addRoad(fromHex, toHex);
  }

  getPublicGames() {
    const publicGames = [];
    
    for (const [gameId, game] of this.games) {
      if (!game.isStarted && !game.isFinished) {
        const players = Array.from(game.players.values());
        publicGames.push({
          gameId: game.gameId,
          roomName: game.roomName,
          playerCount: game.players.size,
          maxPlayers: game.maxPlayers,
          createdAt: game.createdAt,
          players: players.map(p => ({
            id: p.id,
            name: p.name,
            isReady: game.isPlayerReady(p.id),
            isCreator: p.id === game.creatorId
          })),
          canStart: game.canStart(),
          creatorId: game.creatorId
        });
      }
    }
    
    return publicGames.sort((a, b) => b.createdAt - a.createdAt);
  }

  getActiveGamesCount() {
    return this.games.size;
  }

  getConnectedPlayersCount() {
    return this.playerGameMap.size;
  }

  cleanup() {
    const now = Date.now();
    const GAME_TIMEOUT = 60 * 60 * 1000; // 1 hour
    
    for (const [gameId, game] of this.games) {
      if (now - game.lastUpdated > GAME_TIMEOUT) {
        console.log(`Cleaning up inactive game: ${gameId}`);
        this.deleteGame(gameId);
      }
    }
  }
}

module.exports = GameManager;