import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import prettier from 'eslint-config-prettier';

export default [
  { ignores: ['**/dist/**', '**/.turbo/**', '**/.sanity/**'] },

  { settings: { react: { version: '19.2' } } },

  js.configs.recommended,
  {
    rules: { 'no-empty': ['error', { allowEmptyCatch: true }] },
  },

  {
    files: ['**/*.{js,jsx,mjs,cjs,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: tsParser,
    },
    plugins: { '@typescript-eslint': tsPlugin },
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },

  {
    files: ['**/*.{ts,tsx}'],
    rules: { 'no-undef': 'off' },
  },

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

      'react/prop-types': 'off',
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
  },

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

  {
    files: ['**/*.cjs'],
    languageOptions: { sourceType: 'commonjs', globals: globals.node },
  },

  {
    files: ['apps/web/src/routes/**'],
    rules: { 'react-refresh/only-export-components': 'off' },
  },

  prettier,
];
