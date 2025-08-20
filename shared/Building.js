import { BUILDING_TYPES, RESOURCE_TYPES } from './gameTypes.js';
import { ResourceCollection, Resource } from './Resource.js';

export class Building {
  constructor(type, playerId, position) {
    this.id = Math.random().toString(36).substr(2, 9);
    this.type = type;
    this.playerId = playerId;
    this.position = position;
    this.inputResources = new ResourceCollection();
    this.isActive = false;
  }

  getRequiredInputs() {
    switch (this.type) {
      case BUILDING_TYPES.WOODCUTTER:
        return [];
      case BUILDING_TYPES.QUARRY:
        return [];
      case BUILDING_TYPES.CLAY_PIT:
        return [];
      case BUILDING_TYPES.COAL_MINE:
        return [];
      case BUILDING_TYPES.IRON_MINE:
        return [];
      case BUILDING_TYPES.GOLD_MINE:
        return [{ type: RESOURCE_TYPES.FOOD, quantity: 1 }];
      case BUILDING_TYPES.PAPER_MILL:
        return [{ type: RESOURCE_TYPES.WOOD, quantity: 2 }];
      case BUILDING_TYPES.MINT:
        return [{ type: RESOURCE_TYPES.GOLD, quantity: 1 }];
      case BUILDING_TYPES.STOCK_EXCHANGE:
        return [{ type: RESOURCE_TYPES.COINS, quantity: 2 }];
      case BUILDING_TYPES.RESEARCH_LAB:
        return [{ type: RESOURCE_TYPES.PAPER, quantity: 1 }];
      default:
        return [];
    }
  }

  getOutputResources() {
    switch (this.type) {
      case BUILDING_TYPES.WOODCUTTER:
        return [Resource.wood(1)];
      case BUILDING_TYPES.QUARRY:
        return [Resource.stone(1)];
      case BUILDING_TYPES.CLAY_PIT:
        return [Resource.clay(1)];
      case BUILDING_TYPES.COAL_MINE:
        return [Resource.coal(1)];
      case BUILDING_TYPES.IRON_MINE:
        return [Resource.iron(1)];
      case BUILDING_TYPES.GOLD_MINE:
        return [Resource.gold(1)];
      case BUILDING_TYPES.PAPER_MILL:
        return [Resource.paper(1)];
      case BUILDING_TYPES.MINT:
        return [Resource.coins(1)];
      case BUILDING_TYPES.STOCK_EXCHANGE:
        return [Resource.stock(1)];
      case BUILDING_TYPES.RESEARCH_LAB:
        return [];
      default:
        return [];
    }
  }

  isPrimaryProducer() {
    return [
      BUILDING_TYPES.WOODCUTTER,
      BUILDING_TYPES.QUARRY,
      BUILDING_TYPES.CLAY_PIT,
      BUILDING_TYPES.COAL_MINE,
      BUILDING_TYPES.IRON_MINE
    ].includes(this.type);
  }

  canProduce() {
    if (this.isPrimaryProducer()) {
      return true;
    }

    const requiredInputs = this.getRequiredInputs();
    return requiredInputs.every(input => 
      this.inputResources.has(input.type, input.quantity)
    );
  }

  produce() {
    if (!this.canProduce()) {
      return [];
    }

    if (!this.isPrimaryProducer()) {
      const requiredInputs = this.getRequiredInputs();
      requiredInputs.forEach(input => {
        this.inputResources.remove(input.type, input.quantity);
      });
    }

    this.isActive = true;
    return this.getOutputResources();
  }

  addInputResource(resource) {
    this.inputResources.add(resource);
  }

  removeInputResource(resourceType, quantity) {
    return this.inputResources.remove(resourceType, quantity);
  }

  getBuildCost() {
    switch (this.type) {
      case BUILDING_TYPES.WOODCUTTER:
        return [{ type: RESOURCE_TYPES.WOOD, quantity: 1 }];
      case BUILDING_TYPES.QUARRY:
        return [{ type: RESOURCE_TYPES.STONE, quantity: 1 }];
      case BUILDING_TYPES.CLAY_PIT:
        return [{ type: RESOURCE_TYPES.WOOD, quantity: 1 }];
      case BUILDING_TYPES.COAL_MINE:
        return [{ type: RESOURCE_TYPES.WOOD, quantity: 2 }];
      case BUILDING_TYPES.IRON_MINE:
        return [{ type: RESOURCE_TYPES.WOOD, quantity: 3 }];
      case BUILDING_TYPES.GOLD_MINE:
        return [{ type: RESOURCE_TYPES.WOOD, quantity: 2 }, { type: RESOURCE_TYPES.STONE, quantity: 1 }];
      case BUILDING_TYPES.PAPER_MILL:
        return [{ type: RESOURCE_TYPES.WOOD, quantity: 2 }, { type: RESOURCE_TYPES.STONE, quantity: 2 }];
      case BUILDING_TYPES.MINT:
        return [{ type: RESOURCE_TYPES.STONE, quantity: 3 }];
      case BUILDING_TYPES.STOCK_EXCHANGE:
        return [{ type: RESOURCE_TYPES.STONE, quantity: 4 }];
      case BUILDING_TYPES.RESEARCH_LAB:
        return [{ type: RESOURCE_TYPES.WOOD, quantity: 1 }, { type: RESOURCE_TYPES.STONE, quantity: 1 }];
      default:
        return [];
    }
  }

  toJSON() {
    return {
      id: this.id,
      type: this.type,
      playerId: this.playerId,
      position: this.position ? this.position.toString() : null,
      inputResources: this.inputResources.toJSON(),
      isActive: this.isActive
    };
  }

  static fromJSON(data) {
    const building = new Building(data.type, data.playerId, data.position);
    building.id = data.id;
    building.inputResources = ResourceCollection.fromJSON(data.inputResources);
    building.isActive = data.isActive;
    return building;
  }
}

export class BuildingFactory {
  static createWoodcutter(playerId, position) {
    return new Building(BUILDING_TYPES.WOODCUTTER, playerId, position);
  }

  static createQuarry(playerId, position) {
    return new Building(BUILDING_TYPES.QUARRY, playerId, position);
  }

  static createClayPit(playerId, position) {
    return new Building(BUILDING_TYPES.CLAY_PIT, playerId, position);
  }

  static createCoalMine(playerId, position) {
    return new Building(BUILDING_TYPES.COAL_MINE, playerId, position);
  }

  static createIronMine(playerId, position) {
    return new Building(BUILDING_TYPES.IRON_MINE, playerId, position);
  }

  static createGoldMine(playerId, position) {
    return new Building(BUILDING_TYPES.GOLD_MINE, playerId, position);
  }

  static createPaperMill(playerId, position) {
    return new Building(BUILDING_TYPES.PAPER_MILL, playerId, position);
  }

  static createMint(playerId, position) {
    return new Building(BUILDING_TYPES.MINT, playerId, position);
  }

  static createStockExchange(playerId, position) {
    return new Building(BUILDING_TYPES.STOCK_EXCHANGE, playerId, position);
  }

  static createResearchLab(playerId, position) {
    return new Building(BUILDING_TYPES.RESEARCH_LAB, playerId, position);
  }
}