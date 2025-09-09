import eslint from '@eslint/js';
import vitest from '@vitest/eslint-plugin';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import testingLibraryPlugin from 'eslint-plugin-testing-library';
import globals from 'globals';
import tseslint, { type ConfigArray } from 'typescript-eslint';

const config: ConfigArray = [
  {
    ignores: ['dist/**', 'storybook-static/**', 'node_modules/**'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  reactPlugin.configs.flat.recommended,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
        project: './tsconfig.json',
      },
    },
  },
  {
    settings: {
      react: {
        version: 'detect',
      },
    },
    languageOptions: {
      ecmaVersion: 6,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        expect: 'readonly',
      },
      parser: tseslint.parser,
    },
    plugins: {
      // There is no flat config available.
      'react-hooks': reactHooksPlugin,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': ['error'],
      '@typescript-eslint/no-unnecessary-type-parameters': 'off',
      '@typescript-eslint/unbound-method': 'off',
      'import/no-unresolved': 'off',
      'no-case-declarations': 'off',
      'no-console': 'error',
      'no-trailing-spaces': 'error',
      'no-unused-vars': 'off', // disabled to allow the typescript one to take over and avoid errors in reporting
      'no-var': 'off',
      'prefer-const': 'off',
      'prefer-rest-params': 'off',

      'react/jsx-no-undef': 'error',
      'react/jsx-pascal-case': 'error',
      'react/no-danger': 'error',
      'react/jsx-no-duplicate-props': 'error',
      'react/jsx-sort-prop-types': 'off',
      'react/jsx-sort-props': 'off',
      'react/jsx-uses-vars': 'warn',
      'react/no-did-mount-set-state': 'warn',
      'react/no-did-update-set-state': 'warn',
      'react/no-unknown-property': 'warn',
      'react/prop-types': 'off',
      'react/jsx-wrap-multilines': 'error',
      // allowExpressions allow single expressions in a fragment eg: <>{children}</>
      // https://github.com/jsx-eslint/eslint-plugin-react/blob/f83b38869c7fc2c6a84ef8c2639ac190b8fef74f/docs/rules/jsx-no-useless-fragment.md#allowexpressions
      'react/jsx-no-useless-fragment': ['error', { allowExpressions: true }],
      'react/display-name': 'off',
      'react/no-children-prop': 'error',
      'react/no-unescaped-entities': 'error',
      'react/jsx-key': 'error',
      'react/jsx-no-target-blank': 'error',
      // Turned off because we use automatic runtime.
      'react/jsx-uses-react': 'off',
      'react/react-in-jsx-scope': 'off',

      ...reactHooksPlugin.configs.recommended.rules,

      '@typescript-eslint/no-unnecessary-condition': [
        'error',
        {
          allowConstantLoopConditions: true,
        },
      ],

      '@typescript-eslint/prefer-literal-enum-member': [
        'error',
        {
          allowBitwiseExpressions: true,
        },
      ],

      '@typescript-eslint/restrict-template-expressions': [
        'error',
        { allowNumber: true },
      ],

      '@typescript-eslint/switch-exhaustiveness-check': [
        'error',
        { considerDefaultExhaustiveForUnions: true },
      ],
    },
  },
  {
    files: ['**/*.test.{ts,tsx}'],
    plugins: {
      vitest,
      'testing-library': testingLibraryPlugin,
    },
    rules: {
      ...vitest.configs.recommended.rules,
      ...testingLibraryPlugin.configs['flat/react'].rules,

      'vitest/expect-expect': 'off',

      '@typescript-eslint/no-non-null-assertion': 'off',
    },
    settings: {
      vitest: {
        typecheck: true,
      },
    },
    languageOptions: {
      globals: {
        ...vitest.environments.env.globals,
      },
    },
  },
];

export { config as default };
