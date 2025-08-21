# Roads and Boats

A digital implementation of the classic logistics and resource management board game "Roads and Boats" by Splotter Spellen.

![Single Player Game](resources/gameplay/single%20player%20game.png)

## Overview

Roads and Boats is a strategic board game where players build transportation networks to move and transform resources across a hex-based board. The game emphasizes efficient supply chains and logistics rather than territorial control. Players must manage resources, build infrastructure, and optimize their transportation networks to achieve victory.

## Features

- **Multiplayer Support**: Play with friends online in real-time
- **Single Player Mode**: Practice and learn the game mechanics solo
- **Real-time Gameplay**: Live updates and synchronized game state
- **Resource Management**: Complex supply chain and conversion mechanics
- **Transportation Networks**: Build roads, bridges, and various transport units
- **Research System**: Unlock advanced technologies and buildings
- **Hex-based Board**: Strategic terrain-based gameplay

## Game Mechanics

### Core Concepts
- **Resource Production**: Extract raw materials from terrain (wood, stone, clay, gold, iron)
- **Resource Conversion**: Transform basic resources into processed goods (boards, fuel, paper, coins)
- **Transportation**: Move resources using donkeys, wagons, boats, and trucks
- **Infrastructure**: Build roads, bridges, and production buildings
- **Research**: Use geese and paper to unlock advanced technologies

### Victory Conditions
- **Gold**: 10 points per unit
- **Coins**: 40 points per unit
- **Stock Certificates**: 120 points per unit

The game ends when all 193 Wonder blocks are removed, and the player with the most points wins.

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)

### Setup
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd rnb
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:8080`

## Available Scripts

- `npm run dev` - Start both client and server in development mode
- `npm run dev:server` - Start only the server in development mode
- `npm run dev:client` - Start only the client in development mode
- `npm run build` - Build the client for production
- `npm start` - Start the production server
- `npm test` - Run tests

## Project Structure

```
rnb/
├── client/           # Frontend application
│   ├── GameClient.js
│   ├── GameRenderer.js
│   ├── UIManager.js
│   ├── index.html
│   └── index.js
├── server/           # Backend server
│   ├── GameManager.js
│   └── index.js
├── shared/           # Shared game logic
│   ├── Building.js
│   ├── GameActions.js
│   ├── GameBoard.js
│   ├── GameState.js
│   ├── Player.js
│   ├── Resource.js
│   ├── Transporter.js
│   ├── gameTypes.js
│   └── hexUtils.js
├── resources/        # Game assets
│   ├── buildings/    # Building sprites
│   ├── buttons/      # UI buttons
│   ├── gameplay/     # Gameplay images
│   ├── goods/        # Resource sprites
│   ├── player/       # Player assets
│   ├── research/     # Research items
│   ├── roads/        # Road sprites
│   ├── terrain/      # Terrain tiles
│   ├── tiles/        # Hex tiles
│   ├── walls/        # Wall sprites
│   └── wonder/       # Wonder assets
├── rules.md          # Detailed game rules
└── start-game.sh     # Quick start script
```

## Game Rules

For detailed game rules and mechanics, see [rules.md](rules.md).

### Quick Start
1. **Setup**: Each player starts with 3 wood, 2 stone, 3 donkeys, and 2 geese
2. **Production Phase**: Buildings automatically produce resources
3. **Movement Phase**: Move your transporters to collect and deliver resources
4. **Building Phase**: Construct new buildings, roads, and bridges
5. **Repeat**: Continue until the Wonder is completed

## Single Player Mode

The game includes a comprehensive single player mode perfect for learning the mechanics or enjoying the logistics puzzle solo. See the image above for a preview of the single player interface.

### Single Player Features
- **Solo Gameplay**: Practice without coordinating with other players
- **Learning Tool**: Master complex logistics without time pressure
- **Strategy Testing**: Experiment with different approaches and build orders
- **Accessible**: Play anytime without needing other players

## Technology Stack

- **Frontend**: Vanilla JavaScript with HTML5 Canvas
- **Backend**: Node.js with Express
- **Real-time Communication**: Socket.IO
- **Build Tool**: Webpack
- **Development**: Nodemon for server hot-reload

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
