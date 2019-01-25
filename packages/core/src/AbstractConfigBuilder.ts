import { flatten } from './utils/flatten';
import { unflatten } from './utils/unflatten';
import { Selector } from './Selector';
import { extractFirstPropChain } from './utils/extractFirstPropChain';
import { InsertPos } from './InsertPos';
import { ConfigModification } from './ConfigModification';
import 'reflect-metadata';

export abstract class AbstractConfigBuilder<
  TConfig extends Record<string, any>,
  TOptions
> {
  private readonly modifications: ConfigModification[] = [];

  public constructor(externalOptions: TOptions) {
    Object.keys(externalOptions).forEach(option => {
      if (
        this.hasOwnProperty(option) &&
        typeof (this as any)[option] !== 'function'
      ) {
        Reflect.defineMetadata(
          'data',
          {
            externalValue: (externalOptions as any)[option]
          },
          this.constructor.prototype,
          option
        );
      }
    });
  }

  public build(createBaseConfig?: (options: TOptions) => TConfig): TConfig {
    const options = this.resolveOptions();
    console.log(options);
    const flattenConfig = createBaseConfig
      ? flatten(createBaseConfig(options))
      : new Map();
    const appliedModifications: ConfigModification[] = [];
    this.modifications.forEach(modifier => {
      if (
        !modifier.id ||
        !appliedModifications.some(
          appliedModifier =>
            Boolean(appliedModifier.id) && appliedModifier.id === modifier.id
        )
      ) {
        appliedModifications.push(modifier.apply(flattenConfig));
      }
    });
    // require('fs').writeFileSync(
    //   'webpack-config-generated.json',
    //   JSON.stringify(unflatten<any>(flattenConfig))
    // );
    return unflatten<TConfig>(flattenConfig);
  }

  public resolveOptions(): TOptions {
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
              getOptionValue: metadata.getOptionValue
            }
          );
        },
        {} as any
      )
      .filter(Boolean);

    for (let k = 0; k < optionsMeta.length; k++) {
      optionsMeta.forEach((el, i) => {
        const { optionKey } = el;
        const index = optionsMeta.findIndex(
          findEl => findEl.dependencies.indexOf(optionKey) !== -1
        );
        if (index !== -1 && index < i) {
          optionsMeta = optionsMeta.filter(
            findEl => findEl.optionKey !== optionKey
          );
          optionsMeta.splice(index, 0, el);
        }
      });
    }

    return optionsMeta.reduce(
      (result, { optionKey, getOptionValue }) => ({
        ...result,
        [optionKey]: getOptionValue
          ? getOptionValue(result)
          : (this as any)[optionKey]
      }),
      {}
    ) as any;
  }

  // this.modifications.push(
  //   Modification.array(...)
  // )
  protected addModification<TSelectedValue>(
    selector: Selector<Required<TConfig>, TSelectedValue>,
    handler: (selectedValue: TSelectedValue) => TSelectedValue,
    modificationId: string | undefined
  ): this {
    const path = extractFirstPropChain(String(selector));

    if (!path) {
      throw new Error(
        `[${this.constructor.name}]: Parsing prop chain failed from selector`
      );
    }

    this.modifications.push(
      new ConfigModification(
        path,
        config => handler(config.get(path)),
        modificationId
      )
    );

    return this;
  }

  protected insert<TSelectedValue extends any[]>(
    selector: Selector<Required<TConfig>, TSelectedValue>,
    creator: (options: TOptions) => TSelectedValue[0] | undefined,
    position: InsertPos,
    modificationId: string | undefined
  ): this {
    return this.addModification(
      selector,
      (array: any[]) => {
        const element = creator(this.resolveOptions());

        if (!element) {
          return array;
        }

        if (!array) {
          return [element];
        }

        switch (position) {
          case InsertPos.Start:
            return [element, ...array];

          case InsertPos.Middle:
            array.splice(array.length / 2, 0, element);
            return array.slice(0);

          case InsertPos.End:
            return [...array, element];

          default:
            throw new Error(
              `[${
                this.constructor.name
              }]: Insert position '${position}' doesn't exists`
            );
        }
      },
      modificationId
    );
  }

  public pipe<T extends (o: this) => this>(func: T | T[]): this {
    if (Array.isArray(func)) {
      func.forEach(f => f(this));
      return this;
    }
    return func(this);
  }
}
