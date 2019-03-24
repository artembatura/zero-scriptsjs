import { AbstractPreset } from './AbstractPreset';
import { AbstractOptionsContainer } from './AbstractOptionsContainer';

export abstract class AbstractExtension<
  TOptionsContainer extends AbstractOptionsContainer
> {
  constructor(public readonly optionsContainer: TOptionsContainer) {}

  abstract activate(preset: AbstractPreset): void;
}
