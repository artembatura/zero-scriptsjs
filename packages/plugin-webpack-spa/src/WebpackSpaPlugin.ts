import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import fastify from 'fastify';
import _HtmlWebpackPlugin from 'html-webpack-plugin';
import path from 'path';
import ScriptExtHtmlWebpackPlugin from 'script-ext-html-webpack-plugin';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

import {
  PluginAPI,
  AbstractPlugin,
  InsertPos,
  ReadOptions,
  Task
} from '@zero-scripts/core';
import { WebpackConfig } from '@zero-scripts/webpack-config';

import { WebpackSpaPluginOptions } from './WebpackSpaPluginOptions';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const HtmlWebpackPlugin = _HtmlWebpackPlugin as any;

// eslint-disable-next-line @typescript-eslint/no-var-requires
const FriendlyErrorsPlugin = require('@artemir/friendly-errors-webpack-plugin');

type StartTaskOptions = {
  smokeTest: boolean;
  port: string;
};

@ReadOptions(WebpackSpaPluginOptions, 'extension.webpack-spa')
export class WebpackSpaPlugin<
  TOptions extends WebpackSpaPluginOptions = WebpackSpaPluginOptions
> extends AbstractPlugin<TOptions> {
  public apply(ws: PluginAPI): void {
    ws.hooks.beforeRun.tap('WebpackSpaPlugin', api => {
      const webpackConfigBuilder = api.getConfigBuilder(WebpackConfig);

      api.addTask(
        new Task('start').handle((async (
          args: string[],
          options: StartTaskOptions
        ) => {
          process.env.NODE_ENV = 'development';

          const config = webpackConfigBuilder
            .setIsDev(true)
            .addEntry(require.resolve('webpack-hot-middleware/client'))
            .build();

          const compiler = webpack([config]);

          // for e2e tests
          if (options.smokeTest) {
            compiler.hooks.invalid.tap('smokeTest', async () => {
              process.exit(1);
            });

            compiler.hooks.done.tap('smokeTest', async () => {
              process.exit(0);
            });
          }

          const server: fastify.FastifyInstance = fastify();

          server.use(webpackDevMiddleware(compiler));

          server.use(
            webpackHotMiddleware(compiler, {
              log: false
            })
          );

          await server.listen(parseInt(options.port) || 8080, err => {
            if (err) throw err;
          });
        }) as any)
      );

      /**
       * .addTask(() => {
       *   ...
       * }, new TaskParameters())
       */

      api.addTask(
        new Task('build').handle(() => {
          process.env.NODE_ENV = 'production';

          const config = webpackConfigBuilder.setIsDev(false).build();

          const compiler = webpack(config);

          compiler.run(err => {
            if (err) throw err;
          });
        })
      );

      webpackConfigBuilder.hooks.build.tap(
        'WebpackSpaPlugin',
        (modifications, { isDev, paths }) => {
          if (isDev) {
            modifications.insertPlugin(() => new CleanWebpackPlugin());

            modifications.insertPlugin(
              () =>
                new CopyWebpackPlugin([
                  {
                    from: paths.publicPath,
                    to: paths.build,
                    ignore: [paths.indexHtml]
                  }
                ])
            );

            modifications.insertPlugin(
              () =>
                new FriendlyErrorsPlugin({
                  compilationSuccessInfo: {
                    messages: [
                      'Your application is available at http://localhost:8080'
                    ],
                    notes: [
                      'The development build is not optimized',
                      'To create a production build, run `build` script'
                    ]
                  }
                })
            );
          } else {
            modifications.insertPlugin(
              () =>
                new FriendlyErrorsPlugin({
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

          modifications
            .insertPlugin(
              () =>
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
            )
            .insertPlugin(
              () =>
                new ScriptExtHtmlWebpackPlugin({
                  module: /.*.m?js/gm
                })
            );
        }
      );
    });
  }
}
