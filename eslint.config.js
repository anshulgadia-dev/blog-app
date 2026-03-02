import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import prettierConfig from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import prettierPlugin from 'eslint-plugin-prettier';
import globals from 'globals';

export default defineConfig([
  {
    ignores: ['node_modules/', 'dist/', 'build/'],
  },

  js.configs.recommended,
  prettierConfig,

  {
    files: ['**/*.{js,mjs,cjs}'],

    languageOptions: {
      globals: globals.node,
      sourceType: 'module',
    },

    plugins: {
      prettier: prettierPlugin,
      import: importPlugin,
    },

    rules: {
      'prettier/prettier': 'error',

      // 🔥 IMPORT ORDERING RULE
      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
            'object',
            'type',
          ],

          'newlines-between': 'always',

          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },

          // ✅ PUT YOUR CODE HERE
          pathGroups: [
            {
              pattern: 'dotenv',
              group: 'external',
              position: 'before',
            },
          ],
          pathGroupsExcludedImportTypes: ['builtin'],
        },
      ],

      // optional but recommended
      'import/no-duplicates': 'error',
    },
  },
]);
