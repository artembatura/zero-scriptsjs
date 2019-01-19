import {
  Configuration,
  RuleSetRule,
  Plugin,
  DefinePlugin,
  HotModuleReplacementPlugin
} from 'webpack';
import { AbstractConfigBuilder, InsertPos } from '@zero-scripts/core';
import { validateWebpackConfig } from './validateWebpackConfig';
const TerserPlugin = require('terser-webpack-plugin');
import { WebpackConfigOptions } from './WebpackConfigOptions';
import { resolvePath } from './utils';
import { ReadOptions } from '@zero-scripts/core';
import { resolveModule } from './utils';
import ManifestPlugin from 'webpack-assets-manifest';
import { extensionsRegex } from '@zero-scripts/core';

@ReadOptions()
export class WebpackConfig extends AbstractConfigBuilder<
  Configuration,
  WebpackConfigOptions
> {
  constructor({
    sourceMap = true,
    paths,
    additionalEntry = [],
    moduleFileExtensions = [],
    jsFileExtensions = []
  }: Partial<WebpackConfigOptions>) {
    super({
      isDev: false,
      additionalEntry,
      sourceMap,
      moduleFileExtensions: ['.js', '.mjs', '.json', ...moduleFileExtensions],
      jsFileExtensions: ['js', 'mjs', ...jsFileExtensions],
      paths: {
        root: '',
        src: 'src',
        build: 'build',
        indexJs: 'src/index',
        indexHtml: 'public/index.html',
        public: 'public',
        tsConfig: 'tsconfig.json',
        ...(paths ? paths : {})
      }
    });
  }

  public addJsFileExtension(extension: string): this {
    this.options.jsFileExtensions.push(extension);
    const extensionWithDot = '.' + extension;
    if (!this.options.moduleFileExtensions.includes(extensionWithDot)) {
      this.options.moduleFileExtensions.push(extensionWithDot);
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
    this.options.additionalEntry.push(entry);
    return this;
  }

  public isDev(isDev: boolean): this {
    this.options.isDev = isDev;
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
    return this.set(
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

        const element = getRule(this.options);

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
    const config = super.build(
      ({
        paths,
        moduleFileExtensions,
        isDev,
        additionalEntry,
        sourceMap,
        jsFileExtensions
      }) => ({
        mode: isDev ? 'development' : 'production',
        entry: [
          resolveModule(jsFileExtensions, paths.indexJs),
          ...additionalEntry
        ],
        devtool: isDev ? 'cheap-module-source-map' : sourceMap && 'source-map',
        output: {
          path: !isDev ? resolvePath(paths.build) : undefined,
          filename: isDev ? 'js/[name].js' : 'js/[name].[contenthash:8].js',
          chunkFilename: isDev
            ? 'js/[name].chunk.js'
            : 'js/[name].[contenthash:8].chunk.js'
        },
        bail: !isDev,
        optimization: {
          minimize: !isDev,
          minimizer: [
            new TerserPlugin({
              terserOptions: {
                parse: {
                  ecma: 8
                },
                compress: {
                  ecma: 5,
                  warnings: false,
                  comparisons: false,
                  inline: 2
                },
                mangle: {
                  safari10: true
                },
                output: {
                  ecma: 5,
                  comments: false,
                  ascii_only: true
                }
              },
              parallel: true,
              cache: true,
              sourceMap
            })
          ],
          splitChunks: {
            chunks: 'all'
          },
          runtimeChunk: true
        },
        resolve: {
          modules: ['node_modules'],
          extensions: moduleFileExtensions
        },
        module: {
          strictExportPresence: true,
          rules: [
            {
              oneOf: [
                {
                  loader: require.resolve('file-loader'),
                  exclude: [extensionsRegex(moduleFileExtensions), /\.html$/],
                  options: {
                    name: 'media/[name].[hash:8].[ext]'
                  }
                }
              ]
            }
          ]
        },
        plugins: [
          new DefinePlugin({
            'process.env': {
              NODE_ENV: JSON.stringify(process.env.NODE_ENV)
            }
          }),
          new ManifestPlugin({
            output: 'asset-manifest.json'
          })
        ].concat(isDev ? [new HotModuleReplacementPlugin()] : []),
        node: false,
        stats: 'errors-only'
      })
    );

    return validateWebpackConfig(config);
  }
}
