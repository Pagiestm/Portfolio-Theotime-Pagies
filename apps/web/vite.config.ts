import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],

  resolve: {
    /**
     * Monorepo : le Studio exige React 19, que npm hisse à la racine de
     * `node_modules` ; le React 18 de ce site est imbriqué ici. Sans `dedupe`,
     * une dépendance hissée (`react-router-dom`, `@portabletext/react`)
     * importerait le React racine et le bundle embarquerait deux copies — les
     * hooks échoueraient au premier rendu. Toute importation de `react` est
     * donc forcée vers la copie de ce site.
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
   * JavaScript, donc public. Ces deux-là sont sans risque — l'identifiant de
   * projet et le nom du dataset apparaissent de toute façon dans les requêtes
   * que le navigateur envoie à l'API.
   */
  envPrefix: ['VITE_', 'SANITY_PROJECT_ID', 'SANITY_DATASET'],
});
