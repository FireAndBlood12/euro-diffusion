import { MapGrid, Country } from './entities';
import { parseInputFile } from './utils';

const processCase = (countriesStrings: string[]) => {
  try {
    const countries: Country[] = countriesStrings.map(
      Country.parseCountryString,
    );
    const result = new MapGrid(countries).startDiffusionEmulation();
    console.log(MapGrid.diffusionResultToString(result));
  } catch (error) {
    console.error(error);
  }
};

const main = () => {
  const countryStrings = parseInputFile('inputFile');
  countryStrings.forEach((caseCountries: string[], caseNumber) => {
    console.log(`Case Number ${caseNumber + 1}`);
    processCase(caseCountries);
  });
};

main();
