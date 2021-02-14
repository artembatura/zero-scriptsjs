import type {
  Configuration,
  RuleSetRule,
  Compiler,
  RuleSetUseItem
} from 'webpack';

import {
  AbstractModificationsContainer,
  ConfigModification,
  InsertPos
} from '@zero-scripts/core';

import { MainRulesModification } from './modifications/MainRulesModification';
import { WebpackConfigOptions } from './WebpackConfigOptions';

interface WebpackPlugin {
  apply: (compiler: Compiler) => void;
}

/**
 * An API designed for modifying webpack configuration by plugins
 */
export class WebpackConfigModifications extends AbstractModificationsContainer<
  Configuration,
  WebpackConfigOptions
> {
  constructor() {
    super();

    this.modifications.push(new MainRulesModification());
  }

  public insertPlugin(
    plugin: WebpackPlugin,
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

  public insertNonJsRule(
    rule: RuleSetRule,
    position: InsertPos = InsertPos.Middle
  ): this {
    this.getOneOfModification().nonJsRules.push({ rule, position });
    return this;
  }

  public insertExternalJsRule(
    rule: RuleSetRule,
    position: InsertPos = InsertPos.Middle
  ): this {
    this.getOneOfModification().externalJsRules.push({ rule, position });
    return this;
  }

  // public insertJsRule(
  //   rule: RuleSetRule,
  //   position: InsertPos = InsertPos.Middle
  // ): this {
  //   this.getOneOfModification().jsRules.push({ rule, position });
  //   return this;
  // }

  public insertUseItem(
    rule: RuleSetUseItem,
    position: InsertPos = InsertPos.Middle
  ): this {
    this.getOneOfModification().jsUseItems.push({ rule, position });
    return this;
  }

  public insertRootRule(
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
    minimizer: WebpackPlugin,
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

  public addResolveAlias(
    alias: string,
    path: string,
    modificationId?: string
  ): this {
    this.modifications.push(
      new ConfigModification(
        c => c.resolve.alias,
        prevValue => {
          return {
            ...prevValue,
            [alias]: path
          };
        },
        modificationId
      )
    );

    return this;
  }

  protected getOneOfModification(): MainRulesModification {
    const modification = this.modifications.find(
      modification => modification.id === MainRulesModification.id
    );

    if (!modification) {
      throw new Error(
        'Probably you forgot to instantiate OneOfModification in WebpackConfigModifications constructor'
      );
    }

    return modification as MainRulesModification;
  }
}
