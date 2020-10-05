import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';

import {
  AbstractPlugin,
  ReadOptions,
  ApplyContext,
  getCurrentTaskMeta,
  readPackageJson
} from '@zero-scripts/core';
import type { WebpackBabelPlugin } from '@zero-scripts/plugin-webpack-babel';
import type { WebpackEslintPlugin } from '@zero-scripts/plugin-webpack-eslint';
import { WebpackConfig } from '@zero-scripts/webpack-config';

import { WebpackReactPluginOptions } from './WebpackReactPluginOptions';

const rr = require.resolve;

@ReadOptions(WebpackReactPluginOptions, 'plugin-webpack-react')
export class WebpackReactPlugin extends AbstractPlugin<
  WebpackReactPluginOptions
> {
  public apply(applyContext: ApplyContext): void {
    applyContext.hooks.beforeRun.tap('WebpackReactPlugin', beforeRunContext => {
      const config = beforeRunContext.getConfigBuilder(WebpackConfig);
      const prebuiltConfigOptions = config.optionsContainer.build();

      config.hooks.beforeBuild.tap(
        'WebpackReactPlugin::addExtensions',
        configOptions => {
          configOptions.jsFileExtensions.push('jsx');
          configOptions.moduleFileExtensions.push('.jsx');

          if (prebuiltConfigOptions.useTypescript) {
            configOptions.jsFileExtensions.push('tsx');
            configOptions.moduleFileExtensions.push('.tsx');
          }
        }
      );

      config.hooks.beforeBuild.tap('WebpackReactPlugin', configOptions => {
        const pluginOptions = this.optionsContainer.build();

        const babelPlugin = beforeRunContext.findPlugin<WebpackBabelPlugin>(
          'WebpackBabelPlugin'
        );
        const eslintPlugin = beforeRunContext.findPlugin<WebpackEslintPlugin>(
          'WebpackEslintPlugin'
        );

        if (babelPlugin) {
          babelPlugin.optionsContainer.hooks.beforeBuild.tap(
            'WebpackReactPlugin',
            optionsContainer => {
              optionsContainer.presets.push([
                rr('@babel/preset-react'),
                {
                  development: configOptions.isDev,
                  useBuiltIns: true,
                  runtime: 'automatic'
                }
              ]);

              if (configOptions.isDev && pluginOptions.propTypes) {
                optionsContainer.plugins.push([
                  rr('babel-plugin-transform-react-remove-prop-types'),
                  { removeImport: true }
                ]);
              }
            }
          );
        }

        if (eslintPlugin) {
          eslintPlugin.optionsContainer.hooks.beforeBuild.tap(
            'WebpackReactPlugin',
            optionsContainer => {
              optionsContainer.extends.push(rr('eslint-config-react-app'));

              const reactVersion = readPackageJson(o => o.dependencies?.react);

              if (reactVersion && parseInt(reactVersion) > 16) {
                optionsContainer.rules = {
                  ...optionsContainer.rules,
                  'react/jsx-uses-react': 'off',
                  'react/react-in-jsx-scope': 'off'
                };
              }

              optionsContainer.parserOptions = {
                ...optionsContainer.parserOptions,
                ecmaFeatures: {
                  jsx: true
                }
              };

              optionsContainer.settings = {
                ...optionsContainer.settings,
                react: {
                  version: 'detect'
                }
              };
            }
          );
        }

        const currentTask = getCurrentTaskMeta();

        if (
          pluginOptions.fastRefresh &&
          currentTask?.instance?.name === 'start'
        ) {
          if (babelPlugin) {
            babelPlugin.optionsContainer.hooks.beforeBuild.tap(
              'WebpackReactPlugin::addFastRefreshLoader',
              optionsContainer => {
                optionsContainer.plugins.push(rr('react-refresh/babel'));
              }
            );

            config.hooks.build.tap(
              'WebpackReactPlugin::addReactRefresh',
              modifications => {
                modifications.insertPlugin(
                  new ReactRefreshWebpackPlugin({
                    overlay: {
                      sockIntegration: 'whm'
                    }
                  })
                );

                modifications.addResolveAlias(
                  'react-refresh/runtime',
                  require.resolve('react-refresh/runtime')
                );
              }
            );
          }
        }
      });
    });
  }
}
