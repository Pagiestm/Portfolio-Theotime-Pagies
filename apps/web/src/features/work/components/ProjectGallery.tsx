import { useCallback, useState } from 'react';
import Reveal from '../../../components/common/Reveal';
import { usePrefersReducedMotion } from '../../../hooks/useMediaQuery';
import { useTranslation } from '../../../i18n/useTranslation';
import { imageSrcSet, imageUrl } from '../../../services/sanity/image';
import type { SanityImage } from '../../../services/sanity/types';
import GalleryLightbox from './GalleryLightbox';

const ProjectGallery = ({ images, title }: { images?: SanityImage[] | null; title: string }) => {
  const { t } = useTranslation();
  const reduced = usePrefersReducedMotion();
  const [opened, setOpened] = useState<number | null>(null);

  const legendOf = useCallback(
    (image: SanityImage, position: number) => image.alt ?? `${title} - ${t.gallery} ${position}`,
    [t, title]
  );

  if (!images?.length) return null;

  const motion = reduced ? '' : 'transition-transform duration-[600ms] ease-out';
  const zoomIn = reduced ? '' : 'group-hover:scale-[1.04] group-focus-visible:scale-[1.04]';

  return (
    <>
      <div
        className="grid gap-[2px] border-2 border-line bg-line"
        style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))' }}
      >
        {images.map((image, index) => {
          const thumb = imageUrl(image, 720);
          if (!thumb) return null;

          const legend = legendOf(image, index + 1);

          return (
            <Reveal
              key={image._key ?? index}
              variant="up"
              delay={Math.min(index, 5) * 60}
              className="bg-surface-2"
              style={{ aspectRatio: '16 / 10' }}
            >
              <button
                type="button"
                onClick={() => setOpened(index)}
                aria-label={legend}
                className="group relative block h-full w-full cursor-zoom-in overflow-hidden outline-none"
              >
                <img
                  src={thumb}
                  srcSet={imageSrcSet(image, [400, 640, 900, 1200])}
                  sizes="(max-width: 640px) 100vw, (max-width: 1000px) 50vw, 420px"
                  alt={legend}
                  loading="lazy"
                  className={`block h-full w-full object-contain ${motion} ${zoomIn}`}
                />

                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute left-3 top-3 text-[11px] font-bold tabular-nums tracking-[.14em] text-muted opacity-70"
                >
                  {String(index + 1).padStart(2, '0')}
                </span>

                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 border-2 border-transparent transition-colors duration-300 group-hover:border-accent group-focus-visible:border-accent"
                />

                {image.alt && (
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none absolute inset-x-0 bottom-0 translate-y-full bg-[rgba(1,0,1,.82)] px-4 py-3 text-left text-[12.5px] leading-snug text-accent-2 group-hover:translate-y-0 group-focus-visible:translate-y-0 ${
                      reduced ? '' : 'transition-transform duration-300 ease-out'
                    }`}
                  >
                    {image.alt}
                  </span>
                )}
              </button>
            </Reveal>
          );
        })}
      </div>

      {opened !== null && (
        <GalleryLightbox
          images={images}
          index={opened}
          legendOf={legendOf}
          onClose={() => setOpened(null)}
          onNavigate={setOpened}
        />
      )}
    </>
  );
};

export default ProjectGallery;
