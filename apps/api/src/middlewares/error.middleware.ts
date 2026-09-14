import type { Context } from 'hono';
import { HttpError } from '../models/errors.model.ts';

/**
 * Toute erreur ressort en JSON `{ error: code }` avec son statut. Le détail
 * part dans les journaux serveur, jamais vers le client : un message d'API
 * amont ou une variable manquante ne regardent pas le visiteur.
 */
export const errorHandler = (error: Error, c: Context) => {
  if (error instanceof HttpError) {
    if (error.status >= 500) console.error('[api]', error.code, error.message);
    return c.json({ error: error.code }, error.status as 400 | 429 | 500 | 502 | 503);
  }
  console.error('[api]', error);
  return c.json({ error: 'internal' }, 500);
};

export const notFoundHandler = (c: Context) => c.json({ error: 'not_found' }, 404);
