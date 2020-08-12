import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin';

import { AbstractPlugin, ReadOptions, PluginAPI } from '@zero-scripts/core';
import {
  getLocalIdent,
  getStyleLoaders
} from '@zero-scripts/utils-webpack-styles';
import { WebpackConfig } from '@zero-scripts/webpack-config';

import { WebpackSassPluginOptions } from './WebpackSassPluginOptions';

const safePostCssParser = require('postcss-safe-parser');
const sassModuleRegex = /\.(module|m)\.(scss|sass)$/;

@ReadOptions(WebpackSassPluginOptions, 'plugin-webpack-sass')
export class WebpackSassPlugin extends AbstractPlugin<
  WebpackSassPluginOptions
> {
  public apply(ws: PluginAPI): void {
    ws.hooks.beforeRun.tap('WebpackSassPlugin', api => {
      const webpackConfigBuilder = api.getConfigBuilder(WebpackConfig);

      webpackConfigBuilder.hooks.build.tap(
        'WebpackSassPlugin',
        (modifications, configOptions) => {
          const sassLoader = {
            loader: require.resolve('sass-loader'),
            options: {
              implementation: require('sass')
            }
          };

          modifications.insertModuleRule({
            test: /\.(scss|sass)$/,
            exclude: sassModuleRegex,
            use: getStyleLoaders(
              MiniCssExtractPlugin.loader,
              undefined,
              sassLoader
            )(configOptions),
            sideEffects: true
          });

          modifications.insertModuleRule({
            test: sassModuleRegex,
            use: getStyleLoaders(
              MiniCssExtractPlugin.loader,
              {
                modules: {
                  getLocalIdent
                }
              },
              sassLoader
            )(configOptions)
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
