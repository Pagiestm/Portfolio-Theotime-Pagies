import type { Locale } from '../../../services/sanity/types';
import { useTranslation } from '../../../i18n/useTranslation';
import { scene } from '../../../config/scene';
import LazyHeroScene from '../../scene/components/LazyHeroScene';

const HEADER_HEIGHT = 68;

const HeroStage = ({ title, text }: { title?: Locale; text?: Locale }) => {
  const { localize } = useTranslation();
  const heading = localize(title);

  if (!heading) return null;

  return (
    <section
      data-hero-stage
      className="relative overflow-hidden border-b-2 border-line"
      style={{ height: `calc(100vh - ${HEADER_HEIGHT}px)`, minHeight: 520 }}
    >
      <div className="absolute inset-0">
        <LazyHeroScene density={scene.density} />
      </div>

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `
            radial-gradient(60% 60% at 74% 46%, color-mix(in srgb, var(--color-accent) 16%, transparent), transparent 70%),
            linear-gradient(90deg, color-mix(in srgb, var(--color-bg) var(--hero-veil-1), transparent) 0%, color-mix(in srgb, var(--color-bg) var(--hero-veil-2), transparent) 44%, color-mix(in srgb, var(--color-bg) var(--hero-veil-3), transparent) 72%, color-mix(in srgb, var(--color-bg) var(--hero-veil-4), transparent) 100%)`,
        }}
      />

      <div className="relative mx-auto flex h-full max-w-shell items-center px-6">
        <div
          className="w-full"
          style={{ maxWidth: 'min(780px, max(320px, 70%))', containerType: 'inline-size' }}
        >
          <h1 className="m-0 mb-[28px] text-[clamp(32px,8.4cqw,68px)] font-black leading-[.98] tracking-[-.04em]">
            {heading}
          </h1>
          <p className="m-0 max-w-[62ch] border-l-2 border-accent py-1 pl-5 text-[clamp(16px,1.45vw,20px)] leading-relaxed text-muted">
            {localize(text)}
          </p>
        </div>
      </div>
    </section>
  );
};

export default HeroStage;
