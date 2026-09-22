import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url';
import { sanityClient } from './client';

const builder = imageUrlBuilder(sanityClient);

export const imageUrl = (source: SanityImageSource | undefined, width?: number) => {
  if (!source) return undefined;
  const url = builder.image(source).auto('format').fit('max');
  return (width ? url.width(width) : url).url();
};

const DEFAULT_WIDTHS = [400, 640, 900, 1200, 1600];

export const imageSrcSet = (
  source: SanityImageSource | undefined,
  widths: number[] = DEFAULT_WIDTHS
) => {
  if (!source) return undefined;
  return widths
    .map(
      (width) => `${builder.image(source).auto('format').fit('max').width(width).url()} ${width}w`
    )
    .join(', ');
};
