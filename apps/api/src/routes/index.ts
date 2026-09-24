import type { Hono } from 'hono';
import { askRoutes } from './ask.routes.ts';
import { contactRoutes } from './contact.routes.ts';

export const registerRoutes = (app: Hono) => {
  app.route('/ask', askRoutes);
  app.route('/contact', contactRoutes);
};
