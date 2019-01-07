import { Configuration, RuleSetRule, Plugin } from 'webpack';
import { AbstractConfigBuilder, InsertPos } from '@zero-scripts/core';
import { validateWebpackConfig } from './validateWebpackConfig';
import { createWebpackConfig } from './createWebpackConfig';
import { WebpackConfigOptions } from './WebpackConfigOptions';
import { resolvePath } from './utils/resolvePath';
import { ReadOptions } from '@zero-scripts/core';

@ReadOptions()
export class WebpackConfig extends AbstractConfigBuilder<
  Configuration,
  WebpackConfigOptions
> {
  constructor({ sourceMap = true }: Partial<WebpackConfigOptions>) {
    super({
      isDev: false,
      entry: [],
      sourceMap,
      moduleFileExtensions: ['.js', '.mjs', '.json'],
      jsFileExtensions: ['js', 'mjs'],
      paths: {
        root: resolvePath(''),
        src: resolvePath('src'),
        build: resolvePath('build'),
        indexJs: resolvePath('src/index.js'),
        indexHtml: resolvePath('public/index.html'),
        public: resolvePath('public')
      }
    });
  }

  public addEntry(entry: string) {
    this.options.entry.push(entry);
    return this;
  }

  public isDev(isDev: boolean): this {
    this.options.isDev = isDev;
    return this;
  }

  public build(): Configuration {
    const config = super.build(
      ({ paths, moduleFileExtensions, isDev, entry, sourceMap }) =>
        createWebpackConfig({
          isDev,
          sourceMap,
          entry: [paths.indexJs, ...entry],
          outputPath: paths.build,
          resolveExtensions: moduleFileExtensions
        })
    );

    return validateWebpackConfig(config);
  }

  public insertPlugin(
    getPlugin: (options: WebpackConfigOptions) => Plugin | undefined,
    position: InsertPos = InsertPos.End
  ) {
    return this.insert(c => c.plugins, getPlugin, position);
  }

  public insertModuleRule(
    getRule: (options: WebpackConfigOptions) => RuleSetRule,
    position: InsertPos = InsertPos.Middle
  ): this {
    return this.insert(c => c.module.rules, getRule, position);
  }
}
