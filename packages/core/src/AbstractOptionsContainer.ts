import 'reflect-metadata';
import {
  METADATA_OPTIONS,
  METADATA_ROOT_DEPENDENCY_NODE,
  OptionMetadata,
  RootDependencyMetadata
} from './metadata';

export abstract class AbstractOptionsContainer<TOptions> {
  constructor(externalOptions: TOptions) {
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

  public build(): TOptions {
    // exclude non-option members
    const { build, ...options } = this;

    type OptionsMetaArray = (OptionMetadata<TOptions, any> & {
      optionKey: keyof TOptions;
    })[];

    const optionsMeta = Object.keys(options).map(optionKey => {
      if (
        !Reflect.hasMetadata(
          METADATA_OPTIONS,
          this.constructor.prototype,
          optionKey
        )
      ) {
        throw new Error(
          `Must need to use Option decorator on your ${
            this.constructor.name
          } properties`
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

    const resolvedOptions = rootNode
      .resolve()
      .filter(node => node.id !== 'root')
      .map(
        node =>
          optionsMeta.find(
            meta => meta.optionKey === node.id
          ) as OptionsMetaArray[0]
      );

    const builtOptions: TOptions = resolvedOptions.reduce(
      (result, { optionKey, getOptionValue, externalValue }) => ({
        ...result,
        [optionKey]: getOptionValue
          ? getOptionValue(result, externalValue)
          : (this as any)[optionKey]
      }),
      {} as TOptions
    );

    // apply post modifier
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
