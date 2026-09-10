import { useContext } from 'react';
import { I18nContext } from './context';

/**
 * Accès à la langue courante, au dictionnaire (`t`) et au résolveur de
 * valeurs localisées (`localize`, pour les objets `{ fr, en }` des données).
 */
export const useTranslation = () => {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useTranslation doit être utilisé dans un <I18nProvider>');
  return ctx;
};
