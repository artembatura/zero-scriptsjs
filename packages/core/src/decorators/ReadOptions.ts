import { AbstractOptionsContainer } from '../AbstractOptionsContainer';
import { readZeroScriptsOptions } from '../utils/readZeroScriptsOptions';

/**
 * ReadOptions Decorator
 *
 * @param OptionsContainer
 * @param optionsKey
 * @constructor
 *
 * Decorated class need to accepting OptionsContainer as first argument
 *
 * Example:
 *
 * @ReadOptions(MyOptionsContainer, 'myKeyInPackageJson')
 * class Foo {
 *   constructor(optionsContainer: AbstractOptionsContainer, secondArg: number, thirdArg: string): {}
 * }
 */
export function ReadOptions<TOptionsContainer extends AbstractOptionsContainer>(
  OptionsContainer: {
    new (externalOptions: Record<string, unknown>): TOptionsContainer;
  },
  optionsKey: string
) {
  return <T extends { new (...args: any[]): any }>(DecoratedClass: T) =>
    ({
      [DecoratedClass.name]: class extends DecoratedClass {
        constructor(...args: any[]) {
          const externalOptions = readZeroScriptsOptions(optionsKey);

          const [optionsContainerInstance, ...restArgs] =
            args[0] instanceof AbstractOptionsContainer
              ? args
              : [new OptionsContainer(externalOptions), ...args.slice(1)];

          super(optionsContainerInstance, ...restArgs);
        }
      }
    }[DecoratedClass.name]);
}
