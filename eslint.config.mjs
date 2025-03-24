// @ts-check

import eslint from '@eslint/js';
import eslintPluginJest from 'eslint-plugin-jest';
import globals from 'globals';
import tseslint from 'typescript-eslint';

import bestPractices from 'eslint-config-airbnb-base/rules/best-practices';
import errors from 'eslint-config-airbnb-base/rules/errors';
import es6 from 'eslint-config-airbnb-base/rules/es6';
import node from 'eslint-config-airbnb-base/rules/node';
import strict from 'eslint-config-airbnb-base/rules/strict';
import style from 'eslint-config-airbnb-base/rules/style';
import variables from 'eslint-config-airbnb-base/rules/variables';

const bestPracticesRules = bestPractices.rules;
const errorsRules = errors.rules;
const es6Rules = es6.rules;
const nodeRules = node.rules;
const strictRules = strict.rules;
const styleRules = style.rules;
const variablesRules = variables.rules;

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...tseslint.configs.stylistic,
  {
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    rules: {
      ...bestPracticesRules,
      ...errorsRules,
      ...es6Rules,
      ...nodeRules,
      ...strictRules,
      ...styleRules,
      ...variablesRules,

      'class-methods-use-this': 'off',
      'complexity': ['error', 10],
      'linebreak-style': ['error', (process.platform === 'win32' ? 'windows' : 'unix')],
      'max-depth': ['error', 2],
      'max-len': ['error', { code: 120, ignoreUrls: true }],
      'max-lines': ['error', 700],
      'max-statements': ['error', 10],
      'no-underscore-dangle': 'off',
      'no-unused-vars': 'off',
      'object-curly-spacing': ['error', 'always'],
      'operator-linebreak': ['error', 'after'],
      'quotes': ['error', 'single'],
      'quote-props': ['error', 'consistent'],

      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
    },
  },
  {
    files: ['src/formatter/templates/*.ts'],
    rules: {
      'indent': 'off',
      'template-curly-spacing': ['error', 'always'],
    },
  },
  {
    files: ['script/**/*.ts'],
    rules: {
      'no-console': 'off',
    },
  },
  {
    files: ['test/**/*.test.ts'],
    ...eslintPluginJest.configs['flat/recommended'],
    rules: {
      ...eslintPluginJest.configs['flat/recommended'].rules,
      'jest/no-disabled-tests': 'off',
      'jest/no-standalone-expect': 'off',
      'jest/prefer-expect-assertions': 'off',
      'max-lines': 'off',
      'max-statements': 'off',
    },
  },
  {
    files: ['test/fixtures/**/*.ts'],
    rules: {
      'max-lines': 'off',
    },
  },
  {
    files: ['test/matchers.ts', 'test/utilities.ts', 'unibuild.ts'],
    rules: {
      'jest/no-export': 'off',
      'max-statements': 'off',
    },
  },
  {
    ignores: [
      'lib/**/*',
      'src/normalize_mappings/suffix-normalize-mapping.ts',
      'src/parser/*/peg_parser.ts',
    ],
  },
);
