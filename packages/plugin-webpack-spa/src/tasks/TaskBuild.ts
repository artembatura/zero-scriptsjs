import webpack from 'webpack';

import { Task } from '@zero-scripts/core';
import { WebpackConfig } from '@zero-scripts/webpack-config';

import { WebpackSpaPluginOptions } from '../WebpackSpaPluginOptions';

export class TaskBuild extends Task {
  constructor(
    protected readonly configBuilder: WebpackConfig,
    protected readonly pluginOptionsContainer: WebpackSpaPluginOptions
  ) {
    super('build');
  }

  public run(): void | Promise<void> {
    process.env.NODE_ENV = 'production';

    const config = this.configBuilder.setIsDev(false).build();

    const compiler = webpack(config);

    compiler.run(err => {
      if (err) throw err;
    });
  }
}
