import { defineConfig } from 'eslint/config';
import { globSync } from 'glob';
import js from '@eslint/js';
import eslintComments from '@eslint-community/eslint-plugin-eslint-comments';
import vitestPlugin from '@vitest/eslint-plugin';
import importPlugin from 'eslint-plugin-import-x';
import prettierPlugin from 'eslint-plugin-prettier/recommended';
import tseslint from 'typescript-eslint';

const devFiles = [
  'eslint.config.js',
  'vitest.config.ts',
  'vitest.setup.ts',
  '{toolkit,core,mod}/**/*.test.{ts,tsx}',
  '{toolkit,core,mod}/**/*.spec.{ts,tsx}',
  '{toolkit,core,mod}/**/__tests__/**/*.{ts,tsx}',
  '{toolkit,core,mod}/**/dev/**/*.{ts,tsx}',
];

/** Ограничения синтаксиса для всех файлов */
const restrictedSyntax = [
  {
    selector:
      "MemberExpression[object.type='MemberExpression'][object.object.type='ThisExpression'][object.property.name='deps']",
    message: 'Деструктурируйте this.deps',
  },
];

export default defineConfig([
  {
    ignores: ['**/node_modules/', '**/dist/'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...tseslint.configs.strict,
  prettierPlugin,
  {
    files: ['**/*.ts'],
    plugins: {
      '@eslint-community/eslint-comments': eslintComments,
      '@typescript-eslint': tseslint.plugin,
      'import-x': importPlugin,
    },
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        projectService: true,
      },
    },
    linterOptions: {
      reportUnusedDisableDirectives: 'error',
    },
    settings: {
      'import-x/resolver': {
        typescript: true,
      },
    },
    rules: {
      // ESLint comments rules
      '@eslint-community/eslint-comments/require-description': 'error',

      // TypeScript rules
      '@typescript-eslint/no-use-before-define': ['error', { functions: false }],
      '@typescript-eslint/no-extraneous-class': ['error', { allowWithDecorator: true }],
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-invalid-void-type': [
        'error',
        {
          allowAsThisParameter: true,
        },
      ],
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', ignoreRestSiblings: true },
      ],
      '@typescript-eslint/parameter-properties': 'error',

      // Core rules
      'func-style': ['error', 'declaration'],
      'no-console': 'error',
      'no-restricted-syntax': ['error', ...restrictedSyntax],
      'no-use-before-define': 'off',

      // Import rules
      'no-useless-rename': 'error',
      'import-x/order': [
        'error',
        {
          'newlines-between': 'always-and-inside-groups',
          groups: [['builtin', 'external'], ['parent'], ['sibling', 'index']],
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
      'import-x/no-default-export': 'error',
      'import-x/no-extraneous-dependencies': [
        'error',
        {
          devDependencies: devFiles,
          peerDependencies: true,
          packageDir: ['./', ...globSync(['./toolkit/*', './core/*', './mod/*'])],
        },
      ],
    },
  },
  // Конфигурационные файлы
  {
    files: ['**/eslint.config.js', 'vitest.config.ts'],
    rules: {
      'import-x/no-default-export': 'off',
    },
  },
  // Правила для прод-файлов. Они собираются в Lua, а тесты и dev-файлы — нет
  {
    files: ['**/*.ts'],
    ignores: devFiles,
    rules: {
      '@typescript-eslint/no-non-null-assertion': 'error',
      // В Lua у функции либо есть self, либо нет. TypeScriptToLua проверяет это при сборке, но не
      // видит, если метод передали без объекта или вызвали через bind, call и apply (см. #68)
      '@typescript-eslint/unbound-method': 'error',
      'no-restricted-syntax': [
        'error',
        ...restrictedSyntax,
        {
          selector: 'CallExpression > MemberExpression.callee[property.name=/^(bind|call|apply)$/]',
          message:
            'Не используйте bind, call и apply: в Lua они ломают передачу self. Оберните вызов в стрелочную функцию',
        },
      ],
    },
  },
  // Правила для файлов с тестами
  {
    files: ['**/*.spec.ts', '**/*.test.ts'],
    ...vitestPlugin.configs.recommended,
    rules: {
      ...vitestPlugin.configs.recommended.rules,
      'vitest/consistent-test-filename': [
        'error',
        {
          allTestPattern: '.*\\.spec(\\.ts)?$',
          pattern: '.*\\.spec(\\.ts)?$',
        },
      ],
    },
  },
]);
