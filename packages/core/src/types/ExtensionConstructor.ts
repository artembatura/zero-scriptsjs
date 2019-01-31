import { AbstractExtension } from '../AbstractExtension';
import { AbstractPreset } from '../AbstractPreset';

export type ExtensionConstructor = {
  new (preset: AbstractPreset, options?: any): AbstractExtension<any>;
};
