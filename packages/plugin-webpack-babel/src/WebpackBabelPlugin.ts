import type ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import * as fs from 'fs';
import * as path from 'path';

import {
  AbstractPlugin,
  ApplyContext,
  ReadOptions,
  Task
} from '@zero-scripts/core';
import { WebpackConfig } from '@zero-scripts/webpack-config';

import { babelConfigExists } from './babelConfigExists';
import { getBabelConfigFileContents } from './getBabelConfigFileContents';
import { getInitialBabelConfig } from './getInitialBabelConfig';
import { resolveMap as sourceResolveMap } from './resolveMap';
import { WebpackBabelPluginOptions } from './WebpackBabelPluginOptions';

const rr = require.resolve;

@ReadOptions(WebpackBabelPluginOptions, 'plugin-webpack-babel')
export class WebpackBabelPlugin extends AbstractPlugin<WebpackBabelPluginOptions> {
  public readonly resolveMap = sourceResolveMap;

  public apply(applyContext: ApplyContext): void {
    applyContext.hooks.beforeRun.tap('WebpackBabelPlugin', beforeRunContext => {
      const webpackConfigBuilder = beforeRunContext.getConfigBuilder(
        WebpackConfig
      );

      beforeRunContext.addTask(
        new Task('generate-babel-config', () => {
          const configOptions = webpackConfigBuilder.optionsContainer.build();
          const { paths } = configOptions;

          const pluginOptions = this.optionsContainer.build();

          if (!babelConfigExists(paths.root)) {
            const initialBabelConfig = getInitialBabelConfig(
              configOptions,
              pluginOptions,
              pluginOptions.baseBabelConfig,
              false
            );

            const babelConfigPath = path.resolve(paths.root, 'babel.config.js');

            // eslint-disable-next-line no-console
            console.log('Create babel.config.js...');

            fs.writeFile(
              babelConfigPath,
              getBabelConfigFileContents(initialBabelConfig),
              err => {
                if (err) {
                  throw err;
                }
              }
            );
          }
        })
      );

      webpackConfigBuilder.hooks.build.tap(
        'WebpackBabelPlugin',
        (modifications, configOptions) => {
          const { isDev, paths, useTypescript } = configOptions;

          this.resolveMap['@zero-scripts/plugin-webpack-babel'] = [
            '@babel/preset-typescript',
            '@babel/plugin-proposal-decorators',
            '@babel/plugin-transform-flow-strip-types',
            '@babel/preset-env',
            '@babel/plugin-transform-runtime',
            '@babel/plugin-syntax-dynamic-import',
            '@babel/plugin-proposal-class-properties'
          ];

          const pluginOptions = this.optionsContainer.build();

          const initialBabelConfig = getInitialBabelConfig(
            configOptions,
            pluginOptions,
            pluginOptions.baseBabelConfig,
            true
          );

          modifications.insertUseItem({
            loader: rr('babel-loader'),
            options: {
              cacheDirectory: true,
              cacheCompression: !isDev,
              compact: !isDev,
              configFile: true,
              ...initialBabelConfig
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
