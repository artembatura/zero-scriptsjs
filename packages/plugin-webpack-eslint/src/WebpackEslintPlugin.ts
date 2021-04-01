import ESLintPlugin from 'eslint-webpack-plugin';
import * as fs from 'fs';
import * as path from 'path';

import {
  AbstractPlugin,
  ReadOptions,
  ApplyContext,
  Task,
  run
} from '@zero-scripts/core';
import type { WebpackBabelPlugin } from '@zero-scripts/plugin-webpack-babel';
import { WebpackConfig } from '@zero-scripts/webpack-config';

import { eslintConfigExists } from './eslintConfigExists';
import { getEslintConfigFileContents } from './getEslintConfigFileContents';
import { getInitialEslintConfig } from './getInitialEslintConfig';
import { WebpackEslintPluginOptions } from './WebpackEslintPluginOptions';

@ReadOptions(WebpackEslintPluginOptions, 'plugin-webpack-eslint')
export class WebpackEslintPlugin extends AbstractPlugin<WebpackEslintPluginOptions> {
  public readonly resolveMaps: string[] = [
    '@zero-scripts/plugin-webpack-eslint/build/resolveMap.js'
  ];

  public apply(applyContext: ApplyContext): void {
    applyContext.hooks.beforeRun.tap(
      'WebpackEslintPlugin',
      beforeRunContext => {
        const webpackConfigBuilder = beforeRunContext.getConfigBuilder(
          WebpackConfig
        );

        beforeRunContext.addTask(
          new Task('generate-eslint-config', async () => {
            const configOptions = webpackConfigBuilder.optionsContainer.build();
            const { paths } = configOptions;

            const pluginOptions = this.optionsContainer.build();

            if (!eslintConfigExists(paths.root)) {
              const initialBabelConfig = getInitialEslintConfig(
                configOptions,
                pluginOptions.baseEslintConfig,
                false
              );

              const eslintConfigPath = path.resolve(paths.root, '.eslintrc.js');

              if (beforeRunContext.hasPlugin('WebpackBabelPlugin')) {
                await run(['generate-babel-config']);
              }

              // eslint-disable-next-line no-console
              console.log('Create .eslintrc.js...');

              fs.writeFile(
                eslintConfigPath,
                getEslintConfigFileContents(
                  initialBabelConfig,
                  this.resolveMaps
                ),
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
          'WebpackEslintPlugin',
          (modifications, configOptions) => {
            const { jsFileExtensions, paths } = configOptions;
            const pluginOptions = this.optionsContainer.build();

            const baseEslintConfig = getInitialEslintConfig(
              configOptions,
              pluginOptions.baseEslintConfig,
              true
            );

            const babelPlugin = beforeRunContext.findPlugin<WebpackBabelPlugin>(
              'WebpackBabelPlugin'
            );

            const babelOptions = babelPlugin
              ? babelPlugin.optionsContainer.build().baseBabelConfig
              : undefined;

            (global as any)['ESLINT_CONFIG'] = {
              ...baseEslintConfig,
              parserOptions: {
                ...baseEslintConfig.parserOptions,
                babelOptions
              }
            };

            const useEslintrc = eslintConfigExists(paths.root);

            modifications.insertPlugin(
              new ESLintPlugin({
                extensions: jsFileExtensions,
                context: paths.src,
                cache: true,
                cwd: paths.root,
                overrideConfigFile: useEslintrc
                  ? undefined
                  : require.resolve('./eslint-config.js'),
                useEslintrc
              })
            );
          }
        );
      }
    );
  }
}
