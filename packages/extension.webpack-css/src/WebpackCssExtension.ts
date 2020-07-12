import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin';

import { WebpackConfig } from '@zero-scripts/config.webpack';
import {
  AbstractExtension,
  AbstractPreset,
  ReadOptions
} from '@zero-scripts/core';
import {
  getLocalIdent,
  getStyleLoaders
} from '@zero-scripts/utils.webpack-styles';

import { WebpackCssExtensionOptions } from './WebpackCssExtensionOptions';

const safePostCssParser = require('postcss-safe-parser');

const cssModuleRegex = /\.(module|m)\.css$/;

@ReadOptions(WebpackCssExtensionOptions, 'extension.webpack-css')
export class WebpackCssExtension<
  TParentExtensionOptions extends WebpackCssExtensionOptions = WebpackCssExtensionOptions
> extends AbstractExtension<TParentExtensionOptions> {
  public activate(preset: AbstractPreset): void {
    preset.getInstance(WebpackConfig).beforeBuild(config => {
      const options = this.optionsContainer.build();

      // eslint-disable-next-line
      options?.styleLoaders?.forEach(rule => {
        config.insertModuleRule(configOptions => ({
          test: new RegExp(rule.test),
          exclude: rule.exclude ? new RegExp(rule.exclude) : undefined,
          use: getStyleLoaders(
            {
              importLoaders: 1,
              sourceMap: !configOptions.isDev && configOptions.useSourceMap
            },
            rule.preprocessor ? require.resolve(rule.preprocessor) : undefined,
            require.resolve(rule.loader)
          )(configOptions),
          sideEffects: true
        }));
      });

      config
        .insertModuleRule(configOptions => ({
          test: /\.css$/,
          exclude: cssModuleRegex,
          use: getStyleLoaders(
            {
              importLoaders: 1,
              sourceMap: !configOptions.isDev && configOptions.useSourceMap
            },
            undefined
          )(configOptions),
          sideEffects: true
        }))
        .insertModuleRule(configOptions => ({
          test: cssModuleRegex,
          use: getStyleLoaders(
            {
              importLoaders: 1,
              sourceMap: !configOptions.isDev && configOptions.useSourceMap,
              modules: true,
              getLocalIdent
            },
            undefined
          )(configOptions)
        }))
        .insertPlugin(
          options =>
            !options.isDev
              ? new MiniCssExtractPlugin({
                  filename: 'css/[name].[contenthash:8].css',
                  chunkFilename: 'css/[name].[contenthash:8].chunk.css'
                })
              : undefined,
          undefined,
          'mini-css-extract-plugin'
        )
        .insertMinimizer(
          ({ useSourceMap }) =>
            new OptimizeCSSAssetsPlugin({
              cssProcessorOptions: {
                parser: safePostCssParser,
                map: useSourceMap
                  ? {
                      inline: false,
                      annotation: true
                    }
                  : false
              }
            })
        );
    });
  }
}
