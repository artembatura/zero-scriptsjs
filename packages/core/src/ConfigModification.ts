import { Selector } from './Selector';
import { extractFirstPropChain } from './utils/extractFirstPropChain';
import { InsertPos } from './InsertPos';

export class ConfigModification<
  TConfig extends Record<string, any>,
  TConfigBuilderParameters extends Record<string, any>,
  TSelectedValue
> {
  public readonly path: string;
  constructor(
    selector: Selector<Required<TConfig>, TSelectedValue>,
    protected readonly createNewValue: (
      selectedValue: TSelectedValue,
      parameters: TConfigBuilderParameters
    ) => TSelectedValue,
    public readonly id?: string
  ) {
    this.path = extractFirstPropChain(String(selector));
  }

  public apply(
    target: Map<any, any>,
    parameters: TConfigBuilderParameters
  ): this {
    target.set(
      this.path,
      this.createNewValue(target.get(this.path), parameters)
    );
    return this;
  }

  public static arrayInsertCreator<TSelectedValue extends any[]>(
    creator: (parameters: any) => TSelectedValue[0] | undefined,
    position: InsertPos
  ) {
    return (array: any[], parameters: any) => {
      const element = creator(parameters);

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
    };
  }
}
