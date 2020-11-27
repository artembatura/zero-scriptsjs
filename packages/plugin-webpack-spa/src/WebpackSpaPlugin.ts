import { FriendlyErrorsWebpackPlugin } from '@artemir/friendly-errors-webpack-plugin';
import InterpolateHtmlPlugin from '@k88/interpolate-html-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import { HotAcceptPlugin } from 'hot-accept-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import path from 'path';
import { HotModuleReplacementPlugin } from 'webpack';

import {
  ApplyContext,
  AbstractPlugin,
  InsertPos,
  ReadOptions,
  getCurrentTaskMeta
} from '@zero-scripts/core';
import { WebpackConfig } from '@zero-scripts/webpack-config';

import { TaskStart, TaskBuild, TaskWatch } from './tasks';
import { WebpackSpaPluginOptions } from './WebpackSpaPluginOptions';

@ReadOptions(WebpackSpaPluginOptions, 'plugin-webpack-spa')
export class WebpackSpaPlugin extends AbstractPlugin<WebpackSpaPluginOptions> {
  public apply(applyContext: ApplyContext): void {
    applyContext.hooks.beforeRun.tap('WebpackSpaPlugin', beforeRunContext => {
      const webpackConfig = beforeRunContext.getConfigBuilder(WebpackConfig);

      [TaskStart, TaskBuild, TaskWatch].forEach(Task => {
        const task = new Task(webpackConfig, this.optionsContainer);

        beforeRunContext.addTask(task);
      });

      webpackConfig.hooks.build.tap(
        'WebpackSpaPlugin',
        (modifications, { isDev, paths }) => {
          const pluginOptions = this.optionsContainer.build();
          const devServerOptions = pluginOptions.devServer;

          const taskMeta = getCurrentTaskMeta<
            TaskStart | TaskBuild | TaskWatch
          >();

          const isBuildTask = taskMeta?.instance instanceof TaskBuild;
          const isWatchTask = taskMeta?.instance instanceof TaskWatch;
          const isStartTask = taskMeta?.instance instanceof TaskStart;

          if (isBuildTask || isWatchTask) {
            modifications.insertPlugin(
              new CopyWebpackPlugin({
                patterns: [
                  {
                    from: paths.public,
                    to: paths.build,
                    globOptions: {
                      ignore: [paths.indexHtml]
                    }
                  }
                ]
              }) as any
            );
          }

          if (isStartTask) {
            modifications.insertPlugin(
              new FriendlyErrorsWebpackPlugin({
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
            );

            modifications.insertPlugin(new HotModuleReplacementPlugin());

            modifications.insertPlugin(
              new HotAcceptPlugin({
                test: path.basename(paths.indexJs)
              })
            );
          }

          if (isBuildTask) {
            modifications.insertPlugin(new CleanWebpackPlugin());

            modifications.insertPlugin(
              new FriendlyErrorsWebpackPlugin({
                compilationSuccessInfo: {
                  messages: [
                    `Your application successfully built and available at ${paths.build
                      .split(path.sep)
                      .pop()} folder`
                  ]
                }
              })
            );
          }

          if (isWatchTask) {
            modifications.insertPlugin(
              new FriendlyErrorsWebpackPlugin({
                compilationSuccessInfo: {
                  messages: [
                    `Your application successfully built and available at ${paths.build
                      .split(path.sep)
                      .pop()} folder`
                  ]
                }
              })
            );
          }

          modifications.insertPlugin(
            new InterpolateHtmlPlugin({
              PUBLIC_URL: paths.publicUrlOrPath.endsWith('/')
                ? paths.publicUrlOrPath.slice(0, -1)
                : paths.publicUrlOrPath
            })
          );

          modifications.insertPlugin(
            new HtmlWebpackPlugin({
              inject: true,
              cache: !isWatchTask,
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
