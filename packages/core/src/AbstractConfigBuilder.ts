import { flatten } from './utils/flatten';
import { unflatten } from './utils/unflatten';
import { ConfigModification } from './ConfigModification';
import { OptionsContainer } from './OptionsContainer';

export abstract class AbstractConfigBuilder<
  TConfig extends Record<string, any>,
  TOptions extends OptionsContainer,
  TConfigModification extends ConfigModification<TConfig, TOptions, any>
> {
  public readonly modifications: TConfigModification[] = [];

  constructor(public readonly options: TOptions) {}

  public build(createBaseConfig?: (options: TOptions) => TConfig): TConfig {
    const options = this.options.build();
    const flattenConfig = createBaseConfig
      ? flatten(createBaseConfig(options))
      : new Map();
    const appliedModifications: TConfigModification[] = [];
    this.modifications.forEach(modifier => {
      if (
        !modifier.id ||
        !appliedModifications.some(
          appliedModifier =>
            Boolean(appliedModifier.id) && appliedModifier.id === modifier.id
        )
      ) {
        appliedModifications.push(modifier.apply(flattenConfig, options));
      }
    });
    // require('fs').writeFileSync(
    //   'webpack-config-generated.json',
    //   JSON.stringify(unflatten(flattenConfig))
    // );
    return unflatten(flattenConfig) as TConfig;
  }

  public pipe<T extends (o: this) => this>(func: T | T[]): this {
    if (Array.isArray(func)) {
      func.forEach(f => f(this));
      return this;
    }
    return func(this);
  }
}
