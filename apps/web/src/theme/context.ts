import { createContext } from 'react';

export type ThemePreference = 'system' | 'light' | 'dark';
export type ResolvedTheme = 'light' | 'dark';
export const THEME_STORAGE_KEY = 'portfolio.theme';

export interface ThemeOrigin {
  x: number;
  y: number;
}

export interface ThemeContextValue {
  preference: ThemePreference;
  resolved: ResolvedTheme;
  setPreference: (preference: ThemePreference) => void;
  toggle: (origin?: ThemeOrigin) => void;
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);
