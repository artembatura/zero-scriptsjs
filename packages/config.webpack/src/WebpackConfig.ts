import { Configuration, RuleSetRule, Plugin } from 'webpack';
import { WebpackConfigOptions } from './WebpackConfigOptions';
import {
  AbstractConfigBuilder,
  InsertPos,
  ReadOptions
} from '@zero-scripts/core';
import { validateWebpackConfig } from './validateWebpackConfig';
import fs from 'fs';
import { createWebpackConfiguration } from './createWebpackConfiguration';
import 'reflect-metadata';

type ObjectType<T> = { new (): T } | Function;

function Option<T, TOption extends T[keyof T], TKey extends keyof T>(
  Class: ObjectType<T>,
  getValue: (data: {
    dependencies: { [K in TKey]: T[K] };
    defaultValue: TOption;
    externalValue: TOption;
  }) => TOption = ({ externalValue, defaultValue }) =>
    externalValue !== undefined ? externalValue : defaultValue,
  dependencies: TKey[] = []
) {
  return (target: any, propertyName: string) => {
    const values = new Map();

    Object.defineProperty(target, propertyName, {
      set(firstValue: any) {
        Object.defineProperty(this, propertyName, {
          get() {
            return values.get(this);
          },
          set(value: any) {
            values.set(this, value);
          },
          enumerable: true
        });

        this[propertyName] = firstValue;

        const getOptionValue = (options: any, externalValue: any) =>
          getValue({
            dependencies: dependencies.reduce(
              (object, dependency) => ({
                ...object,
                [dependency]: options[dependency] || this[dependency]
              }),
              {} as T
            ),
            defaultValue: this[propertyName],
            externalValue
          });

        Reflect.defineMetadata(
          'data',
          {
            getOptionValue,
            dependencies
          },
          target,
          propertyName
        );
      },
      enumerable: true,
      configurable: true
    });
  };
}

@ReadOptions()
export class WebpackConfig extends AbstractConfigBuilder<
  Configuration,
  WebpackConfigOptions
> {
  @Option(
    WebpackConfig,
    ({ externalValue, dependencies: { paths } }) =>
      typeof externalValue === 'boolean'
        ? externalValue
        : fs.existsSync(paths.tsConfig),
    ['paths', 'useTypescript']
  )
  public useTypescript: boolean = false;

  // todo paths are not resolved
  @Option(WebpackConfig)
  public paths: WebpackConfigOptions['paths'] = {
    root: '',
    src: 'src',
    build: 'build',
    indexJs: 'src/index',
    indexHtml: 'public/index.html',
    public: 'public',
    tsConfig: 'tsconfig.json'
  };

  @Option(WebpackConfig)
  public useSourceMap: boolean = true;

  @Option(WebpackConfig)
  public readonly additionalEntry: string[] = [];

  @Option(WebpackConfig)
  public readonly moduleFileExtensions: string[] = ['.js', '.json'];

  @Option(WebpackConfig)
  public readonly jsFileExtensions: string[] = ['js'];

  @Option(WebpackConfig)
  public isDev: boolean = false;

  public addJsFileExtension(extension: string): this {
    this.jsFileExtensions.push(extension);
    const extensionWithDot = '.' + extension;
    if (!this.moduleFileExtensions.includes(extensionWithDot)) {
      this.moduleFileExtensions.push(extensionWithDot);
    }
    return this;
  }

  public addJsFileExtensions(extensions: string[]): this {
    extensions.forEach(extension => {
      this.addJsFileExtension(extension);
    });
    return this;
  }

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
    return this.insert(c => c.plugins, getPlugin, position, modificationId);
  }

  public insertModuleRule(
    getRule: (options: WebpackConfigOptions) => RuleSetRule,
    position: InsertPos = InsertPos.Middle,
    modificationId?: string
  ) {
    return this.addModification(
      c => c.module.rules,
      targetRules => {
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

        const element = getRule(this.getOptions());

        if (!element) {
          return rules;
        }

        const oneOf = (rules[indexOfOneOf].oneOf
          ? rules[indexOfOneOf].oneOf
          : []) as RuleSetRule[];

        switch (position) {
          case InsertPos.Start:
            rules[indexOfOneOf].oneOf = [element, ...(oneOf as RuleSetRule[])];
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
    );
  }

  public insertCommonModuleRule(
    getRule: (options: WebpackConfigOptions) => RuleSetRule,
    position: InsertPos = InsertPos.Middle,
    modificationId?: string
  ): this {
    return this.insert(c => c.module.rules, getRule, position, modificationId);
  }

  public build(): Configuration {
    const config = super.build(createWebpackConfiguration);

    return validateWebpackConfig(config);
  }
}
