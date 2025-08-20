import { RESOURCE_TYPES } from './gameTypes.js';

export class Resource {
  constructor(type, quantity = 1) {
    this.type = type;
    this.quantity = quantity;
    this.id = Math.random().toString(36).substr(2, 9);
  }

  static wood(quantity = 1) {
    return new Resource(RESOURCE_TYPES.WOOD, quantity);
  }

  static stone(quantity = 1) {
    return new Resource(RESOURCE_TYPES.STONE, quantity);
  }

  static clay(quantity = 1) {
    return new Resource(RESOURCE_TYPES.CLAY, quantity);
  }

  static iron(quantity = 1) {
    return new Resource(RESOURCE_TYPES.IRON, quantity);
  }

  static coal(quantity = 1) {
    return new Resource(RESOURCE_TYPES.COAL, quantity);
  }

  static paper(quantity = 1) {
    return new Resource(RESOURCE_TYPES.PAPER, quantity);
  }

  static food(quantity = 1) {
    return new Resource(RESOURCE_TYPES.FOOD, quantity);
  }

  static gold(quantity = 1) {
    return new Resource(RESOURCE_TYPES.GOLD, quantity);
  }

  static coins(quantity = 1) {
    return new Resource(RESOURCE_TYPES.COINS, quantity);
  }

  static stock(quantity = 1) {
    return new Resource(RESOURCE_TYPES.STOCK, quantity);
  }

  toJSON() {
    return {
      type: this.type,
      quantity: this.quantity,
      id: this.id
    };
  }

  static fromJSON(data) {
    const resource = new Resource(data.type, data.quantity);
    resource.id = data.id;
    return resource;
  }
}

export class ResourceCollection {
  constructor() {
    this.resources = new Map();
  }

  add(resource) {
    const existing = this.resources.get(resource.type);
    if (existing) {
      existing.quantity += resource.quantity;
    } else {
      this.resources.set(resource.type, new Resource(resource.type, resource.quantity));
    }
  }

  remove(resourceType, quantity = 1) {
    const existing = this.resources.get(resourceType);
    if (!existing || existing.quantity < quantity) {
      return false;
    }
    
    existing.quantity -= quantity;
    if (existing.quantity === 0) {
      this.resources.delete(resourceType);
    }
    return true;
  }

  has(resourceType, quantity = 1) {
    const existing = this.resources.get(resourceType);
    return existing && existing.quantity >= quantity;
  }

  get(resourceType) {
    return this.resources.get(resourceType);
  }

  getAll() {
    return Array.from(this.resources.values());
  }

  clear() {
    this.resources.clear();
  }

  isEmpty() {
    return this.resources.size === 0;
  }

  toJSON() {
    return {
      resources: Array.from(this.resources.entries()).map(([type, resource]) => [type, resource.toJSON()])
    };
  }

  static fromJSON(data) {
    const collection = new ResourceCollection();
    for (const [type, resourceData] of data.resources) {
      collection.resources.set(type, Resource.fromJSON(resourceData));
    }
    return collection;
  }
}