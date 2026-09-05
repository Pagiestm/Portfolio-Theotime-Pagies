/**
 * Transforme un libellé en identifiant d'URL stable :
 * « Click'n Party » → « click-n-party », « MyDigitalSchool-V2 » → « mydigitalschool-v2 ».
 */
export const slugify = (value) =>
  String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
