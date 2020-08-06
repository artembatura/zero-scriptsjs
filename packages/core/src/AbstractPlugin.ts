import { AbstractOptionsContainer } from './AbstractOptionsContainer';
import { PluginAPI } from './api';

export abstract class AbstractPlugin<
  TOptionsContainer extends AbstractOptionsContainer = any
> {
  public constructor(public readonly optionsContainer: TOptionsContainer) {}

  public abstract apply(api: PluginAPI): void;
}
