import type { Env } from '../config/env.ts';
import { UpstreamError } from '../models/errors.model.ts';

const TIMEOUT_MS = 20_000;
const MAX_OUTPUT_TOKENS = 2048;

type GenerateResponse = {
  candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
};

/**
 * Appel direct à l'API REST de Gemini, sans SDK : une seule requête, un seul
 * format de réponse, rien à maintenir. Le budget de sortie inclut les jetons
 * de réflexion du modèle, d'où une marge large pour une réponse courte.
 */
export const generate = async (env: Env, system: string, user: string): Promise<string> => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${env.geminiModel}:generateContent`,
      {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-goog-api-key': env.geminiApiKey },
        signal: controller.signal,
        body: JSON.stringify({
          system_instruction: { parts: [{ text: system }] },
          contents: [{ role: 'user', parts: [{ text: user }] }],
          generationConfig: { temperature: 0.2, maxOutputTokens: MAX_OUTPUT_TOKENS },
        }),
      }
    );
    if (!res.ok) throw new UpstreamError(`Gemini ${res.status}`);
    const data = (await res.json()) as GenerateResponse;
    const text = data.candidates?.[0]?.content?.parts
      ?.map((p) => p.text ?? '')
      .join('')
      .trim();
    if (!text) throw new UpstreamError('Gemini : réponse vide');
    return text;
  } finally {
    clearTimeout(timer);
  }
};
