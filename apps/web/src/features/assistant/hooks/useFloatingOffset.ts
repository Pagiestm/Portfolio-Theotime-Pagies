import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const SELECTOR = 'footer, [data-bottom-bar]';
const GAP = 12;

const blockedHeight = (element: Element) => {
  const rect = element.getBoundingClientRect();
  if (rect.bottom < window.innerHeight - 2) return 0;
  return Math.max(0, Math.min(window.innerHeight - rect.top, rect.height));
};

export const useFloatingOffset = () => {
  const { pathname } = useLocation();
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    let frame = 0;

    const measure = () => {
      frame = 0;
      const obstacles = document.querySelectorAll(SELECTOR);
      let blocked = 0;
      obstacles.forEach((element) => {
        blocked = Math.max(blocked, blockedHeight(element));
      });
      setOffset(blocked > 0 ? blocked + GAP : 0);
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener('scroll', schedule, { passive: true, capture: true });
    window.addEventListener('resize', schedule);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule, true);
      window.removeEventListener('resize', schedule);
    };
  }, [pathname]);

  return offset;
};
