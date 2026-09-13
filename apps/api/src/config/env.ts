import { ConfigError } from '../models/errors.model.ts';

export type Env = {
  sanityProjectId: string;
  sanityDataset: string;
  geminiApiKey: string;
  geminiModel: string;
};

/**
 * Lit la configuration au moment de la requête, pas au chargement du module :
 * sur Vercel comme sous Vite, les variables peuvent être injectées après
 * l'import. Une variable obligatoire absente lève une `ConfigError`, que le
 * middleware d'erreur transforme en 500 sans en révéler le détail au client.
 */
export const getEnv = (): Env => {
  const sanityProjectId = process.env.SANITY_PROJECT_ID;
  const geminiApiKey = process.env.GEMINI_API_KEY;
  if (!sanityProjectId) throw new ConfigError('SANITY_PROJECT_ID');
  if (!geminiApiKey) throw new ConfigError('GEMINI_API_KEY');
  return {
    sanityProjectId,
    sanityDataset: process.env.SANITY_DATASET ?? 'production',
    geminiApiKey,
    geminiModel: process.env.GEMINI_MODEL ?? 'gemini-3.6-flash',
  };
};
