import { AbstractPreset } from '@zero-scripts/core';
import webpack from 'webpack';
import fastify from 'fastify';
import { IncomingMessage, Server, ServerResponse } from 'http';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import { WebpackConfig } from '@zero-scripts/config.webpack';
import { extensions as localExtensions } from './extensions';

export class WebpackPresetWeb extends AbstractPreset {
  constructor() {
    super([]);

    this.scripts.set('start', async () => {
      process.env.NODE_ENV = 'development';

      const builder = this.getInstance(WebpackConfig);

      const config = builder
        .isDev(true)
        .addEntry(require.resolve('webpack-hot-middleware/client'))
        .pipe(localExtensions)
        .build();

      const compiler = webpack(config);

      const server: fastify.FastifyInstance<
        Server,
        IncomingMessage,
        ServerResponse
      > = fastify();

      server.use(
        webpackDevMiddleware(compiler, {
          stats: config.stats,
          publicPath: (config.output as webpack.Output).publicPath as string,
          logLevel: 'SILENT'
        })
      );

      server.use(
        webpackHotMiddleware(compiler, {
          log: false
        })
      );

      await server.listen(8080, (err, address) => {
        if (err) throw err;
      });
    });

    this.scripts.set('build', async () => {
      process.env.NODE_ENV = 'production';

      const builder = this.getInstance(WebpackConfig);

      const config = builder
        .isDev(false)
        .pipe(localExtensions)
        .build();

      const compiler = webpack(config);

      compiler.run(err => {
        if (err) throw err;
      });
    });
  }
}
