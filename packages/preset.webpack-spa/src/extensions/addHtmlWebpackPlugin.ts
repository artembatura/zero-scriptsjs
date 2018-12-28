import { WebpackConfig } from '@zero-scripts/config.webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { InsertPos } from '@zero-scripts/core';

export const addHtmlWebpackPlugin = (config: WebpackConfig) =>
  config.insertPlugin(
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
