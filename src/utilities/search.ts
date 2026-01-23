const MISSPELLING_PAIRS = [
    ["dhamma", "dharma"],
]

export function searchQueryMatches(query: string, name: string) {
    const tokenisedQuery = tokenisedName(query);
    if (tokenisedName(name).includes(tokenisedQuery)) {
        return true;
    }

    for (const [a, b] of MISSPELLING_PAIRS) {
        if (name.toLowerCase().includes(a)) {
            if (tokenisedName(name.toLowerCase().replaceAll(a, b)).includes(tokenisedQuery)) {
                return true;
            }
        }
        if (name.toLowerCase().includes(b)) {
            if (tokenisedName(name.toLowerCase().replaceAll(b, a)).includes(tokenisedQuery)) {
                return true;
            }
        }
    }

    return false;
}

function tokenisedName(name: string) {
    // Remove all diacretics
    name = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    // Lowercase
    name = name.toLowerCase();

    // Remove all non-alpha characters
    name = name.replaceAll(/[^a-z]/g, "");

    // Remove all "h"s (which covers most common alterative spellings)
    name = name.replaceAll('h', '');

    return name;
}