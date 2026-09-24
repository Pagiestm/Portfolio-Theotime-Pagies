import { Hono } from 'hono';
import * as contactController from '../controllers/contact.controller.ts';
import { rateLimit } from '../middlewares/rate-limit.middleware.ts';

export const contactRoutes = new Hono().post(
  '/',
  rateLimit({ max: 5, windowMs: 60 * 60 * 1000 }),
  contactController.send
);
