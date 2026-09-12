import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url';
import { sanityClient } from './client';

const builder = imageUrlBuilder(sanityClient);

export const imageUrl = (source: SanityImageSource | undefined, width?: number) => {
  if (!source) return undefined;
  const url = builder.image(source).auto('format').fit('max');
  return (width ? url.width(width) : url).url();
};
