import fastify from 'fastify';
import { IncomingMessage, Server, ServerResponse } from 'http';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

import { WebpackConfig } from '@zero-scripts/config.webpack';
import { AbstractPreset } from '@zero-scripts/core';

export class WebpackPresetSpa extends AbstractPreset {
  public constructor(defaultExtensions: string[] = []) {
    super(['@zero-scripts/extension.webpack-spa', ...defaultExtensions]);

    this.scripts.set('start', async ({ options }) => {
      process.env.NODE_ENV = 'development';

      const builder = this.getInstance(WebpackConfig);

      const config = builder
        .setIsDev(true)
        .addEntry(require.resolve('webpack-hot-middleware/client'))
        .build();

      const compiler = webpack([config]);

      const server: fastify.FastifyInstance<
        Server,
        IncomingMessage,
        ServerResponse
      > = fastify();

      // for e2e tests
      if (options.smokeTest) {
        compiler.hooks.invalid.tap('smokeTest', () => {
          process.exit(1);
        });

        server.get('/terminate-dev-server', () => {
          process.exit(1);
        });
      }

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

      await server.listen(parseInt(options.port as string) || 8080, err => {
        if (err) throw err;
      });
    });

    this.scripts.set('build', async () => {
      process.env.NODE_ENV = 'production';

      const builder = this.getInstance(WebpackConfig);

      const config = builder.setIsDev(false).build();

      const compiler = webpack(config);

      compiler.run(err => {
        if (err) throw err;
      });
    });
  }
}
