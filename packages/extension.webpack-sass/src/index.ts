import { AbstractExtension } from '@zero-scripts/core';
import { WebpackConfig } from '@zero-scripts/config.webpack';
import {
  getStyleLoaders,
  getLocalIdent
} from '@zero-scripts/utils.webpack-styles';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

const sassModuleRegex = /\.module\.(scss|sass)$/;

export class WebpackSassExtension extends AbstractExtension {
  public activate(): void {
    this.preset
      .getInstance(WebpackConfig)
      .insertModuleRule(options => ({
        oneOf: [
          {
            test: /\.(scss|sass)$/,
            exclude: sassModuleRegex,
            use: getStyleLoaders(
              {
                importLoaders: 2,
                sourceMap: !options.isDev && options.sourceMap
              },
              require.resolve('sass-loader')
            )(options),
            sideEffects: true
          },
          {
            test: sassModuleRegex,
            use: getStyleLoaders(
              {
                importLoaders: 2,
                sourceMap: !options.isDev && options.sourceMap,
                modules: true,
                getLocalIdent
              },
              require.resolve('sass-loader')
            )(options)
          }
        ]
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
      );
  }
}

export default WebpackSassExtension;
