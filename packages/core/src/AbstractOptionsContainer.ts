import 'reflect-metadata';

import { SyncHook } from 'tapable';

import { resolve } from './graph';
import {
  METADATA_OPTIONS,
  METADATA_ROOT_DEPENDENCY_NODE,
  OptionMetadata,
  RootDependencyMetadata
} from './metadata';
import { ExtractOptions } from './types';

export abstract class AbstractOptionsContainer<
  TArgHook extends AbstractOptionsContainer = any
> {
  public readonly hooks = {
    beforeBuild: new SyncHook<[TArgHook]>(['optionsContainer'])
  };

  public constructor(externalOptions?: Record<string, unknown>) {
    if (!externalOptions) {
      return;
    }

    Object.keys(externalOptions).forEach(option => {
      const prevMeta = Reflect.getMetadata(
        METADATA_OPTIONS,
        this.constructor.prototype,
        option
      );

      if (prevMeta) {
        Reflect.deleteMetadata(
          METADATA_OPTIONS,
          this.constructor.prototype,
          option
        );
      }

      Reflect.defineMetadata(
        METADATA_OPTIONS,
        {
          ...(prevMeta ? prevMeta : {}),
          externalValue: (externalOptions as any)[option]
        },
        this.constructor.prototype,
        option
      );
    });
  }

  public build<T extends ExtractOptions<this>>(): T {
    this.hooks.beforeBuild.call(this as any);

    const properties = Object.getOwnPropertyNames(this).filter(
      prop => prop !== 'hooks'
    );

    type OptionsMetaArray = (OptionMetadata<T, any> & {
      optionKey: keyof T;
    })[];

    const optionsMeta = properties.map(optionKey => {
      if (
        !Reflect.hasMetadata(
          METADATA_OPTIONS,
          this.constructor.prototype,
          optionKey
        )
      ) {
        throw new Error(
          `Must need to use Option decorator on your ${this.constructor.name} properties`
        );
      }

      return {
        ...Reflect.getMetadata(
          METADATA_OPTIONS,
          this.constructor.prototype,
          optionKey
        ),
        optionKey
      };
    }) as OptionsMetaArray;

    const { instance: rootNode }: RootDependencyMetadata = Reflect.getMetadata(
      METADATA_ROOT_DEPENDENCY_NODE,
      this.constructor.prototype
    );

    const resolvedOptions = resolve(rootNode)
      .filter(node => node.id !== 'root')
      .map(
        node =>
          optionsMeta.find(
            meta => meta.optionKey === node.id
          ) as OptionsMetaArray[0]
      );

    const builtOptions: T = resolvedOptions.reduce(
      (result, { optionKey, getOptionValue, externalValue }) => ({
        ...result,
        [optionKey]: getOptionValue
          ? getOptionValue(result, externalValue)
          : (this as any)[optionKey]
      }),
      {} as T
    );

    optionsMeta.forEach(({ optionKey, postModifier }) => {
      if (postModifier) {
        builtOptions[optionKey] = postModifier(
          builtOptions[optionKey],
          builtOptions
        );
      }
    });

    return builtOptions;
  }
}
