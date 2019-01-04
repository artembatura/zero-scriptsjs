import { AbstractExtension } from './AbstractExtension';
import { readPackageJson } from './utils/readPackageJson';
import { ExtensionConstructor } from './ExtensionConstructor';
import { packageIsExtension } from './packageIsExtension';
import { splitByUpperCase } from './utils/splitByUpperCase';
import { ScriptsMap } from './ScriptsMap';

export const packageJsonOptionsKey = 'zero-scripts';

export abstract class AbstractPreset {
  public readonly scripts: ScriptsMap = new ScriptsMap();
  private readonly instances: Map<string, any> = new Map();
  private readonly extensions: AbstractExtension<any>[] = [];

  protected constructor(protected readonly standardExtensions: string[] = []) {
    Object.keys(readPackageJson(data => data.devDependencies) as object)
      .concat(standardExtensions)
      .filter(packageIsExtension)
      .map((packageName: string) => {
        const ExtensionClass = (require(packageName) as {
          default: ExtensionConstructor;
        }).default;
        const tempOptions: object = readPackageJson(
          data =>
            data[packageJsonOptionsKey] &&
            data[packageJsonOptionsKey][packageName]
        );
        const extensionOptions =
          typeof tempOptions === 'object' ? tempOptions : {};
        console.log(`${packageName}: ${JSON.stringify(extensionOptions)}`);
        return new ExtensionClass(this, extensionOptions);
      })
      .forEach(extension => {
        if (
          this.extensions.find(
            ext => ext.constructor.name === extension.constructor.name
          )
        ) {
          throw new Error(
            `Cannot activate extension ${
              extension.constructor.name
            } more than one`
          );
        }
        extension.activate();
        this.extensions.push(extension);
      });
  }

  public getInstance<T>(Class: { new (options?: any): T }): T {
    const className: string = Class.name;

    if (!this.instances.get(className)) {
      const packageJsonZeroScripts = readPackageJson(
        data => data[packageJsonOptionsKey]
      );
      const classNameWords = splitByUpperCase(className);
      const optionsKey =
        packageJsonZeroScripts &&
        Object.keys(packageJsonZeroScripts).find(packageName => {
          let isSuitable = false;
          // strongly check order
          /* let latestIndexOf = -1; */
          classNameWords.forEach(word => {
            const currentIndexOf = packageName.indexOf(word);
            isSuitable = currentIndexOf !== -1;
          });
          return isSuitable;
        });
      const options =
        optionsKey && typeof packageJsonZeroScripts[optionsKey] === 'object'
          ? packageJsonZeroScripts[optionsKey]
          : {};
      console.log(`${optionsKey}: ${JSON.stringify(options)}`);
      this.instances.set(className, new Class(options));
    }

    return this.instances.get(className);
  }
}
