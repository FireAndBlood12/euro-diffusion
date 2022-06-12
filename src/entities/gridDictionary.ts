import City from './city';

export type Coordinates = { x: number; y: number };

export class GridDictionary {
  private map = new Map<string, City>();

  private key(coords: Coordinates) {
    return `${coords.x}-${coords.y}`;
  }

  set(coords: Coordinates, value: City) {
    const key = this.key(coords);
    this.map.set(key, value);
  }

  get(coords: Coordinates) {
    const key = this.key(coords);
    return this.map.get(key);
  }
}

export default GridDictionary;
