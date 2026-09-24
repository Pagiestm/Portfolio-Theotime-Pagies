import type { Context } from 'hono';
import { parseContactRequest } from '../models/contact.model.ts';
import { ValidationError } from '../models/errors.model.ts';
import * as contact from '../services/contact.service.ts';

export const send = async (c: Context) => {
  const body = await c.req.json().catch(() => {
    throw new ValidationError('corps JSON attendu');
  });
  const request = parseContactRequest(body);

  if (request.automated) {
    console.warn('[api] contact écarté', { de: request.email, mots: request.message.length });
  } else {
    await contact.send(request);
  }

  c.header('cache-control', 'no-store');
  return c.json({ sent: true });
};
