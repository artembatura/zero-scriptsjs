import { AbstractConfigBuilder } from './AbstractConfigBuilder';
import { AbstractOptionsContainer } from './AbstractOptionsContainer';

export abstract class Task<
  TConfigBuilder extends AbstractConfigBuilder<any, any>,
  TOptionsContainer extends AbstractOptionsContainer
> {
  protected configBuilder?: TConfigBuilder;
  protected pluginOptionsContainer?: TOptionsContainer;
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

  public abstract run<
    TArgs extends string[],
    TOptions extends Record<string, unknown>
  >(args: TArgs, options: TOptions): void | Promise<void>;

  public bind(
    configBuilder: TConfigBuilder,
    optionsContainer: TOptionsContainer
  ): this {
    this.configBuilder = configBuilder;
    this.pluginOptionsContainer = optionsContainer;

    return this;
  }

  public isBound(): this is {
    configBuilder: TConfigBuilder;
    pluginOptionsContainer: TOptionsContainer;
  } {
    return Boolean(this.configBuilder) || Boolean(this.pluginOptionsContainer);
  }

  public printIfNotBound(): void {
    if (!this.isBound()) {
      console.log(
        'You forgot to bound context for task ' + this.constructor.name
      );
    }
  }
}
