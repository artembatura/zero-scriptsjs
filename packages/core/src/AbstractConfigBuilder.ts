import { ConfigModification } from './ConfigModification';
import { AbstractOptionsContainer } from './AbstractOptionsContainer';

export abstract class AbstractConfigBuilder<
  TConfig extends Record<string, any>,
  TOptions extends AbstractOptionsContainer<any>,
  TConfigModification extends ConfigModification<TConfig, TOptions, any>
> {
  public readonly modifications: TConfigModification[] = [];

  constructor(public readonly options: TOptions) {}

  public build(createBaseConfig?: (options: TOptions) => TConfig): TConfig {
    const options = this.options.build();
    const config: TConfig = createBaseConfig
      ? createBaseConfig(options)
      : ({} as TConfig);
    const appliedModifications: TConfigModification[] = [];
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
    // require('fs').writeFileSync(
    //   'webpack-config-generated.json',
    //   JSON.stringify(config)
    // );
    return config;
  }

  public pipe<T extends (o: this) => this>(func: T | T[]): this {
    if (Array.isArray(func)) {
      func.forEach(f => f(this));
      return this;
    }
    return func(this);
  }
}
