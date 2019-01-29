import { Configuration, Plugin, RuleSetRule } from 'webpack';
import { WebpackConfigOptions } from './WebpackConfigOptions';
import {
  AbstractConfigBuilder,
  InsertPos,
  ReadOptions,
  ConfigModification
} from '@zero-scripts/core';
import { createWebpackConfiguration } from './createWebpackConfiguration';
import { OneOfModification } from './OneOfModification';
import { WebpackConfigParameters } from './WebpackConfigParameters';

@ReadOptions()
export class WebpackConfig extends AbstractConfigBuilder<
  Configuration,
  WebpackConfigOptions,
  ConfigModification<Configuration, WebpackConfigOptions, any>,
  WebpackConfigParameters
> {
  constructor(parameters: WebpackConfigOptions) {
    super(new WebpackConfigParameters(parameters));
  }

  public addEntry(entry: string): this {
    this.parameters.additionalEntry.push(entry);
    return this;
  }

  public setIsDev(isDev: boolean): this {
    this.parameters.isDev = isDev;
    return this;
  }

  public insertPlugin(
    getPlugin: (options: WebpackConfigOptions) => Plugin | undefined,
    position: InsertPos = InsertPos.End,
    modificationId?: string
  ) {
    this._modifications.push(
      new ConfigModification(
        c => c.plugins,
        ConfigModification.arrayInsertCreator(getPlugin, position),
        modificationId
      )
    );
    return this;
  }

  protected getOneOfModification(): OneOfModification {
    const foundModification = this._modifications.find(
      modification => modification.id === OneOfModification.id
    );

    if (!foundModification) {
      const modification = new OneOfModification();
      this._modifications.push(modification);
      return modification;
    } else {
      return foundModification as OneOfModification;
    }
  }

  public insertModuleRule(
    getRule: (parameters: WebpackConfigOptions) => RuleSetRule,
    position: InsertPos = InsertPos.Middle
  ) {
    const modification = this.getOneOfModification();
    modification.rules.push({ getRule, position });
    return this;
  }

  public insertCommonModuleRule(
    getRule: (options: WebpackConfigOptions) => RuleSetRule,
    position: InsertPos = InsertPos.Middle,
    modificationId?: string
  ): this {
    this._modifications.push(
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
