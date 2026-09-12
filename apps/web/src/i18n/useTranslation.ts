import { useContext } from 'react';
import { I18nContext } from './context';

export const useTranslation = () => {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useTranslation doit être utilisé dans un <I18nProvider>');
  return ctx;
};
