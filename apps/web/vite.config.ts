import { fileURLToPath } from 'node:url';
import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { prerender } from './vite.prerender.ts';

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
    dedupe: ['react', 'react-dom'],
  },

  envPrefix: ['VITE_', 'SANITY_PROJECT_ID', 'SANITY_DATASET'],
});
