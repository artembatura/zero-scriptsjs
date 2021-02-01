import type ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import fs from 'fs';
import path from 'path';

import { AbstractPlugin, ApplyContext, ReadOptions } from '@zero-scripts/core';
import { WebpackConfig } from '@zero-scripts/webpack-config';

import { getBabelConfigPath } from './geBabelConfigPath';
import { getBaseBabelConfig } from './getBaseBabelConfig';
import { WebpackBabelPluginOptions } from './WebpackBabelPluginOptions';

const rr = require.resolve;

@ReadOptions(WebpackBabelPluginOptions, 'plugin-webpack-babel')
export class WebpackBabelPlugin extends AbstractPlugin<WebpackBabelPluginOptions> {
  public apply(applyContext: ApplyContext): void {
    applyContext.hooks.beforeRun.tap('WebpackBabelPlugin', beforeRunContext => {
      const webpackConfigBuilder = beforeRunContext.getConfigBuilder(
        WebpackConfig
      );

      webpackConfigBuilder.hooks.build.tap(
        'WebpackBabelPlugin',
        (modifications, configOptions) => {
          const { isDev, paths, useTypescript } = configOptions;

          const pluginOptions = this.optionsContainer.build();

          if (pluginOptions.syncConfig.enabled) {
            const babelConfigPath = getBabelConfigPath(paths.root);

            if (!babelConfigPath) {
              const baseBabelConfig = getBaseBabelConfig(
                configOptions,
                pluginOptions,
                pluginOptions.baseBabelConfig
              );

              const babelConfigPath = path.resolve(
                paths.root,
                'babel.config.json'
              );

              // eslint-disable-next-line no-console
              console.log('Create babel.config.json...');

              fs.writeFileSync(
                babelConfigPath,
                JSON.stringify(baseBabelConfig, null, 2)
              );
            }
          }

          modifications.insertUseItem({
            loader: rr('babel-loader'),
            options: {
              cacheDirectory: true,
              cacheCompression: !isDev,
              compact: !isDev
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
                  '@babel/preset-env',
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
