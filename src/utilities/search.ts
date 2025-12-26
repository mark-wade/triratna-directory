export function tokenisedName(name: string) {
    // Remove all diacretics
    name = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    // Lowercase
    name = name.toLowerCase();

    // Remove all non-alpha characters
    name = name.replace(/[^a-z]/g, "");

    // Standardise spellings of certain words
    name = name.replace('dhamma', 'dharma');

    // Remove all "h"s (which covers most other situations)
    name = name.replace('h', '');

    return name;
}