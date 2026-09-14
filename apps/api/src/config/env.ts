import { ConfigError } from '../models/errors.model.ts';
import { type Candidate, parseCandidates } from '../models/llm.model.ts';

export type Env = {
  sanityProjectId: string;
  sanityDataset: string;
  /** Les modèles à interroger, dans l'ordre de préférence. */
  models: Candidate[];
};

/**
 * Lit la configuration au moment de la requête, pas au chargement du module :
 * sur Vercel comme sous Vite, les variables peuvent être injectées après
 * l'import. Une variable obligatoire absente lève une `ConfigError`, que le
 * middleware d'erreur transforme en 500 sans en révéler le détail au client.
 */
export const getEnv = (): Env => {
  const sanityProjectId = process.env.SANITY_PROJECT_ID;
  if (!sanityProjectId) throw new ConfigError('SANITY_PROJECT_ID');
  return {
    sanityProjectId,
    sanityDataset: process.env.SANITY_DATASET ?? 'production',
    models: parseCandidates(process.env.LLM_MODELS, process.env),
  };
};
