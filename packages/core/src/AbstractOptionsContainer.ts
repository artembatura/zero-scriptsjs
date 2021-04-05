import 'reflect-metadata';

import { SyncHook } from 'tapable';

import { TaskMetaContainer } from './cli';
import { resolve } from './graph';
import {
  METADATA_OPTIONS,
  METADATA_ROOT_DEPENDENCY_NODE,
  OptionMetadata,
  RootDependencyMetadata
} from './metadata';
import { ExtractOptions } from './types';

function deepClone<T extends any[] | Record<string, any>>(val: T): T {
  if (typeof val === 'object') {
    return JSON.parse(JSON.stringify(val));
  }

  return val;
}

export abstract class AbstractOptionsContainer<
  TArgHook extends AbstractOptionsContainer = any
> {
  public taskMetaContainer?: TaskMetaContainer;

  public readonly hooks = {
    beforeBuild: new SyncHook<[TArgHook]>(['optionsContainer'])
  };

  protected lastSavedOptions?: Record<string, unknown>;

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

  protected get properties(): string[] {
    return Object.getOwnPropertyNames(this).filter(
      prop => !['hooks', 'lastSavedOptions', 'taskMetaContainer'].includes(prop)
    );
  }

  protected saveOptions(): void {
    this.lastSavedOptions = this.properties.reduce((acc, prop) => {
      return { ...acc, [prop]: deepClone(this[prop as keyof this]) };
    }, {});
  }

  protected retrieveOptions(): void {
    const savedOptions = this.lastSavedOptions;

    if (savedOptions) {
      Object.keys(savedOptions).forEach(key => {
        this[key as keyof this] = savedOptions[key] as this[keyof this];
      });
    }

    this.lastSavedOptions = undefined;
  }

  public build<T extends ExtractOptions<this>>(): T {
    this.saveOptions();

    this.hooks.beforeBuild.call(this as any);

    type OptionsMetaArray = (OptionMetadata<T, any> & {
      optionKey: keyof T;
    })[];

    const optionsMeta = this.properties.map(optionKey => {
      if (
        !Reflect.hasMetadata(
          METADATA_OPTIONS,
          this.constructor.prototype,
          optionKey
        )
      ) {
        throw new Error(
          `Must need to use @Option decorator on ${this.constructor.name}.${optionKey} property`
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

    this.retrieveOptions();

    return builtOptions;
  }
}
