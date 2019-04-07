import {
  AbstractExtension,
  AbstractPreset,
  ReadOptions
} from '@zero-scripts/core';
import { WebpackSassExtensionOptions } from './WebpackSassExtensionOptions';
import { WebpackConfig } from '@zero-scripts/config.webpack';
import {
  getLocalIdent,
  getStyleLoaders
} from '@zero-scripts/utils.webpack-styles';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin';

const safePostCssParser = require('postcss-safe-parser');
const sassModuleRegex = /\.(module|m)\.(scss|sass)$/;

@ReadOptions(WebpackSassExtensionOptions)
export class WebpackSassExtension extends AbstractExtension<
  WebpackSassExtensionOptions
> {
  activate(preset: AbstractPreset): void {
    preset
      .getInstance(WebpackConfig)
      .insertModuleRule(options => ({
        test: /\.(scss|sass)$/,
        exclude: sassModuleRegex,
        use: getStyleLoaders(
          {
            importLoaders: 2,
            sourceMap: !options.isDev && options.useSourceMap
          },
          require.resolve('sass-loader')
        )(options),
        sideEffects: true
      }))
      .insertModuleRule(options => ({
        test: sassModuleRegex,
        use: getStyleLoaders(
          {
            importLoaders: 2,
            sourceMap: !options.isDev && options.useSourceMap,
            modules: true,
            getLocalIdent
          },
          require.resolve('sass-loader')
        )(options)
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
