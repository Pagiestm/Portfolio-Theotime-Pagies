import { useCallback, useSyncExternalStore } from 'react';

export const useMediaQuery = (query: string) => {
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener('change', onStoreChange);
      return () => mql.removeEventListener('change', onStoreChange);
    },
    [query]
  );

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false
  );
};

export const useIsWide = () => useMediaQuery('(min-width: 1180px)');

export const usePrefersReducedMotion = () => useMediaQuery('(prefers-reduced-motion: reduce)');
