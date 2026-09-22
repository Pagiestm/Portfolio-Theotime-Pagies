import { QuotaExhaustedError, UpstreamError } from '../models/errors.model.ts';
import type { Candidate, Provider } from '../models/llm.model.ts';

const ATTEMPT_TIMEOUT_MS = 12_000;

const TOTAL_BUDGET_MS = 24_000;

const MIN_ATTEMPT_MS = 2_000;

const COOLDOWN_MINUTE_MS = 60_000;
const COOLDOWN_DAY_MS = 60 * 60_000;
const COOLDOWN_UNKNOWN_MS = 5 * 60_000;
const MAX_OUTPUT_TOKENS = 2048;
const TEMPERATURE = 0.2;

const exhaustedUntil = new Map<string, number>();

type Adapter = {
  url: (c: Candidate) => string;
  headers: (c: Candidate) => Record<string, string>;
  body: (c: Candidate, system: string, user: string) => unknown;
  extract: (data: unknown) => string;
};

type GoogleResponse = {
  candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
};
type OpenAiResponse = { choices?: Array<{ message?: { content?: string } }> };

const joinParts = (data: unknown) =>
  ((data as GoogleResponse).candidates?.[0]?.content?.parts ?? [])
    .map((p) => p.text ?? '')
    .join('')
    .trim();

const ADAPTERS: Record<Provider, Adapter> = {
  google: {
    url: (c) =>
      `https://generativelanguage.googleapis.com/v1beta/models/${c.model}:generateContent`,
    headers: (c) => ({ 'content-type': 'application/json', 'x-goog-api-key': c.apiKey }),
    body: (_c, system, user) => ({
      system_instruction: { parts: [{ text: system }] },
      contents: [{ role: 'user', parts: [{ text: user }] }],
      generationConfig: { temperature: TEMPERATURE, maxOutputTokens: MAX_OUTPUT_TOKENS },
    }),
    extract: joinParts,
  },
  openai: {
    url: (c) => `${(c.baseUrl ?? '').replace(/\/$/, '')}/chat/completions`,
    headers: (c) => ({ 'content-type': 'application/json', authorization: `Bearer ${c.apiKey}` }),
    body: (c, system, user) => ({
      model: c.model,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
      temperature: TEMPERATURE,
      max_tokens: MAX_OUTPUT_TOKENS,
    }),
    extract: (data) => ((data as OpenAiResponse).choices?.[0]?.message?.content ?? '').trim(),
  },
};

type Verdict = 'quota' | 'transient' | 'fatal';

const verdictOf = (status: number): Verdict => {
  if (status === 429) return 'quota';
  if (status >= 500) return 'transient';
  return 'fatal';
};

export const cooldownFor = (retryAfter: string | null, detail: string): number => {
  const seconds = Number(retryAfter);
  if (Number.isFinite(seconds) && seconds > 0) return seconds * 1_000 + 1_000;

  const delay = /"retryDelay"\s*:\s*"(\d+(?:\.\d+)?)s"/.exec(detail);
  if (delay?.[1]) return Math.ceil(Number(delay[1]) * 1_000) + 1_000;

  if (/per\s*-?\s*day/i.test(detail)) return COOLDOWN_DAY_MS;
  if (/per\s*-?\s*minute/i.test(detail)) return COOLDOWN_MINUTE_MS;
  return COOLDOWN_UNKNOWN_MS;
};

const askOne = async (
  candidate: Candidate,
  system: string,
  user: string,
  timeoutMs: number
): Promise<string> => {
  const adapter = ADAPTERS[candidate.provider];
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(adapter.url(candidate), {
      method: 'POST',
      headers: adapter.headers(candidate),
      signal: controller.signal,
      body: JSON.stringify(adapter.body(candidate, system, user)),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => '');
      const error = new UpstreamError(`${candidate.id} → ${res.status} ${detail.slice(0, 300)}`);
      if (verdictOf(res.status) === 'quota') {
        const cooldown = cooldownFor(res.headers.get('retry-after'), detail);
        exhaustedUntil.set(candidate.id, Date.now() + cooldown);
        console.warn(
          '[api] quota atteint',
          candidate.id,
          `écarté ${Math.round(cooldown / 1000)} s`,
          detail.slice(0, 300)
        );
      }
      throw Object.assign(error, { verdict: verdictOf(res.status) });
    }

    const text = adapter.extract(await res.json());
    if (!text)
      throw Object.assign(new UpstreamError(`${candidate.id} : réponse vide`), {
        verdict: 'transient' as Verdict,
      });
    return text;
  } finally {
    clearTimeout(timer);
  }
};

export const generate = async (
  candidates: Candidate[],
  system: string,
  user: string
): Promise<string> => {
  const deadline = Date.now() + TOTAL_BUDGET_MS;
  const now = Date.now();
  const fresh = candidates.filter((c) => (exhaustedUntil.get(c.id) ?? 0) <= now);
  const order = fresh.length
    ? [...fresh, ...candidates.filter((c) => !fresh.includes(c))]
    : candidates;

  let last: unknown;
  let tried = 0;
  let refusedForQuota = 0;
  let skippedForTime = 0;
  for (const candidate of order) {
    const remaining = deadline - Date.now();

    if (remaining < MIN_ATTEMPT_MS) {
      skippedForTime += 1;
      continue;
    }
    tried += 1;
    try {
      return await askOne(candidate, system, user, Math.min(ATTEMPT_TIMEOUT_MS, remaining));
    } catch (error) {
      last = error;
      const verdict = (error as { verdict?: Verdict }).verdict;

      if (verdict === 'fatal') throw error;
      if (verdict === 'quota') refusedForQuota += 1;
      console.warn('[api] bascule après', candidate.id, (error as Error).message);
    }
  }

  if (skippedForTime) {
    console.warn('[api] budget écoulé,', skippedForTime, 'modèle(s) non tentés');
  }

  if (tried > 0 && refusedForQuota === tried && !skippedForTime) {
    throw new QuotaExhaustedError(`quota épuisé sur les ${tried} modèles configurés`);
  }

  throw last instanceof Error ? last : new UpstreamError('aucun modèle disponible');
};

export const resetModelState = () => exhaustedUntil.clear();
