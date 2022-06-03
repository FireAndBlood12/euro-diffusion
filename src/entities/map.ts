import City from './city';
import Country from './country';
import GridDictionary from './gridDictionary';

export class MapGrid {
  countries: Country[];
  countriesGrid = new GridDictionary();

  minX: number;
  minY: number;
  maxX: number;
  maxY: number;

  constructor(countries: Country[]) {
    this.countries = countries;
    this.minX = 0;
    this.minY = 0;
    this.maxX = 0;
    this.maxY = 0;

    countries.forEach(({ coordinates: { xl, yl, xh, yh } }) => {
      this.minX = Math.min(this.minX, xl);
      this.minY = Math.min(this.minY, yl);
      this.maxX = Math.max(this.maxX, xh);
      this.maxY = Math.max(this.maxY, yh);
    });

    this.addCitiesToCountries();
    this.addNeighborsToCities();
  }

  isCompleted(): boolean {
    return this.countries.every((country) => country.isCalculationFinished());
  }

  addCitiesToCountries(): void {
    const coinTypes = this.countries.map((country) => country.name);
    this.countries.forEach((country, countryIndex) => {
      for (
        let x = country.coordinates.xl;
        x <= country.coordinates.xh;
        x += 1
      ) {
        for (
          let y = country.coordinates.yl;
          y <= country.coordinates.yh;
          y += 1
        ) {
          const city = new City(coinTypes, country.name);
          this.countriesGrid.set({ x, y }, city);
          this.countries[countryIndex].addCity(city);
        }
      }
    });
  }

  addNeighborsToCities(): void {
    for (let x = this.minX; x <= this.maxX; x += 1) {
      for (let y = this.minY; y <= this.maxY; y += 1) {
        const city = this.countriesGrid.get({ x, y });
        if (!city) {
          continue;
        }

        const neighbors: City[] = [];

        const addNeighbor = (x: number, y: number) => {
          const neighborCity = this.countriesGrid.get({ x, y });
          if (neighborCity) {
            neighbors.push(neighborCity);
          }
        };

        if (x < this.maxX) {
          addNeighbor(x + 1, y);
        }
        if (x > this.minY) {
          addNeighbor(x - 1, y);
        }
        if (y < this.maxY) {
          addNeighbor(x, y + 1);
        }
        if (y > this.minY) {
          addNeighbor(x, y - 1);
        }

        if (this.countries.length > 1 && !neighbors.length) {
          throw new Error(`City in ${city.countryName} has no neighbors`);
        }

        city.neighbors = neighbors;
      }
    }
  }

  startDiffusionEmulation(): Map<string, number> {
    this.countriesGrid = new GridDictionary();
    const result = new Map<string, number>();
    let currentDay = 0;

    while (!this.isCompleted()) {
      this.countries.forEach((country) => {
        country.cities.forEach((city) => {
          city.transportCoinsToNeighbors();
        });

        if (country.isCalculationFinished()) {
          if (!result.has(country.name)) {
            result.set(country.name, currentDay);
          }
        }
      });

      this.countries.forEach((country) => {
        country.cities.forEach((city) => {
          city.updateCoins();
        });
      });
      currentDay += 1;
    }

    this.countries.forEach(({ name }) => {
      if (!result.has(name)) {
        result.set(name, currentDay);
      }
    });

    return result;
  }

  static diffusionResultToString(diffusionResult: Map<string, number>): string {
    const results = [];
    const sortedResults = [...diffusionResult].sort(
      (r1, r2) => r1[1] - r2[1] || r1[0].localeCompare(r2[0]),
    );

    for (const [countryName, days] of sortedResults) {
      results.push(`${countryName} ${days}`);
    }
    return results.join('\n');
  }
}

export default MapGrid;
