import { DependencyNode } from './graph';
import 'reflect-metadata';

export class OptionsContainer {
  constructor(externalParameters: OptionsContainer) {
    Object.keys(externalParameters).forEach(parameter => {
      const prevMeta = Reflect.getMetadata(
        'data',
        this.constructor.prototype,
        parameter
      );

      if (prevMeta) {
        Reflect.deleteMetadata('data', this.constructor.prototype, parameter);
      }

      Reflect.defineMetadata(
        'data',
        {
          ...(prevMeta ? prevMeta : {}),
          externalValue: (externalParameters as any)[parameter]
        },
        this.constructor.prototype,
        parameter
      );
    });
  }

  public build(): this {
    const keysOfOptions = Object.keys(this).filter(
      parameterKey => typeof (this as any)[parameterKey] !== 'function'
    );

    let parametersMeta = keysOfOptions
      .map(
        parameterKey => {
          const metadata = Reflect.getMetadata(
            'data',
            this.constructor.prototype,
            parameterKey
          );

          return (
            metadata && {
              parameterKey,
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
          parametersMeta.find(meta => meta.parameterKey === node.id) ||
          ({} as any)
      );

    const parameters = resolvedOptions.reduce(
      (result, { parameterKey, getOptionValue, externalValue }) => ({
        ...result,
        [parameterKey]: getOptionValue
          ? getOptionValue(result, externalValue)
          : (this as any)[parameterKey]
      }),
      {} as OptionsContainer
    );

    // apply postModifier
    parametersMeta.forEach(({ parameterKey, postModifier }) => {
      if (postModifier) {
        parameters[parameterKey] = postModifier(
          parameters[parameterKey],
          parameters
        );
      }
    });

    return parameters;
  }
}
