import webpack from 'webpack';

import { Task } from '@zero-scripts/core';
import { WebpackConfig } from '@zero-scripts/webpack-config';

import { WebpackSpaPluginOptions } from '../WebpackSpaPluginOptions';

export class TaskWatch extends Task {
  constructor(
    protected readonly configBuilder: WebpackConfig,
    protected readonly pluginOptionsContainer: WebpackSpaPluginOptions
  ) {
    super('watch');
  }

  public run(): void | Promise<void> {
    process.env.NODE_ENV = 'development';

    const config = this.configBuilder.setIsDev(true).build();

    const compiler = webpack(config);

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
