import { HexCoordinate, hexNeighbors } from './hexUtils.js';
import { TERRAIN_TYPES } from './gameTypes.js';

export class GameBoard {
  constructor(width = 20, height = 20) {
    this.width = width;
    this.height = height;
    this.hexes = new Map();
    this.roads = new Set();
    this.bridges = new Set();
    this.walls = new Set();
    this.generateBoard();
  }

  generateBoard() {
    for (let q = 0; q < this.width; q++) {
      for (let r = 0; r < this.height; r++) {
        const hex = new HexCoordinate(q, r);
        const terrain = this.generateTerrain(q, r);
        this.hexes.set(hex.toString(), {
          coordinate: hex,
          terrain,
          buildings: [],
          resources: [],
          transporters: []
        });
      }
    }
  }

  generateTerrain(q, r) {
    const noise = Math.sin(q * 0.3) * Math.cos(r * 0.3);
    const distanceFromCenter = Math.sqrt(
      Math.pow(q - this.width / 2, 2) + 
      Math.pow(r - this.height / 2, 2)
    );
    
    if (distanceFromCenter > Math.min(this.width, this.height) / 2 - 2) {
      return TERRAIN_TYPES.WATER;
    }
    
    if (noise > 0.5) return TERRAIN_TYPES.MOUNTAIN;
    if (noise > 0.2) return TERRAIN_TYPES.FOREST;
    if (noise > -0.2) return TERRAIN_TYPES.GRASSLAND;
    if (noise > -0.5) return TERRAIN_TYPES.ROCK;
    return TERRAIN_TYPES.DESERT;
  }

  getHex(coordinate) {
    return this.hexes.get(coordinate.toString());
  }

  setHex(coordinate, hexData) {
    this.hexes.set(coordinate.toString(), hexData);
  }

  addRoad(from, to) {
    const roadKey = `${from.toString()}-${to.toString()}`;
    const reverseKey = `${to.toString()}-${from.toString()}`;
    
    if (!this.roads.has(roadKey) && !this.roads.has(reverseKey)) {
      this.roads.add(roadKey);
      return true;
    }
    return false;
  }

  hasRoad(from, to) {
    const roadKey = `${from.toString()}-${to.toString()}`;
    const reverseKey = `${to.toString()}-${from.toString()}`;
    return this.roads.has(roadKey) || this.roads.has(reverseKey);
  }

  addBridge(from, to) {
    const bridgeKey = `${from.toString()}-${to.toString()}`;
    const reverseKey = `${to.toString()}-${from.toString()}`;
    
    if (!this.bridges.has(bridgeKey) && !this.bridges.has(reverseKey)) {
      this.bridges.add(bridgeKey);
      return true;
    }
    return false;
  }

  hasBridge(from, to) {
    const bridgeKey = `${from.toString()}-${to.toString()}`;
    const reverseKey = `${to.toString()}-${from.toString()}`;
    return this.bridges.has(bridgeKey) || this.bridges.has(reverseKey);
  }

  addWall(from, to) {
    const wallKey = `${from.toString()}-${to.toString()}`;
    this.walls.add(wallKey);
  }

  hasWall(from, to) {
    const wallKey = `${from.toString()}-${to.toString()}`;
    return this.walls.has(wallKey);
  }

  canMove(from, to, transporterType) {
    const fromHex = this.getHex(from);
    const toHex = this.getHex(to);
    
    if (!fromHex || !toHex) return false;
    if (this.hasWall(from, to)) return false;

    const fromTerrain = fromHex.terrain;
    const toTerrain = toHex.terrain;
    
    if (transporterType === 'donkey') {
      if (fromTerrain === TERRAIN_TYPES.WATER || toTerrain === TERRAIN_TYPES.WATER) {
        return this.hasBridge(from, to);
      }
      return true;
    }
    
    if (transporterType === 'raft' || transporterType === 'rowboat' || transporterType === 'steamer') {
      return fromTerrain === TERRAIN_TYPES.WATER && toTerrain === TERRAIN_TYPES.WATER;
    }
    
    if (transporterType === 'wagon' || transporterType === 'truck') {
      if (fromTerrain === TERRAIN_TYPES.WATER || toTerrain === TERRAIN_TYPES.WATER) {
        return false;
      }
      return this.hasRoad(from, to);
    }
    
    return false;
  }

  getValidMoves(from, transporterType, maxDistance = 1) {
    const visited = new Set();
    const queue = [{ hex: from, distance: 0 }];
    const validMoves = [];
    
    while (queue.length > 0) {
      const { hex, distance } = queue.shift();
      const hexKey = hex.toString();
      
      if (visited.has(hexKey) || distance > maxDistance) continue;
      visited.add(hexKey);
      
      if (distance > 0) {
        validMoves.push(hex);
      }
      
      const neighbors = hexNeighbors(hex);
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor.toString()) && this.canMove(hex, neighbor, transporterType)) {
          queue.push({ hex: neighbor, distance: distance + 1 });
        }
      }
    }
    
    return validMoves;
  }

  findLandHexes() {
    const landHexes = [];
    const landTerrains = ['forest', 'mountain', 'grassland', 'rock', 'desert'];
    
    for (const [hexKey, hexData] of this.hexes) {
      if (landTerrains.includes(hexData.terrain)) {
        landHexes.push(hexData.coordinate);
      }
    }
    
    return landHexes;
  }

  toJSON() {
    return {
      width: this.width,
      height: this.height,
      hexes: Array.from(this.hexes.entries()),
      roads: Array.from(this.roads),
      bridges: Array.from(this.bridges),
      walls: Array.from(this.walls)
    };
  }

  static fromJSON(data) {
    const board = new GameBoard(data.width, data.height);
    board.hexes = new Map(data.hexes);
    board.roads = new Set(data.roads);
    board.bridges = new Set(data.bridges);
    board.walls = new Set(data.walls);
    return board;
  }
}