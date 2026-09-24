import { ConfigError } from '../models/errors.model.ts';
import { type Candidate, parseCandidates } from '../models/llm.model.ts';

export type Env = {
  sanityProjectId: string;
  sanityDataset: string;

  models: Candidate[];

  emailjs: {
    serviceId?: string;
    templateId?: string;
    publicKey?: string;
    privateKey?: string;
  };
};

export const getEnv = (): Env => {
  const sanityProjectId = process.env.SANITY_PROJECT_ID;
  if (!sanityProjectId) throw new ConfigError('SANITY_PROJECT_ID');
  return {
    sanityProjectId,
    sanityDataset: process.env.SANITY_DATASET ?? 'production',
    models: parseCandidates(process.env.LLM_MODELS, process.env),
    emailjs: {
      serviceId: process.env.EMAILJS_SERVICE_ID,
      templateId: process.env.EMAILJS_TEMPLATE_ID,
      publicKey: process.env.EMAILJS_PUBLIC_KEY,
      privateKey: process.env.EMAILJS_PRIVATE_KEY,
    },
  };
};
