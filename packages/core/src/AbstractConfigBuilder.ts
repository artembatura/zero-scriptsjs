import { flatten } from './utils/flatten';
import { unflatten } from './utils/unflatten';
import { ConfigModification } from './ConfigModification';
import { ParametersContainer } from './ParametersContainer';

export abstract class AbstractConfigBuilder<
  TConfig extends Record<string, any>,
  TParameters extends Record<string, any>,
  TConfigModification extends ConfigModification<TConfig, TParameters, any>,
  TParametersContainer extends ParametersContainer<TParameters>
> {
  public readonly modifications: TConfigModification[] = [];

  constructor(public readonly parameters: TParametersContainer) {}

  public build(
    createBaseConfig?: (parameters: TParameters) => TConfig
  ): TConfig {
    const parameters = this.parameters.build();
    const flattenConfig = createBaseConfig
      ? flatten(createBaseConfig(parameters))
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
        appliedModifications.push(modifier.apply(flattenConfig, parameters));
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
