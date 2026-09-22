import { ConfigError } from '../models/errors.model.ts';
import { type Candidate, parseCandidates } from '../models/llm.model.ts';

export type Env = {
  sanityProjectId: string;
  sanityDataset: string;

  models: Candidate[];
};

export const getEnv = (): Env => {
  const sanityProjectId = process.env.SANITY_PROJECT_ID;
  if (!sanityProjectId) throw new ConfigError('SANITY_PROJECT_ID');
  return {
    sanityProjectId,
    sanityDataset: process.env.SANITY_DATASET ?? 'production',
    models: parseCandidates(process.env.LLM_MODELS, process.env),
  };
};
