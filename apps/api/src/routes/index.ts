import type { Hono } from 'hono';
import { askRoutes } from './ask.routes.ts';

/** Une ligne par ressource : c'est ici qu'on lit ce que l'API expose. */
export const registerRoutes = (app: Hono) => {
  app.route('/ask', askRoutes);
};
