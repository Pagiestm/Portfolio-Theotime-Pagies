import { useCallback, useEffect, useRef } from 'react';
import { usePrefersReducedMotion } from '../../../hooks/useMediaQuery';
import { useTranslation } from '../../../i18n/useTranslation';
import { imageSrcSet, imageUrl } from '../../../services/sanity/image';
import type { SanityImage } from '../../../services/sanity/types';

const SWIPE_THRESHOLD = 48;

const ARROW = {
  prev: 'M15 4 L7 12 L15 20',
  next: 'M9 4 L17 12 L9 20',
};

const Control = ({
  label,
  path,
  onClick,
  className,
}: {
  label: string;
  path: string;
  onClick: () => void;
  className: string;
}) => (
  <button
    type="button"
    onClick={(event) => {
      event.stopPropagation();
      onClick();
    }}
    aria-label={label}
    className={`absolute top-1/2 -translate-y-1/2 border-2 border-line-soft bg-bg/60 p-3 text-ink transition-colors duration-200 hover:border-accent hover:text-accent ${className}`}
  >
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d={path} stroke="currentColor" strokeWidth="2" />
    </svg>
  </button>
);

const GalleryLightbox = ({
  images,
  index,
  legendOf,
  onClose,
  onNavigate,
}: {
  images: SanityImage[];
  index: number;
  legendOf: (image: SanityImage, position: number) => string;
  onClose: () => void;
  onNavigate: (next: number) => void;
}) => {
  const { t } = useTranslation();
  const reduced = usePrefersReducedMotion();
  const dialogRef = useRef<HTMLDivElement>(null);
  const touchStart = useRef(0);

  const total = images.length;
  const image = images[index];

  const step = useCallback(
    (delta: number) => onNavigate((index + delta + total) % total),
    [index, onNavigate, total]
  );

  useEffect(() => {
    dialogRef.current?.focus();
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowRight') step(1);
      if (event.key === 'ArrowLeft') step(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = previous;
    };
  }, [onClose, step]);

  const legend = legendOf(image, index + 1);

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={t.gallery}
      tabIndex={-1}
      onClick={onClose}
      onTouchStart={(event) => {
        touchStart.current = event.touches[0].clientX;
      }}
      onTouchEnd={(event) => {
        const delta = event.changedTouches[0].clientX - touchStart.current;
        if (Math.abs(delta) > SWIPE_THRESHOLD) step(delta < 0 ? 1 : -1);
      }}
      className={`fixed inset-0 z-50 flex flex-col bg-bg/95 outline-none ${
        reduced ? '' : 'animate-fade'
      }`}
    >
      <div className="flex items-center justify-between border-b-2 border-line-soft px-5 py-4">
        <span className="text-[12px] font-bold tabular-nums tracking-[.16em] text-muted">
          {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </span>
        <button
          type="button"
          onClick={onClose}
          aria-label={t.galleryClose}
          className="border-2 border-line-soft p-2 text-ink transition-colors duration-200 hover:border-accent hover:text-accent"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M5 5 L19 19 M19 5 L5 19" stroke="currentColor" strokeWidth="2" />
          </svg>
        </button>
      </div>

      <div className="relative flex flex-1 items-center justify-center overflow-hidden p-4 sm:p-10">
        <img
          key={image._key ?? index}
          src={imageUrl(image, undefined, 90)}
          srcSet={imageSrcSet(image, [1200, 1600, 2400, 3200], 90)}
          sizes="100vw"
          alt={legend}
          className={`max-h-full max-w-full object-contain ${reduced ? '' : 'animate-rise'}`}
        />

        {total > 1 && (
          <>
            <Control
              label={t.galleryPrev}
              path={ARROW.prev}
              onClick={() => step(-1)}
              className="left-3 sm:left-6"
            />
            <Control
              label={t.galleryNext}
              path={ARROW.next}
              onClick={() => step(1)}
              className="right-3 sm:right-6"
            />
          </>
        )}
      </div>

      {image.alt && (
        <p className="m-0 border-t-2 border-line-soft px-5 py-4 text-center text-[13.5px] text-accent-2">
          {image.alt}
        </p>
      )}
    </div>
  );
};

export default GalleryLightbox;
