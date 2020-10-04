import { output } from '@artemir/friendly-errors-webpack-plugin';
import webpack from 'webpack';

import { Task } from '@zero-scripts/core';
import { WebpackConfig } from '@zero-scripts/webpack-config';

import { WebpackSpaPluginOptions } from '../WebpackSpaPluginOptions';

type WatchTaskOptions = {
  smokeTest?: boolean;
};

export class TaskWatch extends Task {
  constructor(
    protected readonly configBuilder: WebpackConfig,
    protected readonly pluginOptionsContainer: WebpackSpaPluginOptions
  ) {
    super('watch');
  }

  public run(args: string[], options: WatchTaskOptions): void | Promise<void> {
    process.env.NODE_ENV = 'development';

    const config = this.configBuilder.setIsDev(true).build();

    const compiler = webpack(config);

    if (options.smokeTest) {
      compiler.hooks.invalid.tap('WebpackSpaPlugin.smokeTest', () => {
        process.exit(1);
      });

      compiler.hooks.done.tap('WebpackSpaPlugin.smokeTest', () => {
        process.exit(1);
      });
    }

    output.clearConsole();
    output.title('info', 'WAIT', 'Compiling...');

    compiler.watch(
      {
        aggregateTimeout: 300,
        poll: undefined
      },
      err => {
        if (err) throw err;
      }
    );
  }
}
