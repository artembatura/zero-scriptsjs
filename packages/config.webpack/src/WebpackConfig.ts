import { Configuration, Plugin, RuleSetRule } from 'webpack';
import {
  AbstractConfigBuilder,
  ConfigModification,
  InsertPos,
  ReadOptions
} from '@zero-scripts/core';
import { createWebpackConfiguration } from './createWebpackConfiguration';
import { OneOfModification } from './modifications/OneOfModification';
import { WebpackConfigOptions } from './WebpackConfigOptions';

@ReadOptions()
export class WebpackConfig extends AbstractConfigBuilder<
  Configuration,
  WebpackConfigOptions,
  ConfigModification<Configuration, WebpackConfigOptions, any>
> {
  constructor(options: WebpackConfigOptions) {
    super(new WebpackConfigOptions(options));
  }

  public addEntry(entry: string): this {
    this.options.additionalEntry.push(entry);
    return this;
  }

  public setIsDev(isDev: boolean): this {
    this.options.isDev = isDev;
    return this;
  }

  public insertPlugin(
    getPlugin: (options: WebpackConfigOptions) => Plugin | undefined,
    position: InsertPos = InsertPos.End,
    modificationId?: string
  ) {
    this.modifications.push(
      new ConfigModification(
        c => c.plugins,
        ConfigModification.arrayInsertCreator(getPlugin, position),
        modificationId
      )
    );
    return this;
  }

  protected getOneOfModification(): OneOfModification {
    const foundModification = this.modifications.find(
      modification => modification.id === OneOfModification.id
    );

    if (!foundModification) {
      const modification = new OneOfModification();
      this.modifications.push(modification);
      return modification;
    } else {
      return foundModification as OneOfModification;
    }
  }

  public insertModuleRule(
    getRule: (options: WebpackConfigOptions) => RuleSetRule,
    position: InsertPos = InsertPos.Middle
  ) {
    this.getOneOfModification().rules.push({ getRule, position });
    return this;
  }

  public insertCommonModuleRule(
    getRule: (options: WebpackConfigOptions) => RuleSetRule,
    position: InsertPos = InsertPos.Middle,
    modificationId?: string
  ): this {
    this.modifications.push(
      new ConfigModification(
        c => c.module.rules,
        ConfigModification.arrayInsertCreator(getRule, position),
        modificationId
      )
    );
    return this;
  }

  public build(): Configuration {
    return super.build(createWebpackConfiguration);
  }
}
