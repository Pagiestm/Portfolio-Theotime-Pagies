import { getRequestListener } from '@hono/node-server';
import { Hono } from 'hono';
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

/**
 * Le runtime Node de Vercel appelle une exportation par défaut avec le couple
 * `(req, res)` de Node, pas avec une `Request` Web : l'adaptateur `hono/vercel`
 * attendait la seconde, la requête n'était jamais lue et la fonction expirait.
 * Le listener de `@hono/node-server` fait la conversion dans les deux sens.
 */
export const handler = getRequestListener(app.fetch);
