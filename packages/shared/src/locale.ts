/**
 * Une valeur bilingue telle que stockée dans Sanity et consommée par le site.
 *
 * Le français est obligatoire, l'anglais facultatif : côté site, `localize()`
 * retombe sur `fr` quand `en` est absent ou vide.
 */
export type Locale<T = string> = { fr: T; en?: T | null };
