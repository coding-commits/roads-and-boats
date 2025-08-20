export class HexCoordinate {
  constructor(q, r, s = null) {
    this.q = q;
    this.r = r;
    this.s = s !== null ? s : -q - r;
  }

  equals(other) {
    return this.q === other.q && this.r === other.r && this.s === other.s;
  }

  toString() {
    return `(${this.q}, ${this.r}, ${this.s})`;
  }

  static fromAxial(q, r) {
    return new HexCoordinate(q, r, -q - r);
  }
}

export function hexToPixel(hex, size, origin = { x: 0, y: 0 }) {
  const x = size * (3/2 * hex.q) + origin.x;
  const y = size * (Math.sqrt(3)/2 * hex.q + Math.sqrt(3) * hex.r) + origin.y;
  return { x, y };
}

export function pixelToHex(point, size, origin = { x: 0, y: 0 }) {
  const x = (point.x - origin.x) / size;
  const y = (point.y - origin.y) / size;
  
  const q = (2/3) * x;
  const r = (-1/3 * x + Math.sqrt(3)/3 * y);
  
  return hexRound(new HexCoordinate(q, r));
}

export function hexRound(hex) {
  let rq = Math.round(hex.q);
  let rr = Math.round(hex.r);
  let rs = Math.round(hex.s);

  const qDiff = Math.abs(rq - hex.q);
  const rDiff = Math.abs(rr - hex.r);
  const sDiff = Math.abs(rs - hex.s);

  if (qDiff > rDiff && qDiff > sDiff) {
    rq = -rr - rs;
  } else if (rDiff > sDiff) {
    rr = -rq - rs;
  } else {
    rs = -rq - rr;
  }

  return new HexCoordinate(rq, rr, rs);
}

export function hexDistance(a, b) {
  return Math.max(Math.abs(a.q - b.q), Math.abs(a.r - b.r), Math.abs(a.s - b.s));
}

export function hexNeighbors(hex) {
  const directions = [
    new HexCoordinate(1, 0, -1),
    new HexCoordinate(1, -1, 0),
    new HexCoordinate(0, -1, 1),
    new HexCoordinate(-1, 0, 1),
    new HexCoordinate(-1, 1, 0),
    new HexCoordinate(0, 1, -1)
  ];
  
  return directions.map(dir => 
    new HexCoordinate(hex.q + dir.q, hex.r + dir.r, hex.s + dir.s)
  );
}

export function hexInRange(center, range) {
  const results = [];
  for (let q = -range; q <= range; q++) {
    for (let r = Math.max(-range, -q - range); r <= Math.min(range, -q + range); r++) {
      results.push(new HexCoordinate(center.q + q, center.r + r));
    }
  }
  return results;
}