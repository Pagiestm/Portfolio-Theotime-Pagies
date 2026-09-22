import type { Hono } from 'hono';
import { askRoutes } from './ask.routes.ts';

export const registerRoutes = (app: Hono) => {
  app.route('/ask', askRoutes);
};
