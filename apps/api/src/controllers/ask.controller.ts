import type { Context } from 'hono';
import { parseAskRequest } from '../models/ask.model.ts';
import { ValidationError } from '../models/errors.model.ts';
import * as assistant from '../services/assistant.service.ts';

/** Reçoit la question, la valide, délègue au service, renvoie la réponse. */
export const ask = async (c: Context) => {
  const body = await c.req.json().catch(() => {
    throw new ValidationError('corps JSON attendu');
  });
  const request = parseAskRequest(body);
  const response = await assistant.answer(request);
  c.header('cache-control', 'no-store');
  return c.json(response);
};
