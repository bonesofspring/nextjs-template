import rules from '@bonesofspring/eslint-react'
import globals from 'globals'
import boundariesPlugin from 'eslint-plugin-boundaries'
import compatPlugin from 'eslint-plugin-compat'
import noRelativeImportPathsPlugin from 'eslint-plugin-no-relative-import-paths'

export default [
  ...rules,
  // === Project-specific: boundaries, compat ===
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      boundaries: boundariesPlugin,
      compat: compatPlugin,
      'no-relative-import-paths': noRelativeImportPathsPlugin,
    },
    settings: {
      'boundaries/ignore': ['pages/*'],
      'boundaries/elements': [
        { type: 'app', pattern: 'src/(app|App|main)' },
        { type: 'pageIndex', pattern: 'src/pages/*/index.ts{,x}', mode: 'file' },
        { type: 'pages', pattern: 'src/pages' },
        { type: 'widgetIndex', pattern: 'src/widgets/*/index.ts{,x}', mode: 'file' },
        { type: 'widgets', pattern: 'src/widgets/*' },
        { type: 'sharedUiIndex', pattern: 'src/shared/ui/*/index.ts{,x}', mode: 'file' },
        { type: 'sharedUi', pattern: 'src/shared/ui/*' },
        { type: 'shared', pattern: 'src/shared/*' },
      ],
    },
    rules: {
      'boundaries/dependencies': [
        'error',
        {
          default: 'allow',
          rules: [
            {
              from: { type: 'app' },
              disallow: [
                { to: { type: 'pages' } },
                { to: { type: 'widgets' } },
                { to: { type: 'sharedUi' } },
              ],
              message: 'Нельзя импортировать напрямую, нужно через publicApi (index)',
            },
            {
              from: { type: 'pages' },
              disallow: [{ to: { type: 'app' } }],
              message: 'Нельзя в pages использовать app',
            },
            {
              from: { type: 'pages' },
              disallow: [{ to: { type: 'pages' } }, { to: { type: 'pageIndex' } }],
              message: 'Нельзя в одной странице использовать части другой',
            },
            {
              from: { type: 'pages' },
              disallow: [{ to: { type: 'widgets' } }],
              message: 'Можно использовать widgets только через publicApi (index)',
            },
            {
              from: { type: 'pages' },
              disallow: [{ to: { type: 'sharedUi' } }],
              message: 'shared/ui можно использовать только через publicApi (index)',
            },
            {
              from: { type: 'widgets' },
              disallow: [
                { to: { type: 'app' } },
                { to: { type: 'pages' } },
                { to: { type: 'pageIndex' } },
              ],
              message: 'Нельзя использовать app и pages из widgets',
            },
            {
              from: { type: 'widgets' },
              disallow: [{ to: { type: 'widgets' } }, { to: { type: 'widgetIndex' } }],
              message:
                'Виджеты независимы, можно вынести общие части в shared, либо собрать композицию на уровне page',
            },
            {
              from: { type: 'widgets' },
              disallow: [{ to: { type: 'sharedUi' } }],
              message: 'shared/ui можно использовать только через publicApi (index)',
            },
            {
              from: [{ type: 'shared' }, { type: 'sharedUi' }, { type: 'sharedUiIndex' }],
              disallow: [
                { to: { type: 'app' } },
                { to: { type: 'pages' } },
                { to: { type: 'pageIndex' } },
                { to: { type: 'widgets' } },
                { to: { type: 'widgetIndex' } },
              ],
              message: 'Из shared нельзя использовать вышестоящие слои',
            },
            {
              from: [{ type: 'shared' }, { type: 'sharedUi' }],
              disallow: [{ to: { type: 'sharedUi' } }],
              message:
                'В shared/ui находятся независимые компоненты, их можно использовать только через publicApi (index)',
            },
          ],
        },
      ],
      'compat/compat': 'warn',
      'no-relative-import-paths/no-relative-import-paths': 'off',
      'next/no-img-element': 'warn',
    },
  },
  // === Restricted imports ===
  {
    files: ['**/*'],
    ignores: ['src/types/**'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/types/*', '!@/types/index', '!@/types/enums'],
              message: 'Import of private types is not allowed.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['**/*'],
    ignores: ['src/api/**'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/api/*', '!@/api/index'],
              message: 'Import of internal api variables is not allowed.',
            },
          ],
        },
      ],
    },
  },
  // === Ignores ===
  {
    ignores: ['.next', 'coverage', 'build', 'node_modules', 'out', 'public', '*.d.ts'],
  },
  // === Test files: allow devDependencies (testing-library, jest, etc.) ===
  {
    files: [
      '**/__tests__/**/*.{ts,tsx}',
      '**/*.{test,spec}.{ts,tsx}',
      '**/lib/utils/tests.{ts,tsx}',
    ],
    rules: {
      'import-x/no-extraneous-dependencies': ['error', { devDependencies: true }],
    },
  },
  // === Node.js config files (без type-aware linting) ===
  {
    files: [
      '*.config.js',
      '*.config.mjs',
      '*.config.ts',
      'jest.setup.js',
      '.lintstagedrc.js',
      'sentry.client.config.js',
      'jest.config.js',
      'eslint.config.mjs',
    ],
    languageOptions: {
      globals: { ...globals.node },
    },
    rules: {
      'import-x/no-extraneous-dependencies': ['error', { devDependencies: true }],
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-useless-constructor': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      'class-methods-use-this': 'off',
    },
  },
]
