const process = require('process');
const jestPlugin = require('eslint-plugin-jest');
const importPlugin = require('eslint-plugin-import');
const tseslint = require('typescript-eslint');
const { FlatCompat } = require('@eslint/eslintrc');

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

module.exports = tseslint.config(
  {
    ignores: [
      'dist/**',
      'lib/**',
      'node_modules/**',
      'src/formatter/templates/*.ts',
      'src/parser/*_peg_parser.ts',
      'src/normalize_mappings/suffix-normalize-mapping.ts',
      'src/normalize_mappings/enharmonic-normalize.ts',
      'test/formatter/pdf/pdf-dev.js',
    ],
  },
  // eslint.configs.recommended,
  // ...tseslint.configs.recommended,
  ...compat.extends('eslint-config-airbnb-typescript/base'),
  {
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: true,
      },
    },
    plugins: {
      jest: jestPlugin,
      import: importPlugin,
    },
    rules: {
      'max-len': [2, 120, 2],
      'no-underscore-dangle': 'off',
      'class-methods-use-this': 'off',
      'no-console': ['error', { allow: ['log', 'warn', 'error'] }],
      'no-trailing-spaces': 'error',
      'no-unused-vars': ['error', { argsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' }],
      'quote-props': ['error', 'consistent-as-needed'],
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-inferrable-types': 'off',
      '@typescript-eslint/no-loop-func': 'off',
      'import/no-extraneous-dependencies': 'off',
      'linebreak-style': ['error', (process.platform === 'win32' ? 'windows' : 'unix')],
      'import/extensions': [
        'error',
        {
          js: 'never',
          jsx: 'never',
          ts: 'never',
          tsx: 'never',
        },
      ],
    },
  },
);
