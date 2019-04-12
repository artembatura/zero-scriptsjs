import { AbstractOptionsContainer } from './AbstractOptionsContainer';
import { AbstractPreset } from './AbstractPreset';

export abstract class AbstractExtension<
  TOptionsContainer extends AbstractOptionsContainer | undefined = undefined
> {
  public constructor(public readonly optionsContainer: TOptionsContainer) {}

  abstract activate(preset: AbstractPreset): void;
}
