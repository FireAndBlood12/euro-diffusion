import City from './city';

export interface CountryCoordinates {
  xl: number;
  yl: number;
  xh: number;
  yh: number;
}

export class Country {
  cities: City[];
  name: string;
  coordinates: CountryCoordinates;

  constructor(name: string, coordinates: CountryCoordinates) {
    if (!Country.areCoordinatesValid(coordinates)) {
      throw new Error('Coordinates are invalid');
    }

    if (name.length > 25) {
      throw new Error(`Name must be less than 25 characters`);
    }

    this.cities = [];
    this.name = name;
    this.coordinates = coordinates;
  }

  static areCoordinatesValid({ xl, yl, xh, yh }: CountryCoordinates): boolean {
    const isCorrectLowHighRange = (low: number, high: number) => low <= high;

    const isCoordinateInBounds = (coordinate: number) =>
      coordinate >= 1 && coordinate <= 10;

    return (
      [xl, yl, xh, yh].every(isCoordinateInBounds) &&
      isCorrectLowHighRange(xl, xh) &&
      isCorrectLowHighRange(yl, yh)
    );
  }

  addCity(city: City): void {
    this.cities.push(city);
  }

  isCalculationFinished(): boolean {
    return this.cities.every((city) => city.isCalculationFinished());
  }

  static parseCountryString(countryString: string): Country {
    const [name, ...coordinates] = countryString.split(' ');
    const [xl, yl, xh, yh] = coordinates.map((coordinate) =>
      parseInt(coordinate),
    );
    return new Country(name, { xl, yl, xh, yh } as CountryCoordinates);
  }
}

export default Country;
