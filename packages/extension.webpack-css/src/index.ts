import { AbstractExtension } from '@zero-scripts/core';
import { WebpackConfig } from '@zero-scripts/config.webpack';
import {
  getStyleLoaders,
  getLocalIdent
} from '@zero-scripts/utils.webpack-styles';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

const cssModuleRegex = /\.module\.css$/;

export class WebpackCssExtension extends AbstractExtension {
  public activate(): void {
    this.preset
      .getInstance(WebpackConfig)
      .insertModuleRule(options => ({
        oneOf: [
          {
            test: /\.css$/,
            exclude: cssModuleRegex,
            use: getStyleLoaders({
              importLoaders: 1,
              sourceMap: !options.isDev && options.sourceMap
            })(options),
            sideEffects: true
          },
          {
            test: cssModuleRegex,
            use: getStyleLoaders({
              importLoaders: 1,
              sourceMap: !options.isDev && options.sourceMap,
              modules: true,
              getLocalIdent
            })(options)
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

export default WebpackCssExtension;
