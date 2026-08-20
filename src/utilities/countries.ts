import * as countryCodes from "country-codes-list";

export const countryCodesByName = countryCodes.customList(
  "countryNameEn",
  "{countryCode}"
);

export function countryNames() {
  return Object.keys(countryCodesByName).sort((a, b) => a.localeCompare(b));
}
