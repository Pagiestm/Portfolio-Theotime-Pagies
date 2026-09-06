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
  // Le Studio Sanity est un paquet autonome : son propre toolchain (React 19,
  // contexte Node) et sa propre config. Le linter du site n'a rien a y dire.
  ignorePatterns: ['dist', '.eslintrc.cjs', 'studio'],
  // ESLint n'est pas configuré en mode type-aware (pas de `project`) : le vrai
  // type-check reste `tsc --noEmit`. Le parser sert à comprendre la syntaxe TS.
  parser: '@typescript-eslint/parser',
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: { react: { version: '18.2' } },
  plugins: ['react-refresh', '@typescript-eslint'],
  rules: {
    'react/jsx-no-target-blank': 'off',
    // Contrat des composants documenté via les types TypeScript, pas PropTypes.
    'react/prop-types': 'off',
    // Version TS-aware : ne signale pas à tort les noms de paramètres dans les
    // signatures de type. Préfixer par `_` pour ignorer volontairement.
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': [
      'warn',
      { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
    ],
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
