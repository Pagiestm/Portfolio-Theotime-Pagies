import { Hono } from 'hono';
import * as askController from '../controllers/ask.controller.ts';
import { rateLimit } from '../middlewares/rate-limit.middleware.ts';

export const askRoutes = new Hono().post(
  '/',
  rateLimit({ max: 20, windowMs: 60 * 60 * 1000 }),
  askController.ask
);
