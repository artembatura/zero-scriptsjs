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

const rr = (pkg: string, bool: boolean) => (bool ? require.resolve(pkg) : pkg);

@ReadOptions(WebpackReactPluginOptions, 'plugin-webpack-react')
export class WebpackReactPlugin extends AbstractPlugin<WebpackReactPluginOptions> {
  public apply(applyContext: ApplyContext): void {
    applyContext.hooks.beforeRun.tap('WebpackReactPlugin', beforeRunContext => {
      const webpackConfigBuilder = beforeRunContext.getConfigBuilder(
        WebpackConfig
      );
      const prebuiltConfigOptions = webpackConfigBuilder.optionsContainer.build();

      webpackConfigBuilder.optionsContainer.hooks.beforeBuild.tap(
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

      const currentTask = getCurrentTaskMeta();

      if (babelPlugin) {
        babelPlugin.optionsContainer.hooks.beforeBuild.tap(
          'WebpackReactPlugin',
          optionsContainer => {
            const baseConfig = optionsContainer.baseBabelConfig;

            babelPlugin.resolveMaps.push(
              '@zero-scripts/plugin-webpack-react/build/babelResolveMap.js'
            );

            const isGenerateTask =
              currentTask?.name === 'generate-babel-config';

            const resolveBabelPackages = !isGenerateTask;

            baseConfig.presets.push([
              rr('@babel/preset-react', resolveBabelPackages),
              {
                useBuiltIns: true,
                runtime: useNewJsxTransform ? 'automatic' : 'classic'
              }
            ]);

            baseConfig.env.development.presets.push([
              rr('@babel/preset-react', resolveBabelPackages),
              {
                development: true,
                useBuiltIns: true,
                runtime: useNewJsxTransform ? 'automatic' : 'classic'
              }
            ]);

            // TODO: if prop-types package is installed,
            //  automatically enable this option
            if (pluginOptions.propTypes) {
              baseConfig.env.production.plugins.push([
                rr(
                  'babel-plugin-transform-react-remove-prop-types',
                  resolveBabelPackages
                ),
                { removeImport: true }
              ]);
            }

            if (pluginOptions.svgReactComponent) {
              baseConfig.plugins.push([
                rr('babel-plugin-named-asset-import', resolveBabelPackages),
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

            baseConfig.extends = (baseConfig.extends || []) as string[];

            eslintPlugin.resolveMaps.push(
              '@zero-scripts/plugin-webpack-react/build/eslintResolveMap.js'
            );

            const isGenerateTask =
              currentTask?.name === 'generate-eslint-config';

            const resolveEslintPackages = !isGenerateTask;

            baseConfig.extends.push(
              rr('@zero-scripts/eslint-config-react', resolveEslintPackages)
            );

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

      if (pluginOptions.fastRefresh && currentTask?.name === 'start') {
        if (babelPlugin) {
          babelPlugin.optionsContainer.hooks.beforeBuild.tap(
            'WebpackReactPlugin::addFastRefreshLoader',
            optionsContainer => {
              const baseConfig = optionsContainer.baseBabelConfig;

              baseConfig.env.development.plugins.push('react-refresh/babel');
            }
          );

          webpackConfigBuilder.hooks.build.tap(
            'WebpackReactPlugin::addReactRefresh',
            modifications => {
              modifications.insertPlugin(
                new ReactRefreshWebpackPlugin({
                  overlay: {
                    sockIntegration: 'whm',
                    entry: rr('webpack-hot-middleware/client', true)
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
  }
}
