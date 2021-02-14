import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin';

import {
  AbstractPlugin,
  ApplyContext,
  ReadOptions,
  packageExists
} from '@zero-scripts/core';
import { WebpackConfig } from '@zero-scripts/webpack-config';

import { getLocalIdent, getStyleLoaders } from './utils';
import { WebpackStylingPluginOptions } from './WebpackStylingPluginOptions';

const cssModuleRegex = /\.(module|m)\.css$/;
const sassModuleRegex = /\.(module|m)\.(scss|sass)$/;
const lessModuleRegex = /\.(module|m)\.less$/;

const rr = require.resolve;

@ReadOptions(WebpackStylingPluginOptions, 'plugin-webpack-styling')
export class WebpackStylingPlugin extends AbstractPlugin<WebpackStylingPluginOptions> {
  public apply(applyContext: ApplyContext): void {
    applyContext.hooks.beforeRun.tap('WebpackCssPlugin', beforeRunContext => {
      const webpackConfigBuilder = beforeRunContext.getConfigBuilder(
        WebpackConfig
      );

      webpackConfigBuilder.hooks.build.tap(
        'WebpackCssPlugin',
        (modifications, configOptions) => {
          const options = this.optionsContainer.build();

          options.styleLoaders?.forEach(rule => {
            const { preprocessor, exclude, loader, test } = rule;

            modifications.insertNonJsRule({
              test: new RegExp(test),
              exclude: exclude ? new RegExp(exclude) : undefined,
              use: getStyleLoaders(
                undefined,
                loader,
                preprocessor
              )(configOptions),
              sideEffects: true
            });
          });

          modifications.insertNonJsRule({
            test: /\.css$/,
            exclude: cssModuleRegex,
            sideEffects: true,
            use: getStyleLoaders()(configOptions)
          });

          modifications.insertNonJsRule({
            test: cssModuleRegex,
            use: getStyleLoaders(undefined, {
              options: {
                modules: {
                  getLocalIdent
                }
              }
            })(configOptions)
          });

          const enableSassSupport = packageExists(
            ['sass', 'node-sass'],
            configOptions.paths.root
          );

          if (enableSassSupport) {
            const sassLoader = rr('sass-loader');

            modifications.insertNonJsRule({
              test: /\.(scss|sass)$/,
              exclude: sassModuleRegex,
              use: getStyleLoaders(
                undefined,
                undefined,
                sassLoader
              )(configOptions),
              sideEffects: true
            });

            modifications.insertNonJsRule({
              test: sassModuleRegex,
              use: getStyleLoaders(
                undefined,
                {
                  options: {
                    modules: {
                      getLocalIdent
                    }
                  }
                },
                sassLoader
              )(configOptions)
            });
          }

          const enableLessSupport = packageExists(
            'less',
            configOptions.paths.root
          );

          if (enableLessSupport) {
            const lessLoader = rr('less-loader');

            modifications.insertNonJsRule({
              test: /\.less$/,
              exclude: lessModuleRegex,
              use: getStyleLoaders(
                undefined,
                undefined,
                lessLoader
              )(configOptions),
              sideEffects: true
            });

            modifications.insertNonJsRule({
              test: lessModuleRegex,
              use: getStyleLoaders(
                undefined,
                {
                  options: {
                    modules: {
                      getLocalIdent
                    }
                  }
                },
                lessLoader
              )(configOptions)
            });
          }

          if (!configOptions.isDev) {
            modifications.insertPlugin(
              new MiniCssExtractPlugin({
                filename: 'css/[name].[contenthash:8].css',
                chunkFilename: 'css/[name].[contenthash:8].chunk.css'
              }),
              undefined,
              'mini-css-extract-plugin'
            );
          }

          modifications.insertMinimizer(
            new OptimizeCSSAssetsPlugin({
              cssProcessorOptions: {
                parser: require('postcss-safe-parser'),
                map: configOptions.useSourceMap
                  ? {
                      inline: false,
                      annotation: true
                    }
                  : false
              }
            }),
            undefined,
            'optimize-css-assets-plugin'
          );
        }
      );
    });
  }
}
