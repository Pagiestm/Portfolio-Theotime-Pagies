import { useCallback, useEffect, useRef, useState } from 'react';
import { usePrefersReducedMotion } from '../../../hooks/useMediaQuery';

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

/**
 * Le « couloir » du parcours : le scroll vertical fait défiler une piste
 * horizontale, et chaque carte se rapproche ou s'éloigne en 3D selon sa
 * distance au centre. Portage de `_hstage()` / `_hStep()` de Portfolio.dc.html.
 *
 * Les styles par frame sont écrits directement sur le DOM : les passer par
 * un state React déclencherait un rendu complet à 60 fps pour rien.
 */
export const useHorizontalStage = ({ stickyOffset = 0 } = {}) => {
  const stageRef = useRef(null);
  const frameRef = useRef(null);
  const trackRef = useRef(null);
  const railFillRef = useRef(null);
  const barRef = useRef(null);
  const cardRefs = useRef([]);

  const [activeIndex, setActiveIndex] = useState(0);
  const reduced = usePrefersReducedMotion();

  const registerCard = useCallback((index) => (el) => {
    cardRefs.current[index] = el;
  }, []);

  const geometry = useCallback(() => {
    const stage = stageRef.current;
    const frame = frameRef.current;
    const track = trackRef.current;
    if (!stage || !frame || !track) return null;

    const frameWidth = frame.clientWidth;
    return {
      stage,
      frame,
      track,
      frameWidth,
      centre: frameWidth / 2,
      shift: Math.max(track.scrollWidth - frameWidth, 0),
      travel: Math.max(stage.offsetHeight - frame.offsetHeight, 1),
      cards: cardRefs.current.filter(Boolean),
    };
  }, []);

  useEffect(() => {
    let raf = 0;
    let offset = null;

    const frame = () => {
      raf = requestAnimationFrame(frame);
      const g = geometry();
      if (!g) return;

      const progress = clamp(-g.stage.getBoundingClientRect().top / g.travel, 0, 1);
      const target = -progress * g.shift;

      if (offset === null || reduced) offset = target;
      else offset += (target - offset) * 0.13;
      if (Math.abs(target - offset) < 0.35) offset = target;

      g.track.style.transform = `translate3d(${offset.toFixed(1)}px,0,0)`;

      const frameRect = g.frame.getBoundingClientRect();
      let nearest = 0;
      let bestDistance = Infinity;

      g.cards.forEach((card, index) => {
        const rect = card.getBoundingClientRect();
        const dx = (rect.left - frameRect.left + rect.width / 2 - g.centre) / Math.max(g.frameWidth, 1);
        const distance = Math.abs(dx);
        if (distance < bestDistance) {
          bestDistance = distance;
          nearest = index;
        }

        card.style.zIndex = String(100 - Math.round(distance * 60));

        const body = card.querySelector('[data-card-body]');
        if (!body) return;

        if (reduced) {
          body.style.transform = 'none';
          body.style.opacity = '1';
          body.style.filter = 'none';
          return;
        }

        const focus = Math.max(0, 1 - distance * 3.2);
        const z = -Math.min(distance, 1.4) * 320;
        const rotateY = clamp(-dx * 28, -22, 22);
        body.style.transform = `translate3d(0,${(distance * 18).toFixed(1)}px,${z.toFixed(1)}px) rotateY(${rotateY.toFixed(2)}deg) scale(${(1 + focus * 0.05).toFixed(3)})`;
        body.style.opacity = Math.max(0.1, 1 - distance * 1.05).toFixed(3);
        body.style.filter =
          distance > 0.3 ? `blur(${Math.min(3.4, (distance - 0.3) * 5.5).toFixed(2)}px)` : 'none';

        // Le repère passe à la couleur accent une fois franchi le centre.
        const node = card.querySelector('[data-card-node]');
        if (node) {
          const nodeRect = node.getBoundingClientRect();
          const passed = nodeRect.left - frameRect.left + nodeRect.width / 2 <= g.centre;
          node.style.background = passed ? 'var(--color-accent)' : 'var(--color-bg)';
          node.style.borderColor = passed ? 'var(--color-accent)' : 'var(--color-line)';
          node.style.transform = passed ? 'scale(1.2)' : 'none';
        }
      });

      if (railFillRef.current) {
        railFillRef.current.style.width = `${(-offset + g.centre).toFixed(1)}px`;
      }
      if (barRef.current) {
        barRef.current.style.width = `${(progress * 100).toFixed(1)}%`;
      }
      setActiveIndex((current) => (current === nearest ? current : nearest));
    };

    frame();
    return () => cancelAnimationFrame(raf);
  }, [geometry, reduced]);

  /** Amène la carte suivante / précédente au centre du couloir. */
  const step = useCallback(
    (direction) => {
      const g = geometry();
      if (!g || !g.shift) return;

      const next = clamp(activeIndex + direction, 0, g.cards.length - 1);
      const card = g.cards[next];
      if (!card) return;

      const centreX = card.offsetLeft + card.offsetWidth / 2;
      const progress = clamp((centreX - g.centre) / g.shift, 0, 1);
      window.scrollTo({
        top: g.stage.offsetTop + progress * g.travel,
        behavior: 'smooth',
      });
    },
    [activeIndex, geometry]
  );

  return {
    stageRef,
    frameRef,
    trackRef,
    railFillRef,
    barRef,
    registerCard,
    activeIndex,
    step,
    stickyOffset,
  };
};
