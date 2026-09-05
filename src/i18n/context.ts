import { createContext } from 'react';

export const LANGUAGES = ['fr', 'en'];
export const STORAGE_KEY = 'portfolio.lang';

/** Contexte partagé par `I18nProvider` et le hook `useTranslation`. */
export const I18nContext = createContext(null);
