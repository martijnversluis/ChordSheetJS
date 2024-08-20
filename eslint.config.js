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
      'src/parser/*/peg_parser.ts',
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
        projectService: {
          allowDefaultProject: ['./*.js', 'eslint.config.js'],
          defaultProject: './tsconfig.json',
        },
      },
    },
    plugins: {
      jest: jestPlugin,
      import: importPlugin,
    },
    rules: {
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'variable',
          format: [
            'camelCase',
            'PascalCase',
            'UPPER_CASE',
          ],
          leadingUnderscore: 'allow',
          trailingUnderscore: 'forbid',
        },
      ],
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-inferrable-types': 'off',
      '@typescript-eslint/no-loop-func': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'class-methods-use-this': 'off',
      'import/extensions': [
        'error',
        {
          js: 'never',
          jsx: 'never',
          ts: 'never',
          tsx: 'never',
        },
      ],
      'max-len': [2, 120, 2],
      'no-console': ['error', { allow: ['log', 'warn', 'error'] }],
      'no-trailing-spaces': 'error',
      'no-underscore-dangle': 'off',
      'no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      'import/no-extraneous-dependencies': 'off',
      'linebreak-style': ['error', (process.platform === 'win32' ? 'windows' : 'unix')],
      'quote-props': ['error', 'consistent-as-needed'],
    },
  },
);
