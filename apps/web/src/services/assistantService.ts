export type AssistantSource = { title: string; path: string };
export type AssistantAnswer = { answer: string; sources: AssistantSource[] };

const ENDPOINT = '/api/ask';

/**
 * Pose une question à la fonction serveur `api/ask.ts`. Le composant ne
 * connaît ni le modèle ni la clé : il reçoit un texte et des sources.
 * Rejette avec `RATE_LIMITED` ou `ASSISTANT_FAILED`, que l'appelant traduit.
 */
export const askAssistant = async (question: string, lang: string): Promise<AssistantAnswer> => {
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ question, lang }),
  });
  if (res.status === 429) throw new Error('RATE_LIMITED');
  if (!res.ok) throw new Error('ASSISTANT_FAILED');
  return res.json();
};
