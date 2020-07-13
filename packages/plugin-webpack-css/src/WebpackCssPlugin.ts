import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin';

import { AbstractPlugin, PluginAPI, ReadOptions } from '@zero-scripts/core';
import {
  getLocalIdent,
  getStyleLoaders
} from '@zero-scripts/utils-webpack-styles';
import { WebpackConfig } from '@zero-scripts/webpack-config';

import { WebpackCssPluginOptions } from './WebpackCssPluginOptions';

const safePostCssParser = require('postcss-safe-parser');
const cssModuleRegex = /\.(module|m)\.css$/;

@ReadOptions(WebpackCssPluginOptions, 'plugin-webpack-css')
export class WebpackCssPlugin<
  TOptions extends WebpackCssPluginOptions = WebpackCssPluginOptions
> extends AbstractPlugin<TOptions> {
  public apply(ws: PluginAPI): void {
    ws.hooks.beforeRun.tap('WebpackCssPlugin', api => {
      const webpackConfigBuilder = api.getConfigBuilder(WebpackConfig);

      webpackConfigBuilder.hooks.build.tap(
        'WebpackCssPlugin',
        (modifications, configOptions) => {
          const options = this.optionsContainer.build();
          console.log({
            styleLoaders: options.styleLoaders
          });

          options.styleLoaders?.forEach(rule => {
            console.log({
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
