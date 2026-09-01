import { useEffect, useRef, useState } from 'react';

/**
 * Progression [0..1] de la traversée d'une section « pinnée » (sticky) par le scroll.
 * Reproduit le calcul de Portfolio.dc.html : -top / (hauteur de scène - hauteur du sticky).
 *
 * @param {object} options
 * @param {number} options.stickyOffset hauteur du header sticky, retranchée de la fenêtre.
 * @returns {[React.RefObject<HTMLElement>, number]} la ref à poser sur la scène, et sa progression.
 */
export const useScrollProgress = ({ stickyOffset = 0 } = {}) => {
  const stageRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const rafRef = useRef(null);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return undefined;

    const compute = () => {
      rafRef.current = null;
      const pinHeight = window.innerHeight - stickyOffset;
      const travel = Math.max(stage.offsetHeight - pinHeight, 1);
      const raw = -stage.getBoundingClientRect().top / travel;
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
  }, [stickyOffset]);

  return [stageRef, progress];
};
