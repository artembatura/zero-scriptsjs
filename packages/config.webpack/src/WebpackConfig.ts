import { Configuration, RuleSetRule, Plugin } from 'webpack';
import { WebpackConfigOptions } from './WebpackConfigOptions';
import {
  AbstractConfigBuilder,
  InsertPos,
  ReadOptions,
  Option
} from '@zero-scripts/core';
import { validateWebpackConfig } from './validateWebpackConfig';
import fs from 'fs';
import { createWebpackConfiguration } from './createWebpackConfiguration';
import { resolvePaths } from './resolvePaths';
import { ConfigModification } from '@zero-scripts/core/build/ConfigModification';

@ReadOptions()
export class WebpackConfig extends AbstractConfigBuilder<
  Configuration,
  WebpackConfigOptions,
  ConfigModification<Configuration, WebpackConfigOptions, any>
> {
  @Option<WebpackConfig, 'paths'>(
    ({ defaultValue, externalValue }) => ({
      ...defaultValue,
      ...externalValue
    }),
    [],
    (value, { jsFileExtensions }) => resolvePaths(value, jsFileExtensions)
  )
  public paths: WebpackConfigOptions['paths'] = {
    root: '',
    src: 'src',
    build: 'build',
    indexJs: 'src/index',
    indexHtml: 'public/index.html',
    publicPath: 'public',
    tsConfig: 'tsconfig.json'
  };

  @Option<WebpackConfig, 'useSourceMap'>()
  public useSourceMap: boolean = true;

  @Option<WebpackConfig, 'additionalEntry'>(
    ({ externalValue, defaultValue }) => [
      ...defaultValue,
      ...(externalValue ? externalValue : [])
    ]
  )
  public readonly additionalEntry: string[] = [];

  @Option<WebpackConfig, 'moduleFileExtensions', 'useTypescript'>(
    ({ externalValue, defaultValue, dependencies: { useTypescript } }) => [
      ...defaultValue,
      ...(useTypescript ? ['.ts', '.tsx'] : []),
      ...(externalValue ? externalValue : [])
    ],
    ['useTypescript']
  )
  public readonly moduleFileExtensions: string[] = ['.json', '.js'];

  @Option<WebpackConfig, 'jsFileExtensions', 'useTypescript'>(
    ({ externalValue, defaultValue, dependencies: { useTypescript } }) => [
      ...defaultValue,
      ...(useTypescript ? ['ts', 'tsx'] : []),
      ...(externalValue ? externalValue : [])
    ],
    ['useTypescript']
  )
  public readonly jsFileExtensions: string[] = ['js'];

  @Option<WebpackConfig, 'isDev'>()
  public isDev: boolean = false;

  @Option<WebpackConfig, 'useTypescript', 'paths'>(
    ({ externalValue, dependencies: { paths } }) =>
      typeof externalValue === 'boolean'
        ? externalValue
        : fs.existsSync(paths.tsConfig),
    ['paths']
  )
  public useTypescript: boolean = false;

  public addEntry(entry: string): this {
    this.additionalEntry.push(entry);
    return this;
  }

  public setIsDev(isDev: boolean): this {
    this.isDev = isDev;
    return this;
  }

  public insertPlugin(
    getPlugin: (options: WebpackConfigOptions) => Plugin | undefined,
    position: InsertPos = InsertPos.End,
    modificationId?: string
  ) {
    this._modifications.push(
      new ConfigModification(
        c => c.plugins,
        ConfigModification.arrayInsertCreator(getPlugin, position),
        modificationId
      )
    );
    return this;
  }

  public insertModuleRule(
    getRule: (options: WebpackConfigOptions) => RuleSetRule,
    position: InsertPos = InsertPos.Middle,
    modificationId?: string
  ) {
    this._modifications.push(
      new ConfigModification(
        c => c.module.rules,
        (targetRules, parameters) => {
          let rules = Array.isArray(targetRules)
            ? targetRules.slice(0)
            : [{ oneOf: [] }];

          let indexOfOneOf = rules.findIndex(rule =>
            rule.hasOwnProperty('oneOf')
          );

          if (indexOfOneOf === -1) {
            rules = [...rules, { oneOf: [] }];
            indexOfOneOf = rules.length - 1;
          }

          const element = getRule(parameters);

          if (!element) {
            return rules;
          }

          const oneOf = (rules[indexOfOneOf].oneOf
            ? rules[indexOfOneOf].oneOf
            : []) as RuleSetRule[];

          switch (position) {
            case InsertPos.Start:
              rules[indexOfOneOf].oneOf = [
                element,
                ...(oneOf as RuleSetRule[])
              ];
              break;

            case InsertPos.Middle:
              oneOf.splice(oneOf.length / 2, 0, element);
              rules[indexOfOneOf].oneOf = oneOf.slice(0);
              break;

            case InsertPos.End:
              rules[indexOfOneOf].oneOf = [...oneOf, element];
              break;

            default:
              throw new Error(
                `[${
                  this.constructor.name
                }]: Insert position '${position}' doesn't exists`
              );
          }

          return rules;
        },
        modificationId
      )
    );
    return this;
  }

  public insertCommonModuleRule(
    getRule: (options: WebpackConfigOptions) => RuleSetRule,
    position: InsertPos = InsertPos.Middle,
    modificationId?: string
  ): this {
    this._modifications.push(
      new ConfigModification(
        c => c.module.rules,
        ConfigModification.arrayInsertCreator(getRule, position),
        modificationId
      )
    );
    return this;
  }

  public build(): Configuration {
    const config = super.build(createWebpackConfiguration);

    return validateWebpackConfig(config);
  }
}
