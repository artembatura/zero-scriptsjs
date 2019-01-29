import { flatten } from './utils/flatten';
import { unflatten } from './utils/unflatten';
import { ConfigModification } from './ConfigModification';
import 'reflect-metadata';
import { DependencyNode } from './DependencyNode';
import { ParametersContainer } from './ParametersContainer';

export abstract class AbstractConfigBuilder<
  TConfig extends Record<string, any>,
  TParameters extends Record<string, any>,
  TConfigModification extends ConfigModification<TConfig, TParameters, any>,
  TParametersContainer extends ParametersContainer<TParameters>
> {
  public readonly _modifications: TConfigModification[] = [];

  constructor(public readonly parameters: TParametersContainer) {}

  public build(
    createBaseConfig?: (parameters: TParameters) => TConfig
  ): TConfig {
    const parameters = this.buildParameters();
    const flattenConfig = createBaseConfig
      ? flatten(createBaseConfig(parameters))
      : new Map();
    const appliedModifications: TConfigModification[] = [];
    this._modifications.forEach(modifier => {
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

  public buildParameters(): TParameters {
    const keysOfOptions = Object.keys(this).filter(
      optionKey => typeof (this as any)[optionKey] !== 'function'
    );

    let optionsMeta = keysOfOptions
      .map(
        optionKey => {
          const metadata = Reflect.getMetadata(
            'data',
            this.constructor.prototype,
            optionKey
          );

          return (
            metadata && {
              optionKey,
              dependencies: metadata.dependencies,
              getOptionValue: metadata.getOptionValue,
              externalValue: metadata.externalValue,
              postModifier: metadata.postModifier
            }
          );
        },
        {} as any
      )
      .filter(Boolean);

    const dependencyNodes = Reflect.getMetadata(
      'dependency-nodes',
      this.constructor.prototype
    );

    const rootNode = new DependencyNode('root');
    dependencyNodes.forEach((node: DependencyNode) => {
      rootNode.edges.push(node);
    });

    const resolvedOptions = rootNode
      .resolve()
      .map(
        node =>
          optionsMeta.find(meta => meta.optionKey === node.id) || ({} as any)
      );

    const options = resolvedOptions.reduce(
      (result, { optionKey, getOptionValue, externalValue }) => ({
        ...result,
        [optionKey]: getOptionValue
          ? getOptionValue(result, externalValue)
          : (this as any)[optionKey]
      }),
      {} as TParameters
    );

    // apply postModifier
    optionsMeta.forEach(({ optionKey, postModifier }) => {
      if (postModifier) {
        options[optionKey] = postModifier(options[optionKey], options);
      }
    });

    return options;
  }

  public pipe<T extends (o: this) => this>(func: T | T[]): this {
    if (Array.isArray(func)) {
      func.forEach(f => f(this));
      return this;
    }
    return func(this);
  }
}
