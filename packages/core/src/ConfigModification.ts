import { Selector, InsertPos } from './types';
import { extractFirstPropChain } from './utils/extractFirstPropChain';
import setValue from 'set-value';
import getValue from 'get-value';
import { DeepRequired } from './types';

export class ConfigModification<
  TConfig extends Record<string, any>,
  TConfigBuilderOptions extends Record<string, any>,
  TSelectedValue,
  TRequiredConfiguration extends DeepRequired<TConfig> = DeepRequired<TConfig>
> {
  public readonly path: string;

  public constructor(
    selector: Selector<TRequiredConfiguration, TSelectedValue>,
    protected readonly createNewValue: (
      selectedValue: TSelectedValue,
      options: TConfigBuilderOptions
    ) => TSelectedValue,
    public readonly id?: string
  ) {
    this.path = extractFirstPropChain(String(selector));
  }

  public apply(target: TConfig, options: TConfigBuilderOptions): this {
    setValue(
      target,
      this.path,
      this.createNewValue(getValue(target, this.path), options)
    );
    return this;
  }

  public static arrayInsertCreator<TSelectedValue extends any[]>(
    creator: (options: any) => TSelectedValue[0] | undefined,
    position: InsertPos
  ) {
    return (array: TSelectedValue, options: any): TSelectedValue => {
      const element = creator(options);

      if (!element) {
        return array;
      }

      if (!array) {
        return [element] as TSelectedValue;
      }

      switch (position) {
        case InsertPos.Start:
          return [element, ...array] as TSelectedValue;

        case InsertPos.Middle:
          array.splice(array.length / 2, 0, element);
          return array.slice(0) as TSelectedValue;

        case InsertPos.End:
          return [...array, element] as TSelectedValue;

        default:
          throw new Error(
            `[${
              this.constructor.name
            }]: Insert position '${position}' doesn't exists`
          );
      }
    };
  }
}
