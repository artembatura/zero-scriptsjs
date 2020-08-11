import express from 'express';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

import { Task } from '@zero-scripts/core';
import { WebpackConfig } from '@zero-scripts/webpack-config';

import { WebpackSpaPluginOptions } from '../WebpackSpaPluginOptions';

type StartTaskOptions = {
  port?: number;
  smokeTest?: boolean;
};

export class TaskStart extends Task<WebpackConfig, WebpackSpaPluginOptions> {
  public run(args: string[], options: StartTaskOptions): void | Promise<void> {
    if (!this.isBound()) {
      return this.printIfNotBound();
    }

    process.env.NODE_ENV = 'development';

    const config = this.configBuilder
      .setIsDev(true)
      .addEntry(require.resolve('webpack-hot-middleware/client'))
      .build();

    const compiler = webpack(config);

    const devServer = express();

    devServer.use(webpackDevMiddleware(compiler));

    devServer.use(
      webpackHotMiddleware(compiler, {
        log: false,
        path: '/__webpack_hmr',
        heartbeat: 10 * 1000
      })
    );

    // for e2e tests
    if (options.smokeTest) {
      compiler.hooks.invalid.tap('WebpackSpaPlugin.smokeTest', () => {
        process.exit(1);
      });

      devServer.get('/terminate-dev-server', () => {
        process.exit(1);
      });
    }

    devServer.listen(options.port || 8080);
  }
}
