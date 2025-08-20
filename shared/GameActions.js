export const ACTION_TYPES = {
  MOVE_TRANSPORTER: 'move_transporter',
  LOAD_RESOURCE: 'load_resource',
  UNLOAD_RESOURCE: 'unload_resource',
  BUILD_STRUCTURE: 'build_structure',
  BUILD_ROAD: 'build_road',
  BUILD_BRIDGE: 'build_bridge',
  BUILD_WALL: 'build_wall',
  RESEARCH_TECHNOLOGY: 'research_technology',
  PRODUCE_RESOURCE: 'produce_resource',
  END_PHASE: 'end_phase',
  JOIN_GAME: 'join_game',
  LEAVE_GAME: 'leave_game',
  START_GAME: 'start_game',
  TOGGLE_READY: 'toggle_ready'
};

export class GameAction {
  constructor(type, playerId, data = {}) {
    this.id = Math.random().toString(36).substr(2, 9);
    this.type = type;
    this.playerId = playerId;
    this.data = data;
    this.timestamp = Date.now();
  }

  static moveTransporter(playerId, transporterId, fromHex, toHex) {
    return new GameAction(ACTION_TYPES.MOVE_TRANSPORTER, playerId, {
      transporterId,
      fromHex: fromHex.toString(),
      toHex: toHex.toString()
    });
  }

  static loadResource(playerId, transporterId, resourceType, quantity, fromHex) {
    return new GameAction(ACTION_TYPES.LOAD_RESOURCE, playerId, {
      transporterId,
      resourceType,
      quantity,
      fromHex: fromHex.toString()
    });
  }

  static unloadResource(playerId, transporterId, resourceType, quantity, toHex) {
    return new GameAction(ACTION_TYPES.UNLOAD_RESOURCE, playerId, {
      transporterId,
      resourceType,
      quantity,
      toHex: toHex.toString()
    });
  }

  static buildStructure(playerId, buildingType, position, cost) {
    return new GameAction(ACTION_TYPES.BUILD_STRUCTURE, playerId, {
      buildingType,
      position: position.toString(),
      cost
    });
  }

  static buildRoad(playerId, fromHex, toHex, cost) {
    return new GameAction(ACTION_TYPES.BUILD_ROAD, playerId, {
      fromHex: fromHex.toString(),
      toHex: toHex.toString(),
      cost
    });
  }

  static buildBridge(playerId, fromHex, toHex, cost) {
    return new GameAction(ACTION_TYPES.BUILD_BRIDGE, playerId, {
      fromHex: fromHex.toString(),
      toHex: toHex.toString(),
      cost
    });
  }

  static buildWall(playerId, fromHex, toHex, cost) {
    return new GameAction(ACTION_TYPES.BUILD_WALL, playerId, {
      fromHex: fromHex.toString(),
      toHex: toHex.toString(),
      cost
    });
  }

  static researchTechnology(playerId, technology) {
    return new GameAction(ACTION_TYPES.RESEARCH_TECHNOLOGY, playerId, {
      technology
    });
  }

  static produceResource(playerId, buildingId) {
    return new GameAction(ACTION_TYPES.PRODUCE_RESOURCE, playerId, {
      buildingId
    });
  }

  static endPhase(playerId) {
    return new GameAction(ACTION_TYPES.END_PHASE, playerId);
  }

  static joinGame(playerId, playerName, gameId) {
    return new GameAction(ACTION_TYPES.JOIN_GAME, playerId, {
      playerName,
      gameId
    });
  }

  static toggleReady(playerId, ready) {
    return new GameAction(ACTION_TYPES.TOGGLE_READY, playerId, {
      ready
    });
  }

  static leaveGame(playerId, gameId) {
    return new GameAction(ACTION_TYPES.LEAVE_GAME, playerId, {
      gameId
    });
  }

  static startGame(playerId, gameId) {
    return new GameAction(ACTION_TYPES.START_GAME, playerId, {
      gameId
    });
  }

  toJSON() {
    return {
      id: this.id,
      type: this.type,
      playerId: this.playerId,
      data: this.data,
      timestamp: this.timestamp
    };
  }

  static fromJSON(data) {
    const action = new GameAction(data.type, data.playerId, data.data);
    action.id = data.id;
    action.timestamp = data.timestamp;
    return action;
  }
}