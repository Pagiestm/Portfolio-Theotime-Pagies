import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url';
import { sanityClient } from './client';

const builder = imageUrlBuilder(sanityClient);

const DEFAULT_QUALITY = 80;

const base = (source: SanityImageSource, quality: number) =>
  builder.image(source).auto('format').fit('max').quality(quality);

export const imageUrl = (
  source: SanityImageSource | undefined,
  width?: number,
  quality = DEFAULT_QUALITY
) => {
  if (!source) return undefined;
  const url = base(source, quality);
  return (width ? url.width(width) : url).url();
};

const DEFAULT_WIDTHS = [400, 640, 900, 1200, 1600];

export const imageSrcSet = (
  source: SanityImageSource | undefined,
  widths: number[] = DEFAULT_WIDTHS,
  quality = DEFAULT_QUALITY
) => {
  if (!source) return undefined;
  return widths.map((width) => `${base(source, quality).width(width).url()} ${width}w`).join(', ');
};
