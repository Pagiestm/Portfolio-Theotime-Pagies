import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { afterEach, beforeEach, describe, it } from 'node:test';
import { ConfigError, QuotaExhaustedError, UpstreamError } from '../src/models/errors.model.ts';
import { parseCandidates } from '../src/models/llm.model.ts';
import { cooldownFor, generate, resetModelState } from '../src/services/llm.service.ts';

const realFetch = globalThis.fetch;

const fakeUpstream = (replies: Array<Response | (() => Response)>) => {
  const visited: string[] = [];
  let i = 0;
  globalThis.fetch = (async (input: string | URL | Request) => {
    visited.push(String(input));
    const reply = replies[Math.min(i++, replies.length - 1)];
    return typeof reply === 'function' ? reply() : reply;
  }) as typeof fetch;
  return visited;
};

const googleText = (text: string) =>
  Response.json({ candidates: [{ content: { parts: [{ text }] } }] });
const openAiText = (text: string) => Response.json({ choices: [{ message: { content: text } }] });
const quota = () => new Response('{"error":{"message":"quota exceeded"}}', { status: 429 });

const two = [
  { provider: 'google' as const, model: 'a', apiKey: 'k', id: 'google:a' },
  { provider: 'google' as const, model: 'b', apiKey: 'k', id: 'google:b' },
];

describe('parseCandidates', () => {
  it('refuse de démarrer sans LLM_MODELS : aucun modèle n est écrit dans le code', () => {
    assert.throws(() => parseCandidates(undefined, { GEMINI_API_KEY: 'k' }), ConfigError);
    assert.throws(() => parseCandidates('   ', { GEMINI_API_KEY: 'k' }), ConfigError);
  });

  it('lit une liste explicite, dans l ordre donné', () => {
    const c = parseCandidates('google:flash, openai:mistral-free', {
      GEMINI_API_KEY: 'k',
      LLM_API_KEY: 'o',
      LLM_BASE_URL: 'https://exemple.test/v1',
    });
    assert.deepEqual(
      c.map((x) => x.id),
      ['google:flash', 'openai:mistral-free']
    );
  });

  it('écarte un modèle dont la clé manque plutôt que de tout faire échouer', () => {
    const c = parseCandidates('google:flash,openai:secours', { GEMINI_API_KEY: 'k' });
    assert.deepEqual(
      c.map((x) => x.id),
      ['google:flash']
    );
  });

  it('refuse de démarrer quand aucun modèle n est utilisable', () => {
    assert.throws(() => parseCandidates('google:flash', {}), ConfigError);
  });

  it('écarte un fournisseur au format OpenAI qui ne dit pas où il vit', () => {
    assert.throws(() => parseCandidates('openai:x/y:free', { LLM_API_KEY: 'o' }), ConfigError);
  });
});

describe('cooldownFor', () => {
  it('suit le Retry-After du fournisseur quand il est donné', () => {
    assert.equal(cooldownFor('30', ''), 31_000);
  });

  it('lit le retryDelay que Google place dans son corps d erreur', () => {
    const corps = '{"error":{"details":[{"@type":"...RetryInfo","retryDelay":"44s"}]}}';
    assert.equal(cooldownFor(null, corps), 45_000);
  });

  it('écarte une minute pour une limite par minute, une heure pour une limite par jour', () => {
    const minute = cooldownFor(null, '{"quotaId":"GenerateRequestsPerMinutePerProjectPerModel"}');
    const jour = cooldownFor(null, '{"quotaId":"GenerateRequestsPerDayPerProjectPerModel"}');
    assert.equal(minute, 60_000);
    assert.ok(jour > minute * 10, 'une limite journalière ne se rouvre pas en une minute');
  });

  it('reste prudent quand le fournisseur ne dit rien', () => {
    const inconnu = cooldownFor(null, 'quota exceeded');
    assert.ok(inconnu > 60_000 && inconnu < 60 * 60_000);
  });
});

describe('generate', () => {
  beforeEach(() => resetModelState());
  afterEach(() => {
    globalThis.fetch = realFetch;
    resetModelState();
  });

  it('bascule sur le modèle suivant quand le quota est atteint', async () => {
    const visited = fakeUpstream([quota(), googleText('réponse du second')]);
    assert.equal(await generate(two, 'sys', 'user'), 'réponse du second');
    assert.equal(visited.length, 2);
    assert.ok(visited[0]?.includes('/models/a:'));
    assert.ok(visited[1]?.includes('/models/b:'));
  });

  it('ne brûle pas la liste sur une erreur qui se répéterait à l identique', async () => {
    const visited = fakeUpstream([new Response('clé invalide', { status: 401 })]);
    await assert.rejects(() => generate(two, 'sys', 'user'), UpstreamError);
    assert.equal(visited.length, 1);
  });

  it('se souvient du modèle épuisé et commence par le suivant', async () => {
    fakeUpstream([quota(), googleText('second')]);
    await generate(two, 'sys', 'user');

    const visited = fakeUpstream([googleText('encore le second')]);
    assert.equal(await generate(two, 'sys', 'user'), 'encore le second');
    assert.equal(visited.length, 1, 'le modèle épuisé ne doit plus être tenté en premier');
    assert.ok(visited[0]?.includes('/models/b:'));
  });

  it('retente malgré tout un modèle épuisé quand il ne reste que lui', async () => {
    const seul = two.slice(0, 1);
    fakeUpstream([quota(), googleText('rouvert')]);
    await assert.rejects(() => generate(seul, 'sys', 'user'));
    assert.equal(await generate(seul, 'sys', 'user'), 'rouvert');
  });

  it('distingue le quota épuisé de la panne, pour que le visiteur sache quoi faire', async () => {
    fakeUpstream([quota(), quota()]);
    await assert.rejects(() => generate(two, 'sys', 'user'), QuotaExhaustedError);
  });

  it('reste une panne tant qu un modèle a échoué pour une autre raison', async () => {
    fakeUpstream([quota(), new Response('en rade', { status: 503 })]);
    const error = await generate(two, 'sys', 'user').catch((e) => e);
    assert.ok(error instanceof UpstreamError);
    assert.ok(!(error instanceof QuotaExhaustedError));
  });

  it('reste sous le plafond de la fonction Vercel', async () => {
    const vercel = JSON.parse(
      readFileSync(new URL('../../web/vercel.json', import.meta.url), 'utf8')
    );
    const maxDuration = vercel.functions['api/**/*.ts'].maxDuration * 1000;
    const source = readFileSync(new URL('../src/services/llm.service.ts', import.meta.url), 'utf8');
    const budget = Number(/TOTAL_BUDGET_MS = ([\d_]+)/.exec(source)![1]!.replace(/_/g, ''));
    assert.ok(
      budget < maxDuration,
      `le budget (${budget} ms) doit rester sous maxDuration (${maxDuration} ms), sinon Vercel coupe la fonction avant que l API ne réponde`
    );
  });

  it('parle le format OpenAI quand le fournisseur l attend', async () => {
    const bodies: string[] = [];
    globalThis.fetch = (async (_input: unknown, init?: RequestInit) => {
      bodies.push(String(init?.body));
      return openAiText('réponse compatible');
    }) as typeof fetch;

    const text = await generate(
      [
        {
          provider: 'openai',
          model: 'x/y:free',
          apiKey: 'k',
          baseUrl: 'https://exemple.test/v1',
          id: 'openai:x/y:free',
        },
      ],
      'sys',
      'user'
    );
    assert.equal(text, 'réponse compatible');
    const sent = JSON.parse(bodies[0] ?? '{}');
    assert.equal(sent.model, 'x/y:free');
    assert.deepEqual(
      sent.messages.map((m: { role: string }) => m.role),
      ['system', 'user']
    );
  });
});
