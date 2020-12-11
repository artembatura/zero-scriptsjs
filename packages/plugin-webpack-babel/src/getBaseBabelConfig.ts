import type { TransformOptions } from '@babel/core';

import { ExtractOptions } from '@zero-scripts/core';
import { WebpackConfigOptions } from '@zero-scripts/webpack-config';

import { WebpackBabelPluginOptions } from './WebpackBabelPluginOptions';

export function getBaseBabelConfig(
  configOptions: ExtractOptions<WebpackConfigOptions>,
  pluginOptions: ExtractOptions<WebpackBabelPluginOptions>,
  baseConfig: WebpackBabelPluginOptions['baseBabelConfig']
): TransformOptions {
  const presets = baseConfig.presets;
  const plugins = baseConfig.plugins;
  const overrides = baseConfig.overrides;

  if (configOptions.useTypescript) {
    presets.push('@babel/preset-typescript');
    plugins.push('@babel/plugin-proposal-decorators');

    overrides.push({
      test: ['**/*.ts', '**/*.tsx'],
      plugins: [['@babel/plugin-proposal-decorators', { legacy: true }]]
    });
  }

  // TODO: if flow package is installed,
  //  automatically enable this option
  if (pluginOptions.flow) {
    overrides.push({
      exclude: ['**/*.ts', '**/*.tsx'],
      plugins: ['@babel/plugin-transform-flow-strip-types']
    });
  }

  return {
    ...baseConfig,
    presets: [
      [
        '@babel/preset-env',
        {
          modules: false,
          targets: { esmodules: true },
          useBuiltIns: 'entry',
          corejs: 3,
          exclude: ['transform-typeof-symbol']
        }
      ],
      ...presets
    ],
    plugins: [
      ['@babel/plugin-transform-runtime', { useESModules: true }],
      '@babel/plugin-syntax-dynamic-import',
      ['@babel/plugin-proposal-class-properties', { loose: true }],
      ...plugins
    ],
    overrides
  };
}
