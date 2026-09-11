import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],

  resolve: {
    /**
     * Monorepo : chaque workspace déclare son React, et npm est libre d'en
     * hisser une copie à la racine de `node_modules` et d'en imbriquer une
     * autre. Sans `dedupe`, une dépendance hissée (`react-router-dom`,
     * `@portabletext/react`) importerait la copie racine et le bundle en
     * embarquerait deux — deux React ne partagent pas leur état interne, les
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
   * JavaScript, donc public. Ces deux-là sont sans risque — l'identifiant de
   * projet et le nom du dataset apparaissent de toute façon dans les requêtes
   * que le navigateur envoie à l'API.
   */
  envPrefix: ['VITE_', 'SANITY_PROJECT_ID', 'SANITY_DATASET'],
});
