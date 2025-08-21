export class GameRenderer {
  constructor() {
    this.svg = document.getElementById('gameBoard');
    this.game = null;
    this.hexSize = 30;
    this.hexSpacing = this.hexSize * 1.5;
    this.viewBox = { x: 0, y: 0, width: 1000, height: 600 };
    this.selectedHex = null;
    this.selectedTransporter = null;
    this.eventHandlers = new Map();
    this.tooltip = null;
    
    // Zoom and pan constraints
    this.maxZoom = 3.0;
    this.currentZoom = 1.0;
    this.initialViewBox = { ...this.viewBox };
    this.mapBounds = { width: 20 * this.hexSpacing, height: 20 * this.hexSpacing };
    
    // Set minimum zoom to 100% (1.0)
    this.minZoom = 1.0;
    
    // Optimized texture parameters
    this.debugOffsets = {
      x: -30,
      y: -17,
      patternWidth: 60,
      patternHeight: 60,
      imageScale: 1.9
    };
    
    // Map positioning offset
    this.mapOffset = {
      x: 0,
      y: 0
    };
    
    this.initializeSVG();
    this.setupEventListeners();
    this.setupTerrainPatterns();
    this.setupTooltip();
    this.setupDebugTool();
    this.setupDebugToggle();
  }

  initializeSVG() {
    this.svg.setAttribute('viewBox', `${this.viewBox.x} ${this.viewBox.y} ${this.viewBox.width} ${this.viewBox.height}`);
    this.svg.style.width = '100%';
    this.svg.style.height = '100%';
  }

  setupTerrainPatterns() {
    // Check if defs already exists, if not create it
    let defs = this.svg.querySelector('defs');
    if (!defs) {
      defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
      this.svg.insertBefore(defs, this.svg.firstChild);
    }

    const terrainTextures = {
      grassland: '/resources/tiles/terrainsHex/pastureTile.png',
      forest: '/resources/tiles/terrainsHex/woodsTile.png',
      mountain: '/resources/tiles/terrainsHex/mountainTile.png',
      water: '/resources/tiles/terrainsHex/seaTile.png',
      desert: '/resources/tiles/terrainsHex/desertTile.png',
      rock: '/resources/tiles/terrainsHex/rockTile.png'
    };

    Object.entries(terrainTextures).forEach(([terrainType, imagePath]) => {
      // Check if pattern already exists
      const existingPattern = document.getElementById(`terrain-${terrainType}`);
      if (existingPattern) {
        return; // Skip if pattern already exists
      }

      console.log(`Creating pattern for ${terrainType} with image: ${imagePath}`);
      
      const pattern = document.createElementNS('http://www.w3.org/2000/svg', 'pattern');
      pattern.setAttribute('id', `terrain-${terrainType}`);
      pattern.setAttribute('patternUnits', 'userSpaceOnUse');
      pattern.setAttribute('width', this.debugOffsets.patternWidth);
      pattern.setAttribute('height', this.debugOffsets.patternHeight);
      pattern.setAttribute('x', '0');
      pattern.setAttribute('y', '0');

      const image = document.createElementNS('http://www.w3.org/2000/svg', 'image');
      image.setAttribute('href', imagePath);
      image.setAttribute('width', this.debugOffsets.patternWidth * this.debugOffsets.imageScale);
      image.setAttribute('height', this.debugOffsets.patternHeight * this.debugOffsets.imageScale);
      image.setAttribute('x', this.debugOffsets.x);
      image.setAttribute('y', this.debugOffsets.y);
      image.setAttribute('preserveAspectRatio', 'xMidYMid slice');

      let fallbackCreated = false;
      
      // Add error handling for images
      image.addEventListener('error', (e) => {
        console.error(`Failed to load terrain texture: ${imagePath}`, e);
        if (!fallbackCreated) {
          // Create a colored rectangle as fallback
          const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
          rect.setAttribute('width', this.debugOffsets.patternWidth);
          rect.setAttribute('height', this.debugOffsets.patternHeight);
          rect.setAttribute('x', this.debugOffsets.x);
          rect.setAttribute('y', this.debugOffsets.y);
          rect.setAttribute('fill', this.getTerrainColor(terrainType));
          rect.setAttribute('id', `fallback-${terrainType}`);
          pattern.appendChild(rect);
          fallbackCreated = true;
        }
      });

      image.addEventListener('load', () => {
        console.log(`Successfully loaded terrain texture: ${imagePath}`);
        // Remove fallback if it exists and image loaded successfully
        const fallback = document.getElementById(`fallback-${terrainType}`);
        if (fallback) {
          fallback.remove();
        }
      });

      pattern.appendChild(image);
      defs.appendChild(pattern);
    });
  }

  setupTooltip() {
    // Create tooltip element
    this.tooltip = document.createElement('div');
    this.tooltip.style.position = 'absolute';
    this.tooltip.style.background = 'rgba(0, 0, 0, 0.8)';
    this.tooltip.style.color = 'white';
    this.tooltip.style.padding = '8px 12px';
    this.tooltip.style.borderRadius = '4px';
    this.tooltip.style.fontSize = '12px';
    this.tooltip.style.pointerEvents = 'none';
    this.tooltip.style.zIndex = '1000';
    this.tooltip.style.display = 'none';
    this.tooltip.style.maxWidth = '200px';
    document.body.appendChild(this.tooltip);
  }

  setupEventListeners() {
    let isDragging = false;
    let lastX = 0;
    let lastY = 0;

    this.svg.addEventListener('mousedown', (e) => {
      isDragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      e.preventDefault();
    });

    this.svg.addEventListener('mousemove', (e) => {
      if (isDragging) {
        const deltaX = (lastX - e.clientX);
        const deltaY = (lastY - e.clientY);
        
        this.viewBox.x += deltaX;
        this.viewBox.y += deltaY;
        
        this.constrainPan();
        this.updateViewBox();
        
        lastX = e.clientX;
        lastY = e.clientY;
        e.preventDefault();
      }
    });

    this.svg.addEventListener('mouseup', () => {
      isDragging = false;
    });

    this.svg.addEventListener('wheel', (e) => {
      e.preventDefault();
      const zoomDirection = e.deltaY > 0 ? -0.1 : 0.1;
      this.changeZoom(zoomDirection);
    });
    
    this.setupZoomControls();
  }

  setGame(game) {
    this.game = game;
    this.render();
  }

  render() {
    if (!this.game) return;
    
    this.clearSVG();
    this.renderBoard();
    this.renderRoads();
    this.renderBuildings();
    this.renderResources();
    this.renderTransporters();
  }

  clearSVG() {
    // Preserve defs element with patterns
    const defs = this.svg.querySelector('defs');
    while (this.svg.firstChild) {
      this.svg.removeChild(this.svg.firstChild);
    }
    // Re-add defs if it existed
    if (defs) {
      this.svg.appendChild(defs);
    }
  }

  renderBoard() {
    const board = this.game.board;
    
    // Handle both serialized (array) and non-serialized (Map) board.hexes
    const hexEntries = Array.isArray(board.hexes) ? board.hexes : Object.entries(board.hexes);
    
    for (const [hexKey, hexData] of hexEntries) {
      if (Array.isArray(hexData)) {
        const [coordStr, data] = hexData;
        this.renderHex(data.coordinate, data.terrain);
      } else {
        this.renderHex(hexData.coordinate, hexData.terrain);
      }
    }
  }

  renderHex(coordinate, terrain) {
    const { x, y } = this.hexToPixel(coordinate);
    const hexElement = this.createHexagon(x, y, this.hexSize);
    
    // Try to use texture pattern, fallback to solid color
    const patternId = `terrain-${terrain}`;
    const pattern = document.getElementById(patternId);
    
    if (pattern) {
      hexElement.setAttribute('fill', `url(#${patternId})`);
      // Add fallback in case pattern fails to render
      hexElement.setAttribute('stroke', this.getTerrainColor(terrain));
      hexElement.setAttribute('stroke-width', '1');
    } else {
      console.warn(`Pattern not found for ${terrain}, using fallback color`);
      hexElement.setAttribute('fill', this.getTerrainColor(terrain));
    }
    
    hexElement.setAttribute('class', 'hex');
    hexElement.setAttribute('data-q', coordinate.q);
    hexElement.setAttribute('data-r', coordinate.r);
    hexElement.setAttribute('data-terrain', terrain);
    
    hexElement.addEventListener('click', (e) => {
      e.stopPropagation();
      this.handleHexClick(coordinate);
    });

    // Add hover events for tooltip
    hexElement.addEventListener('mouseenter', (e) => {
      this.showTooltip(e, coordinate, terrain);
    });

    hexElement.addEventListener('mousemove', (e) => {
      this.updateTooltipPosition(e);
    });

    hexElement.addEventListener('mouseleave', () => {
      this.hideTooltip();
    });
    
    this.svg.appendChild(hexElement);
  }

  renderRoads() {
    if (!this.game.board.roads) return;
    
    for (const roadKey of this.game.board.roads) {
      const [fromStr, toStr] = roadKey.split('-');
      const [fromQ, fromR] = fromStr.replace('(', '').replace(')', '').split(',').map(Number);
      const [toQ, toR] = toStr.replace('(', '').replace(')', '').split(',').map(Number);
      
      const fromPos = this.hexToPixel({ q: fromQ, r: fromR });
      const toPos = this.hexToPixel({ q: toQ, r: toR });
      
      const road = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      road.setAttribute('x1', fromPos.x);
      road.setAttribute('y1', fromPos.y);
      road.setAttribute('x2', toPos.x);
      road.setAttribute('y2', toPos.y);
      road.setAttribute('stroke', '#8B4513');
      road.setAttribute('stroke-width', '3');
      road.setAttribute('class', 'road');
      
      this.svg.appendChild(road);
    }
  }

  renderBuildings() {
    if (!this.game.players) return;
    
    for (const [playerId, player] of Object.entries(this.game.players)) {
      if (Array.isArray(player)) {
        const [id, playerData] = player;
        this.renderPlayerBuildings(playerData);
      } else {
        this.renderPlayerBuildings(player);
      }
    }
  }

  renderPlayerBuildings(player) {
    for (const building of player.buildings) {
      const position = this.parseCoordinate(building.position);
      const { x, y } = this.hexToPixel(position);
      
      const buildingElement = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      buildingElement.setAttribute('x', x - 8);
      buildingElement.setAttribute('y', y - 8);
      buildingElement.setAttribute('width', '16');
      buildingElement.setAttribute('height', '16');
      buildingElement.setAttribute('fill', this.getBuildingColor(building.type));
      buildingElement.setAttribute('stroke', player.color);
      buildingElement.setAttribute('stroke-width', '2');
      buildingElement.setAttribute('class', 'building');
      
      this.svg.appendChild(buildingElement);
    }
  }

  renderResources() {
    if (!this.game.board.hexes) return;
    
    for (const [hexKey, hexData] of Object.entries(this.game.board.hexes)) {
      let resources = [];
      let coordinate = null;
      
      if (Array.isArray(hexData)) {
        const [coordStr, data] = hexData;
        resources = data.resources || [];
        coordinate = data.coordinate;
      } else {
        resources = hexData.resources || [];
        coordinate = hexData.coordinate;
      }
      
      if (resources.length > 0) {
        this.renderHexResources(coordinate, resources);
      }
    }
  }

  renderHexResources(coordinate, resources) {
    const { x, y } = this.hexToPixel(coordinate);
    
    resources.forEach((resource, index) => {
      const offsetX = (index % 3 - 1) * 8;
      const offsetY = Math.floor(index / 3) * 8 - 4;
      
      const resourceElement = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      resourceElement.setAttribute('cx', x + offsetX);
      resourceElement.setAttribute('cy', y + offsetY);
      resourceElement.setAttribute('r', '4');
      resourceElement.setAttribute('fill', this.getResourceColor(resource.type));
      resourceElement.setAttribute('stroke', '#000');
      resourceElement.setAttribute('stroke-width', '1');
      resourceElement.setAttribute('class', 'resource');
      
      this.svg.appendChild(resourceElement);
      
      if (resource.quantity > 1) {
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', x + offsetX);
        text.setAttribute('y', y + offsetY + 2);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('font-size', '8');
        text.setAttribute('fill', '#fff');
        text.textContent = resource.quantity;
        
        this.svg.appendChild(text);
      }
    });
  }

  renderTransporters() {
    if (!this.game.players) return;
    
    for (const [playerId, player] of Object.entries(this.game.players)) {
      if (Array.isArray(player)) {
        const [id, playerData] = player;
        this.renderPlayerTransporters(playerData);
      } else {
        this.renderPlayerTransporters(player);
      }
    }
  }

  renderPlayerTransporters(player) {
    for (const transporter of player.transporters) {
      if (!transporter.position) continue;
      
      const position = this.parseCoordinate(transporter.position);
      const { x, y } = this.hexToPixel(position);
      
      const transporterElement = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
      const points = this.getTransporterShape(transporter.type);
      transporterElement.setAttribute('points', points);
      transporterElement.setAttribute('fill', player.color);
      transporterElement.setAttribute('stroke', '#000');
      transporterElement.setAttribute('stroke-width', '1');
      transporterElement.setAttribute('class', 'transporter');
      transporterElement.setAttribute('transform', `translate(${x}, ${y})`);
      
      if (this.selectedTransporter && this.selectedTransporter.id === transporter.id) {
        transporterElement.setAttribute('class', 'transporter selected');
      }
      
      transporterElement.addEventListener('click', (e) => {
        e.stopPropagation();
        this.handleTransporterClick(transporter);
      });
      
      this.svg.appendChild(transporterElement);
    }
  }

  getTransporterShape(type) {
    switch (type) {
      case 'donkey':
        return '-4,-6 4,-6 6,0 4,6 -4,6 -6,0';
      case 'wagon':
        return '-6,-4 6,-4 6,4 -6,4';
      case 'truck':
        return '-8,-4 8,-4 8,4 -8,4';
      case 'raft':
        return '-6,-3 6,-3 4,3 -4,3';
      case 'rowboat':
        return '-5,-4 5,-4 3,4 -3,4';
      case 'steamer':
        return '-8,-5 8,-5 6,5 -6,5';
      default:
        return '-4,-4 4,-4 4,4 -4,4';
    }
  }

  createHexagon(cx, cy, size) {
    const points = [];
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i;
      const x = cx + size * Math.cos(angle);
      const y = cy + size * Math.sin(angle);
      points.push(`${x},${y}`);
    }
    
    const hexagon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    hexagon.setAttribute('points', points.join(' '));
    return hexagon;
  }

  hexToPixel(hex) {
    const x = this.hexSize * (3/2 * hex.q);
    const y = this.hexSize * (Math.sqrt(3)/2 * hex.q + Math.sqrt(3) * hex.r);
    return { x: x + 400 + this.mapOffset.x, y: y + 300 + this.mapOffset.y };
  }

  pixelToHex(x, y) {
    // Convert pixel coordinates back to hex coordinates
    const adjustedX = x - 400 - this.mapOffset.x;
    const adjustedY = y - 300 - this.mapOffset.y;
    
    const q = (2/3 * adjustedX) / this.hexSize;
    const r = (-1/3 * adjustedX + Math.sqrt(3)/3 * adjustedY) / this.hexSize;
    
    return { q, r };
  }

  centerOn(q, r) {
    // Center the viewport on the given hex coordinates
    const { x, y } = this.hexToPixel({ q, r });
    
    this.viewBox.x = x - this.viewBox.width / 2;
    this.viewBox.y = y - this.viewBox.height / 2;
    
    this.constrainPan();
    this.updateViewBox();
  }

  setupZoomControls() {
    const zoomSlider = document.getElementById('zoomSlider');
    const zoomInBtn = document.getElementById('zoomInBtn');
    const zoomOutBtn = document.getElementById('zoomOutBtn');
    const zoomLevel = document.getElementById('zoomLevel');
    
    if (!zoomSlider || !zoomInBtn || !zoomOutBtn || !zoomLevel) return;
    
    // Set slider range based on zoom constraints
    zoomSlider.min = this.minZoom;
    zoomSlider.max = this.maxZoom;
    zoomSlider.value = this.currentZoom;
    zoomLevel.textContent = Math.round(this.currentZoom * 100) + '%';
    
    // Slider change handler
    zoomSlider.addEventListener('input', (e) => {
      this.setZoom(parseFloat(e.target.value));
    });
    
    // Button handlers
    zoomInBtn.addEventListener('click', () => {
      this.changeZoom(0.1);
    });
    
    zoomOutBtn.addEventListener('click', () => {
      this.changeZoom(-0.1);
    });
  }
  
  setZoom(newZoom) {
    // Constrain zoom level
    newZoom = Math.max(this.minZoom, Math.min(this.maxZoom, newZoom));
    
    if (newZoom === this.currentZoom) return;
    
    const centerX = this.viewBox.x + this.viewBox.width / 2;
    const centerY = this.viewBox.y + this.viewBox.height / 2;
    
    // Calculate new viewBox dimensions based on zoom
    const baseWidth = this.initialViewBox.width;
    const baseHeight = this.initialViewBox.height;
    
    this.viewBox.width = baseWidth / newZoom;
    this.viewBox.height = baseHeight / newZoom;
    
    // Recenter on the same point
    this.viewBox.x = centerX - this.viewBox.width / 2;
    this.viewBox.y = centerY - this.viewBox.height / 2;
    
    this.currentZoom = newZoom;
    this.constrainPan();
    this.updateViewBox();
    this.updateZoomControls();
  }
  
  changeZoom(delta) {
    this.setZoom(this.currentZoom + delta);
  }
  
  constrainPan() {
    // Calculate map boundaries - how far we can pan based on current zoom
    const mapRadius = Math.max(this.mapBounds.width, this.mapBounds.height) / 2;
    const viewRadius = Math.max(this.viewBox.width, this.viewBox.height) / 2;
    
    // Allow panning up to map radius, but not beyond
    const maxPanDistance = mapRadius;
    
    // Calculate center of current view
    const centerX = this.viewBox.x + this.viewBox.width / 2;
    const centerY = this.viewBox.y + this.viewBox.height / 2;
    
    // Calculate distance from map center (0,0 is map center)
    const mapCenterX = this.mapBounds.width / 2;
    const mapCenterY = this.mapBounds.height / 2;
    
    const distanceFromCenter = Math.sqrt(
      Math.pow(centerX - mapCenterX, 2) + 
      Math.pow(centerY - mapCenterY, 2)
    );
    
    // If we're beyond the allowed distance, constrain
    if (distanceFromCenter > maxPanDistance) {
      const angle = Math.atan2(centerY - mapCenterY, centerX - mapCenterX);
      const constrainedCenterX = mapCenterX + Math.cos(angle) * maxPanDistance;
      const constrainedCenterY = mapCenterY + Math.sin(angle) * maxPanDistance;
      
      this.viewBox.x = constrainedCenterX - this.viewBox.width / 2;
      this.viewBox.y = constrainedCenterY - this.viewBox.height / 2;
    }
  }
  
  updateViewBox() {
    this.svg.setAttribute('viewBox', `${this.viewBox.x} ${this.viewBox.y} ${this.viewBox.width} ${this.viewBox.height}`);
  }
  
  updateZoomControls() {
    const zoomSlider = document.getElementById('zoomSlider');
    const zoomLevel = document.getElementById('zoomLevel');
    const zoomInBtn = document.getElementById('zoomInBtn');
    const zoomOutBtn = document.getElementById('zoomOutBtn');
    
    if (zoomSlider) zoomSlider.value = this.currentZoom;
    if (zoomLevel) zoomLevel.textContent = Math.round(this.currentZoom * 100) + '%';
    
    // Disable buttons at limits
    if (zoomInBtn) zoomInBtn.disabled = this.currentZoom >= this.maxZoom;
    if (zoomOutBtn) zoomOutBtn.disabled = this.currentZoom <= this.minZoom;
  }

  parseCoordinate(coordStr) {
    if (typeof coordStr === 'object') return coordStr;
    
    const match = coordStr.match(/\((-?\d+),\s*(-?\d+)/);
    if (match) {
      return { q: parseInt(match[1]), r: parseInt(match[2]) };
    }
    return { q: 0, r: 0 };
  }

  getTerrainColor(terrain) {
    const colors = {
      grassland: '#90EE90',
      forest: '#228B22', 
      mountain: '#A0522D',
      water: '#4682B4',
      desert: '#F4A460',
      rock: '#696969'
    };
    return colors[terrain] || '#DDD';
  }

  getTerrainInfo(terrain) {
    const terrainInfo = {
      grassland: {
        name: 'Grassland',
        description: 'Suitable for Clay Pits. Can build various structures.',
        resources: 'Clay (with Clay Pit)',
        color: '#90EE90'
      },
      forest: {
        name: 'Forest',
        description: 'Source of wood. Essential for early game resources.',
        resources: 'Wood (with Woodcutter)',
        color: '#228B22'
      },
      mountain: {
        name: 'Mountain',
        description: 'Rich in minerals. Source of stone, coal, iron, and gold.',
        resources: 'Stone (Quarry), Coal (Mine), Iron (Mine), Gold (Mine)',
        color: '#A0522D'
      },
      water: {
        name: 'Water',
        description: 'Blocks land movement. Requires boats or bridges to cross.',
        resources: 'Navigation route for boats',
        color: '#4682B4'
      },
      desert: {
        name: 'Desert',
        description: 'Harsh terrain. Can be source of oil with proper equipment.',
        resources: 'Oil (with Oil Rig)',
        color: '#F4A460'
      },
      rock: {
        name: 'Rock/Stone Plain',
        description: 'Rocky terrain suitable for quarries. Source of building stone.',
        resources: 'Stone (with Quarry)',
        color: '#696969'
      },
      stone_plain: {
        name: 'Stone Plain',
        description: 'Rocky terrain suitable for quarries. Source of building stone.',
        resources: 'Stone (with Quarry)',
        color: '#696969'
      }
    };
    return terrainInfo[terrain] || { name: 'Unknown', description: 'Unknown terrain type', resources: 'None', color: '#DDD' };
  }

  showTooltip(event, coordinate, terrain) {
    if (!this.tooltip) return;
    
    const terrainInfo = this.getTerrainInfo(terrain);
    const hexData = this.game.board.hexes ? 
      (Array.isArray(this.game.board.hexes) ? 
        this.game.board.hexes.find(([key, data]) => {
          const coord = Array.isArray(data) ? data[1].coordinate : data.coordinate;
          return coord.q === coordinate.q && coord.r === coordinate.r;
        }) : 
        this.game.board.hexes[coordinate.toString()]) : null;

    let content = `<strong>${terrainInfo.name}</strong><br/>`;
    content += `<em>Coordinate: (${coordinate.q}, ${coordinate.r})</em><br/>`;
    content += `${terrainInfo.description}<br/>`;
    content += `<strong>Resources:</strong> ${terrainInfo.resources}`;

    // Add building and resource information if available
    if (hexData) {
      const data = Array.isArray(hexData) ? hexData[1] : hexData;
      if (data.buildings && data.buildings.length > 0) {
        content += `<br/><strong>Buildings:</strong> ${data.buildings.map(b => b.type).join(', ')}`;
      }
      if (data.resources && data.resources.length > 0) {
        content += `<br/><strong>Current Resources:</strong> ${data.resources.map(r => `${r.quantity} ${r.type}`).join(', ')}`;
      }
      if (data.transporters && data.transporters.length > 0) {
        content += `<br/><strong>Transporters:</strong> ${data.transporters.length}`;
      }
    }

    this.tooltip.innerHTML = content;
    this.tooltip.style.display = 'block';
    this.updateTooltipPosition(event);
  }

  updateTooltipPosition(event) {
    if (!this.tooltip) return;
    
    const x = event.clientX + 10;
    const y = event.clientY - 10;
    
    this.tooltip.style.left = x + 'px';
    this.tooltip.style.top = y + 'px';
  }

  hideTooltip() {
    if (this.tooltip) {
      this.tooltip.style.display = 'none';
    }
  }

  getBuildingColor(buildingType) {
    const colors = {
      woodcutter: '#8B4513',
      quarry: '#696969',
      clay_pit: '#CD853F',
      coal_mine: '#2F4F4F',
      iron_mine: '#B22222',
      gold_mine: '#FFD700',
      paper_mill: '#F5F5DC',
      mint: '#FFD700',
      stock_exchange: '#4169E1',
      research_lab: '#9370DB'
    };
    return colors[buildingType] || '#666';
  }

  getResourceColor(resourceType) {
    const colors = {
      wood: '#8B4513',
      stone: '#696969',
      clay: '#CD853F',
      iron: '#B22222',
      coal: '#2F4F4F',
      paper: '#F5F5DC',
      food: '#FF6347',
      gold: '#FFD700',
      coins: '#FFA500',
      stock: '#4169E1'
    };
    return colors[resourceType] || '#666';
  }

  handleHexClick(coordinate) {
    this.selectedHex = coordinate;
    this.emit('hex_clicked', coordinate);
  }

  handleTransporterClick(transporter) {
    this.selectedTransporter = transporter;
    this.emit('transporter_clicked', transporter);
  }

  on(event, handler) {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, []);
    }
    this.eventHandlers.get(event).push(handler);
  }

  emit(event, data) {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      handlers.forEach(handler => handler(data));
    }
  }

  setupDebugTool() {
    // Update display values
    const updateDisplayValues = () => {
      document.getElementById('xOffsetValue').textContent = this.debugOffsets.x;
      document.getElementById('yOffsetValue').textContent = this.debugOffsets.y;
      document.getElementById('patternWidthValue').textContent = this.debugOffsets.patternWidth;
      document.getElementById('patternHeightValue').textContent = this.debugOffsets.patternHeight;
      document.getElementById('imageScaleValue').textContent = this.debugOffsets.imageScale.toFixed(1);
      
      // Update map offset values
      document.getElementById('mapXOffsetValue').textContent = this.mapOffset.x;
      document.getElementById('mapYOffsetValue').textContent = this.mapOffset.y;
      
      // Update output display
      const output = `Texture: x: ${this.debugOffsets.x}, y: ${this.debugOffsets.y}, width: ${this.debugOffsets.patternWidth}, height: ${this.debugOffsets.patternHeight}, scale: ${this.debugOffsets.imageScale} | Map: x: ${this.mapOffset.x}, y: ${this.mapOffset.y}`;
      document.getElementById('offsetOutput').textContent = output;
    };
    
    // Update patterns and re-render
    const updatePatterns = () => {
      // Remove old patterns
      const defs = this.svg.querySelector('defs');
      if (defs) {
        defs.innerHTML = '';
      }
      
      // Recreate patterns with new values
      this.setupTerrainPatterns();
      
      // Re-render if game exists
      if (this.game) {
        this.render();
      }
    };
    
    // Setup event listeners for sliders
    document.getElementById('xOffsetSlider').addEventListener('input', (e) => {
      this.debugOffsets.x = parseInt(e.target.value);
      updateDisplayValues();
      updatePatterns();
    });
    
    document.getElementById('yOffsetSlider').addEventListener('input', (e) => {
      this.debugOffsets.y = parseInt(e.target.value);
      updateDisplayValues();
      updatePatterns();
    });
    
    document.getElementById('patternWidthSlider').addEventListener('input', (e) => {
      this.debugOffsets.patternWidth = parseInt(e.target.value);
      updateDisplayValues();
      updatePatterns();
    });
    
    document.getElementById('patternHeightSlider').addEventListener('input', (e) => {
      this.debugOffsets.patternHeight = parseInt(e.target.value);
      updateDisplayValues();
      updatePatterns();
    });
    
    document.getElementById('imageScaleSlider').addEventListener('input', (e) => {
      this.debugOffsets.imageScale = parseFloat(e.target.value);
      updateDisplayValues();
      updatePatterns();
    });
    
    // Reset button
    document.getElementById('resetOffsets').addEventListener('click', () => {
      this.debugOffsets.x = -30;
      this.debugOffsets.y = -17;
      this.debugOffsets.patternWidth = 60;
      this.debugOffsets.patternHeight = 60;
      this.debugOffsets.imageScale = 1.9;
      
      // Update sliders
      document.getElementById('xOffsetSlider').value = -30;
      document.getElementById('yOffsetSlider').value = -17;
      document.getElementById('patternWidthSlider').value = 60;
      document.getElementById('patternHeightSlider').value = 60;
      document.getElementById('imageScaleSlider').value = 1.9;
      
      updateDisplayValues();
      updatePatterns();
    });
    
    // Copy button
    document.getElementById('copyOffsets').addEventListener('click', () => {
      const values = `x: ${this.debugOffsets.x}, y: ${this.debugOffsets.y}, patternWidth: ${this.debugOffsets.patternWidth}, patternHeight: ${this.debugOffsets.patternHeight}, imageScale: ${this.debugOffsets.imageScale}`;
      navigator.clipboard.writeText(values).then(() => {
        const btn = document.getElementById('copyOffsets');
        const originalText = btn.textContent;
        btn.textContent = 'Copied!';
        setTimeout(() => {
          btn.textContent = originalText;
        }, 1000);
      });
    });
    
    // Initialize display
    updateDisplayValues();
  }

  setupDebugToggle() {
    // Add keyboard listener for debug toggle
    document.addEventListener('keydown', (e) => {
      // Toggle debug panel with 'D' key (case insensitive)
      if (e.key.toLowerCase() === 'd' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        // Only toggle if we're not typing in an input field
        const activeElement = document.activeElement;
        if (activeElement.tagName !== 'INPUT' && activeElement.tagName !== 'TEXTAREA') {
          this.toggleDebugPanel();
        }
      }
    });
  }

  toggleDebugPanel() {
    const debugPanel = document.getElementById('debugPanel');
    const isVisible = debugPanel.style.display !== 'none';
    
    if (isVisible) {
      debugPanel.style.display = 'none';
      console.log('Debug panel hidden. Press "D" to show.');
    } else {
      debugPanel.style.display = 'block';
      console.log('Debug panel shown. Press "D" to hide.');
    }
  }
}