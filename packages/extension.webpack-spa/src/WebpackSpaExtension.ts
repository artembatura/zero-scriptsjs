import CleanWebpackPlugin from 'clean-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import path from 'path';

import { WebpackConfig } from '@zero-scripts/config.webpack';
import {
  AbstractExtension,
  AbstractPreset,
  InsertPos,
  ReadOptions
} from '@zero-scripts/core';

import { WebpackSpaExtensionOptions } from './WebpackSpaExtensionOptions';

const FriendlyErrorsPlugin = require('@artemir/friendly-errors-webpack-plugin');

@ReadOptions(WebpackSpaExtensionOptions, 'extension.webpack-spa')
export class WebpackSpaExtension<
  TParentExtensionOptions extends WebpackSpaExtensionOptions = WebpackSpaExtensionOptions
> extends AbstractExtension<TParentExtensionOptions> {
  public activate(preset: AbstractPreset): void {
    preset
      .getInstance(WebpackConfig)
      .insertPlugin(({ isDev }) =>
        !isDev ? new CleanWebpackPlugin() : undefined
      )
      .insertPlugin(({ isDev, paths }) =>
        !isDev
          ? new CopyWebpackPlugin([
              {
                from: paths.publicPath,
                to: paths.build,
                ignore: [paths.indexHtml]
              }
            ])
          : undefined
      )
      .insertPlugin(({ isDev, paths }) =>
        isDev
          ? new FriendlyErrorsPlugin({
              compilationSuccessInfo: {
                messages: [
                  'You application is available at http://localhost:8080'
                ],
                notes: [
                  'The development build is not optimized',
                  'To create a production build, run `build` script'
                ]
              }
            })
          : new FriendlyErrorsPlugin({
              compilationSuccessInfo: {
                messages: [
                  `You application successfully built and available at ${paths.build
                    .split(path.sep)
                    .pop()} folder`
                ]
              }
            })
      )
      .insertPlugin(
        ({ isDev, paths }) =>
          new HtmlWebpackPlugin({
            inject: true,
            template: paths.indexHtml,
            minify: !isDev
              ? {
                  removeComments: true,
                  collapseWhitespace: true,
                  removeRedundantAttributes: true,
                  useShortDoctype: true,
                  removeEmptyAttributes: true,
                  removeStyleLinkTypeAttributes: true,
                  keepClosingSlash: true,
                  minifyJS: true,
                  minifyCSS: true,
                  minifyURLs: true
                }
              : false
          }),
        InsertPos.Start
      );
  }
}
