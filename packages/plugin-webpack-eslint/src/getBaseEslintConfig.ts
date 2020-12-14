import { Linter } from 'eslint';

import { ExtractOptions } from '@zero-scripts/core';
import { WebpackConfigOptions } from '@zero-scripts/webpack-config';

export function getBaseEslintConfig(
  configOptions: ExtractOptions<WebpackConfigOptions>,
  baseConfig: Linter.Config
): Linter.Config {
  const overrides = baseConfig?.overrides || [];

  if (configOptions?.useTypescript) {
    overrides.unshift({
      files: ['*.ts', '*.tsx'],
      parser: '@typescript-eslint/parser',
      plugins: ['@typescript-eslint'],
      rules: {
        'no-undef': 'off',
        'no-unused-vars': 'off',
        'no-restricted-globals': 'off',
        'no-use-before-define': 'off',
        '@typescript-eslint/no-unused-vars': [
          'warn',
          {
            vars: 'all',
            args: 'after-used',
            ignoreRestSiblings: false
          }
        ]
      }
    });
  }

  return {
    ...baseConfig,
    parser: baseConfig.parser || '@babel/eslint-parser',
    extends: ['eslint:recommended', ...(baseConfig.extends || [])],
    plugins: ['import', ...(baseConfig.plugins || [])],
    parserOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      ...(baseConfig.parserOptions || {})
    },
    env: {
      browser: true,
      node: true,
      ...(baseConfig.env || {})
    },
    rules: {
      'no-unused-vars': 'warn',
      'no-console': 'warn',
      ...(baseConfig.rules || {})
    },
    overrides
  };
}
