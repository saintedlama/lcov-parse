import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier/flat';
import prettierPlugin from 'eslint-plugin-prettier';

export default tseslint.config(
  {
    ignores: [
      'dist/**',
      'node_modules/**'
    ],
  },

  // Base configurations
  eslint.configs.recommended,
  ...tseslint.configs.recommended,

  // TypeScript configuration
  {
    files: ['src/**/*.ts'],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // TypeScript specific rules
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/explicit-function-return-type': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-non-null-assertion': 'warn',

      // Code quality rules that work well with Prettier
      'curly': ['error', 'all'],
      'no-console': 'warn',
      'no-debugger': 'error',
      'prefer-const': 'error',
      'no-var': 'error',
    },
  },

  // Prettier integration - this should come AFTER other configs
  {
    files: ['src/**/*.ts'],
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      'prettier/prettier': 'error',
    },
  },

  // Test file overrides
  {
    files: ['src/**/*.test.ts'],
    rules: {
      '@typescript-eslint/explicit-function-return-type': 'off',
      'no-console': 'off', // Allow console in tests
    },
  },

  // eslint-config-prettier must be last to override conflicting rules
  eslintConfigPrettier
);