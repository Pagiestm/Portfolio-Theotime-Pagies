import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url';
import { sanityClient } from './client';

const builder = imageUrlBuilder(sanityClient);

/**
 * Construit une URL d'image servie par le CDN Sanity.
 *
 * Le CDN redimensionne et convertit à la volée : on demande une largeur et il
 * renvoie du WebP quand le navigateur l'accepte, sans qu'aucun fichier ne soit
 * versionné dans le dépôt.
 */
export const imageUrl = (source: SanityImageSource | undefined, width?: number) => {
  if (!source) return undefined;
  const url = builder.image(source).auto('format').fit('max');
  return (width ? url.width(width) : url).url();
};
