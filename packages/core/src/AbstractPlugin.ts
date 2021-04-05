import { AbstractOptionsContainer } from './AbstractOptionsContainer';
import { ApplyContext } from './context';

export abstract class AbstractPlugin<
  TOptionsContainer extends AbstractOptionsContainer = AbstractOptionsContainer
> {
  public constructor(public readonly optionsContainer: TOptionsContainer) {}

  public abstract apply(applyContext: ApplyContext): void;
}
