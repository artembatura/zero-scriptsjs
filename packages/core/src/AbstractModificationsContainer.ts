import { AbstractOptionsContainer } from './AbstractOptionsContainer';
import { ConfigModification } from './ConfigModification';
import { ExtractOptions } from './types';

export abstract class AbstractModificationsContainer<
  TConfig extends Record<string, any>,
  TOptionsContainer extends AbstractOptionsContainer
> {
  protected modifications: ConfigModification<TConfig, any, any>[] = [];

  public has(modificationId: string): boolean {
    return this.modifications.some(
      modification => modification.id === modificationId
    );
  }

  public remove(modificationId: string): boolean {
    if (this.has(modificationId)) {
      this.modifications = this.modifications.filter(
        modification => modification.id !== modificationId
      );

      return true;
    }

    return false;
  }

  public applyAll(
    config: TConfig,
    options: ExtractOptions<TOptionsContainer>
  ): void {
    const appliedModifications: ConfigModification<TConfig, any, any>[] = [];

    this.modifications.forEach(modifier => {
      if (
        !modifier.id ||
        !appliedModifications.some(
          appliedModifier =>
            Boolean(appliedModifier.id) && appliedModifier.id === modifier.id
        )
      ) {
        appliedModifications.push(modifier.apply(config, options));
      }
    });
  }
}
