export class UIManager {
  constructor(gameClient, gameRenderer) {
    this.gameClient = gameClient;
    this.gameRenderer = gameRenderer;
    this.selectedTransporter = null;
    this.currentMessage = null;
    this.refreshInterval = null;
  }

  isPlayerReady(game, playerId) {
    return game.readyPlayers && Array.isArray(game.readyPlayers) && game.readyPlayers.includes(playerId);
  }

  showMenuScreen() {
    this.hideAll();
    document.getElementById('menuScreen').classList.remove('hidden');
    
    // Check if gameMenu is visible and start auto-refresh if needed
    const gameMenu = document.getElementById('gameMenu');
    if (gameMenu && !gameMenu.classList.contains('hidden')) {
      this.startAutoRefresh();
    }
  }

  showGameScreen() {
    this.hideAll();
    document.getElementById('gameScreen').classList.remove('hidden');
  }

  showGameMenu() {
    document.getElementById('playerNameSection').classList.add('hidden');
    document.getElementById('gameMenu').classList.remove('hidden');
    
    // Automatically load games list when showing the menu
    this.gameClient.getGameList();
    
    // Start auto-refresh of games list every 5 seconds
    this.startAutoRefresh();
  }

  showCreateGameForm() {
    document.getElementById('gameMenuButtons').classList.add('hidden');
    document.getElementById('createGameForm').classList.remove('hidden');
  }

  hideCreateGameForm() {
    document.getElementById('createGameForm').classList.add('hidden');
    document.getElementById('gameMenuButtons').classList.remove('hidden');
  }

  showGamesList() {
    document.getElementById('gameMenuButtons').classList.add('hidden');
    document.getElementById('gamesList').classList.remove('hidden');
  }

  hideGamesList() {
    document.getElementById('gamesList').classList.add('hidden');
    document.getElementById('gameMenuButtons').classList.remove('hidden');
  }

  showLoading() {
    document.getElementById('loadingSection').classList.remove('hidden');
  }

  hideLoading() {
    document.getElementById('loadingSection').classList.add('hidden');
  }

  hideAll() {
    console.log('hideAll called');
    const menuScreen = document.getElementById('menuScreen');
    const gameScreen = document.getElementById('gameScreen');
    const roomLobby = document.getElementById('roomLobby');
    
    console.log('Elements found:', { menuScreen: !!menuScreen, gameScreen: !!gameScreen, roomLobby: !!roomLobby });
    
    if (menuScreen) menuScreen.classList.add('hidden');
    if (gameScreen) gameScreen.classList.add('hidden');
    if (roomLobby) roomLobby.classList.add('hidden');
    
    // Stop auto-refresh when hiding all screens
    this.stopAutoRefresh();
  }

  displayGamesList(games) {
    const gamesList = document.getElementById('gamesList');
    gamesList.innerHTML = '';
    
    if (games.length === 0) {
      gamesList.innerHTML = '<div class="empty-rooms">No active rooms found. Create a new game to start playing!</div>';
      return;
    }
    
    games.forEach(game => {
      const gameItem = document.createElement('div');
      gameItem.className = 'game-item';
      
      const statusText = game.canStart ? 'Ready to Start!' : 'Waiting for Players';
      
      gameItem.innerHTML = `
        <div class="game-item-info">
          <div class="game-item-name">${game.roomName}</div>
          <div class="game-item-details">
            Players: ${game.playerCount}/${game.maxPlayers} | 
            Created: ${new Date(game.createdAt).toLocaleTimeString()}
          </div>
        </div>
        <div class="game-item-status">${statusText}</div>
      `;
      
      gameItem.addEventListener('click', () => {
        this.joinGame(game.gameId);
      });
      
      gamesList.appendChild(gameItem);
    });
  }

  showRoomLobby(game) {
    console.log('showRoomLobby called');
    this.hideAll(); // This will also stop auto-refresh
    
    const roomLobbyElement = document.getElementById('roomLobby');
    console.log('roomLobby element:', roomLobbyElement);
    
    if (roomLobbyElement) {
      roomLobbyElement.classList.remove('hidden');
      console.log('Removed hidden class from roomLobby');
      console.log('roomLobby classes after remove:', roomLobbyElement.classList.toString());
    } else {
      console.error('roomLobby element not found!');
    }
    
    this.updateRoomLobby(game);
  }

  updateRoomLobby(game) {
    console.log('Updating room lobby with game:', game);
    console.log('Ready players from server:', game.readyPlayers);
    console.log('Current player ID:', this.gameClient.playerId);
    
    try {
      // Update room title and info
      const roomName = game.roomName || `Room ${game.gameId?.substr(0, 8) || 'Unknown'}`;
      document.getElementById('roomTitle').textContent = `Room: ${roomName}`;
      
      const playerCount = game.players?.length || Object.keys(game.players || {}).length || 0;
      document.getElementById('roomInfo').textContent = `Players: ${playerCount}/${game.maxPlayers}`;
      
      // Update players list
      this.updateRoomPlayersList(game);
      
      // Update buttons based on player status
      this.updateRoomButtons(game);
    } catch (error) {
      console.error('Error updating room lobby:', error);
      console.log('Game object:', game);
    }
  }

  updateRoomPlayersList(game) {
    console.log('Updating players list with game:', game);
    const playersList = document.getElementById('roomPlayersList');
    playersList.innerHTML = '';
    
    const players = Array.isArray(game.players) ? 
      game.players.map(([id, player]) => player) : 
      Object.values(game.players || {});
    
    console.log('Players:', players);
    
    players.forEach(player => {
      console.log('Processing player:', player);
      const playerDiv = document.createElement('div');
      const isReady = this.isPlayerReady(game, player.id);
      const isCreator = player.id === game.creatorId;
      const isCurrentUser = player.id === this.gameClient.playerId;
      
      let playerClass = 'room-player';
      if (isReady) playerClass += ' ready';
      if (isCreator) playerClass += ' creator';
      if (isCurrentUser) playerClass += ' current-user';
      
      playerDiv.className = playerClass;
      
      let statusText = 'Waiting';
      let statusClass = 'room-player-status';
      
      // Priority for status display: current user > creator, but always show ready status
      if (isCurrentUser) {
        if (isCreator) {
          statusText = isReady ? 'You (Creator) - Ready' : 'You (Creator)';
        } else {
          statusText = isReady ? 'You - Ready' : 'You';
        }
        statusClass += ' current-user';
        if (isReady) statusClass += ' ready';
      } else if (isCreator) {
        statusText = isReady ? 'Creator - Ready' : 'Creator';
        statusClass += ' creator';
        if (isReady) statusClass += ' ready';
      } else {
        statusText = isReady ? 'Ready' : 'Waiting';
        if (isReady) statusClass += ' ready';
      }
      
      const readyIcon = isReady ? ' ✓' : '';
      
      playerDiv.innerHTML = `
        <div class="room-player-name">${readyIcon} ${player.name}${isCurrentUser ? ' (You)' : ''}</div>
        <div class="${statusClass}">${statusText}</div>
      `;
      
      playersList.appendChild(playerDiv);
    });
  }

  updateRoomButtons(game) {
    console.log('Updating room buttons with game:', game);
    const readyBtn = document.getElementById('readyBtn');
    const startGameBtn = document.getElementById('startGameBtn');
    
    // Find current player from the game data
    const players = Array.isArray(game.players) ? 
      game.players.map(([id, player]) => player) : 
      Object.values(game.players || {});
    
    const currentPlayer = players.find(p => p.id === this.gameClient.playerId);
    
    const isCreator = currentPlayer && currentPlayer.id === game.creatorId;
    const isReady = this.isPlayerReady(game, this.gameClient.playerId);
    const allReady = game.readyPlayers && players.length > 0 && players.length === game.readyPlayers.length;
    const canStart = players.length >= 2 && allReady;
    
    console.log('Button state:', { 
      isCreator, 
      isReady, 
      canStart, 
      players: players.length, 
      readyCount: game.readyPlayers?.length,
      readyPlayersArray: game.readyPlayers,
      currentPlayerId: this.gameClient.playerId
    });
    
    // Update ready button
    if (isReady) {
      readyBtn.textContent = '✓ Ready (Click to Unready)';
      readyBtn.classList.add('ready');
    } else {
      readyBtn.textContent = 'Ready Up';
      readyBtn.classList.remove('ready');
    }
    readyBtn.disabled = false;
    
    // Update start button (only visible to creator)
    if (isCreator) {
      startGameBtn.classList.remove('hidden');
      startGameBtn.disabled = !canStart;
      
      if (canStart) {
        startGameBtn.textContent = 'Start Game';
        startGameBtn.title = 'All players are ready! Click to start the game.';
      } else if (players.length < 2) {
        startGameBtn.textContent = 'Start Game (Need More Players)';
        startGameBtn.title = 'Need at least 2 players to start the game.';
      } else {
        const notReadyCount = players.length - (game.readyPlayers?.length || 0);
        startGameBtn.textContent = `Start Game (${notReadyCount} not ready)`;
        startGameBtn.title = 'Waiting for all players to be ready.';
      }
    } else {
      startGameBtn.classList.add('hidden');
    }
  }

  joinGame(gameId) {
    window.app.joinGame(gameId);
  }

  updateGameState(game) {
    this.updatePhaseIndicator(game);
    this.updatePlayersList(game);
    
    if (game.isStarted) {
      this.showGameControls();
    }
    
    // Update single player specific UI
    if (this.gameClient.isSinglePlayer) {
      this.updateSinglePlayerUI(game);
    }
  }

  updateSinglePlayerUI(game) {
    // Handle both serialized and non-serialized game data
    const players = game.getAllPlayers ? 
      game.getAllPlayers() : 
      Array.isArray(game.players) ? 
        game.players.map(([id, player]) => player) : 
        Object.values(game.players || {});
        
    // In single player mode, there's only one player
    const currentPlayer = players[0];
    
    // Update phase indicator to show current player
    const phaseIndicator = document.getElementById('phaseIndicator');
    const phaseNames = {
      production: 'Production',
      movement: 'Movement', 
      building: 'Building',
      wonder: 'Wonder'
    };
    
    const phaseName = phaseNames[game.currentPhase] || game.currentPhase;
    phaseIndicator.textContent = `${phaseName} Phase - Turn ${game.turn} - ${currentPlayer.name}'s Turn`;
    phaseIndicator.style.background = currentPlayer.color;
  }

  updatePhaseIndicator(game) {
    const phaseIndicator = document.getElementById('phaseIndicator');
    const phaseNames = {
      production: 'Production',
      movement: 'Movement', 
      building: 'Building',
      wonder: 'Wonder'
    };
    
    const phaseName = phaseNames[game.currentPhase] || game.currentPhase;
    phaseIndicator.textContent = `${phaseName} Phase - Turn ${game.turn}`;
  }

  updatePlayersList(game) {
    const playersList = document.getElementById('playersList');
    playersList.innerHTML = '';
    
    const players = Array.isArray(game.players) ? 
      game.players.map(([id, player]) => player) : 
      Object.values(game.players);
    
    players.forEach(player => {
      const playerDiv = document.createElement('div');
      playerDiv.className = 'player-info';
      playerDiv.innerHTML = `
        <div class="player-name" style="color: ${player.color}">
          ${player.name}
          ${player.isReady ? '✓' : ''}
        </div>
        <div class="player-score">Score: ${player.score}</div>
        <div class="resource-list">
          ${this.formatPlayerResources(player)}
        </div>
      `;
      
      playersList.appendChild(playerDiv);
    });
  }

  formatPlayerResources(player) {
    if (!player.resources || !player.resources.resources) {
      return '<div class="resource-item">No resources</div>';
    }
    
    const resources = Array.isArray(player.resources.resources) ?
      player.resources.resources.map(([type, data]) => ({ type, ...data })) :
      Object.values(player.resources.resources);
    
    if (resources.length === 0) {
      return '<div class="resource-item">No resources</div>';
    }
    
    return resources.map(resource => 
      `<div class="resource-item">
        <span>${resource.type}</span>
        <span>${resource.quantity}</span>
      </div>`
    ).join('');
  }

  showGameControls() {
    const endPhaseBtn = document.getElementById('endPhaseBtn');
    endPhaseBtn.disabled = false;
    
    // Update button text for single player mode
    if (this.gameClient.isSinglePlayer) {
      endPhaseBtn.textContent = 'Next Player';
    } else {
      endPhaseBtn.textContent = 'End Phase';
    }
  }

  selectTransporter(transporter) {
    this.selectedTransporter = transporter;
    this.updateTransporterInfo(transporter);
    this.showTransporterControls();
    this.gameRenderer.selectedTransporter = transporter;
    this.gameRenderer.render();
  }

  deselectTransporter() {
    this.selectedTransporter = null;
    this.hideTransporterControls();
    this.gameRenderer.selectedTransporter = null;
    this.gameRenderer.render();
  }

  updateTransporterInfo(transporter) {
    const transporterInfo = document.getElementById('transporterInfo');
    const transporterCargo = document.getElementById('transporterCargo');
    
    transporterInfo.innerHTML = `
      <div><strong>${transporter.type}</strong></div>
      <div>Movement: ${transporter.movementRemaining}/${transporter.maxMovement}</div>
      <div>Capacity: ${this.getCurrentCapacity(transporter)}/${transporter.maxCapacity}</div>
    `;
    
    const cargo = this.formatTransporterCargo(transporter);
    transporterCargo.innerHTML = `
      <h5>Cargo:</h5>
      ${cargo}
    `;
    
    document.getElementById('selectedTransporter').classList.remove('hidden');
  }

  getCurrentCapacity(transporter) {
    if (!transporter.cargo || !transporter.cargo.resources) return 0;
    
    const resources = Array.isArray(transporter.cargo.resources) ?
      transporter.cargo.resources.map(([type, data]) => data) :
      Object.values(transporter.cargo.resources);
    
    return resources.reduce((total, resource) => total + (resource.quantity || 0), 0);
  }

  formatTransporterCargo(transporter) {
    if (!transporter.cargo || !transporter.cargo.resources) {
      return '<div class="resource-item">Empty</div>';
    }
    
    const resources = Array.isArray(transporter.cargo.resources) ?
      transporter.cargo.resources.map(([type, data]) => ({ type, ...data })) :
      Object.values(transporter.cargo.resources);
    
    if (resources.length === 0) {
      return '<div class="resource-item">Empty</div>';
    }
    
    return resources.map(resource => 
      `<div class="resource-item">
        <span>${resource.type}</span>
        <span>${resource.quantity}</span>
      </div>`
    ).join('');
  }

  showTransporterControls() {
    document.getElementById('actionButtons').classList.remove('hidden');
    
    // Enable/disable buttons based on game phase and transporter state
    const game = this.gameClient.currentGame;
    const canMove = game && game.currentPhase === 'movement' && 
                   this.selectedTransporter && this.selectedTransporter.movementRemaining > 0;
    
    document.getElementById('moveBtn').disabled = !canMove;
    document.getElementById('loadBtn').disabled = game && game.currentPhase !== 'movement';
    document.getElementById('unloadBtn').disabled = game && game.currentPhase !== 'movement';
  }

  hideTransporterControls() {
    document.getElementById('selectedTransporter').classList.add('hidden');
    document.getElementById('actionButtons').classList.add('hidden');
  }

  showMessage(message, type = 'info') {
    this.clearMessage();
    
    const messageDiv = document.createElement('div');
    messageDiv.className = type === 'error' ? 'error' : 'success';
    messageDiv.textContent = message;
    
    const sidebar = document.querySelector('.sidebar');
    sidebar.insertBefore(messageDiv, sidebar.firstChild);
    
    this.currentMessage = messageDiv;
    
    setTimeout(() => {
      this.clearMessage();
    }, 5000);
  }

  showError(message) {
    this.showMessage(message, 'error');
    
    const errorSection = document.getElementById('errorSection');
    errorSection.textContent = message;
    errorSection.classList.remove('hidden');
    
    setTimeout(() => {
      errorSection.classList.add('hidden');
    }, 5000);
  }

  clearMessage() {
    if (this.currentMessage) {
      this.currentMessage.remove();
      this.currentMessage = null;
    }
  }

  startAutoRefresh() {
    // Clear any existing interval
    this.stopAutoRefresh();
    
    // Set up auto-refresh every 5 seconds
    this.refreshInterval = setInterval(() => {
      // Only refresh if we're still on the menu screen and not in a game/room
      const menuScreen = document.getElementById('menuScreen');
      const isMenuVisible = menuScreen && !menuScreen.classList.contains('hidden');
      
      if (isMenuVisible) {
        console.log('Auto-refreshing games list...');
        this.gameClient.getGameList();
      } else {
        // Stop auto-refresh if we're no longer on the menu
        this.stopAutoRefresh();
      }
    }, 5000);
    
    console.log('Started auto-refresh for games list (every 5 seconds)');
  }

  stopAutoRefresh() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
      this.refreshInterval = null;
      console.log('Stopped auto-refresh for games list');
    }
  }
}