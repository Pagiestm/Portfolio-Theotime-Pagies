module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
    // Toujours en dernier : désactive les règles ESLint qui entrent en conflit
    // avec Prettier (le formatage est délégué à Prettier).
    'prettier',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  // Parser TypeScript pour la syntaxe (interfaces, annotations, `as`).
  // Le plugin type-aware n'est pas chargé : son `ts-api-utils` est incompatible
  // avec le compilateur natif TypeScript 7. Le vrai type-check reste `tsc --noEmit`.
  parser: '@typescript-eslint/parser',
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: { react: { version: '18.2' } },
  plugins: ['react-refresh'],
  rules: {
    'react/jsx-no-target-blank': 'off',
    // Contrat des composants documenté via les types TypeScript, pas PropTypes.
    'react/prop-types': 'off',
    // Le core `no-unused-vars` n'est pas TS-aware : il signale à tort les noms de
    // paramètres dans les signatures de type (`(v: string) => void`). Le vrai
    // contrôle des variables inutilisées est délégué à `tsc --noEmit`.
    'no-unused-vars': 'off',
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
  },
  overrides: [
    {
      // La table de routes déclare des composants `lazy()` sans les exporter :
      // le Fast Refresh ne s'y applique pas, la règle y est un faux positif.
      files: ['src/routes/**'],
      rules: { 'react-refresh/only-export-components': 'off' },
    },
  ],
};
