import { Configuration, RuleSetRule, Plugin } from 'webpack';
import { AbstractConfigBuilder, InsertPos } from '@zero-scripts/core';
import { validateWebpackConfig } from './validateWebpackConfig';
import { createWebpackConfig } from './createWebpackConfig';
import { WebpackConfigOptions } from './WebpackConfigOptions';
import { resolvePath } from './utils';
import { ReadOptions } from '@zero-scripts/core';
import { resolveModule } from './utils';

@ReadOptions()
export class WebpackConfig extends AbstractConfigBuilder<
  Configuration,
  WebpackConfigOptions
> {
  constructor({
    sourceMap = true,
    paths,
    additionalEntry = [],
    moduleFileExtensions = [],
    jsFileExtensions = []
  }: Partial<WebpackConfigOptions>) {
    super({
      isDev: false,
      additionalEntry,
      sourceMap,
      moduleFileExtensions: ['.js', '.mjs', '.json', ...moduleFileExtensions],
      jsFileExtensions: ['js', 'mjs', ...jsFileExtensions],
      paths: {
        root: '',
        src: 'src',
        build: 'build',
        indexJs: 'src/index',
        indexHtml: 'public/index.html',
        public: 'public',
        tsConfig: 'tsconfig.json',
        ...(paths ? paths : {})
      }
    });
  }

  public addJsFileExtension(extension: string): this {
    this.options.jsFileExtensions.push(extension);
    const extensionWithDot = '.' + extension;
    if (!this.options.moduleFileExtensions.includes(extensionWithDot)) {
      this.options.moduleFileExtensions.push(extensionWithDot);
    }
    return this;
  }

  public addJsFileExtensions(extensions: string[]): this {
    extensions.forEach(extension => {
      this.addJsFileExtension(extension);
    });
    return this;
  }

  public addEntry(entry: string): this {
    this.options.additionalEntry.push(entry);
    return this;
  }

  public isDev(isDev: boolean): this {
    this.options.isDev = isDev;
    return this;
  }

  public build(): Configuration {
    const config = super.build(
      ({
        paths,
        moduleFileExtensions,
        isDev,
        additionalEntry,
        sourceMap,
        jsFileExtensions
      }) =>
        createWebpackConfig({
          isDev,
          sourceMap,
          entry: [
            resolveModule(jsFileExtensions, paths.indexJs),
            ...additionalEntry
          ],
          outputPath: resolvePath(paths.build),
          resolveExtensions: moduleFileExtensions
        })
    );

    return validateWebpackConfig(config);
  }

  public insertPlugin(
    getPlugin: (options: WebpackConfigOptions) => Plugin | undefined,
    position: InsertPos = InsertPos.End,
    modificationId?: string
  ) {
    return this.insert(c => c.plugins, getPlugin, position, modificationId);
  }

  public insertModuleRule(
    getRule: (options: WebpackConfigOptions) => RuleSetRule,
    position: InsertPos = InsertPos.Middle,
    modificationId?: string
  ): this {
    return this.insert(c => c.module.rules, getRule, position, modificationId);
  }
}
