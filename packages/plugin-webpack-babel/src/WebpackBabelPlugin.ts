import {
  AbstractPlugin,
  PluginAPI,
  extensionsRegex,
  ReadOptions
} from '@zero-scripts/core';
import { WebpackConfig } from '@zero-scripts/webpack-config';

import { WebpackBabelPluginOptions } from './WebpackBabelPluginOptions';

const rr = require.resolve;

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

          modifications.insertModuleRule({
            test: extensionsRegex(jsFileExtensions),
            oneOf: [
              {
                include: paths.src,
                use: [
                  {
                    loader: rr('babel-loader'),
                    options: {
                      babelrc: false,
                      configFile: false,
                      presets: [
                        [
                          rr('@babel/preset-env'),
                          {
                            modules: false,
                            targets: { esmodules: true },
                            useBuiltIns: 'entry',
                            corejs: 3,
                            exclude: ['transform-typeof-symbol']
                          }
                        ],
                        useTypescript && rr('@babel/preset-typescript'),
                        ...pluginOptions.presets
                      ].filter(Boolean),
                      plugins: [
                        [
                          rr('@babel/plugin-transform-runtime'),
                          { useESModules: true }
                        ],
                        rr('@babel/plugin-syntax-dynamic-import'),
                        useTypescript &&
                          rr('@babel/plugin-proposal-decorators'),
                        [
                          rr('@babel/plugin-proposal-class-properties'),
                          { loose: true }
                        ],
                        ...pluginOptions.plugins
                      ].filter(Boolean),
                      overrides: [
                        pluginOptions.flow && {
                          exclude: /\.(ts|tsx)?$/,
                          plugins: [
                            rr('@babel/plugin-transform-flow-strip-types')
                          ]
                        },
                        useTypescript && {
                          test: /\.(ts|tsx)?$/,
                          plugins: [
                            [
                              rr('@babel/plugin-proposal-decorators'),
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
                  ...pluginOptions.jsLoaders
                ]
              },
              {
                exclude: /@babel(?:\/|\\{1,2})runtime/,
                loader: rr('babel-loader'),
                options: {
                  babelrc: false,
                  configFile: false,
                  compact: false,
                  presets: [[rr('@babel/preset-env'), { loose: true }]],
                  cacheDirectory: true,
                  cacheCompression: !isDev,
                  sourceMaps: false
                }
              }
            ]
          });

          if (useTypescript) {
            try {
              const ForkTsCheckerPlugin = require('fork-ts-checker-webpack-plugin');

              modifications.insertPlugin(
                new ForkTsCheckerPlugin({
                  typescript: rr('typescript'),
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
              );
            } catch (e) {
              // eslint-disable-next-line no-console
              console.log(
                'Warning: If you want to check types on your Typescript files' +
                  ' , you need to manually install fork-ts-checker-webpack-plugin'
              );
            }
          }
        }
      );
    });
  }
}
