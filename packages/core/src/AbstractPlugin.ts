import { AbstractOptionsContainer } from './AbstractOptionsContainer';
import { ApplyContext } from './context';

export abstract class AbstractPlugin<
  TOptionsContainer extends AbstractOptionsContainer = any
> {
  public constructor(public readonly optionsContainer: TOptionsContainer) {}

  public abstract apply(api: ApplyContext): void;
}
