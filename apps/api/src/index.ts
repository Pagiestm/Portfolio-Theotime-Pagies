import { Hono } from 'hono';
import { handle } from 'hono/vercel';
import { errorHandler, notFoundHandler } from './middlewares/error.middleware.ts';
import { registerRoutes } from './routes/index.ts';

/**
 * Point d'entrée de l'API. L'application Hono est assemblée ici et exportée
 * sous deux formes : `app` pour le serveur Vite et les tests, `handler` pour
 * la fonction Vercel du site. Aucune logique métier dans ce fichier.
 */
export const app = new Hono().basePath('/api');

app.onError(errorHandler);
app.notFound(notFoundHandler);
registerRoutes(app);

export const handler = handle(app);
