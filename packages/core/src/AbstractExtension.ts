import { AbstractPreset } from './AbstractPreset';

export abstract class AbstractExtension<TOptions = any> {
  constructor(
    protected readonly preset: AbstractPreset,
    protected readonly options?: TOptions
  ) {}

  abstract activate(): void;
}
