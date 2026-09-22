import { fileURLToPath } from 'node:url';
import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { prerender } from './vite.prerender';

/**
 * Sert l'API pendant `npm run dev`, exactement comme Vercel le fait en
 * production, sans outil supplémentaire : toute requête `/api/*` est remise à
 * l'application Hono de `@portfolio/api`, chargée depuis sa source pour
 * profiter du rechargement. Les variables du `.env` sont injectées dans
 * `process.env`, là où l'API les lit.
 */
const API_ENTRY = `/@fs/${fileURLToPath(new URL('../api/src/index.ts', import.meta.url)).replace(/\\/g, '/')}`;

const apiDev = (): Plugin => ({
  name: 'api-dev',
  configureServer(server) {
    const env = loadEnv(server.config.mode, server.config.root, '');
    for (const [k, v] of Object.entries(env)) process.env[k] ??= v;

    server.middlewares.use('/api', async (req, res) => {
      const chunks: Buffer[] = [];
      for await (const chunk of req) chunks.push(chunk as Buffer);
      const request = new Request(`http://localhost/api${req.url ?? '/'}`, {
        method: req.method,
        headers: req.headers as Record<string, string>,
        body: chunks.length ? Buffer.concat(chunks) : undefined,
      });
      const { app } = await server.ssrLoadModule(API_ENTRY);
      const response: Response = await app.fetch(request);
      res.statusCode = response.status;
      response.headers.forEach((value, key) => res.setHeader(key, value));
      res.end(Buffer.from(await response.arrayBuffer()));
    });
  },
});

export default defineConfig({
  plugins: [react(), apiDev(), prerender()],

  resolve: {
    /**
     * Monorepo : chaque workspace déclare son React, et npm est libre d'en
     * hisser une copie à la racine de `node_modules` et d'en imbriquer une
     * autre. Sans `dedupe`, une dépendance hissée (`react-router-dom`,
     * `@portabletext/react`) importerait la copie racine et le bundle en
     * embarquerait deux - deux React ne partagent pas leur état interne, les
     * hooks échoueraient au premier rendu. Toute importation de `react` est
     * donc forcée vers la copie de ce site. Le site et le Studio sont
     * aujourd'hui tous deux en React 19, mais rien ne garantit qu'ils le
     * resteront : ne pas retirer cette ligne.
     */
    dedupe: ['react', 'react-dom'],
  },

  /**
   * Vite n'expose au code client que les variables préfixées `VITE_`. Les deux
   * variables Sanity sont nommées sans ce préfixe, elles sont donc déclarées
   * ici pour être exposées malgré tout.
   *
   * Ce sont les noms complets, pas un préfixe `SANITY_` : un jeton d'écriture
   * nommé `SANITY_WRITE_TOKEN` se retrouverait sinon embarqué dans le bundle
   * JavaScript, donc public. Ces deux-là sont sans risque - l'identifiant de
   * projet et le nom du dataset apparaissent de toute façon dans les requêtes
   * que le navigateur envoie à l'API. `GEMINI_API_KEY` ne doit jamais figurer
   * ici : seule `apps/api` la lit, côté serveur.
   */
  envPrefix: ['VITE_', 'SANITY_PROJECT_ID', 'SANITY_DATASET'],
});
