import { AbstractExtension } from '@zero-scripts/core';
import { WebpackConfig } from '@zero-scripts/config.webpack';
import {
  getStyleLoaders,
  getLocalIdent
} from '@zero-scripts/utils.webpack-styles';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin';

const safePostCssParser = require('postcss-safe-parser');

const cssModuleRegex = /\.(module|m)\.css$/;

export class WebpackCssExtension extends AbstractExtension {
  public activate(): void {
    this.preset
      .getInstance(WebpackConfig)
      .insertModuleRule(options => ({
        test: /\.css$/,
        exclude: cssModuleRegex,
        use: getStyleLoaders({
          importLoaders: 1,
          sourceMap: !options.isDev && options.useSourceMap
        })(options),
        sideEffects: true
      }))
      .insertModuleRule(options => ({
        test: cssModuleRegex,
        use: getStyleLoaders({
          importLoaders: 1,
          sourceMap: !options.isDev && options.useSourceMap,
          modules: true,
          getLocalIdent
        })(options)
      }))
      .insertPlugin(
        options =>
          !options.isDev
            ? new MiniCssExtractPlugin({
                filename: 'css/[name].[contenthash:8].css',
                chunkFilename: 'css/[name].[contenthash:8].chunk.css'
              })
            : undefined,
        undefined,
        'mini-css-extract-plugin'
      )
      .insertMinimizer(
        ({ useSourceMap }) =>
          new OptimizeCSSAssetsPlugin({
            cssProcessorOptions: {
              parser: safePostCssParser,
              map: useSourceMap
                ? {
                    inline: false,
                    annotation: true
                  }
                : false
            }
          })
      );
  }
}

export default WebpackCssExtension;
