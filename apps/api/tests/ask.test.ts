import assert from 'node:assert/strict';
import { afterEach, beforeEach, describe, it } from 'node:test';
import { app } from '../src/index.ts';
import { resetCorpusCache } from '../src/services/content.service.ts';

const realFetch = globalThis.fetch;

const post = (body: unknown, ip = '203.0.113.1') =>
  app.request('/api/ask', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-forwarded-for': ip },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });

const fakeUpstreams = (geminiText: string) => {
  globalThis.fetch = (async (input: string | URL | Request) => {
    const url = String(input);
    if (url.includes('apicdn.sanity.io')) {
      return Response.json({
        result: {
          settings: { name: 'Théotime Pagies', role: { fr: 'Dev' } },
          projects: [
            {
              title: 'SolidHive',
              slug: 'solidhive',
              category: 'school',
              stack: ['Stripe'],
              summary: { fr: 'Dons.' },
              contentFr: '',
              endDate: '2026-05-01',
            },
          ],
        },
      });
    }
    if (url.includes('generativelanguage.googleapis.com')) {
      return Response.json({ candidates: [{ content: { parts: [{ text: geminiText }] } }] });
    }
    throw new Error(`fetch inattendu : ${url}`);
  }) as typeof fetch;
};

describe('POST /api/ask', () => {
  beforeEach(() => {
    process.env.SANITY_PROJECT_ID = 'test';
    process.env.GEMINI_API_KEY = 'test-key';
    resetCorpusCache();
  });
  afterEach(() => {
    globalThis.fetch = realFetch;
  });

  it('refuse un corps sans question', async () => {
    const res = await post({ lang: 'fr' });
    assert.equal(res.status, 400);
    assert.deepEqual(await res.json(), { error: 'invalid' });
  });

  it('refuse un corps qui n’est pas du JSON', async () => {
    const res = await post('pas du json');
    assert.equal(res.status, 400);
  });

  it('répond avec les sources citées par le modèle', async () => {
    fakeUpstreams('Oui, voir [SolidHive](/realisations/solidhive) et le [Parcours](/parcours).');
    const res = await post({ question: 'Stripe ?', lang: 'fr' });
    assert.equal(res.status, 200);
    assert.deepEqual(await res.json(), {
      answer: 'Oui, voir [SolidHive](/realisations/solidhive) et le [Parcours](/parcours).',
      sources: [
        { title: 'SolidHive', path: '/realisations/solidhive' },
        { title: 'Parcours', path: '/parcours' },
      ],
    });
  });

  it('traduit une panne du modèle en 502 sans fuite de détail', async () => {
    globalThis.fetch = (async (input: string | URL | Request) =>
      String(input).includes('sanity')
        ? Response.json({ result: { projects: [] } })
        : new Response('boom', { status: 500 })) as typeof fetch;
    const res = await post({ question: 'Bonjour ?', lang: 'fr' });
    assert.equal(res.status, 502);
    assert.deepEqual(await res.json(), { error: 'upstream' });
  });

  it('limite le nombre de questions par adresse', async () => {
    fakeUpstreams('ok');
    let last = 200;
    for (let i = 0; i < 21; i++) last = (await post({ question: 'q ?' }, '198.51.100.7')).status;
    assert.equal(last, 429);
  });

  it('renvoie 404 en JSON sur une route inconnue', async () => {
    const res = await app.request('/api/nope');
    assert.equal(res.status, 404);
    assert.deepEqual(await res.json(), { error: 'not_found' });
  });
});
