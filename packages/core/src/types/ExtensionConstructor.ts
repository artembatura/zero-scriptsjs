import { AbstractExtension } from '../AbstractExtension';

export type ExtensionConstructor = {
  new (): AbstractExtension<any>;
};
