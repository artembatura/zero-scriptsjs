export abstract class AbstractTask<TName extends string = string> {
  // public readonly argumentsRules: Rule<string>[] = [];
  // public readonly optionsRules: Record<string, Rule<string | boolean>> = {};

  public constructor(public readonly name: TName) {}

  // public expectOption<TKey extends string, TValue extends string | boolean>(
  //   key: TKey,
  //   validationRule: Rule<TValue>,
  //   description?: string
  // ): Task<TOptions & { [K in TKey]: TValue }, _TArgs> {
  //   this.optionsRules[key] = validationRule as Rule<string | boolean>;
  //   return this as any;
  // }

  // public expectArguments<T extends Rule<string>[]>(
  //   ...validationRules: T
  // ): Task<TOptions, ExtractValue<T>> {
  //   validationRules.forEach(rule =>
  //     this.argumentsRules.push(rule as Rule<string>)
  //   );
  //   return this as any;
  // }

  public abstract run<
    TArgs extends string[],
    TOptions extends Record<string, unknown>
  >(args: TArgs, options: TOptions): void | Promise<void>;
}
