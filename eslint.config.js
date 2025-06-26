const globals = require('globals');
const typescriptParser = require('@typescript-eslint/parser');
const importPlugin = require('eslint-plugin-import');
const tailwindPlugin = require('eslint-plugin-tailwindcss');
const simpleImportSortPlugin = require('eslint-plugin-simple-import-sort');
const reactPlugin = require('eslint-plugin-react');
const nextPlugin = require('@next/eslint-plugin-next');
const prettierConfig = require('eslint-config-prettier');

// Helper function to create configs for each app
function createAppConfig(dir) {
  return {
    files: [`apps/${dir}/**/*.{ts,tsx,js,jsx}`],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        project: `./apps/${dir}/tsconfig.json`,
        sourceType: 'module',
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
      },
    },
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: `./apps/${dir}/tsconfig.json`,
        },
        alias: {
          map: [['@', './']],
          extensions: ['.ts', '.tsx', '.js', '.jsx'],
        },
      },
    },
  };
}

// Next.js configuration
const nextConfig = {
  plugins: {
    '@next/next': nextPlugin,
  },
  settings: {
    react: {
      version: 'detect', // 自动检测 React 版本
    },
    next: {
      rootDir: ['apps/*/'], // 如果你使用的是 monorepo 结构
    },
  },
  rules: {
    ...nextPlugin.configs.recommended.rules,
    ...nextPlugin.configs['core-web-vitals'].rules,
    '@next/next/no-html-link-for-pages': 'off',
  },
};

// Import plugin configuration
const importConfig = {
  plugins: {
    import: importPlugin,
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
  rules: {
    'import/order': 'off',
    'import/extensions': 'off',
    'import/no-unresolved': 'error',
    'import/no-extraneous-dependencies': 'error',
    'import/no-unassigned-import': 'off',
    'import/no-named-as-default': 'off',
  },
};

// Base plugins configuration
const pluginsConfig = {
  plugins: {
    tailwindcss: tailwindPlugin,
    'simple-import-sort': simpleImportSortPlugin,
    react: reactPlugin,
  },
  rules: {
    'simple-import-sort/imports': [
      'error',
      {
        groups: [
          ['^\\u0000'],
          ['^\\.', '^\\..', '^\\...', '^\\/'],
          ['^react$', '^react-dom$', '^react-router-dom$'],
          ['^@?\\w'],
          ['^'],
          ['^\\.', '^\\..', '^\\...', '^\\/'],
          ['\\.'],
        ],
      },
    ],
    'simple-import-sort/exports': 'error',
    'tailwindcss/no-custom-classname': 'off',
    'tailwindcss/no-contradicting-classname': 'off',
    'tailwindcss/no-unknown-classes': 'off',
    'react/display-name': 'error',
  },
};

module.exports = [
  // Base ignores
  {
    ignores: ['**/node_modules/**', '**/.next/**', '**/out/**', '**/dist/**', '**/.turbo/**', 'eslint.config.js'],
  },

  // Next.js config
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    ...nextConfig,
  },

  // Import plugin config
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    ...importConfig,
  },

  // Plugins config
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    ...pluginsConfig,
  },

  // App-specific configs
  createAppConfig('admin'),
  createAppConfig('web'),

  // Prettier config (must be last)
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    ...prettierConfig,
  },
];
