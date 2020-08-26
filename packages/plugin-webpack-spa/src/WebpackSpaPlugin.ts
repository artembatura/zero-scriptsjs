import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import path from 'path';

import {
  ApplyContext,
  AbstractPlugin,
  InsertPos,
  ReadOptions
} from '@zero-scripts/core';
import { WebpackConfig } from '@zero-scripts/webpack-config';

import { TaskStart, TaskBuild } from './tasks';
import { WebpackSpaPluginOptions } from './WebpackSpaPluginOptions';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const FriendlyErrorsPlugin = require('@artemir/friendly-errors-webpack-plugin');

@ReadOptions(WebpackSpaPluginOptions, 'plugin-webpack-spa')
export class WebpackSpaPlugin extends AbstractPlugin<WebpackSpaPluginOptions> {
  public apply(applyContext: ApplyContext): void {
    applyContext.hooks.beforeRun.tap('WebpackSpaPlugin', beforeRunContext => {
      const webpackConfig = beforeRunContext.getConfigBuilder(WebpackConfig);

      [
        new TaskStart(webpackConfig, this.optionsContainer),
        new TaskBuild(webpackConfig, this.optionsContainer)
      ].forEach(beforeRunContext.addTask.bind(beforeRunContext));

      webpackConfig.hooks.build.tap(
        'WebpackSpaPlugin',
        (modifications, { isDev, paths }) => {
          const pluginOptions = this.optionsContainer.build();
          const devServerOptions = pluginOptions.devServer;

          if (!isDev) {
            modifications.insertPlugin(new CleanWebpackPlugin());

            modifications.insertPlugin(
              new CopyWebpackPlugin({
                patterns: [
                  {
                    from: paths.publicPath,
                    to: paths.build,
                    globOptions: {
                      ignore: [paths.indexHtml]
                    }
                  }
                ]
              })
            );
          }

          modifications.insertPlugin(
            isDev
              ? new FriendlyErrorsPlugin({
                  compilationSuccessInfo: {
                    messages: [
                      'Your application is available at http://localhost:' +
                        devServerOptions.port
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
                      `Your application successfully built and available at ${paths.build
                        .split(path.sep)
                        .pop()} folder`
                    ]
                  }
                })
          );

          modifications.insertPlugin(
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
      );
    });
  }
}
