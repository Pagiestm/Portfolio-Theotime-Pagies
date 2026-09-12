import { createContext } from 'react';

export const LANGUAGES = ['fr', 'en'];
export const STORAGE_KEY = 'portfolio.lang';

export const I18nContext = createContext(null);
