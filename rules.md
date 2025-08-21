# Roads and Boats - Resource Production and Conversion Rules

## Overview
Roads and Boats is a logistics and resource conversion game where players build transportation networks to move and transform resources across a hex-based board. The game emphasizes efficient supply chains rather than territorial control.

## Resource Types

### Primary Resources
- **Trunk** - Produced by Woodcutters from Forest hexes (later converted to Boards via Sawmill)
- **Stone** - Produced by Quarries from Rock hexes
- **Clay** - Produced by Clay Pits from Shore/River Bank hexes
- **Gold** - Produced by Mines from Mountain hexes (initially filled with 3 Gold, 3 Iron)
- **Iron** - Produced by Mines from Mountain hexes (initially filled with 3 Gold, 3 Iron)
- **Fuel** - Produced by Oil Rigs from Sea hexes (requires research)

### Processed Resources
- **Boards** - Produced by Sawmills from Trunks (1 Trunk → 2 Boards, Max 6)
- **Fuel** - Produced by Coal Burners from Trunks/Boards (2 Trunk/Board → 1 Fuel, Max 6)
- **Paper** - Produced by Paper Mills from Trunks/Boards (2 Trunk/Board → 1 Paper, Max 1)
- **Stone** - Produced by Stone Factories from Clay (1 Clay → 2 Stone, Max 6)
- **Coins** - Produced by Mints from Fuel and Gold (1 Fuel + 2 Gold → 1 Coin, Max 1)
- **Stock Certificates** - Produced by Stock Exchanges from Paper and Coins (1 Paper + 2 Coins → 1 Share, Max 6)

### Transportation Units
- **Wagons** - Produced by Wagon Factories (1 Donkey + 2 Boards → 1 Wagon, Max 1)
- **Trucks** - Produced by Truck Factories (1 Fuel + 1 Iron → 1 Truck, Max 1, requires research)
- **Rafts** - Produced by Raft Factories (2 Trunks → 1 Raft, Max 1)
- **Rowboats** - Produced by Rowboat Factories (5 Boards → 1 Rowboat, Max 1, requires research)
- **Steamers** - Produced by Steamer Factories (2 Fuel + 1 Iron → 1 Steamer, Max 1, requires research)
- **Airplanes** - Produced by Airports (2 Boards + 1 Goose → 1 Airplane, Max 1)

### Special Resources
- **Geese** - Used for research and technology advancement (each player starts with 2 geese)

## Production Phase

### Primary Producers
Primary producers automatically generate resources each Production phase without requiring inputs:

| Building | Input Required | Output | Terrain Required |
|----------|---------------|---------|------------------|
| Woodcutter | None | 1 Trunk | Forest |
| Quarry | None | 1 Stone | Rock |
| Clay Pit | None | 1 Clay | Shore/River Bank |
| Mine | None | 1 Gold or 1 Iron | Mountain |
| Oil Rig | None | 1 Coal | Sea |

### Secondary Producers
Secondary producers only generate resources if the required inputs are present on their hex at the start of the Production phase:

| Building | Input Required | Output | Max Output |
|----------|---------------|---------|------------|
| Sawmill | 1 Trunk | 2 Boards | 6 |
| Coal Burner | 2 Trunk/Board | 1 Fuel | 6 |
| Paper Mill | 2 Trunk/Board | 1 Paper | 1 |
| Stone Factory | 1 Clay | 2 Stone | 6 |
| Mint | 1 Fuel + 2 Gold | 1 Coin | 1 |
| Stock Exchange | 1 Paper + 2 Coins | 1 Share | 6 |

## Resource Conversion Formulas

### Basic Conversions
- **1 Trunk → 2 Boards** (Sawmill)
- **2 Trunk/Board → 1 Fuel** (Coal Burner)
- **2 Trunk/Board → 1 Paper** (Paper Mill)
- **1 Clay → 2 Stone** (Stone Factory)
- **1 Fuel + 2 Gold → 1 Coin** (Mint)
- **1 Paper + 2 Coins → 1 Stock Certificate** (Stock Exchange)

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
- **Gold**: 10 points per unit
- **Coins**: 40 points per unit  
- **Stock Certificates**: 120 points per unit

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

### Gameplay Rules

#### Turn Structure
- The player follows 3-phase structure:
  1. **Production Phase** - All buildings produce simultaneously
  2. **Movement Phase** - Current virtual player moves their transporters
  3. **Building Phase** - Current virtual player can build structures/roads

#### Strategy Considerations
- **Resource Sharing**: Plan efficient supply chains between your virtual players
- **Infrastructure Investment**: Build roads and buildings that benefit multiple virtual players
- **Research Timing**: Coordinate technology research across virtual players
- **Transportation Networks**: Create interconnected logistics systems

#### Winning Condition
- The game ends in a fixed number of turns
- **Winning condition**: The player shall score certain points (the goal is different for difficulty levels)

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
- @resources/rules/PBEM_rule.md. exclude rail way for now.
- @resources/rules/RB3Erule.pdf: rules with images

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