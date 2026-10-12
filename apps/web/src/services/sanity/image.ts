import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url';
import { sanityConfig } from './client';

const builder = imageUrlBuilder(sanityConfig);

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

const THUMB_RATIO = 16 / 10;
const THUMB_WIDTHS = [320, 480, 640, 960];

const thumb = (source: SanityImageSource, width: number, quality: number) =>
  base(source, quality)
    .fit('crop')
    .crop('top')
    .width(width)
    .height(Math.round(width / THUMB_RATIO));

export const thumbUrl = (
  source: SanityImageSource | undefined,
  width = 640,
  quality = DEFAULT_QUALITY
) => (source ? thumb(source, width, quality).url() : undefined);

export const thumbSrcSet = (
  source: SanityImageSource | undefined,
  widths: number[] = THUMB_WIDTHS,
  quality = DEFAULT_QUALITY
) => {
  if (!source) return undefined;
  return widths.map((width) => `${thumb(source, width, quality).url()} ${width}w`).join(', ');
};
