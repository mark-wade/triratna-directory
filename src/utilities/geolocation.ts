import { titleCase } from "title-case";
import { countryCodesByName } from "./countries";

export function countryToCountryCode(country: string) {
  // Title casing capitalises words inside brackets, which stops names like "Iran (Islamic
  // Republic of)" matching, so try the name exactly as it is first
  if (country in countryCodesByName) {
    return countryCodesByName[country];
  }
  const normalisedCountryName = titleCase(country.toLowerCase());
  if (normalisedCountryName === 'United States') {
    return 'US'; // It's in the list as "United States of America"
  }
  return normalisedCountryName in countryCodesByName ? countryCodesByName[normalisedCountryName] : undefined;
}
