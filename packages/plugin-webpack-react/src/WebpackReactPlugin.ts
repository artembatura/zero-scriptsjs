import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';

import {
  AbstractPlugin,
  ReadOptions,
  ApplyContext,
  getCurrentTaskMeta
} from '@zero-scripts/core';
import type { WebpackBabelPlugin } from '@zero-scripts/plugin-webpack-babel';
import type { WebpackEslintPlugin } from '@zero-scripts/plugin-webpack-eslint';
import { WebpackConfig } from '@zero-scripts/webpack-config';

import { hasJsxRuntime } from './hasJsxRuntime';
import { WebpackReactPluginOptions } from './WebpackReactPluginOptions';

const rr = require.resolve;

@ReadOptions(WebpackReactPluginOptions, 'plugin-webpack-react')
export class WebpackReactPlugin extends AbstractPlugin<WebpackReactPluginOptions> {
  public apply(applyContext: ApplyContext): void {
    applyContext.hooks.beforeRun.tap('WebpackReactPlugin', beforeRunContext => {
      const config = beforeRunContext.getConfigBuilder(WebpackConfig);
      const prebuiltConfigOptions = config.optionsContainer.build();

      config.hooks.beforeBuild.tap(
        'WebpackReactPlugin::addExtensions',
        configOptions => {
          configOptions.jsFileExtensions.push('jsx');
          configOptions.moduleFileExtensions.push('jsx');

          if (prebuiltConfigOptions.useTypescript) {
            configOptions.jsFileExtensions.push('tsx');
            configOptions.moduleFileExtensions.push('tsx');
          }
        }
      );

      config.hooks.beforeBuild.tap('WebpackReactPlugin', () => {
        const pluginOptions = this.optionsContainer.build();

        const babelPlugin = beforeRunContext.findPlugin<WebpackBabelPlugin>(
          'WebpackBabelPlugin'
        );
        const eslintPlugin = beforeRunContext.findPlugin<WebpackEslintPlugin>(
          'WebpackEslintPlugin'
        );

        const useNewJsxTransform = pluginOptions.disableNewJsxTransform
          ? false
          : hasJsxRuntime(prebuiltConfigOptions.paths);

        if (babelPlugin) {
          babelPlugin.optionsContainer.hooks.beforeBuild.tap(
            'WebpackReactPlugin',
            optionsContainer => {
              const baseConfig = optionsContainer.baseBabelConfig;

              baseConfig.env.development.presets.push([
                '@babel/preset-react',
                {
                  development: true,
                  useBuiltIns: true,
                  runtime: useNewJsxTransform ? 'automatic' : 'classic'
                }
              ]);

              baseConfig.env.production.presets.push([
                '@babel/preset-react',
                {
                  development: false,
                  useBuiltIns: true,
                  runtime: useNewJsxTransform ? 'automatic' : 'classic'
                }
              ]);

              // TODO: if prop-types package is installed,
              //  automatically enable this option
              if (pluginOptions.propTypes) {
                baseConfig.env.production.plugins.push([
                  'babel-plugin-transform-react-remove-prop-types',
                  { removeImport: true }
                ]);
              }

              if (pluginOptions.svgReactComponent) {
                baseConfig.plugins.push([
                  'babel-plugin-named-asset-import',
                  {
                    loaderMap: {
                      svg: {
                        ReactComponent:
                          '@svgr/webpack' + '?-svgo,+titleProp,+ref![path]'
                      }
                    }
                  }
                ]);
              }
            }
          );
        }

        if (eslintPlugin) {
          eslintPlugin.optionsContainer.hooks.beforeBuild.tap(
            'WebpackReactPlugin',
            optionsContainer => {
              const baseConfig = optionsContainer.baseEslintConfig;

              baseConfig.extends = baseConfig.extends || [];

              if (Array.isArray(baseConfig.extends)) {
                baseConfig.extends.push('eslint-config-react-app');
              }

              if (useNewJsxTransform) {
                baseConfig.rules = {
                  ...(baseConfig.rules || {}),
                  'react/jsx-uses-react': 'off',
                  'react/react-in-jsx-scope': 'off'
                };
              }

              baseConfig.parserOptions = {
                ...(baseConfig.parserOptions || {}),
                ecmaFeatures: {
                  jsx: true
                }
              };

              baseConfig.settings = {
                ...(baseConfig.settings || {}),
                react: {
                  version: 'detect'
                }
              };
            }
          );
        }

        const currentTask = getCurrentTaskMeta();

        if (pluginOptions.fastRefresh && currentTask?.name === 'start') {
          if (babelPlugin) {
            babelPlugin.optionsContainer.hooks.beforeBuild.tap(
              'WebpackReactPlugin::addFastRefreshLoader',
              optionsContainer => {
                const baseConfig = optionsContainer.baseBabelConfig;

                baseConfig.env.development.plugins.push('react-refresh/babel');
              }
            );

            config.hooks.build.tap(
              'WebpackReactPlugin::addReactRefresh',
              modifications => {
                modifications.insertPlugin(
                  new ReactRefreshWebpackPlugin({
                    overlay: {
                      sockIntegration: 'whm',
                      entry: rr('webpack-hot-middleware/client')
                    }
                  })
                );

                // react-refresh adds hot accepting logic too
                if (modifications.has('hot-accept-plugin')) {
                  modifications.remove('hot-accept-plugin');
                }
              }
            );
          } else {
            // eslint-disable-next-line no-console
            console.log(
              "Warning: You can't use React Refresh without @zero-scripts/plugin-webpack-babel. Please install this plugin or turn off `plugin-webpack-react.fastRefresh` option"
            );
          }
        }
      });
    });
  }
}
