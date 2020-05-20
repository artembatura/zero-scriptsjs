import type { Configuration } from 'webpack';

import { AbstractConfigBuilder, ReadOptions } from '@zero-scripts/core';

import { createWebpackConfiguration } from './createWebpackConfiguration';
import { WebpackConfigModifications } from './WebpackConfigModifications';
import { WebpackConfigOptions } from './WebpackConfigOptions';

@ReadOptions(WebpackConfigOptions, 'webpack-config')
export class WebpackConfig extends AbstractConfigBuilder<
  Configuration,
  WebpackConfigOptions,
  WebpackConfigModifications
> {
  constructor(optionsContainer: WebpackConfigOptions) {
    super(optionsContainer, new WebpackConfigModifications());
  }

  public build(): Configuration {
    return super.build(createWebpackConfiguration);
  }

  /**
   * API methods, which designed for changing configuration options inside from tasks
   */

  public addEntry(entry: string): this {
    this.optionsContainer.additionalEntry.push(entry);
    return this;
  }

  public setIsDev(isDev: boolean): this {
    this.optionsContainer.isDev = isDev;
    return this;
  }
}
