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

      // for e2e tests
      if (options.smokeTest) {
        compiler.hooks.invalid.tap('smokeTest', async () => {
          setTimeout(() => {
            process.exit(1);
          }, 350);
        });

        // compiler.hooks.done.tap('smokeTest', async stats => {
        //   setTimeout(() => {
        //     if (stats.hasErrors() || stats.hasWarnings()) {
        //       process.exit(1);
        //     } else {
        //       process.exit(0);
        //     }
        //   }, 350);
        // });
      }

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
