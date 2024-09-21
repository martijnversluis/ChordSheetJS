// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...tseslint.configs.stylistic,
  {
    rules: {
      'quotes': ['error', 'single'],

      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
        },
      ],
      'object-curly-spacing': ['error', 'always'],
    }
  },
  {
    ignores: [
      'lib/**/*',
      'src/normalize_mappings/suffix-normalize-mapping.ts',
      'src/parser/*/peg_parser.ts',
    ]
  }
);
