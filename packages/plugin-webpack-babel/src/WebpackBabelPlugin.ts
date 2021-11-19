import type ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import * as fs from 'fs';
import gensync from 'gensync';
import * as path from 'path';

import {
  AbstractPlugin,
  ApplyContext,
  ReadOptions,
  run,
  Task,
  ProjectConfig
} from '@zero-scripts/core';
import { WebpackConfig } from '@zero-scripts/webpack-config';

import { getBabelConfigFileContents } from './getBabelConfigFileContents';
import { getInitialBabelConfig } from './getInitialBabelConfig';
import { WebpackBabelPluginOptions } from './WebpackBabelPluginOptions';

const {
  findRootConfig: genFindRootConfig,
  ROOT_CONFIG_FILENAMES
} = require('@babel/core/lib/config/files/configuration');

const findRootConfig = gensync(genFindRootConfig);

function getBabelConfigPath(rootPath: string): string | undefined {
  for (const fileName of ROOT_CONFIG_FILENAMES) {
    const filePath = path.join(rootPath, fileName);

    if (fs.existsSync(filePath)) {
      return filePath;
    }
  }

  return undefined;
}

function babelConfigExists(rootPath: string) {
  return Boolean(getBabelConfigPath(rootPath));
}

const rr = require.resolve;

@ReadOptions(WebpackBabelPluginOptions, 'plugin-webpack-babel')
export class WebpackBabelPlugin extends AbstractPlugin<WebpackBabelPluginOptions> {
  public readonly resolveMaps: string[] = [
    '@zero-scripts/plugin-webpack-babel/build/resolveMap.js'
  ];

  public readonly getInitialBabelConfig = getInitialBabelConfig;

  public apply(applyContext: ApplyContext): void {
    applyContext.hooks.beforeRun.tap('WebpackBabelPlugin', beforeRunContext => {
      const webpackConfigBuilder = beforeRunContext.getConfigBuilder(
        WebpackConfig
      );

      const paths = webpackConfigBuilder.optionsContainer.build().paths;
      const configFileExists = babelConfigExists(paths.root);

      beforeRunContext.addTask(
        new Task('overwrite-babel-config', async () => {
          const configOptions = webpackConfigBuilder.optionsContainer.build();
          const { paths } = configOptions;

          const pluginOptions = this.optionsContainer.build();

          new ProjectConfig(paths.root).merge({
            precisePackageMap: {
              '@zero-scripts/plugin-webpack-babel': [
                '@babel/preset-typescript',
                '@babel/plugin-proposal-decorators',
                '@babel/plugin-transform-flow-strip-types',
                '@babel/preset-env',
                '@babel/plugin-transform-runtime',
                '@babel/plugin-syntax-dynamic-import',
                '@babel/plugin-proposal-class-properties'
              ]
            }
          });

          // todo: move to other plugin
          new ProjectConfig(paths.root).merge({
            precisePackageMap: {
              '@zero-scripts/plugin-webpack-react': [
                '@babel/preset-react',
                'babel-plugin-transform-react-remove-prop-types',
                'babel-plugin-named-asset-import'
              ]
            }
          });

          // todo: add flag to indicate that babel config was overwritten
          //  then use this to check actuality of `resolveMap`

          if (!configFileExists) {
            const initialBabelConfig = getInitialBabelConfig(
              configOptions,
              pluginOptions,
              pluginOptions.baseBabelConfig,
              false
            );

            const babelConfigPath = path.join(paths.root, 'babel.config.js');

            // eslint-disable-next-line no-console
            console.log('Generating babel.config.js...');

            fs.writeFile(
              babelConfigPath,
              getBabelConfigFileContents(initialBabelConfig, this.resolveMaps),
              err => {
                if (err) {
                  throw err;
                }
              }
            );
          }
        })
      );

      webpackConfigBuilder.hooks.build.tapPromise(
        'WebpackBabelPlugin',
        async (modifications, configOptions) => {
          const { isDev, paths, useTypescript } = configOptions;

          const pluginOptions = this.optionsContainer.build();

          const initialBabelConfig = getInitialBabelConfig(
            configOptions,
            pluginOptions,
            pluginOptions.baseBabelConfig,
            true
          );

          const passOptionsDirectly = await (async () => {
            if (configFileExists) {
              const babelConfigFromFile = findRootConfig.sync(
                paths.root,
                isDev ? 'development' : 'production'
              )?.options;

              // do not pass options if config file contain the same config
              if (
                JSON.stringify(babelConfigFromFile) ===
                JSON.stringify(initialBabelConfig)
              ) {
                return false;
              }

              return !pluginOptions.customConfig;
            }

            if (pluginOptions.customConfig) {
              // eslint-disable-next-line no-console
              console.log(
                'Warning: Option "customConfig" is set to "true" but no Babel config is found in project directory...'
              );

              await run(['generate-babel-config']);

              return false;
            }

            return true;
          })();

          modifications.insertUseItem({
            loader: rr('babel-loader'),
            options: {
              cacheDirectory: true,
              cacheCompression: !isDev,
              compact: !isDev,
              configFile: getBabelConfigPath(paths.root),
              cwd: paths.root,
              ...(passOptionsDirectly ? initialBabelConfig : {})
            }
          });

          modifications.insertExternalJsRule({
            exclude: /@babel(?:\/|\\{1,2})runtime/,
            loader: rr('babel-loader'),
            options: {
              babelrc: false,
              configFile: false,
              compact: false,
              presets: [
                [
                  rr('@babel/preset-env'),
                  {
                    useBuiltIns: 'entry',
                    corejs: 3,
                    exclude: ['transform-typeof-symbol'],
                    loose: true
                  }
                ]
              ],
              cacheDirectory: true,
              cacheCompression: !isDev,
              sourceMaps: false
            }
          });

          if (useTypescript) {
            try {
              const ForkTsCheckerPlugin: typeof ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

              modifications.insertPlugin(
                new ForkTsCheckerPlugin({
                  async: isDev,
                  typescript: {
                    enabled: true,
                    configFile: paths.tsConfig,
                    mode: 'write-references',
                    context: paths.root,
                    diagnosticOptions: {
                      syntactic: true
                    }
                  }
                })
              );
            } catch (err) {
              if (err instanceof Error && err.name === 'MODULE_NOT_FOUND') {
                // eslint-disable-next-line no-console
                console.log(
                  'Warning: If you want to check types on your Typescript files' +
                    ' , you need to manually install fork-ts-checker-webpack-plugin'
                );
              } else {
                // eslint-disable-next-line no-console
                console.log(err.stack || err.stackTrace);
              }
            }
          }
        }
      );
    });
  }
}
