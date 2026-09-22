import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import prettier from 'eslint-config-prettier';

/**
 * Une seule configuration pour tout le dépôt : les quatre workspaces partagent
 * la même base et n'ajoutent que ce qui les distingue — React et le navigateur
 * pour le site et le Studio, Node pour l'API. Dupliquer un fichier par
 * application aurait garanti qu'ils divergent.
 */
export default [
  // `.sanity` est produit par le Studio, `dist` par les builds : rien à y relire.
  { ignores: ['**/dist/**', '**/.turbo/**', '**/.sanity/**'] },

  // Sans `files`, cet objet s'applique partout : les règles react/* y lisent la
  // version, qu'elles ne trouveraient pas si elle restait dans un bloc ciblé.
  { settings: { react: { version: '19.2' } } },

  js.configs.recommended,

  // Base commune : le parser TypeScript sert à lire la syntaxe, sans mode
  // type-aware — le vrai contrôle de types reste `tsc --noEmit`.
  {
    files: ['**/*.{js,jsx,mjs,cjs,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: tsParser,
    },
    plugins: { '@typescript-eslint': tsPlugin },
    rules: {
      // Version TS-aware : ne signale pas à tort les noms de paramètres dans
      // les signatures de type. Préfixer par `_` pour ignorer volontairement.
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },

  // TypeScript vérifie déjà l'existence des identifiants, et connaît les types
  // globaux que `no-undef` ignore — `NodeJS.ProcessEnv`, `RequestInit`. La règle
  // n'y produit que des faux positifs ; c'est la recommandation de
  // typescript-eslint.
  {
    files: ['**/*.{ts,tsx}'],
    rules: { 'no-undef': 'off' },
  },

  // Le site et le Studio rendent du React dans un navigateur.
  {
    ...react.configs.flat.recommended,
    files: ['apps/web/**/*.{js,jsx,ts,tsx}', 'apps/studio/**/*.{js,jsx,ts,tsx}'],
  },
  {
    ...react.configs.flat['jsx-runtime'],
    files: ['apps/web/**/*.{js,jsx,ts,tsx}', 'apps/studio/**/*.{js,jsx,ts,tsx}'],
  },
  {
    ...reactHooks.configs.flat.recommended,
    files: ['apps/web/**/*.{js,jsx,ts,tsx}', 'apps/studio/**/*.{js,jsx,ts,tsx}'],
  },
  {
    files: ['apps/web/**/*.{js,jsx,ts,tsx}', 'apps/studio/**/*.{js,jsx,ts,tsx}'],
    languageOptions: { globals: globals.browser },
    plugins: { 'react-refresh': reactRefresh },
    rules: {
      'react/jsx-no-target-blank': 'off',
      // Contrat des composants documenté via les types TypeScript, pas PropTypes.
      'react/prop-types': 'off',
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],

      // Deux règles apparues avec eslint-plugin-react-hooks 7, désactivées le
      // temps de traiter les sept occurrences qu'elles signalent : leur
      // correction demande de réécrire du code de production. Voir
      // docs/versions.md.
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/refs': 'off',
    },
  },

  // L'API et les scripts tournent sous Node, sans DOM ni React.
  {
    files: [
      'apps/api/**/*.{js,ts}',
      'apps/studio/**/*.{mjs,cjs}',
      'apps/studio/sanity.*.ts',
      '**/*.config.{js,mjs,ts}',
      'scripts/**',
      '**/scripts/**',
    ],
    languageOptions: { globals: globals.node },
  },

  // Les fichiers `.cjs` sont en CommonJS : `module` et `require` y existent,
  // ce que la lecture en module ES ne suppose pas.
  {
    files: ['**/*.cjs'],
    languageOptions: { sourceType: 'commonjs', globals: globals.node },
  },

  // La table de routes déclare des composants `lazy()` sans les exporter : le
  // Fast Refresh ne s'y applique pas, la règle y est un faux positif.
  {
    files: ['apps/web/src/routes/**'],
    rules: { 'react-refresh/only-export-components': 'off' },
  },

  // Toujours en dernier : désactive les règles qui entrent en conflit avec
  // Prettier, à qui le formatage est délégué.
  prettier,
];
