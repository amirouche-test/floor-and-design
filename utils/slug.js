// Transforme un nom en slug, ex: "Chaise Scandinave Blanche" → "chaise-scandinave-blanche"
export function getSlugByName(name) {
  return name
    .toLowerCase()
    .normalize('NFD')                 // enlève accents
    .replace(/[\u0300-\u036f]/g, '')  // enlève diacritiques
    .replace(/[^a-z0-9]+/g, '-')      // remplace tout sauf lettres/chiffres par -
    .replace(/(^-|-$)/g, '')          // retire - au début et à la fin
}
