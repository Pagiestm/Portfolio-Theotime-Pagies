import { useCallback, useEffect, useMemo, useState } from 'react';
import fr from './fr';
import en from './en';
import { I18nContext, LANGUAGES, STORAGE_KEY } from './context';

const DICTIONARIES = { fr, en };

const readStoredLang = () => {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (LANGUAGES.includes(stored)) return stored;
  } catch {
    /* localStorage indisponible (navigation privée, cookies bloqués) */
  }
  const nav = typeof navigator !== 'undefined' ? navigator.language : '';
  return nav.startsWith('en') ? 'en' : 'fr';
};

/** Fournit la langue, le dictionnaire et le résolveur de valeurs localisées. */
const I18nProvider = ({ children }) => {
  const [lang, setLang] = useState(readStoredLang);

  useEffect(() => {
    document.documentElement.lang = lang;
    try {
      window.localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      /* ignoré volontairement */
    }
  }, [lang]);

  /** Résout une valeur localisée : soit une chaîne, soit `{ fr, en }`. */
  const localize = useCallback(
    (value) =>
      value && typeof value === 'object' && !Array.isArray(value) ? value[lang] ?? value.fr : value,
    [lang]
  );

  const value = useMemo(
    () => ({ lang, setLang, t: DICTIONARIES[lang], localize }),
    [lang, localize]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export default I18nProvider;
