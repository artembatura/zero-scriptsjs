import type ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';

import {
  AbstractPlugin,
  ApplyContext,
  extensionsRegex,
  ReadOptions
} from '@zero-scripts/core';
import { WebpackConfig } from '@zero-scripts/webpack-config';

import { WebpackBabelPluginOptions } from './WebpackBabelPluginOptions';

const rr = require.resolve;

@ReadOptions(WebpackBabelPluginOptions, 'plugin-webpack-babel')
export class WebpackBabelPlugin extends AbstractPlugin<WebpackBabelPluginOptions> {
  public apply(applyContext: ApplyContext): void {
    applyContext.hooks.beforeRun.tap('WebpackBabelPlugin', beforeRunContext => {
      const webpackConfigBuilder = beforeRunContext.getConfigBuilder(
        WebpackConfig
      );

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
                  presets: [
                    [
                      rr('@babel/preset-env'),
                      {
                        useBuiltIns: 'entry',
                        corejs: 3,
                        exclude: ['transform-typeof-symbol'],
                        loose: true
                      }
                    ]
                  ],
                  cacheDirectory: true,
                  cacheCompression: !isDev,
                  sourceMaps: false
                }
              }
            ]
          });

          if (useTypescript) {
            try {
              const ForkTsCheckerPlugin: typeof ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

              modifications.insertPlugin(
                new ForkTsCheckerPlugin({
                  async: isDev,
                  typescript: {
                    enabled: true,
                    configFile: paths.tsConfig,
                    mode: 'write-references',
                    context: paths.root,
                    diagnosticOptions: {
                      syntactic: true
                    }
                  }
                })
              );
            } catch (err) {
              if (err instanceof Error && err.name === 'MODULE_NOT_FOUND') {
                // eslint-disable-next-line no-console
                console.log(
                  'Warning: If you want to check types on your Typescript files' +
                    ' , you need to manually install fork-ts-checker-webpack-plugin'
                );
              } else {
                // eslint-disable-next-line no-console
                console.log(err.stack || err.stackTrace);
              }
            }
          }
        }
      );
    });
  }
}
