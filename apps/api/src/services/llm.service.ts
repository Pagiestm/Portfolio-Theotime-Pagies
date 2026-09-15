import { QuotaExhaustedError, UpstreamError } from '../models/errors.model.ts';
import type { Candidate, Provider } from '../models/llm.model.ts';

const ATTEMPT_TIMEOUT_MS = 12_000;
/**
 * `maxDuration` vaut 30 s dans `apps/web/vercel.json` : au-delà, la plateforme
 * tue la fonction et le visiteur reçoit une erreur brute, sans même notre JSON.
 * On garde quatre secondes pour le chargement du corpus et la réponse, et on
 * s'arrête de nous-mêmes avant que Vercel ne le fasse.
 */
const TOTAL_BUDGET_MS = 24_000;
/** En deçà, tenter un modèle de plus n'a plus le temps d'aboutir. */
const MIN_ATTEMPT_MS = 2_000;

/**
 * Combien de temps mettre un modèle de côté. Une limite par minute se rouvre
 * presque aussitôt : l'écarter dix minutes gaspillerait des centaines de
 * requêtes encore disponibles. Une limite journalière, elle, ne se rouvrira
 * pas dans la foulée.
 */
const COOLDOWN_MINUTE_MS = 60_000;
const COOLDOWN_DAY_MS = 60 * 60_000;
const COOLDOWN_UNKNOWN_MS = 5 * 60_000;
const MAX_OUTPUT_TOKENS = 2048;
const TEMPERATURE = 0.2;

/**
 * Modèles à laisser tranquilles jusqu'à la date notée, parce qu'ils ont
 * répondu 429. La mémoire d'une instance serverless est courte et non
 * partagée : c'est un pense-bête qui évite de regaspiller une requête à chaque
 * appel, pas une comptabilité de quota.
 */
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

/**
 * Un adaptateur par dialecte. `openai` n'est pas un fournisseur mais un format,
 * celui que parlent OpenRouter, Groq, Mistral et OpenAI : ajouter l'un d'eux ne
 * demande qu'une entrée dans `LLM_MODELS` et une URL de base.
 */
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
    // `baseUrl` est garanti présent : un candidat `openai` sans lui est écarté
    // à la lecture de la configuration, pour ne pas appeler un hôte au hasard.
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

/** Ce qu'on fait d'un échec : passer au suivant, ou arrêter les frais. */
type Verdict = 'quota' | 'transient' | 'fatal';

const verdictOf = (status: number): Verdict => {
  if (status === 429) return 'quota';
  if (status >= 500) return 'transient';
  return 'fatal';
};

/**
 * Le fournisseur dit souvent lui-même quand revenir : l'en-tête HTTP standard
 * `Retry-After`, ou le `retryDelay` que Google glisse dans son corps d'erreur.
 * À défaut, l'intitulé du quota distingue la limite par minute de la limite
 * par jour. On ne devine que si tout cela manque.
 */
export const cooldownFor = (retryAfter: string | null, detail: string): number => {
  const seconds = Number(retryAfter);
  if (Number.isFinite(seconds) && seconds > 0) return seconds * 1_000 + 1_000;

  const delay = /"retryDelay"\s*:\s*"(\d+(?:\.\d+)?)s"/.exec(detail);
  if (delay?.[1]) return Math.ceil(Number(delay[1]) * 1_000) + 1_000;

  if (/per\s*-?\s*day/i.test(detail)) return COOLDOWN_DAY_MS;
  if (/per\s*-?\s*minute/i.test(detail)) return COOLDOWN_MINUTE_MS;
  return COOLDOWN_UNKNOWN_MS;
};

/**
 * Une requête mal formée ou une clé invalide se répéterait à l'identique chez
 * le modèle suivant : inutile de brûler la liste pour rien. Seuls un quota
 * épuisé et une panne passagère justifient de basculer.
 */
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
      // Le corps dit *quelle* limite est atteinte — par minute, par jour, en
      // jetons. L'information ne vaut que dans les journaux : le visiteur n'a
      // pas à connaître la plomberie.
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

/**
 * Interroge les modèles dans l'ordre donné et renvoie la première réponse
 * obtenue. Les modèles connus comme épuisés sont sautés d'emblée, mais restent
 * disponibles en dernier recours : mieux vaut réessayer un quota peut-être
 * rouvert que de ne rien répondre au visiteur.
 */
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
    // Un modèle refusé pour quota répond en quelques dizaines de millisecondes :
    // enchaîner toute la liste coûte peu, et c'est ce qui évite de rendre une
    // erreur alors qu'un modèle suivant aurait répondu. On ne renonce qu'à
    // l'approche du plafond de la fonction.
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
      // Une erreur de notre côté ne s'arrangera pas ailleurs.
      if (verdict === 'fatal') throw error;
      if (verdict === 'quota') refusedForQuota += 1;
      console.warn('[api] bascule après', candidate.id, (error as Error).message);
    }
  }

  if (skippedForTime) {
    console.warn('[api] budget écoulé,', skippedForTime, 'modèle(s) non tentés');
  }

  // Séparer la limite de la panne : l'une ne se rouvrira que demain et le
  // visiteur doit l'entendre, l'autre justifie de réessayer tout de suite.
  // La distinction n'est honnête que si toute la liste a été parcourue : un
  // modèle laissé de côté faute de temps aurait peut-être répondu.
  if (tried > 0 && refusedForQuota === tried && !skippedForTime) {
    throw new QuotaExhaustedError(`quota épuisé sur les ${tried} modèles configurés`);
  }

  throw last instanceof Error ? last : new UpstreamError('aucun modèle disponible');
};

/** Pour les tests : repart d'un registre vierge. */
export const resetModelState = () => exhaustedUntil.clear();
