import { ConfigError } from './errors.model.ts';

/**
 * Un modèle candidat : le fournisseur qui l'héberge, son identifiant chez lui,
 * et la clé qui l'ouvre. L'assistant n'en connaît aucun en particulier, il
 * reçoit une liste ordonnée et prend le premier qui répond.
 */
export type Candidate = {
  provider: Provider;
  model: string;
  apiKey: string;
  /** Où joindre le fournisseur, pour les formats qui ne sont pas liés à un hôte. */
  baseUrl?: string;
  /** Identifiant lisible dans les journaux, et clé du registre des quotas épuisés. */
  id: string;
};

export type Provider = 'google' | 'openai';

/**
 * Chaque fournisseur lit sa clé dans sa propre variable. `openai` désigne le
 * format d'API, pas la société : OpenRouter, Groq ou Mistral le parlent aussi,
 * d'où `LLM_BASE_URL` pour pointer ailleurs que chez OpenAI.
 */
const API_KEY_VARIABLE: Record<Provider, string> = {
  google: 'GEMINI_API_KEY',
  openai: 'LLM_API_KEY',
};

const isProvider = (value: string): value is Provider => value === 'google' || value === 'openai';

/**
 * Lit `LLM_MODELS`, une liste ordonnée `fournisseur:modèle` séparée par des
 * virgules. Aucun modèle n'est écrit dans le code : en changer ne demande ni
 * modification ni déploiement, seulement une variable d'environnement - au
 * prix d'une configuration obligatoire, sans quoi l'API refuse de démarrer.
 *
 * Un candidat dont la clé manque est écarté plutôt que fatal : la liste peut
 * nommer un fournisseur de secours qui n'est pas configuré partout, sans faire
 * tomber l'API pour autant.
 */
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
