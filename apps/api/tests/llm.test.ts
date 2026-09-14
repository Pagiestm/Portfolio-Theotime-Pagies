import assert from 'node:assert/strict';
import { afterEach, beforeEach, describe, it } from 'node:test';
import { ConfigError, QuotaExhaustedError, UpstreamError } from '../src/models/errors.model.ts';
import { parseCandidates } from '../src/models/llm.model.ts';
import { generate, resetModelState } from '../src/services/llm.service.ts';

const realFetch = globalThis.fetch;

/** Déroule une suite de réponses, une par appel, et note les URL visitées. */
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
