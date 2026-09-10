import { useCallback, useEffect, useRef, useState } from 'react';
import { usePrefersReducedMotion } from './useMediaQuery';

/**
 * Progression [0..1] de la traversée d'une section « pinnée » (sticky) par le scroll.
 *
 * @param {object} options
 * @param {number} options.stickyOffset décalage du sticky (hauteur du header).
 * @returns {{stageRef, pinRef, progress, scrollToProgress}}
 *   `stageRef` va sur la section haute, `pinRef` sur l'enfant sticky.
 */
export const useScrollProgress = ({ stickyOffset = 0 } = {}) => {
  const stageRef = useRef(null);
  const pinRef = useRef(null);
  const rafRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const reduced = usePrefersReducedMotion();

  /**
   * La hauteur épinglée est mesurée, pas déduite de `innerHeight` : l'enfant
   * sticky porte un `min-height`, et sur un écran bas (mobile en paysage) la
   * formule surestimerait la course, empêchant `progress` d'atteindre 1.
   */
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
      // L'enfant s'épingle à `top: stickyOffset`, pas à 0 : la progression
      // démarre quand la scène atteint cette ligne, d'où l'origine décalée.
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

  /**
   * Amène la scène à une progression donnée. `documentTop` vient d'un
   * `getBoundingClientRect()` et non d'`offsetTop`, qui serait relatif au
   * `<main>` positionné et raterait la cible de la hauteur du header.
   */
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
