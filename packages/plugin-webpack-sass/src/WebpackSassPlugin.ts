import { AbstractPlugin, ReadOptions, ApplyContext } from '@zero-scripts/core';
import {
  getLocalIdent,
  getStyleLoaders,
  getOptimizeCSSAssetsPlugin,
  getMiniCssExtractPlugin
} from '@zero-scripts/utils-webpack-styles';
import { WebpackConfig } from '@zero-scripts/webpack-config';

import { WebpackSassPluginOptions } from './WebpackSassPluginOptions';

const sassModuleRegex = /\.(module|m)\.(scss|sass)$/;

@ReadOptions(WebpackSassPluginOptions, 'plugin-webpack-sass')
export class WebpackSassPlugin extends AbstractPlugin<WebpackSassPluginOptions> {
  public apply(applyContext: ApplyContext): void {
    applyContext.hooks.beforeRun.tap('WebpackSassPlugin', beforeRunContext => {
      const webpackConfigBuilder = beforeRunContext.getConfigBuilder(
        WebpackConfig
      );

      webpackConfigBuilder.hooks.build.tap(
        'WebpackSassPlugin',
        (modifications, configOptions) => {
          const sassLoader = require.resolve('sass-loader');

          modifications.insertModuleRule({
            test: /\.(scss|sass)$/,
            exclude: sassModuleRegex,
            use: getStyleLoaders(sassLoader)(configOptions),
            sideEffects: true
          });

          modifications.insertModuleRule({
            test: sassModuleRegex,
            use: getStyleLoaders(sassLoader, {
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
