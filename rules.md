# Roads and Boats - Resource Production and Conversion Rules

## Overview
Roads and Boats is a logistics and resource conversion game where players build transportation networks to move and transform resources across a hex-based board. The game emphasizes efficient supply chains rather than territorial control.

## Resource Types

### Primary Resources
- **Wood** - Produced by Woodcutters from Forest hexes
- **Stone** - Produced by Quarries from Mountain hexes  
- **Clay** - Produced by Clay Pits from Grassland hexes
- **Coal** - Produced by Coal Mines from Mountain hexes
- **Iron** - Produced by Iron Mines from Mountain hexes
- **Gold** - Produced by Gold Mines from Mountain hexes
- **Oil** - Produced by Oil Rigs from Desert/Mountain hexes

### Processed Resources
- **Boards** - Produced by Sawmills from Wood
- **Fuel** - Produced by Coal Burners from Wood/Coal
- **Paper** - Produced by Paper Mills from Boards
- **Stone** - Produced by Stone Factories from Clay
- **Coins** - Produced by Mints (from Fuel and Gold)
- **Stock Certificates** - Produced by Stock Exchanges (from Paper and Coins)

### Transportation Units
- **Wagons** - Produced by Wagon Factories (from Donkey and Boards)
- **Trucks** - Produced by Truck Factories (from Fuel and Iron)
- **Rafts** - Produced by Raft Factories (from Wood)
- **Rowboats** - Produced by Rowboat Factories (from Boards)
- **Steamers** - Produced by Steamer Factories (from Fuel and Iron)
- **Airplanes** - Produced by Airports (from Boards and Geese)

### Special Resources
- **Geese** - Used for research and technology advancement (each player starts with 2 geese)

## Production Phase

### Primary Producers
Primary producers automatically generate resources each Production phase without requiring inputs:

| Building | Input Required | Output | Terrain Required |
|----------|---------------|---------|------------------|
| Woodcutter | None | 1 Wood | Forest |
| Quarry | None | 1 Stone | Mountain |
| Clay Pit | None | 1 Clay | Grassland |
| Coal Mine | None | 1 Coal | Mountain |
| Iron Mine | None | 1 Iron | Mountain |

### Secondary Producers
Secondary producers only generate resources if the required inputs are present on their hex at the start of the Production phase:

| Building | Input Required | Output | Notes |
|----------|---------------|---------|-------|
| Paper Mill | 2 Wood | 1 Paper | Converts wood to paper |
| Gold Mine | None | 1 Gold | Produces gold from mountain terrain |
| Mint | 1 Gold | 1 Coins | Converts gold to currency |
| Stock Exchange | 2 Coins | 1 Stock Certificate | High-value conversion |

## Resource Conversion Formulas

### Basic Conversions
- **2 Wood → 1 Paper** (Paper Mill)
- **1 Gold → 1 Coins** (Mint)
- **2 Coins → 1 Stock Certificate** (Stock Exchange)

### Research and Technology
- **Research**: 2 Geese + 1 Paper → Technology advancement
- **Geese Management**: Players start with 2 geese and consume them for research
- **Technology Benefits**: Unlocks advanced transporters and buildings

### Infrastructure Building
- **Roads**: Stone is used to build roads between hexes
- **Bridges**: Stone is used to build bridges over water hexes
- **Transportation**: Various resources can be used to build different transporter types

## Victory Points

Resources have different victory point values:
- **Gold**: 1 point per unit
- **Coins**: 2 points per unit  
- **Stock Certificates**: 3 points per unit

## Production Rules

### 1. Simultaneous Production
All production happens simultaneously during the Production phase.

### 2. Input Consumption
Secondary producers consume their required inputs at the start of production, then generate outputs.

### 3. Resource Ownership
Resources are not owned by players - they belong to the hex where they're located. Players only own what their transporters carry.

### 4. Building Ownership
Buildings are also not owned by players. Any player can use any building if they can get the required inputs to that location.

### 5. Transportation Requirements
Resources must be transported by player-owned vehicles (donkeys, wagons, boats, etc.) to move between hexes.

## Strategic Considerations

### Supply Chain Efficiency
- Plan transportation routes to minimize movement costs
- Consider building roads to enable faster wagon/truck transport
- Use water routes for efficient bulk transport with boats

### Resource Conversion Strategy
- Early game: Focus on basic resource production (wood, stone, clay)
- Mid game: Establish paper production chains and research carefully
- Late game: Convert to high-value coins and stock certificates

### Research Strategy
- Research early for transportation advantages
- Save geese for critical technology unlocks
- Coordinate paper production with research plans

### Competition vs Cooperation
- Multiple players can benefit from the same production buildings
- Blocking strategies involve building walls or monopolizing transportation routes
- Efficient players can often benefit from others' infrastructure investments

## Building Costs

| Building | Wood Cost | Stone Cost | Other Requirements |
|----------|-----------|------------|-------------------|
| Woodcutter | 1 | 0 | Forest hex |
| Quarry | 0 | 1 | Mountain hex |
| Clay Pit | 1 | 0 | Grassland hex |
| Coal Mine | 2 | 0 | Mountain hex |
| Iron Mine | 3 | 0 | Mountain hex |
| Paper Mill | 2 | 2 | Any hex |
| Gold Mine | 2 | 1 | Mountain hex |
| Research Lab | 1 | 1 | Any hex |
| Mint | 0 | 3 | Any hex |
| Stock Exchange | 0 | 4 | Any hex |

## Wonder Blocks

The game includes a Wonder of the World that serves as the game timer. Each time certain high-value resources are produced, Wonder blocks are removed. When all 193 Wonder blocks are gone, the game ends and scores are calculated.

## Single Player Mode

### Overview
Single Player Mode allows one player to play solo. This mode is ideal for learning the game mechanics, testing strategies, or enjoying the logistics puzzle solo.

### Setup
- The player starts with the standard resources:
  - 3 Wood (boards)
  - 2 Stone  
  - 3 Donkeys
  - 2 Geese
- The player starts at a designated starting position on the board
- No other players or AI opponents are present

### Gameplay Rules

#### Turn Structure
The player follows the standard 4-phase turn structure:
  1. **Production Phase** - All buildings on the board produce simultaneously
  2. **Movement Phase** - Move your transporters and resources
  3. **Building Phase** - Build structures, roads, or new transporters
  4. **Wonder Phase** - Wonder blocks are removed based on high-value resource production

#### Movement and Actions
- You control only your own transporters (donkeys, wagons, boats, etc.)
- You can use any building on the board if you can get the required inputs there
- Resources belong to the hex where they're located, not to you personally
- You must transport resources with your own vehicles to move them between hexes

#### Solo Strategy Considerations
- **Efficient Routes**: Plan transportation networks to minimize movement costs
- **Building Placement**: Strategically place buildings to create efficient production chains  
- **Resource Management**: Balance immediate needs with long-term conversion goals
- **Research Timing**: Use your geese wisely for technology advancement
- **Infrastructure Investment**: Build roads and bridges to improve transportation efficiency

#### Winning Condition
- The game ends when all 193 Wonder blocks are removed
- **Goal**: Maximize your final score through efficient resource conversion
- **Scoring**: Gold (1 point), Coins (2 points), Stock Certificates (3 points)

### Single Player Scoring Variants

#### Score Attack
- Try to achieve the highest possible final score
- Track your personal best scores over multiple games
- Focus on optimal resource conversion and efficiency

#### Speed Challenge
- Try to reach a target score as quickly as possible
- Set goals like "reach 20 points in 10 turns"
- Balance speed with efficiency

#### Efficiency Challenge
- Set specific resource conversion goals:
  - Produce 10+ stock certificates
  - Accumulate 50+ total points
  - Build a complete production chain from wood to stock certificates
  - Research all available technologies

#### Wonder Race
- Try to achieve your target score before the Wonder countdown ends
- Balance point accumulation with Wonder block removal rate
- Practice timing your high-value production

### Benefits of Single Player Mode
- **Learn the Game**: Practice complex logistics without time pressure
- **Test Strategies**: Experiment with different approaches and build orders
- **Puzzle Solving**: Focus on optimal resource flow and transportation efficiency
- **Accessible**: Play anytime without coordinating with other players

## Map Sources and Scenarios

### Current Implementation
This implementation currently uses a procedural map generation system that creates random terrain layouts. While functional for gameplay testing, this differs from the official Roads & Boats experience which uses predefined scenario maps.

### Official Map Sources
Research conducted on 2025-08-21 identified several authoritative sources for Roads & Boats scenario maps:

#### Primary Sources
- **BoardGameGeek Files Section**: [https://boardgamegeek.com/boardgame/875/roads-and-boats/files](https://boardgamegeek.com/boardgame/875/roads-and-boats/files)
  - Community-contributed scenario maps and layouts
  - 3-4 Player Scenario Booklets available for download
  - Requires BGG account for access

- **Splotter Spellen Official Content**: [http://www.splotter.nl/english/r_b/basic.html](http://www.splotter.nl/english/r_b/basic.html)
  - Original publisher's official scenarios from the base game
  - &Cetera expansion includes 24 additional scenarios
  - Material supports 2-6 players depending on scenario

#### Recent Publications
- **Roads & Boats Book of Scenarios Volume 1** (2024): [https://neoncometgames.com/product/roads-boats-book-of-scenarios-volume-1/](https://neoncometgames.com/product/roads-boats-book-of-scenarios-volume-1/)
  - Comprehensive collection of 161 full-color scenarios
  - Contributions from over a dozen designers spanning 25 years
  - Organized by player count with original artwork styling
  - Published by Neon Comet Games, unveiled at Splotter Con 2024

#### Community Resources
- **BoardGameGeek Scenario Discussion**: Geeklist ID 341324 contains community discussion and sharing of custom scenarios
- **Tabletop Simulator**: Steam Workshop has digital implementations with scenario maps
- **&Cetera Expansion**: Adds Polder and City terrain types plus scenarios for 5-6 players

### Map Construction System
The official game uses modular hexagonal terrain tiles that players arrange according to scenario instructions. Key components include:

- **Terrain Types**: Forest (dark green), Mountain (reddish brown), Grassland, Desert, Water
- **Transparent Overlay**: Clear plastic sheet placed over terrain for drawing roads/bridges with dry-erase markers
- **Modular Setup**: Different scenarios use different tile arrangements and starting positions
- **Scalable Difficulty**: Maps range from beginner-friendly isolated areas to complex interconnected networks

### Implementation Notes
For authentic gameplay, future development should consider:
1. Implementing specific scenario layouts from official sources
2. Adding scenario selection menu with predefined maps  
3. Supporting the transparent overlay concept for road/bridge construction
4. Including terrain tile placement rules for custom scenario creation

*Map source research conducted 2025-08-21 using web search of BoardGameGeek, Splotter Spellen, and related gaming resources.*