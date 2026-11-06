import type { CSSProperties } from 'react';

const initialsOf = (title: string) =>
  title
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase();

const ProjectCover = ({
  src,
  srcSet,
  sizes,
  title,
  alt,
  placeholder,
  className = '',
  imageClassName = '',
  fit = 'contain',
  style,
  loading = 'lazy',
}: {
  src?: string;
  srcSet?: string;
  sizes?: string;
  title: string;
  alt?: string;
  placeholder?: string;
  className?: string;
  imageClassName?: string;
  fit?: 'contain' | 'cover';
  style?: CSSProperties;
  loading?: 'lazy' | 'eager';
}) => (
  <div
    className={`flex items-center justify-center overflow-hidden bg-surface-2 ${className}`}
    style={style}
  >
    {src ? (
      <img
        src={src}
        srcSet={srcSet}
        sizes={sizes}
        alt={alt ?? title}
        loading={loading}
        className={`block h-full w-full ${
          fit === 'cover' ? 'object-cover object-top' : 'object-contain'
        } ${imageClassName}`}
      />
    ) : (
      <div
        aria-hidden="true"
        className="flex h-full w-full items-center justify-center"
        style={{
          backgroundImage:
            'repeating-linear-gradient(135deg, var(--color-line-soft) 0 1px, transparent 1px 12px)',
        }}
      >
        {placeholder ? (
          <span className="max-w-[80%] text-center text-[11px] font-bold uppercase leading-[1.5] tracking-[.16em] text-muted">
            {placeholder}
          </span>
        ) : (
          <span className="text-[clamp(30px,5vw,58px)] font-black tracking-[-.04em] text-line">
            {initialsOf(title)}
          </span>
        )}
      </div>
    )}
  </div>
);

export default ProjectCover;
