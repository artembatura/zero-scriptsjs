import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin';

import { AbstractPlugin, ReadOptions, ApplyContext } from '@zero-scripts/core';
import {
  getLocalIdent,
  getStyleLoaders
} from '@zero-scripts/utils-webpack-styles';
import { WebpackConfig } from '@zero-scripts/webpack-config';

import { WebpackLessPluginOptions } from './WebpackLessPluginOptions';

const safePostCssParser = require('postcss-safe-parser');
const lessModuleRegex = /\.(module|m)\.less$/;

@ReadOptions(WebpackLessPluginOptions, 'plugin-webpack-less')
export class WebpackLessPlugin extends AbstractPlugin<WebpackLessPluginOptions> {
  public apply(applyContext: ApplyContext): void {
    applyContext.hooks.beforeRun.tap('WebpackLessPlugin', beforeRunContext => {
      const webpackConfigBuilder = beforeRunContext.getConfigBuilder(
        WebpackConfig
      );

      webpackConfigBuilder.hooks.build.tap(
        'WebpackLessPlugin',
        (modifications, configOptions) => {
          const lessLoader = require.resolve('less-loader');

          modifications.insertModuleRule({
            test: /\.less$/,
            exclude: lessModuleRegex,
            use: getStyleLoaders(
              MiniCssExtractPlugin.loader,
              undefined,
              lessLoader
            )(configOptions),
            sideEffects: true
          });

          modifications.insertModuleRule({
            test: lessModuleRegex,
            use: getStyleLoaders(
              MiniCssExtractPlugin.loader,
              {
                modules: {
                  getLocalIdent
                }
              },
              lessLoader
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
            }),
            undefined,
            'optimize-css-assets-plugin'
          );
        }
      );
    });
  }
}
