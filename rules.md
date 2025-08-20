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
Single Player Mode allows one player to control multiple sets of transporters and resources, essentially playing as all players simultaneously. This mode is ideal for learning the game mechanics, testing strategies, or enjoying the logistics puzzle solo.

### Setup
- The player controls 2-4 different colored sets of transporters
- Each "virtual player" starts with the standard resources:
  - 3 Wood (boards)
  - 2 Stone  
  - 3 Donkeys
  - 2 Geese
- All virtual players start at different corners of the board
- The player can choose how many virtual players to control (2-4)

### Gameplay Rules

#### Turn Structure
- The player takes turns for each virtual player in order
- Each virtual player follows the same 4-phase structure:
  1. **Production Phase** - All buildings produce simultaneously
  2. **Movement Phase** - Current virtual player moves their transporters
  3. **Building Phase** - Current virtual player can build structures/roads
  4. **Wonder Phase** - Check wonder countdown

#### Movement and Actions
- Only the current virtual player's transporters can be moved during their turn
- Resources and buildings are still not owned - any virtual player can use any building
- The same cooperation/competition dynamics apply between virtual players

#### Strategy Considerations
- **Resource Sharing**: Plan efficient supply chains between your virtual players
- **Infrastructure Investment**: Build roads and buildings that benefit multiple virtual players
- **Research Timing**: Coordinate technology research across virtual players
- **Transportation Networks**: Create interconnected logistics systems

#### Winning Condition
- The game ends when Wonder blocks reach zero
- **Winner**: The virtual player with the highest score (gold/coins/stock)
- **Alternative**: Track total combined score as a personal best

### Single Player Scoring Variants

#### Competitive Variant
- Play each virtual player to win individually
- Final ranking determines success (1st, 2nd, 3rd, 4th place)

#### Cooperative Variant  
- Maximize the total combined score of all virtual players
- Challenge yourself to beat previous total scores
- Focus on optimal resource conversion efficiency

#### Challenge Variant
- Set specific goals like:
  - Get all virtual players to 10+ points
  - Produce 20+ stock certificates total
  - Complete the wonder in under 15 turns

### Benefits of Single Player Mode
- **Learn the Game**: Practice complex logistics without time pressure
- **Test Strategies**: Experiment with different approaches and build orders
- **Puzzle Solving**: Focus on optimal resource flow and transportation efficiency
- **Accessible**: Play anytime without coordinating with other players