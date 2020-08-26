import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin';

import { AbstractPlugin, ApplyContext, ReadOptions } from '@zero-scripts/core';
import {
  getLocalIdent,
  getStyleLoaders
} from '@zero-scripts/utils-webpack-styles';
import { WebpackConfig } from '@zero-scripts/webpack-config';

import { WebpackCssPluginOptions } from './WebpackCssPluginOptions';

const safePostCssParser = require('postcss-safe-parser');
const cssModuleRegex = /\.(module|m)\.css$/;

@ReadOptions(WebpackCssPluginOptions, 'plugin-webpack-css')
export class WebpackCssPlugin extends AbstractPlugin<WebpackCssPluginOptions> {
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
            modifications.insertModuleRule({
              test: new RegExp(rule.test),
              exclude: rule.exclude ? new RegExp(rule.exclude) : undefined,
              use: getStyleLoaders(
                MiniCssExtractPlugin.loader,
                undefined,
                rule.preprocessor
                  ? require.resolve(rule.preprocessor)
                  : undefined,
                require.resolve(rule.loader)
              )(configOptions),
              sideEffects: true
            });
          });

          modifications.insertModuleRule({
            test: /\.css$/,
            exclude: cssModuleRegex,
            sideEffects: true,
            use: getStyleLoaders(MiniCssExtractPlugin.loader)(configOptions)
          });

          modifications.insertModuleRule({
            test: cssModuleRegex,
            use: getStyleLoaders(MiniCssExtractPlugin.loader, {
              modules: {
                getLocalIdent
              }
            })(configOptions)
          });

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
                parser: safePostCssParser,
                map: configOptions.useSourceMap
                  ? {
                      inline: false,
                      annotation: true
                    }
                  : false
              }
            })
          );
        }
      );
    });
  }
}
