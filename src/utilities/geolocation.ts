import * as countryCodes from "country-codes-list";
import { titleCase } from "title-case";

const countryCodesByName = countryCodes.customList('countryNameEn', '{countryCode}');
export function countryToCountryCode(country: string) {
  const normalisedCountryName = titleCase(country.toLowerCase());
  if (normalisedCountryName === 'United States') {
    return 'US'; // It's in the list as "United States of America"
  }
  return normalisedCountryName in countryCodesByName ? countryCodesByName[normalisedCountryName] : undefined;
}