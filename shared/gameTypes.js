export const TERRAIN_TYPES = {
  GRASSLAND: 'grassland',
  FOREST: 'forest',
  MOUNTAIN: 'mountain',
  WATER: 'water',
  DESERT: 'desert',
  ROCK: 'rock'
};

export const RESOURCE_TYPES = {
  // Primary Resources
  WOOD: 'wood',
  STONE: 'stone', 
  CLAY: 'clay',
  IRON: 'iron',
  COAL: 'coal',
  GOLD: 'gold',
  OIL: 'oil',
  
  // Processed Resources
  BOARDS: 'boards',
  FUEL: 'fuel',
  PAPER: 'paper',
  COINS: 'coins',
  STOCK: 'stock',
  
  // Special Items
  GEESE: 'geese',
  BOMBS: 'bombs'
};

export const TRANSPORTER_TYPES = {
  // Land Transporters
  DONKEY: 'donkey',
  WAGON: 'wagon', 
  TRUCK: 'truck',
  
  // Water Transporters
  RAFT: 'raft',
  ROWBOAT: 'rowboat',
  STEAMER: 'steamer',
  
  // Air Transporters
  AIRPLANE: 'airplane'
};

export const BUILDING_TYPES = {
  // Primary Producers
  WOODCUTTER: 'woodcutter',
  QUARRY: 'quarry', 
  CLAY_PIT: 'clay_pit',
  COAL_MINE: 'coal_mine',
  IRON_MINE: 'iron_mine',
  GOLD_MINE: 'gold_mine',
  OIL_RIG: 'oil_rig',
  
  // Secondary Producers
  SAWMILL: 'sawmill',
  COAL_BURNER: 'coal_burner', 
  PAPER_MILL: 'paper_mill',
  STONE_FACTORY: 'stone_factory',
  MINT: 'mint',
  STOCK_EXCHANGE: 'stock_exchange',
  
  // Transportation Factories
  WAGON_FACTORY: 'wagon_factory',
  TRUCK_FACTORY: 'truck_factory',
  RAFT_FACTORY: 'raft_factory',
  ROWBOAT_FACTORY: 'rowboat_factory',
  STEAMER_FACTORY: 'steamer_factory',
  AIRPORT: 'airport',
  
  // Special Buildings
  RESEARCH_LAB: 'research_lab',
  BOMB_FACTORY: 'bomb_factory'
};

export const GAME_PHASES = {
  PRODUCTION: 'production',
  MOVEMENT: 'movement',
  BUILDING: 'building',
  WONDER: 'wonder'
};

export const HEX_SIZE = 50;
export const HEX_SPACING = HEX_SIZE * 1.5;