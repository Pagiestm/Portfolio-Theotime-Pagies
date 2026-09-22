import { getRequestListener } from '@hono/node-server';
import { Hono } from 'hono';
import { errorHandler, notFoundHandler } from './middlewares/error.middleware.ts';
import { registerRoutes } from './routes/index.ts';

export const app = new Hono().basePath('/api');

app.onError(errorHandler);
app.notFound(notFoundHandler);
registerRoutes(app);

export const handler = getRequestListener(app.fetch);
