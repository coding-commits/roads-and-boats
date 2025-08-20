import { TRANSPORTER_TYPES } from './gameTypes.js';
import { ResourceCollection } from './Resource.js';
import { HexCoordinate } from './hexUtils.js';

export class Transporter {
  constructor(type, playerId, position = null) {
    this.id = Math.random().toString(36).substr(2, 9);
    this.type = type;
    this.playerId = playerId;
    this.position = position;
    this.cargo = new ResourceCollection();
    this.maxCapacity = this.getMaxCapacity();
    this.maxMovement = this.getMaxMovement();
    this.movementRemaining = this.maxMovement;
  }

  getMaxCapacity() {
    switch (this.type) {
      case TRANSPORTER_TYPES.DONKEY: return 2;
      case TRANSPORTER_TYPES.RAFT: return 3;
      case TRANSPORTER_TYPES.WAGON: return 4;
      case TRANSPORTER_TYPES.TRUCK: return 6;
      case TRANSPORTER_TYPES.ROWBOAT: return 4;
      case TRANSPORTER_TYPES.STEAMER: return 8;
      default: return 1;
    }
  }

  getMaxMovement() {
    switch (this.type) {
      case TRANSPORTER_TYPES.DONKEY: return 2;
      case TRANSPORTER_TYPES.RAFT: return 1;
      case TRANSPORTER_TYPES.WAGON: return 3;
      case TRANSPORTER_TYPES.TRUCK: return 4;
      case TRANSPORTER_TYPES.ROWBOAT: return 2;
      case TRANSPORTER_TYPES.STEAMER: return 3;
      default: return 1;
    }
  }

  getCurrentCapacity() {
    return this.cargo.getAll().reduce((total, resource) => total + resource.quantity, 0);
  }

  canLoadResource(resource) {
    return this.getCurrentCapacity() + resource.quantity <= this.maxCapacity;
  }

  loadResource(resource) {
    if (!this.canLoadResource(resource)) {
      return false;
    }
    this.cargo.add(resource);
    return true;
  }

  unloadResource(resourceType, quantity = 1) {
    return this.cargo.remove(resourceType, quantity);
  }

  unloadAllResources() {
    const resources = this.cargo.getAll();
    this.cargo.clear();
    return resources;
  }

  move(newPosition) {
    if (this.movementRemaining <= 0) {
      return false;
    }
    
    this.position = newPosition;
    this.movementRemaining--;
    return true;
  }

  resetMovement() {
    this.movementRemaining = this.maxMovement;
  }

  canMove() {
    return this.movementRemaining > 0;
  }

  requiresRoads() {
    return this.type === TRANSPORTER_TYPES.WAGON || this.type === TRANSPORTER_TYPES.TRUCK;
  }

  isWaterTransporter() {
    return this.type === TRANSPORTER_TYPES.RAFT || 
           this.type === TRANSPORTER_TYPES.ROWBOAT || 
           this.type === TRANSPORTER_TYPES.STEAMER;
  }

  canTraverseWater() {
    return this.isWaterTransporter();
  }

  toJSON() {
    return {
      id: this.id,
      type: this.type,
      playerId: this.playerId,
      position: this.position ? this.position.toString() : null,
      cargo: this.cargo.toJSON(),
      maxCapacity: this.maxCapacity,
      maxMovement: this.maxMovement,
      movementRemaining: this.movementRemaining
    };
  }

  static fromJSON(data) {
    const transporter = new Transporter(data.type, data.playerId);
    transporter.id = data.id;
    transporter.position = data.position ? HexCoordinate.fromAxial(...data.position.split(',').map(Number)) : null;
    transporter.cargo = ResourceCollection.fromJSON(data.cargo);
    transporter.maxCapacity = data.maxCapacity;
    transporter.maxMovement = data.maxMovement;
    transporter.movementRemaining = data.movementRemaining;
    return transporter;
  }
}

export class TransporterFactory {
  static createDonkey(playerId, position = null) {
    return new Transporter(TRANSPORTER_TYPES.DONKEY, playerId, position);
  }

  static createRaft(playerId, position = null) {
    return new Transporter(TRANSPORTER_TYPES.RAFT, playerId, position);
  }

  static createWagon(playerId, position = null) {
    return new Transporter(TRANSPORTER_TYPES.WAGON, playerId, position);
  }

  static createTruck(playerId, position = null) {
    return new Transporter(TRANSPORTER_TYPES.TRUCK, playerId, position);
  }

  static createRowboat(playerId, position = null) {
    return new Transporter(TRANSPORTER_TYPES.ROWBOAT, playerId, position);
  }

  static createSteamer(playerId, position = null) {
    return new Transporter(TRANSPORTER_TYPES.STEAMER, playerId, position);
  }
}