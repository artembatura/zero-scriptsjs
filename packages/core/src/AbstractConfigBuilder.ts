import { flatten } from './utils/flatten';
import { unflatten } from './utils/unflatten';
import { Selector } from './Selector';
import { extractFirstPropChain } from './utils/extractFirstPropChain';
import { InsertPos } from './InsertPos';
import { ConfigModification } from './ConfigModification';

export abstract class AbstractConfigBuilder<
  TConfig extends Record<string, any>,
  TOptions
> {
  private readonly modifications: ConfigModification[] = [];

  protected constructor(protected readonly options: TOptions) {}

  public build(createBaseConfig?: (options: TOptions) => TConfig): TConfig {
    const flattenConfig = createBaseConfig
      ? flatten(createBaseConfig(this.options))
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

  protected set<TSelectedValue>(
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
    return this.set(
      selector,
      (array: any[]) => {
        const element = creator(this.options);

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
