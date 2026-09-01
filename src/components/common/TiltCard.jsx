import { useCallback, useRef } from 'react';
import { usePrefersReducedMotion } from '../../hooks/useMediaQuery';
import { scene } from '../../config/site';

/**
 * Carte qui s'incline légèrement sous le curseur (`tilt` / `untilt` de la maquette).
 * Désactivée si l'utilisateur a demandé moins d'animations.
 */
const TiltCard = ({ className = '', style, children, ...rest }) => {
  const ref = useRef(null);
  const reduced = usePrefersReducedMotion();
  const enabled = scene.cardTilt && !reduced;

  const onMouseMove = useCallback(
    (e) => {
      if (!enabled) return;
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform = `rotateY(${(x * 3.2).toFixed(2)}deg) rotateX(${(-y * 3.2).toFixed(2)}deg) translateZ(5px)`;
      el.style.boxShadow = `${(-x * 18).toFixed(0)}px ${(-y * 18).toFixed(0)}px 54px rgba(92,127,174,.16)`;
    },
    [enabled]
  );

  const onMouseLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = 'none';
    el.style.boxShadow = 'none';
  }, []);

  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={`border-2 border-line bg-[rgba(25,34,49,.86)] backdrop-blur-[8px] transition-[transform,box-shadow,border-color] duration-200 hover:border-accent ${className}`}
      style={{ transformStyle: 'preserve-3d', ...style }}
      {...rest}
    >
      {children}
    </div>
  );
};

export default TiltCard;
