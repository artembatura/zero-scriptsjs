import { AbstractExtension } from './AbstractExtension';
import { readPackageJson } from './utils/readPackageJson';
import { ExtensionConstructor } from './types';
import { packageIsExtension } from './packageIsExtension';
import { ScriptsMap } from './ScriptsMap';
import { getBaseClass } from './utils/getBaseClass';
import { readZeroScriptsOptions } from './utils/readZeroScriptsOptions';

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
        const tempOptions: object = readZeroScriptsOptions(packageName);
        const extensionOptions =
          typeof tempOptions === 'object' ? tempOptions : {};
        // console.log(`${packageName}: ${JSON.stringify(extensionOptions)}`);
        return new ExtensionClass(this, extensionOptions);
      })
      .forEach(extension => {
        const newBaseClass = getBaseClass(extension.constructor, 1);

        if (newBaseClass) {
          const conflictExtension = this.extensions.find(ext => {
            const iterableBaseClass = getBaseClass(ext.constructor, 1);
            return (
              ext.constructor.name === extension.constructor.name ||
              (iterableBaseClass !== undefined &&
                newBaseClass.name === iterableBaseClass.name)
            );
          });

          if (conflictExtension) {
            throw new Error(
              `Extensions conflict. Check devDependencies and choose one: ${
                extension.constructor.name
              } or ${conflictExtension.constructor.name}`
            );
          }
        }

        extension.activate();
        this.extensions.push(extension);
      });
  }

  public getInstance<T>(Class: { new (...args: any[]): T }): T {
    const className: string = Class.name;

    if (!this.instances.get(className)) {
      this.instances.set(className, new Class());
    }

    return this.instances.get(className);
  }
}
