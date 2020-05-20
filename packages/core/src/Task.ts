// type ExtractValue<T extends Rule<string>[]> = {
//   [K in keyof T]: T[K] extends Rule<infer V> ? V : never
// };

export class Task<TOptions extends {}, _TArgs extends string[]> {
  protected _handler?: (args: string[], options: TOptions) => void;
  // public readonly argumentsRules: Rule<string>[] = [];
  // public readonly optionsRules: Record<string, Rule<string | boolean>> = {};

  public constructor(public readonly name: string) {}

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

  public handle(
    handler: (args: string[], options: TOptions) => void | Promise<void>
  ): this {
    this._handler = handler;
    return this;
  }

  public run(args: _TArgs, options: TOptions): void | Promise<void> {
    if (!this._handler) {
      throw new Error(`Handler for task ${this.name} is not found`);
    }

    return this._handler(args, options);
  }
}

// replace with factory
// const task = new Task('task-0')
// .expectArguments(new StringRule().maxLength(1), new StringRule())
// .expectOption('option-0', new StringRule())
// .handle(([arg0], options) => {});

// task.run(['abc', 'ac'], { 'option-0': '123' });
