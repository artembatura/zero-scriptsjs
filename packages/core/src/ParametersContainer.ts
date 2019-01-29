import { DependencyNode } from './DependencyNode';
import 'reflect-metadata';

export class ParametersContainer<TParameters> {
  constructor(externalParameters: TParameters) {
    Object.keys(externalParameters).forEach(option => {
      const prevMeta = Reflect.getMetadata(
        'data',
        this.constructor.prototype,
        option
      );

      if (prevMeta) {
        Reflect.deleteMetadata('data', this.constructor.prototype, option);
      }

      Reflect.defineMetadata(
        'data',
        {
          ...(prevMeta ? prevMeta : {}),
          externalValue: (externalParameters as any)[option]
        },
        this.constructor.prototype,
        option
      );
    });
  }

  public build(): TParameters {
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
}
