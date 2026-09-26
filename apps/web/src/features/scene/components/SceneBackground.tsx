import { lazy, Suspense, useEffect, useState } from 'react';
import { scene } from '../../../config/scene';
import { usePrefersReducedMotion } from '../../../hooks/useMediaQuery';

const HeroScene = lazy(() => import('./HeroScene'));

const useIdle = (enabled: boolean) => {
  const [idle, setIdle] = useState(false);

  useEffect(() => {
    if (!enabled) return undefined;
    if (typeof requestIdleCallback !== 'function') {
      const timer = setTimeout(() => setIdle(true), 400);
      return () => clearTimeout(timer);
    }
    const handle = requestIdleCallback(() => setIdle(true), { timeout: 2000 });
    return () => cancelIdleCallback(handle);
  }, [enabled]);

  return idle;
};

const useHeroInView = (enabled: boolean) => {
  const [inView, setInView] = useState(true);

  useEffect(() => {
    if (!enabled) return undefined;
    const stage = document.querySelector('[data-hero-stage]');
    if (!stage) return undefined;
    let raf = 0;
    const update = () => {
      raf = 0;
      setInView(stage.getBoundingClientRect().bottom >= window.innerHeight);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [enabled]);

  return inView;
};

const SceneBackground = ({ animated = true }: { animated?: boolean }) => {
  const ready = useIdle(animated);
  const heroInView = useHeroInView(animated && ready);
  const reduced = usePrefersReducedMotion();

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {animated && ready && (
        <div
          className="absolute inset-0"
          style={{
            opacity: heroInView ? 'var(--scene-opacity)' : 0,
            transition: reduced ? undefined : 'opacity .6s ease-out',
          }}
        >
          <Suspense fallback={null}>
            <HeroScene density={scene.backgroundDensity} scrollDriven={false} />
          </Suspense>
        </div>
      )}

      <div className="absolute inset-0 flex flex-col justify-between">
        {Array.from({ length: 8 }, (_, i) => (
          <span key={i} className="block h-px bg-line-soft" />
        ))}
      </div>

      <div className="absolute inset-0 mx-auto max-w-shell">
        <span
          className="absolute inset-y-0 left-6 block w-px"
          style={{
            background: 'linear-gradient(180deg,transparent,var(--color-line),transparent)',
          }}
        />
      </div>

      <div
        className="absolute inset-0"
        style={{
          background: `
          radial-gradient(1000px 640px at 80% -6%, color-mix(in srgb, var(--color-accent) var(--scene-glow), transparent), transparent 64%),
          radial-gradient(760px 520px at 2% 40%, color-mix(in srgb, var(--color-surface) var(--scene-veil-bottom), transparent), transparent 62%),
          linear-gradient(180deg, color-mix(in srgb, var(--color-bg) var(--scene-veil-top), transparent) 0%, color-mix(in srgb, var(--color-bg) var(--scene-veil-bottom), transparent) 100%)`,
        }}
      />
    </div>
  );
};

export default SceneBackground;
