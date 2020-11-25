import { AbstractPlugin, ApplyContext, ReadOptions } from '@zero-scripts/core';
import {
  getLocalIdent,
  getStyleLoaders,
  getOptimizeCSSAssetsPlugin,
  getMiniCssExtractPlugin
} from '@zero-scripts/utils-webpack-styles';
import { WebpackConfig } from '@zero-scripts/webpack-config';

import { WebpackCssPluginOptions } from './WebpackCssPluginOptions';

const cssModuleRegex = /\.(module|m)\.css$/;

@ReadOptions(WebpackCssPluginOptions, 'plugin-webpack-css')
export class WebpackCssPlugin extends AbstractPlugin<WebpackCssPluginOptions> {
  public apply(applyContext: ApplyContext): void {
    applyContext.hooks.beforeRun.tap('WebpackCssPlugin', beforeRunContext => {
      const webpackConfigBuilder = beforeRunContext.getConfigBuilder(
        WebpackConfig
      );

      webpackConfigBuilder.hooks.build.tap(
        'WebpackCssPlugin',
        (modifications, configOptions) => {
          const options = this.optionsContainer.build();

          options.styleLoaders?.forEach(rule => {
            modifications.insertModuleRule({
              test: new RegExp(rule.test),
              exclude: rule.exclude ? new RegExp(rule.exclude) : undefined,
              use: getStyleLoaders(
                undefined,
                require.resolve(rule.loader),
                rule.preprocessor
                  ? require.resolve(rule.preprocessor)
                  : undefined
              )(configOptions),
              sideEffects: true
            });
          });

          modifications.insertModuleRule({
            test: /\.css$/,
            exclude: cssModuleRegex,
            sideEffects: true,
            use: getStyleLoaders()(configOptions)
          });

          modifications.insertModuleRule({
            test: cssModuleRegex,
            use: getStyleLoaders({
              modules: {
                getLocalIdent
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
