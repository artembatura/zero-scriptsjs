import type { TransformOptions } from '@babel/core';

import { ExtractOptions } from '@zero-scripts/core';
import { WebpackConfigOptions } from '@zero-scripts/webpack-config';

import { WebpackBabelPluginOptions } from './WebpackBabelPluginOptions';

const rr = (pkg: string, bool: boolean) => (bool ? require.resolve(pkg) : pkg);

export function getInitialBabelConfig(
  configOptions: ExtractOptions<WebpackConfigOptions>,
  pluginOptions: ExtractOptions<WebpackBabelPluginOptions>,
  baseConfig: WebpackBabelPluginOptions['baseBabelConfig'],
  resolve: boolean
): TransformOptions {
  const presets = [...baseConfig.presets];
  const plugins = [...baseConfig.plugins];
  const overrides = [...baseConfig.overrides];

  if (configOptions.useTypescript) {
    presets.push(rr('@babel/preset-typescript', resolve));
    plugins.push([rr('@babel/plugin-proposal-decorators', resolve), false]);

    overrides.push({
      test: ['**/*.ts', '**/*.tsx'],
      plugins: [
        [rr('@babel/plugin-proposal-decorators', resolve), { legacy: true }]
      ]
    });
  }

  if (pluginOptions.flow) {
    overrides.push({
      exclude: ['**/*.ts', '**/*.tsx'],
      plugins: [rr('@babel/plugin-transform-flow-strip-types', resolve)]
    });
  }

  return {
    ...baseConfig,
    presets: [
      [
        rr('@babel/preset-env', resolve),
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
      [rr('@babel/plugin-transform-runtime', resolve), { useESModules: true }],
      rr('@babel/plugin-syntax-dynamic-import', resolve),
      [rr('@babel/plugin-proposal-class-properties', resolve), { loose: true }],
      ...plugins
    ],
    overrides
  };
}
