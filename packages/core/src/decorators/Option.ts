import 'reflect-metadata';

import { DependencyNode } from '../graph';
import {
  METADATA_OPTIONS,
  METADATA_ROOT_DEPENDENCY_NODE,
  OptionMetadata,
  RootDependencyMetadata
} from '../metadata';

export function Option<
  T,
  TOption extends keyof T,
  TDependency extends (keyof T & string) | undefined = undefined
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

        const prevMeta: Pick<
          OptionMetadata<any, any>,
          'externalValue'
        > = Reflect.getMetadata(
          METADATA_OPTIONS,
          this.constructor.prototype,
          propertyName
        );

        if (prevMeta) {
          Reflect.deleteMetadata(
            METADATA_OPTIONS,
            this.constructor.prototype,
            propertyName
          );
        }

        Reflect.defineMetadata(
          METADATA_OPTIONS,
          {
            ...prevMeta,
            getOptionValue,
            postModifier
          } as OptionMetadata<any, any>,
          target,
          propertyName
        );

        if (!Reflect.hasMetadata(METADATA_ROOT_DEPENDENCY_NODE, target)) {
          Reflect.defineMetadata(
            METADATA_ROOT_DEPENDENCY_NODE,
            {
              instance: new DependencyNode('root')
            },
            target
          );
        }

        const {
          instance: rootNode
        }: RootDependencyMetadata = Reflect.getMetadata(
          METADATA_ROOT_DEPENDENCY_NODE,
          target
        );

        const node = rootNode.addOrGetEdge(propertyName);

        dependencies.forEach(propertyName => {
          node.addOrGetEdge(propertyName as string);
        });
      },
      enumerable: true,
      configurable: true
    });
  };
}
