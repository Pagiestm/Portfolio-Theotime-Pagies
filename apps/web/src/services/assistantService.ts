export type AssistantSource = { title: string; path: string };
export type AssistantAnswer = { answer: string; sources: AssistantSource[] };

/**
 * Ce qui a empêché la réponse, du point de vue du visiteur. Chaque cas appelle
 * une conduite différente : patienter une heure, revenir demain, reformuler ou
 * vérifier sa connexion. Un message unique les confondrait tous.
 */
export type AssistantErrorCode = 'rateLimited' | 'quota' | 'invalid' | 'network' | 'unavailable';

export class AssistantError extends Error {
  readonly code: AssistantErrorCode;

  constructor(code: AssistantErrorCode) {
    super(code);
    this.code = code;
  }
}

const ENDPOINT = '/api/ask';

/** Le code que l'API renvoie dans `{ error }`, traduit en cause lisible. */
const CODES: Record<string, AssistantErrorCode> = {
  rate_limited: 'rateLimited',
  quota_exhausted: 'quota',
  invalid: 'invalid',
};

/**
 * Pose une question à la fonction serveur `api/ask.ts`. Le composant ne
 * connaît ni le modèle ni la clé : il reçoit un texte et des sources, ou une
 * `AssistantError` dont le code dit quoi afficher.
 */
export const askAssistant = async (question: string, lang: string): Promise<AssistantAnswer> => {
  let res: Response;
  try {
    res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ question, lang }),
    });
  } catch {
    // `fetch` ne rejette que si la requête n'est pas partie : hors ligne,
    // serveur injoignable. Le visiteur peut agir là-dessus, contrairement au
    // reste.
    throw new AssistantError('network');
  }

  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { error?: string } | null;
    throw new AssistantError(CODES[body?.error ?? ''] ?? 'unavailable');
  }
  return res.json();
};
