import {
  AbstractPlugin,
  PluginAPI,
  extensionsRegex,
  ReadOptions
} from '@zero-scripts/core';
import { WebpackConfig } from '@zero-scripts/webpack-config';

import { WebpackBabelPluginOptions } from './WebpackBabelPluginOptions';

@ReadOptions(WebpackBabelPluginOptions, 'plugin-webpack-babel')
export class WebpackBabelPlugin<
  TParentOptions extends WebpackBabelPluginOptions = WebpackBabelPluginOptions
> extends AbstractPlugin<TParentOptions> {
  public apply(ws: PluginAPI): void {
    ws.hooks.beforeRun.tap('WebpackBabelPlugin', api => {
      const webpackConfigBuilder = api.getConfigBuilder(WebpackConfig);

      webpackConfigBuilder.hooks.build.tap(
        'WebpackBabelPlugin',
        (modifications, { isDev, jsFileExtensions, paths, useTypescript }) => {
          const pluginOptions = this.optionsContainer.build();

          modifications.insertModuleRule(() => {
            return {
              test: extensionsRegex(jsFileExtensions),
              oneOf: [
                {
                  include: paths.src,
                  loader: require.resolve('babel-loader'),
                  options: {
                    babelrc: false,
                    configFile: false,
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
                      useTypescript && '@babel/preset-typescript',
                      ...pluginOptions.presets
                    ].filter(Boolean),
                    plugins: [
                      [
                        '@babel/plugin-transform-runtime',
                        { useESModules: true }
                      ],
                      '@babel/plugin-syntax-dynamic-import',
                      useTypescript && '@babel/plugin-proposal-decorators',
                      [
                        '@babel/plugin-proposal-class-properties',
                        { loose: true }
                      ],
                      ...pluginOptions.plugins
                    ].filter(Boolean),
                    overrides: [
                      pluginOptions.flow && {
                        exclude: /\.(ts|tsx)?$/,
                        plugins: ['@babel/plugin-transform-flow-strip-types']
                      },
                      useTypescript && {
                        test: /\.(ts|tsx)?$/,
                        plugins: [
                          [
                            '@babel/plugin-proposal-decorators',
                            { legacy: true }
                          ]
                        ]
                      }
                    ].filter(Boolean),
                    cacheDirectory: true,
                    cacheCompression: !isDev,
                    compact: !isDev
                  }
                },
                {
                  exclude: /@babel(?:\/|\\{1,2})runtime/,
                  loader: require.resolve('babel-loader'),
                  options: {
                    babelrc: false,
                    configFile: false,
                    compact: false,
                    presets: [['@babel/preset-env', { loose: true }]],
                    cacheDirectory: true,
                    cacheCompression: !isDev,
                    sourceMaps: false
                  }
                }
              ]
            };
          });

          modifications.insertPlugin(() => {
            let ForkTsCheckerPlugin = undefined;

            if (useTypescript) {
              try {
                ForkTsCheckerPlugin = require('fork-ts-checker-webpack-plugin');
              } catch (e) {
                // eslint-disable-next-line no-console
                console.log(
                  'Warning: If you want to checking types on your Typescript files' +
                    ' , you need to manually install fork-ts-checker-webpack-plugin'
                );
              }
            }

            return ForkTsCheckerPlugin
              ? new ForkTsCheckerPlugin({
                  typescript: require.resolve('typescript'),
                  async: isDev,
                  checkSyntacticErrors: true,
                  useTypescriptIncrementalApi: true,
                  tsconfig: paths.tsConfig,
                  reportFiles: [
                    '**',
                    '!**/*.json',
                    '!**/__tests__/**',
                    '!**/?(*.)(spec|test).*',
                    '!**/src/setupProxy.*',
                    '!**/src/setupTests.*'
                  ],
                  watch: paths.src,
                  silent: false
                })
              : undefined;
          });
        }
      );
    });
  }
}
