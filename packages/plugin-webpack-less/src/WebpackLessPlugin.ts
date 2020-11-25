import { AbstractPlugin, ReadOptions, ApplyContext } from '@zero-scripts/core';
import {
  getLocalIdent,
  getStyleLoaders,
  getOptimizeCSSAssetsPlugin,
  getMiniCssExtractPlugin
} from '@zero-scripts/utils-webpack-styles';
import { WebpackConfig } from '@zero-scripts/webpack-config';

import { WebpackLessPluginOptions } from './WebpackLessPluginOptions';

const lessModuleRegex = /\.(module|m)\.less$/;

@ReadOptions(WebpackLessPluginOptions, 'plugin-webpack-less')
export class WebpackLessPlugin extends AbstractPlugin<WebpackLessPluginOptions> {
  public apply(applyContext: ApplyContext): void {
    applyContext.hooks.beforeRun.tap('WebpackLessPlugin', beforeRunContext => {
      const webpackConfigBuilder = beforeRunContext.getConfigBuilder(
        WebpackConfig
      );

      webpackConfigBuilder.hooks.build.tap(
        'WebpackLessPlugin',
        (modifications, configOptions) => {
          const lessLoader = require.resolve('less-loader');

          modifications.insertModuleRule({
            test: /\.less$/,
            exclude: lessModuleRegex,
            use: getStyleLoaders(undefined, lessLoader)(configOptions),
            sideEffects: true
          });

          modifications.insertModuleRule({
            test: lessModuleRegex,
            use: getStyleLoaders(lessLoader, {
              options: {
                modules: {
                  getLocalIdent
                }
              }
            })(configOptions)
          });

          if (!configOptions.isDev) {
            modifications.insertPlugin(
              getMiniCssExtractPlugin(),
              undefined,
              'mini-css-extract-plugin'
            );
          }

          modifications.insertMinimizer(
            getOptimizeCSSAssetsPlugin(configOptions),
            undefined,
            'optimize-css-assets-plugin'
          );
        }
      );
    });
  }
}
