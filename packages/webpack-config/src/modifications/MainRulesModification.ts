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

export class MainRulesModification extends ConfigModification<
  Configuration,
  WebpackConfigOptions,
  RuleSetRule[]
> {
  public static readonly id: string = 'main-rules-modification';

  public readonly externalJsRules: ModificationRule<RuleSetRule>[] = [];

  public readonly jsUseItems: ModificationRule<RuleSetUseItem>[] = [];

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
      MainRulesModification.id
    );
  }
}
