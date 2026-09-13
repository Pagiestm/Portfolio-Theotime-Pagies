import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { after, before, describe, it } from 'node:test';
import { handler } from '../src/index.ts';

/**
 * Le handler exporté pour Vercel doit accepter le couple `(req, res)` de Node,
 * comme le fait le runtime : on le monte dans un vrai serveur HTTP.
 */
describe('handler Node', () => {
  const server = createServer(handler);
  let base = '';

  before(async () => {
    await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
    const address = server.address();
    if (!address || typeof address === 'string') throw new Error('adresse inattendue');
    base = `http://127.0.0.1:${address.port}`;
  });
  after(() => server.close());

  it('répond sur une route inconnue sans expirer', async () => {
    const res = await fetch(`${base}/api/nope`);
    assert.equal(res.status, 404);
    assert.deepEqual(await res.json(), { error: 'not_found' });
  });

  it('lit le corps de la requête', async () => {
    const res = await fetch(`${base}/api/ask`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ lang: 'fr' }),
    });
    assert.equal(res.status, 400);
    assert.deepEqual(await res.json(), { error: 'invalid' });
  });
});
