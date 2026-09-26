import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { flushSync } from 'react-dom';
import { useMediaQuery, usePrefersReducedMotion } from '../hooks/useMediaQuery';
import {
  ThemeContext,
  THEME_STORAGE_KEY,
  type ResolvedTheme,
  type ThemeOrigin,
  type ThemePreference,
} from './context';
import ThemeWarp from './ThemeWarp';

const readStoredPreference = (): ThemePreference => {
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') return stored;
  } catch {}
  return 'system';
};

interface Warp {
  id: number;
  origin: ThemeOrigin;
  to: ResolvedTheme;
}

type WithViewTransition = Document & {
  startViewTransition?: (update: () => void) => { finished: Promise<void> };
};

const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [preference, setPreference] = useState<ThemePreference>(readStoredPreference);
  const [warp, setWarp] = useState<Warp | null>(null);
  const systemLight = useMediaQuery('(prefers-color-scheme: light)');
  const reduced = usePrefersReducedMotion();
  const resolved = preference === 'system' ? (systemLight ? 'light' : 'dark') : preference;

  useEffect(() => {
    document.documentElement.dataset.theme = resolved;
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute(
        'content',
        getComputedStyle(document.documentElement).getPropertyValue('--bg').trim()
      );
    }
  }, [resolved]);

  useEffect(() => {
    try {
      if (preference === 'system') window.localStorage.removeItem(THEME_STORAGE_KEY);
      else window.localStorage.setItem(THEME_STORAGE_KEY, preference);
    } catch {}
  }, [preference]);

  const toggle = useCallback(
    (origin?: ThemeOrigin) => {
      const to: ResolvedTheme = resolved === 'light' ? 'dark' : 'light';
      const doc = document as WithViewTransition;
      if (!origin || reduced) {
        setPreference(to);
        return;
      }
      setWarp({ id: Date.now(), origin, to });
      if (!doc.startViewTransition) {
        setPreference(to);
        return;
      }
      const root = document.documentElement;
      const radius = Math.hypot(
        Math.max(origin.x, window.innerWidth - origin.x),
        Math.max(origin.y, window.innerHeight - origin.y)
      );
      root.style.setProperty('--warp-x', `${origin.x}px`);
      root.style.setProperty('--warp-y', `${origin.y}px`);
      root.style.setProperty('--warp-r', `${Math.ceil(radius)}px`);
      doc.startViewTransition(() => {
        flushSync(() => setPreference(to));
      });
    },
    [resolved, reduced]
  );

  const value = useMemo(
    () => ({ preference, resolved, setPreference, toggle }),
    [preference, resolved, toggle]
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
      {warp && (
        <ThemeWarp
          key={warp.id}
          origin={warp.origin}
          to={warp.to}
          onDone={() => setWarp((current) => (current?.id === warp.id ? null : current))}
        />
      )}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
