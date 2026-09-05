import { CSSProperties, ElementType, ReactNode, useEffect, useRef, useState } from 'react';
import { usePrefersReducedMotion } from '../../hooks/useMediaQuery';

const HIDDEN_TRANSFORM: Record<string, string> = {
  up: 'translate3d(0,22px,0)',
  left: 'translate3d(-24px,0,0)',
  right: 'translate3d(24px,0,0)',
  tilt: 'perspective(1400px) rotateX(4deg) translate3d(0,26px,-22px)',
};

interface RevealProps {
  as?: ElementType;
  variant?: string;
  delay?: number;
  style?: CSSProperties;
  children?: ReactNode;
  className?: string;
  [key: string]: unknown;
}

const Reveal = ({
  as: Tag = 'div',
  variant = 'up',
  delay = 0,
  style,
  children,
  ...rest
}: RevealProps) => {
  const ref = useRef(null);
  const reduced = usePrefersReducedMotion();
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (reduced) {
      setShown(true);
      return undefined;
    }
    const el = ref.current;
    if (!el) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: '0px 0px -6% 0px', threshold: 0.06 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [reduced]);

  return (
    <Tag
      ref={ref}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? 'none' : (HIDDEN_TRANSFORM[variant] ?? HIDDEN_TRANSFORM.up),
        transition: reduced
          ? undefined
          : `opacity 1s cubic-bezier(.22,.61,.36,1) ${delay}ms, transform 1.15s cubic-bezier(.22,.61,.36,1) ${delay}ms`,
        willChange: shown ? undefined : 'opacity, transform',
        ...style,
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
};

export default Reveal;
