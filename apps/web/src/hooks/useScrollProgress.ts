import { useCallback, useEffect, useRef, useState } from 'react';
import { usePrefersReducedMotion } from './useMediaQuery';

export const useScrollProgress = ({ stickyOffset = 0 } = {}) => {
  const stageRef = useRef(null);
  const pinRef = useRef(null);
  const rafRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const reduced = usePrefersReducedMotion();

  const metrics = useCallback(() => {
    const stage = stageRef.current;
    if (!stage) return null;

    const pinHeight = pinRef.current?.offsetHeight ?? window.innerHeight - stickyOffset;
    const rect = stage.getBoundingClientRect();
    return {
      travel: Math.max(stage.offsetHeight - pinHeight, 1),
      top: rect.top,
      documentTop: rect.top + window.scrollY,
    };
  }, [stickyOffset]);

  useEffect(() => {
    if (!stageRef.current) return undefined;

    const compute = () => {
      rafRef.current = null;
      const m = metrics();
      if (!m) return;

      const raw = (stickyOffset - m.top) / m.travel;
      setProgress(Math.max(0, Math.min(1, raw)));
    };

    const schedule = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(compute);
    };

    compute();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [metrics, stickyOffset]);

  const scrollToProgress = useCallback(
    (value) => {
      const m = metrics();
      if (!m) return;
      window.scrollTo({
        top: m.documentTop - stickyOffset + value * m.travel,
        behavior: reduced ? 'auto' : 'smooth',
      });
    },
    [metrics, reduced, stickyOffset]
  );

  return { stageRef, pinRef, progress, scrollToProgress };
};
