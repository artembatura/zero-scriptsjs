import { flatten } from './utils/flatten';
import { unflatten } from './utils/unflatten';
import { Selector } from './Selector';
import { extractFirstPropChain } from './utils/extractFirstPropChain';
import { InsertPos } from './InsertPos';

export abstract class AbstractConfigBuilder<
  TConfig extends Record<string, any>,
  TOptions
> {
  private readonly modifications: Array<
    (val: Map<string, any>) => Map<string, any>
  > = [];

  protected constructor(protected readonly options: TOptions) {}

  public build(createBaseConfig?: (options: TOptions) => TConfig): TConfig {
    const flattenConfig = createBaseConfig
      ? flatten(createBaseConfig(this.options))
      : new Map();
    this.modifications.forEach(modifier => modifier(flattenConfig));
    // log config
    // fs.writeFileSync(
    //   'webpack-config-generated.json',
    //   JSON.stringify(unflatten<TConfig>(flattenConfig))
    // );
    return unflatten<TConfig>(flattenConfig);
  }

  protected set<TSelectedValue>(
    selector: Selector<Required<TConfig>, TSelectedValue>,
    handler: (selectedValue: TSelectedValue) => TSelectedValue
  ): this {
    // handy hack for set value by selector
    // we convert function to string and parse
    // chain, which used as path in flat object
    const path = extractFirstPropChain(String(selector));

    if (!path) {
      throw new Error(
        `[${this.constructor.name}]: Parsing prop chain failed from selector`
      );
    }

    this.modifications.push(config => {
      const newValue = handler(config.get(path));
      return config.set(path, newValue);
    });

    return this;
  }

  protected insert<TSelectedValue extends any[]>(
    selector: Selector<Required<TConfig>, TSelectedValue>,
    creator: (options: TOptions) => TSelectedValue[0] | undefined,
    position: InsertPos
  ): this {
    return this.set(selector, (array: any[]) => {
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
    });
  }

  public pipe<T extends (o: this) => this>(func: T | T[]): this {
    if (Array.isArray(func)) {
      func.forEach(f => f(this));
      return this;
    }
    return func(this);
  }
}
