import 'reflect-metadata';
import { DependencyNode } from '../graph';

export function Option<
  T,
  TOption extends keyof T,
  TDependency extends keyof T & string | undefined = undefined
>(
  getValue?: (data: {
    dependencies: TDependency extends keyof T
      ? { [K in TDependency]: T[K] }
      : undefined;
    defaultValue: T[TOption];
    externalValue: T[TOption];
  }) => T[TOption],
  dependencies: TDependency[] = [],
  postModifier?: (
    value: T[TOption],
    options: { [K in keyof T]: T[K] }
  ) => T[TOption]
) {
  return (target: any, propertyName: string) => {
    const values = new Map();

    Object.defineProperty(target, propertyName, {
      set(firstValue: any) {
        Object.defineProperty(this, propertyName, {
          get() {
            return values.get(this);
          },
          set(value: any) {
            values.set(this, value);
          },
          enumerable: true
        });

        this[propertyName] = firstValue;

        const getOptionValue = (options: any, externalValue: any) => {
          const defaultValue = this[propertyName];

          if (getValue) {
            return getValue({
              dependencies:
                dependencies.length > 0
                  ? (dependencies as (keyof T)[]).reduce(
                      (object, dependency) => ({
                        ...object,
                        [dependency]: options[dependency] || this[dependency]
                      }),
                      {} as T
                    )
                  : ({} as any),
              defaultValue,
              externalValue
            });
          }

          return externalValue !== undefined ? externalValue : defaultValue;
        };

        // WebpackConfig: [paths, moduleFileExtensions, ...]
        // WebpackConfig.paths: []

        const prevMeta = Reflect.getMetadata(
          'data',
          this.constructor.prototype,
          propertyName
        );

        if (prevMeta) {
          Reflect.deleteMetadata(
            'data',
            this.constructor.prototype,
            propertyName
          );
        }

        Reflect.defineMetadata(
          'data',
          {
            ...prevMeta,
            getOptionValue,
            dependencies,
            postModifier
          },
          target,
          propertyName
        );

        const dependencyNodes = Reflect.getMetadata('dependency-nodes', target);
        Reflect.deleteMetadata('dependency-nodes', target);
        const cloneNodes: any[] = dependencyNodes
          ? dependencyNodes.slice(0)
          : [];

        let node = cloneNodes.find(node => node.id === propertyName);
        if (!node) {
          node = new DependencyNode(propertyName);
          dependencies.forEach(propertyName => {
            let edgeNode = cloneNodes.find(node => node.id === propertyName);
            if (!edgeNode) {
              edgeNode = new DependencyNode(propertyName as string);
              node.edges.push(edgeNode);
              cloneNodes.push(edgeNode);
            } else {
              node.edges.push(edgeNode);
            }
          });
          cloneNodes.push(node);
        }

        Reflect.defineMetadata('dependency-nodes', cloneNodes, target);
      },
      enumerable: true,
      configurable: true
    });
  };
}
