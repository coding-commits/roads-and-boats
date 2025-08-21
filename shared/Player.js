import { TransporterFactory } from './Transporter.js';
import { ResourceCollection, Resource } from './Resource.js';
import { RESOURCE_TYPES } from './gameTypes.js';

export class Player {
  constructor(id, name, color = '#000000') {
    this.id = id;
    this.name = name;
    this.color = color;
    this.transporters = [];
    this.buildings = [];
    this.researchedTech = new Set();
    this.geese = 2;
    this.score = 0;
    this.resources = new ResourceCollection();
    this.isReady = false;
    this.hasActedThisPhase = false;
    
    this.initializeStartingResources();
    this.initializeStartingTransporters();
  }

  initializeStartingResources() {
    // In Roads and Boats, players start with NO resources
    // Resources must be produced through buildings during gameplay
    // Players only start with transporters (donkeys) and geese
  }

  initializeStartingTransporters() {
    for (let i = 0; i < 3; i++) {
      this.transporters.push(TransporterFactory.createDonkey(this.id));
    }
  }

  addTransporter(transporter) {
    this.transporters.push(transporter);
  }

  removeTransporter(transporterId) {
    const index = this.transporters.findIndex(t => t.id === transporterId);
    if (index !== -1) {
      return this.transporters.splice(index, 1)[0];
    }
    return null;
  }

  getTransporter(transporterId) {
    return this.transporters.find(t => t.id === transporterId);
  }

  addBuilding(building) {
    this.buildings.push(building);
  }

  removeBuilding(buildingId) {
    const index = this.buildings.findIndex(b => b.id === buildingId);
    if (index !== -1) {
      return this.buildings.splice(index, 1)[0];
    }
    return null;
  }

  getBuilding(buildingId) {
    return this.buildings.find(b => b.id === buildingId);
  }

  canResearch() {
    return this.geese >= 2 && this.resources.has(RESOURCE_TYPES.PAPER, 1);
  }

  research(technology) {
    if (!this.canResearch()) {
      return false;
    }
    
    this.geese -= 2;
    this.resources.remove(RESOURCE_TYPES.PAPER, 1);
    this.researchedTech.add(technology);
    return true;
  }

  hasResearched(technology) {
    return this.researchedTech.has(technology);
  }

  calculateScore() {
    let score = 0;
    
    const gold = this.resources.get(RESOURCE_TYPES.GOLD);
    if (gold) score += gold.quantity * 1;
    
    const coins = this.resources.get(RESOURCE_TYPES.COINS);
    if (coins) score += coins.quantity * 2;
    
    const stock = this.resources.get(RESOURCE_TYPES.STOCK);
    if (stock) score += stock.quantity * 3;
    
    this.transporters.forEach(transporter => {
      const gold = transporter.cargo.get(RESOURCE_TYPES.GOLD);
      if (gold) score += gold.quantity * 1;
      
      const coins = transporter.cargo.get(RESOURCE_TYPES.COINS);
      if (coins) score += coins.quantity * 2;
      
      const stock = transporter.cargo.get(RESOURCE_TYPES.STOCK);
      if (stock) score += stock.quantity * 3;
    });
    
    this.score = score;
    return score;
  }

  resetForNewTurn() {
    this.hasActedThisPhase = false;
    this.isReady = false;
    this.transporters.forEach(transporter => {
      transporter.resetMovement();
    });
  }

  markReady() {
    this.isReady = true;
  }

  markActed() {
    this.hasActedThisPhase = true;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      color: this.color,
      transporters: this.transporters.map(t => t.toJSON()),
      buildings: this.buildings.map(b => b.toJSON()),
      researchedTech: Array.from(this.researchedTech),
      geese: this.geese,
      score: this.score,
      resources: this.resources.toJSON(),
      isReady: this.isReady,
      hasActedThisPhase: this.hasActedThisPhase
    };
  }

  static fromJSON(data) {
    const player = new Player(data.id, data.name, data.color);
    player.transporters = data.transporters.map(t => Transporter.fromJSON(t));
    player.buildings = data.buildings.map(b => Building.fromJSON(b));
    player.researchedTech = new Set(data.researchedTech);
    player.geese = data.geese;
    player.score = data.score;
    player.resources = ResourceCollection.fromJSON(data.resources);
    player.isReady = data.isReady;
    player.hasActedThisPhase = data.hasActedThisPhase;
    return player;
  }
}