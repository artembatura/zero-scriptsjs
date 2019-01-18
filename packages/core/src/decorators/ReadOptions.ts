import { readZeroScriptsOptions } from '../utils/readZeroScriptsOptions';
import { splitByUpperCase } from '../utils/splitByUpperCase';

export const ReadOptions = (optionsKey?: string) => <
  T extends { new (...args: any[]): any }
>(
  DecoratedClass: T
) =>
  class extends DecoratedClass {
    constructor(...args: any[]) {
      // checking if options are derived from inherit classes
      // used on subsequent decorator override
      if (args[0]) {
        super(args[0]);
      } else {
        const zeroScriptsOptions = readZeroScriptsOptions();

        // if optionsKey not defined
        // find suitable key by
        // split class name
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

        const needOptions =
          key && typeof zeroScriptsOptions[key] === 'object'
            ? zeroScriptsOptions[key]
            : {};

        // console.log(
        //   `${key || DecoratedClass.name}: ${JSON.stringify(needOptions)}`
        // );

        super(needOptions);
      }
    }
  };
