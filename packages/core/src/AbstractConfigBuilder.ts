import { AbstractOptionsContainer } from './AbstractOptionsContainer';
import { ConfigModification } from './ConfigModification';
import { ExtractOptionsFromOptionsContainer } from './types';
import { cloneInstance } from './utils/cloneInstance';

export abstract class AbstractConfigBuilder<
  TConfig extends Record<string, any>,
  TOptionsContainer extends AbstractOptionsContainer
> {
  public readonly modifications: ConfigModification<TConfig, any, any>[] = [];
  private readonly _beforeBuild: ((config: this) => any)[] = [];
  private readonly _afterBuild: ((config: TConfig) => any)[] = [];

  public constructor(public readonly optionsContainer: TOptionsContainer) {}

  public build(
    createBaseConfig?: (
      options: ExtractOptionsFromOptionsContainer<TOptionsContainer>
    ) => TConfig
  ): TConfig {
    this._beforeBuild.forEach(func => {
      func(this);
    });
    const options = this.optionsContainer.build();
    const config: TConfig = createBaseConfig
      ? createBaseConfig(options)
      : ({} as TConfig);
    const appliedModifications: ConfigModification<TConfig, any, any>[] = [];
    this.modifications.forEach(modifier => {
      if (
        !modifier.id ||
        !appliedModifications.some(
          appliedModifier =>
            Boolean(appliedModifier.id) && appliedModifier.id === modifier.id
        )
      ) {
        appliedModifications.push(modifier.apply(config, options));
      }
    });
    this._afterBuild.forEach(func => {
      func(config);
    });
    return config;
  }

  public beforeBuild(func: (config: this) => any) {
    this._beforeBuild.push(func);
    return this;
  }

  public afterBuild(func: (config: TConfig) => any) {
    this._afterBuild.push(func);
    return this;
  }

  public clone() {
    return cloneInstance(this);
  }

  public pipe<T extends (o: this) => this>(func: T | T[]): this {
    if (Array.isArray(func)) {
      func.forEach(f => f(this));
      return this;
    }
    return func(this);
  }
}
