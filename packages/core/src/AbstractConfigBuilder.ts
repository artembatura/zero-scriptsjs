import { SyncHook } from 'tapable';

import { AbstractModificationsContainer } from './AbstractModificationsContainer';
import { AbstractOptionsContainer } from './AbstractOptionsContainer';
import { ExtractOptions } from './types';

export abstract class AbstractConfigBuilder<
  TConfig extends Record<string, any>,
  TOptionsContainer extends AbstractOptionsContainer,
  TModificationsContainer extends AbstractModificationsContainer<
    TConfig,
    TOptionsContainer
  > = any
> {
  public readonly hooks = {
    beforeBuild: new SyncHook<[TOptionsContainer]>(['optionsContainer']),
    build: new SyncHook<
      [TModificationsContainer, ExtractOptions<TOptionsContainer>]
    >(['modifications', 'configOptions'])
  };

  protected constructor(
    public readonly optionsContainer: TOptionsContainer,
    protected readonly modificationsContainer: TModificationsContainer
  ) {}

  public build(
    createBaseConfig?: (options: ExtractOptions<TOptionsContainer>) => TConfig
  ): TConfig {
    this.hooks.beforeBuild.call(this.optionsContainer);

    const options = this.optionsContainer.build();

    const config: TConfig = createBaseConfig
      ? createBaseConfig(options)
      : ({} as TConfig);

    this.hooks.build.call(this.modificationsContainer, options);

    this.modificationsContainer.applyAll(config, options);

    return config;
  }
}
