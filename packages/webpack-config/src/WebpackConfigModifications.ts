import type { Configuration, Plugin, RuleSetRule } from 'webpack';

import {
  AbstractModificationsContainer,
  ConfigModification,
  InsertPos
} from '@zero-scripts/core';

import { OneOfModification } from './modifications/OneOfModification';
import { WebpackConfigOptions } from './WebpackConfigOptions';

/**
 * An API designed for modifying webpack configuration by plugins
 */
export class WebpackConfigModifications extends AbstractModificationsContainer<
  Configuration,
  WebpackConfigOptions
> {
  public insertPlugin(
    plugin: Plugin,
    position: InsertPos = InsertPos.End,
    modificationId?: string
  ): this {
    this.modifications.push(
      new ConfigModification(
        c => c.plugins,
        ConfigModification.arrayInsertCreator(() => plugin, position),
        modificationId
      )
    );

    return this;
  }

  public insertModuleRule(
    rule: RuleSetRule,
    position: InsertPos = InsertPos.Middle
  ): this {
    this.getOneOfModification().rules.push({ rule, position });
    return this;
  }

  public insertCommonModuleRule(
    rule: RuleSetRule,
    position: InsertPos = InsertPos.Middle,
    modificationId?: string
  ): this {
    this.modifications.push(
      new ConfigModification(
        c => c.module.rules,
        ConfigModification.arrayInsertCreator(() => rule, position),
        modificationId
      )
    );

    return this;
  }

  public insertMinimizer(
    minimizer: Plugin,
    position: InsertPos = InsertPos.Middle,
    modificationId?: string
  ): this {
    this.modifications.push(
      new ConfigModification(
        c => c.optimization.minimizer,
        ConfigModification.arrayInsertCreator(() => minimizer, position),
        modificationId
      )
    );

    return this;
  }

  protected getOneOfModification(): OneOfModification {
    const foundModification = this.modifications.find(
      modification => modification.id === OneOfModification.id
    );

    if (!foundModification) {
      const modification = new OneOfModification();
      this.modifications.push(modification);
      return modification;
    } else {
      return foundModification as OneOfModification;
    }
  }
}
