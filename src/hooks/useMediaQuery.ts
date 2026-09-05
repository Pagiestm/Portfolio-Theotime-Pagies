import { useEffect, useState } from 'react';

/** S'abonne à une media query CSS et renvoie son état courant. */
export const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(query).matches
  );

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = (e) => setMatches(e.matches);
    setMatches(mql.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);

  return matches;
};

/** Le breakpoint « wide » de la maquette : la nav complète s'affiche à partir de 1180px. */
export const useIsWide = () => useMediaQuery('(min-width: 1180px)');

export const usePrefersReducedMotion = () =>
  useMediaQuery('(prefers-reduced-motion: reduce)');
