import webpack from 'webpack';

import { Task } from '@zero-scripts/core';
import { WebpackConfig } from '@zero-scripts/webpack-config';

import { WebpackSpaPluginOptions } from '../WebpackSpaPluginOptions';

export class TaskBuild extends Task<WebpackConfig, WebpackSpaPluginOptions> {
  public run(args: string[], options: any): void | Promise<void> {
    if (!this.isBound()) {
      return this.printIfNotBound();
    }

    process.env.NODE_ENV = 'production';

    const config = this.configBuilder.setIsDev(false).build();

    const compiler = webpack(config);

    compiler.run(err => {
      if (err) throw err;
    });
  }
}
