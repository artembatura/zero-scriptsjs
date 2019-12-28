import { AbstractPlugin, ReadOptions, PluginAPI } from '@zero-scripts/core';
import { WebpackBabelPlugin } from '@zero-scripts/plugin-webpack-babel';
import { WebpackEslintPlugin } from '@zero-scripts/plugin-webpack-eslint';
import { WebpackConfig } from '@zero-scripts/webpack-config';

import { WebpackReactPluginOptions } from './WebpackReactPluginOptions';

@ReadOptions(WebpackReactPluginOptions, 'plugin-webpack-react')
export class WebpackReactPlugin<
  TParentOptions extends WebpackReactPluginOptions | undefined = undefined
> extends AbstractPlugin<
  TParentOptions extends undefined ? WebpackReactPluginOptions : TParentOptions
> {
  public apply(ws: PluginAPI): void {
    ws.hooks.beforeRun.tap('WebpackReactPlugin', wsApi => {
      const config = wsApi.getConfigBuilder(WebpackConfig);

      config.hooks.beforeBuild.tap('WebpackReactPlugin', configOptions => {
        const pluginOptions = this.optionsContainer.build();

        const babelPlugin = wsApi.findPlugin(WebpackBabelPlugin) as
          | WebpackBabelPlugin
          | undefined;

        const eslintPlugin = wsApi.findPlugin(WebpackEslintPlugin) as
          | WebpackEslintPlugin
          | undefined;

        if (babelPlugin) {
          babelPlugin.optionsContainer.hooks.beforeBuild.tap(
            'WebpackReactPlugin',
            optionsContainer => {
              optionsContainer.presets.push([
                '@babel/preset-react',
                { development: configOptions.isDev, useBuiltIns: true }
              ]);

              if (configOptions.isDev && pluginOptions.propTypes) {
                optionsContainer.plugins.push([
                  'babel-plugin-transform-react-remove-prop-types',
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
              optionsContainer.extends.push('eslint-config-react-app');

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
      });
    });
  }
}
