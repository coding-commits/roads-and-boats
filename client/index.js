import { GameClient } from './GameClient.js';
import { GameRenderer } from './GameRenderer.js';
import { UIManager } from './UIManager.js';

class RoadsAndBoatsApp {
  constructor() {
    this.gameClient = new GameClient();
    this.gameRenderer = new GameRenderer();
    this.uiManager = new UIManager(this.gameClient, this.gameRenderer);
    
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.uiManager.showMenuScreen();
  }

  setupEventListeners() {
    const setNameBtn = document.getElementById('setNameBtn');
    const playerNameInput = document.getElementById('playerNameInput');
    const createGameBtn = document.getElementById('createGameBtn');
    const refreshGamesBtn = document.getElementById('refreshGamesBtn');
    const confirmCreateBtn = document.getElementById('confirmCreateBtn');
    const cancelCreateBtn = document.getElementById('cancelCreateBtn');
    const endPhaseBtn = document.getElementById('endPhaseBtn');
    const leaveGameBtn = document.getElementById('leaveGameBtn');
    const readyBtn = document.getElementById('readyBtn');
    const startGameBtn = document.getElementById('startGameBtn');
    const leaveRoomBtn = document.getElementById('leaveRoomBtn');
    const gameModeSelect = document.getElementById('gameModeSelect');

    playerNameInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.setPlayerName();
      }
    });

    setNameBtn.addEventListener('click', () => {
      this.setPlayerName();
    });

    createGameBtn.addEventListener('click', () => {
      this.uiManager.showCreateGameForm();
    });


    refreshGamesBtn.addEventListener('click', () => {
      this.gameClient.getGameList();
    });

    confirmCreateBtn.addEventListener('click', () => {
      this.createGame();
    });

    cancelCreateBtn.addEventListener('click', () => {
      this.uiManager.hideCreateGameForm();
    });

    endPhaseBtn.addEventListener('click', () => {
      this.gameClient.endPhase();
    });

    leaveGameBtn.addEventListener('click', () => {
      this.leaveGame();
    });

    readyBtn.addEventListener('click', () => {
      this.toggleReady();
    });

    startGameBtn.addEventListener('click', () => {
      this.startGame();
    });

    leaveRoomBtn.addEventListener('click', () => {
      this.leaveRoom();
    });

    gameModeSelect.addEventListener('change', () => {
      this.handleGameModeChange();
    });

    this.gameClient.on('connected', () => {
      console.log('Connected to server');
      this.uiManager.hideLoading();
    });

    this.gameClient.on('game_created', (data) => {
      console.log('Game created:', data.gameId);
      this.uiManager.showRoomLobby(data.game);
    });

    this.gameClient.on('joined_game', (data) => {
      console.log('Joined game:', data.gameId);
      this.uiManager.showRoomLobby(data.game);
    });

    this.gameClient.on('game_started', (data) => {
      console.log('Game started');
      this.gameRenderer.setGame(data.game);
      this.uiManager.updateGameState(data.game);
      this.uiManager.showMessage('Game started!', 'success');
    });

    this.gameClient.on('phase_changed', (data) => {
      this.uiManager.showMessage(`Phase changed to: ${data.newPhase}`, 'success');
    });

    this.gameClient.on('game_finished', (data) => {
      const winnerName = data.winner ? data.winner.name : 'Unknown';
      this.uiManager.showMessage(`Game finished! Winner: ${winnerName}`, 'success');
      
      setTimeout(() => {
        this.uiManager.showMenuScreen();
      }, 5000);
    });

    this.gameClient.on('player_joined', (data) => {
      this.uiManager.showMessage(`${data.player.name} joined the room`, 'success');
      if (data.game.isStarted) {
        this.gameRenderer.setGame(data.game);
        this.uiManager.updateGameState(data.game);
      } else {
        this.uiManager.updateRoomLobby(data.game);
      }
    });

    this.gameClient.on('player_left', (data) => {
      this.uiManager.showMessage('A player left the room', 'error');
      if (data.game.isStarted) {
        this.gameRenderer.setGame(data.game);
        this.uiManager.updateGameState(data.game);
      } else {
        this.uiManager.updateRoomLobby(data.game);
      }
    });

    this.gameClient.on('game_update', (data) => {
      console.log('Received game update:', data);
      console.log('Game ready players from server:', data.game.readyPlayers);
      console.log('Action that triggered update:', data.action);
      if (data.game.isStarted) {
        this.gameRenderer.setGame(data.game);
        this.uiManager.updateGameState(data.game);
      } else {
        console.log('Calling updateRoomLobby because game not started');
        this.uiManager.updateRoomLobby(data.game);
      }
    });

    this.gameClient.on('action_failed', (data) => {
      this.uiManager.showMessage(`Action failed: ${data.reason}`, 'error');
    });

    this.gameClient.on('error', (data) => {
      this.uiManager.showError(data.message);
    });

    this.gameClient.on('game_list', (data) => {
      this.uiManager.displayGamesList(data.games);
    });

    this.gameRenderer.on('hex_clicked', (hex) => {
      this.handleHexClick(hex);
    });

    this.gameRenderer.on('transporter_clicked', (transporter) => {
      this.handleTransporterClick(transporter);
    });
  }

  setPlayerName() {
    const nameInput = document.getElementById('playerNameInput');
    const name = nameInput.value.trim();
    
    if (name.length < 2) {
      this.uiManager.showError('Name must be at least 2 characters long');
      return;
    }
    
    this.gameClient.setPlayerName(name);
    this.uiManager.showGameMenu();
    this.uiManager.showLoading();
    this.gameClient.connect();
  }

  createGame() {
    const maxPlayersSelect = document.getElementById('maxPlayersSelect');
    const roomNameInput = document.getElementById('roomNameInput');
    const gameModeSelect = document.getElementById('gameModeSelect');
    const maxPlayers = parseInt(maxPlayersSelect.value);
    const gameMode = gameModeSelect.value;
    
    if (gameMode === 'singleplayer') {
      // Start single player game immediately
      this.startSinglePlayerGame(maxPlayers);
    } else {
      // Create multiplayer room
      const roomName = roomNameInput.value.trim() || `${this.gameClient.playerName}'s Room`;
      this.gameClient.createGame(maxPlayers, roomName);
    }
    
    this.uiManager.hideCreateGameForm();
    this.uiManager.showLoading();
  }

  handleGameModeChange() {
    const gameModeSelect = document.getElementById('gameModeSelect');
    const roomNameGroup = document.getElementById('roomNameGroup');
    const playersLabel = document.getElementById('playersLabel');
    const confirmCreateBtn = document.getElementById('confirmCreateBtn');
    
    if (gameModeSelect.value === 'singleplayer') {
      roomNameGroup.style.display = 'none';
      playersLabel.textContent = 'Virtual Players:';
      confirmCreateBtn.textContent = 'Start Single Player';
    } else {
      roomNameGroup.style.display = 'block';
      playersLabel.textContent = 'Max Players:';
      confirmCreateBtn.textContent = 'Create Room';
    }
  }

  startSinglePlayerGame(numPlayers) {
    // Create a local single player game
    this.gameClient.createSinglePlayerGame(numPlayers);
    this.uiManager.showGameScreen();
  }

  toggleReady() {
    this.gameClient.toggleReady();
  }

  startGame() {
    this.gameClient.startGame();
  }

  leaveRoom() {
    this.gameClient.leaveGame();
    this.uiManager.showMenuScreen();
    this.loadGamesList();
  }

  loadGamesList() {
    this.gameClient.getGameList();
    this.uiManager.showGamesList();
  }

  joinGame(gameId) {
    this.gameClient.joinGame(gameId);
    this.uiManager.hideGamesList();
    this.uiManager.showLoading();
  }

  leaveGame() {
    this.gameClient.leaveGame();
    this.uiManager.showMenuScreen();
  }

  handleHexClick(hex) {
    const selectedTransporter = this.uiManager.selectedTransporter;
    
    if (selectedTransporter && this.gameClient.currentGame) {
      const currentPlayer = this.gameClient.currentGame.players.find(
        p => p.id === this.gameClient.playerId
      );
      
      if (currentPlayer && this.gameClient.currentGame.currentPhase === 'movement') {
        this.gameClient.moveTransporter(selectedTransporter.id, selectedTransporter.position, hex);
        this.uiManager.deselectTransporter();
      }
    }
  }

  handleTransporterClick(transporter) {
    if (transporter.playerId === this.gameClient.playerId) {
      this.uiManager.selectTransporter(transporter);
    }
  }
}

window.app = new RoadsAndBoatsApp();