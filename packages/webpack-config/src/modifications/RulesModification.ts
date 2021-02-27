import type { Configuration, RuleSetRule, RuleSetUseItem } from 'webpack';

import {
  ConfigModification,
  extensionsRegex,
  InsertPos,
  sortByInsertPos
} from '@zero-scripts/core';

import { WebpackConfigOptions } from '../WebpackConfigOptions';

const rr = require.resolve;

type ModificationRule<T> = {
  rule: T;
  position: InsertPos;
};

function handleRules<T>(rules: ModificationRule<T>[]) {
  return sortByInsertPos(rules).map(mRule => mRule.rule);
}

/**
 * Encapsulates complex webpack rule which allow to handle three types
 * of files in efficient flow: JS, external JS and non JS files.
 *
 * Includes public properties which allows to add required rules by
 * high-level API that extends AbstractModificationsContainer.
 *
 * Other unknown extensions will be loaded with `file-loader`.
 */
export class RulesModification extends ConfigModification<
  Configuration,
  WebpackConfigOptions,
  RuleSetRule[]
> {
  public static readonly id: string = 'rules-modification';

  /**
   * Processing JS files.
   *
   * (e.g. processing with Babel will be here)
   */
  public readonly jsUseItems: ModificationRule<RuleSetUseItem>[] = [];

  /**
   * Processing external JS files. It's all files outside of "src" folder.
   *
   * (e.g. any libs from `node_modules` like Lodash)
   */
  public readonly externalJsRules: ModificationRule<RuleSetRule>[] = [];

  /**
   * Processing non JS files.
   *
   * (e.g. style extensions: .css, .sass/.scss and .less)
   */
  public readonly nonJsRules: ModificationRule<RuleSetRule>[] = [];

  public constructor() {
    super(
      c => c.module.rules as RuleSetRule[],
      (rules, options) => {
        const jsUseItems = handleRules(this.jsUseItems);
        const nonJsRules = handleRules(this.nonJsRules);
        const externalJsRules = handleRules(this.externalJsRules);

        return [
          ...(rules ? rules : []),
          {
            oneOf: [
              {
                test: extensionsRegex(options.jsFileExtensions),
                oneOf: [
                  {
                    include: options.paths.src,
                    use: [...jsUseItems, ...options.jsLoaders]
                  },
                  ...externalJsRules
                ]
              },
              ...nonJsRules,
              {
                loader: rr('file-loader'),
                exclude: [
                  extensionsRegex(options.moduleFileExtensions),
                  /\.html$/
                ],
                options: {
                  name: 'media/[name].[hash:8].[ext]'
                }
              }
            ]
          }
        ];
      },
      RulesModification.id
    );
  }
}
