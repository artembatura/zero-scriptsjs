import { ConfigModification } from '@zero-scripts/core/build/ConfigModification';
import { Configuration, RuleSetRule } from 'webpack';
import { WebpackConfigOptions } from './WebpackConfigOptions';
import { extensionsRegex, InsertPos } from '@zero-scripts/core';

export class OneOfModification extends ConfigModification<
  Configuration,
  WebpackConfigOptions,
  RuleSetRule[]
> {
  public static readonly id: string = 'one-of';
  public readonly rules: {
    getRule: (parameters: WebpackConfigOptions) => RuleSetRule;
    position: InsertPos;
  }[] = [];

  constructor() {
    super(
      c => c.module.rules,
      (rules, parameters) => {
        const oneOf: RuleSetRule[] = this.rules
          .sort((left, right) => {
            if (left.position < right.position) {
              return 1;
            }

            if (left.position > right.position) {
              return -1;
            }

            return 0;
          })
          .map(({ getRule }) => getRule(parameters))
          .filter(Boolean) as RuleSetRule[];

        return [
          ...(rules ? rules : []),
          {
            oneOf: [
              ...oneOf,
              {
                loader: require.resolve('file-loader'),
                exclude: [
                  extensionsRegex(parameters.moduleFileExtensions),
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
      OneOfModification.id
    );
  }
}
