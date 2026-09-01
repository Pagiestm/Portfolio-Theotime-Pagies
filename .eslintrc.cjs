module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: { react: { version: '18.2' } },
  plugins: ['react-refresh'],
  rules: {
    'react/jsx-no-target-blank': 'off',
    // Projet en JavaScript pur, sans PropTypes : le contrat des composants est
    // documenté en JSDoc. Activer la règle imposerait un schéma par composant.
    'react/prop-types': 'off',
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
