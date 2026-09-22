import { ConfigError } from './errors.model.ts';

export type Candidate = {
  provider: Provider;
  model: string;
  apiKey: string;

  baseUrl?: string;

  id: string;
};

export type Provider = 'google' | 'openai';

const API_KEY_VARIABLE: Record<Provider, string> = {
  google: 'GEMINI_API_KEY',
  openai: 'LLM_API_KEY',
};

const isProvider = (value: string): value is Provider => value === 'google' || value === 'openai';

export const parseCandidates = (spec: string | undefined, env: NodeJS.ProcessEnv): Candidate[] => {
  if (!spec?.trim()) throw new ConfigError('LLM_MODELS');
  const entries = spec
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean);

  const candidates: Candidate[] = [];
  for (const entry of entries) {
    const separator = entry.indexOf(':');
    const provider = separator === -1 ? 'google' : entry.slice(0, separator).trim();
    const model = (separator === -1 ? entry : entry.slice(separator + 1)).trim();
    if (!model) continue;
    if (!isProvider(provider)) {
      console.warn(`[api] fournisseur inconnu ignoré : ${provider}`);
      continue;
    }
    const apiKey = env[API_KEY_VARIABLE[provider]];
    if (!apiKey) {
      console.warn(`[api] ${entry} ignoré : ${API_KEY_VARIABLE[provider]} absent`);
      continue;
    }
    if (provider === 'openai' && !env.LLM_BASE_URL?.trim()) {
      console.warn(`[api] ${entry} ignoré : LLM_BASE_URL absent`);
      continue;
    }
    candidates.push({
      provider,
      model,
      apiKey,
      baseUrl: env.LLM_BASE_URL?.trim(),
      id: `${provider}:${model}`,
    });
  }

  if (!candidates.length) throw new ConfigError('LLM_MODELS : aucun modèle utilisable');
  return candidates;
};
