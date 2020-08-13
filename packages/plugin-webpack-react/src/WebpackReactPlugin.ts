import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';

import { AbstractPlugin, ReadOptions, PluginAPI } from '@zero-scripts/core';
import type { WebpackBabelPlugin } from '@zero-scripts/plugin-webpack-babel';
import type { WebpackEslintPlugin } from '@zero-scripts/plugin-webpack-eslint';
import { WebpackConfig } from '@zero-scripts/webpack-config';

import { WebpackReactPluginOptions } from './WebpackReactPluginOptions';

const rr = require.resolve;

@ReadOptions(WebpackReactPluginOptions, 'plugin-webpack-react')
export class WebpackReactPlugin extends AbstractPlugin<
  WebpackReactPluginOptions
> {
  public apply(ws: PluginAPI): void {
    ws.hooks.beforeRun.tap('WebpackReactPlugin', wsApi => {
      const config = wsApi.getConfigBuilder(WebpackConfig);

      config.hooks.beforeBuild.tap('WebpackReactPlugin', configOptions => {
        const pluginOptions = this.optionsContainer.build();

        const babelPlugin = wsApi.findPlugin<WebpackBabelPlugin>(
          'WebpackBabelPlugin'
        );
        const eslintPlugin = wsApi.findPlugin<WebpackEslintPlugin>(
          'WebpackEslintPlugin'
        );

        if (babelPlugin) {
          babelPlugin.optionsContainer.hooks.beforeBuild.tap(
            'WebpackReactPlugin',
            optionsContainer => {
              optionsContainer.presets.push([
                rr('@babel/preset-react'),
                { development: configOptions.isDev, useBuiltIns: true }
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

        if (pluginOptions.fastRefresh && configOptions.isDev) {
          if (babelPlugin) {
            babelPlugin.optionsContainer.hooks.beforeBuild.tap(
              'WebpackReactPlugin.addFastRefreshLoader',
              optionsContainer => {
                optionsContainer.plugins.push(rr('react-refresh/babel'));
              }
            );

            config.hooks.build.tap('WebpackReactPlugin', modifications => {
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
            });
          }
        }
      });
    });
  }
}
