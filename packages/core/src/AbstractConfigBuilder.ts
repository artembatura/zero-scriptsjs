import { ConfigModification } from './ConfigModification';
import { AbstractOptionsContainer } from './AbstractOptionsContainer';
import { ExtractOptionsFromOptionsContainer } from './types';

export abstract class AbstractConfigBuilder<
  TConfig extends Record<string, any>,
  TOptionsContainer extends AbstractOptionsContainer
> {
  public readonly modifications: ConfigModification<TConfig, any, any>[] = [];

  constructor(public readonly optionsContainer: TOptionsContainer) {}

  public build(
    createBaseConfig?: (
      options: ExtractOptionsFromOptionsContainer<TOptionsContainer>
    ) => TConfig
  ): TConfig {
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
