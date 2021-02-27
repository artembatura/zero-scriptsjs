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

import { RulesModification } from './modifications/RulesModification';
import { WebpackConfigOptions } from './WebpackConfigOptions';

interface WebpackPlugin {
  apply: (compiler: Compiler) => void;
}

/**
 * An imperative API designed for modifying webpack configuration by plugins.
 *
 * Modifications container encapsulates complexity over modifications so
 * developer cannot access to modifications itself and should use simple methods.
 *
 * <br/>
 *
 * @example - Add HtmlWebpackPlugin to webpack configuration
 * class MyPlugin extends AbstractPlugin {
 *   public apply(applyContext: ApplyContext) {
 *     const webpackConfig = beforeRunContext.getConfigBuilder(WebpackConfig);
 *
 *     webpackConfig.hooks.build.tap('MyPlugin', (modifications) => {
 *       modifications.insertPlugin(new HtmlWebpackPlugin()); // << usage here
 *     });
 *   }
 * }
 */
export class WebpackConfigModifications extends AbstractModificationsContainer<
  Configuration,
  WebpackConfigOptions
> {
  constructor() {
    super();

    this.modifications.push(new RulesModification());
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

  /**
   * @see RulesModification#nonJsRules
   */
  public insertNonJsRule(
    rule: RuleSetRule,
    position: InsertPos = InsertPos.Middle
  ): this {
    this.getRulesModification().nonJsRules.push({ rule, position });
    return this;
  }

  /**
   * @see RulesModification#externalJsRules
   */
  public insertExternalJsRule(
    rule: RuleSetRule,
    position: InsertPos = InsertPos.Middle
  ): this {
    this.getRulesModification().externalJsRules.push({ rule, position });
    return this;
  }

  /**
   * @see RulesModification#jsUseItems
   */
  public insertUseItem(
    rule: RuleSetUseItem,
    position: InsertPos = InsertPos.Middle
  ): this {
    this.getRulesModification().jsUseItems.push({ rule, position });
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

  protected getRulesModification(): RulesModification {
    const modification = this.modifications.find(
      modification => modification.id === RulesModification.id
    );

    if (!modification) {
      throw new Error(
        'Probably you forgot to instantiate OneOfModification in WebpackConfigModifications constructor'
      );
    }

    return modification as RulesModification;
  }
}
