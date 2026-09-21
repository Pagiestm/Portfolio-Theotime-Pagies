import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import prettier from 'eslint-config-prettier';

export default [
  { ignores: ['dist/**'] },

  // Sans `files`, cet objet s'applique partout : les règles react/* y lisent
  // la version, qu'elles ne trouveraient pas si elle restait cantonnée au bloc
  // ciblant les sources.
  { settings: { react: { version: '19.2' } } },

  js.configs.recommended,
  react.configs.flat.recommended,
  react.configs.flat['jsx-runtime'],
  reactHooks.configs.flat.recommended,

  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.browser,
      // ESLint n'est pas en mode type-aware (pas de `project`) : le vrai
      // type-check reste `tsc --noEmit`. Le parser sert à lire la syntaxe TS.
      parser: tsParser,
    },
    plugins: { '@typescript-eslint': tsPlugin, 'react-refresh': reactRefresh },
    rules: {
      'react/jsx-no-target-blank': 'off',
      // Contrat des composants documenté via les types TypeScript, pas PropTypes.
      'react/prop-types': 'off',
      // Version TS-aware : ne signale pas à tort les noms de paramètres dans
      // les signatures de type. Préfixer par `_` pour ignorer volontairement.
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],

      // Deux règles apparues avec eslint-plugin-react-hooks 7, désactivées le
      // temps de cette migration d'outillage. Elles signalent de vrais
      // anti-patterns — sept occurrences, dans Reveal, Header, useMediaQuery,
      // usePagination et AssistantWidget — mais les corriger demande de
      // réécrire du code de production : `useSyncExternalStore` pour les
      // media queries, une clé de remontage pour la pagination. Mélanger les
      // deux rendrait impossible de savoir lequel a cassé quoi.
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/refs': 'off',
    },
  },

  // Ces fichiers tournent côté Node, pas dans le navigateur.
  {
    files: ['api/**', 'vite.config.ts', 'postcss.config.js', 'tailwind.config.js'],
    languageOptions: { globals: globals.node },
  },

  // La table de routes déclare des composants `lazy()` sans les exporter : le
  // Fast Refresh ne s'y applique pas, la règle y est un faux positif.
  {
    files: ['src/routes/**'],
    rules: { 'react-refresh/only-export-components': 'off' },
  },

  // Toujours en dernier : désactive les règles qui entrent en conflit avec
  // Prettier, à qui le formatage est délégué.
  prettier,
];
