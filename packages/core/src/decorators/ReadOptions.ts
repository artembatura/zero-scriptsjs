import { readZeroScriptsOptions } from '../utils/readZeroScriptsOptions';
import { splitByUpperCase } from '../utils/splitByUpperCase';
import { AbstractOptionsContainer } from '../AbstractOptionsContainer';

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
export const ReadOptions = <TOptionsContainer extends AbstractOptionsContainer>(
  OptionsContainer: { new (externalOptions: object): TOptionsContainer },
  optionsKey?: string
) => <T extends { new (...args: any[]): any }>(DecoratedClass: T) =>
  class extends DecoratedClass {
    constructor(...args: any[]) {
      const zeroScriptsOptions = readZeroScriptsOptions();

      // if optionsKey is not defined
      // find key by splitting class name
      // TODO: in future we refuse from automatic correspond
      //  class name to package (perf, non-obviousness)
      const key = !optionsKey
        ? zeroScriptsOptions &&
          Object.keys(zeroScriptsOptions).find(packageName => {
            let isSuitable = false;
            splitByUpperCase(DecoratedClass.name).forEach(word => {
              const currentIndexOf = packageName.indexOf(word);
              isSuitable = currentIndexOf !== -1;
            });
            return isSuitable;
          })
        : optionsKey;

      const externalOptions =
        key && typeof zeroScriptsOptions[key] === 'object'
          ? zeroScriptsOptions[key]
          : {};

      const [optionsContainerInstance, ...restArgs] =
        args[0] instanceof AbstractOptionsContainer
          ? args
          : [new OptionsContainer(externalOptions), ...args.slice(1)];

      super(optionsContainerInstance, ...restArgs);
    }
  };
