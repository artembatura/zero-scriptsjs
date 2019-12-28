import { AbstractConfigBuilder } from '../AbstractConfigBuilder';
import { AbstractModificationsContainer } from '../AbstractModificationsContainer';
import { AbstractOptionsContainer } from '../AbstractOptionsContainer';

export type AbstractConfigBuilderConstructor<
  T extends AbstractConfigBuilder<any, any>,
  TOptionsContainer extends AbstractOptionsContainer = any,
  TModificationsContainer extends AbstractModificationsContainer<any, any> = any
> = {
  new (
    optionsContainer?: TOptionsContainer,
    modificationsContainer?: TModificationsContainer
  ): T;
};
