import {
  AbstractExtension,
  AbstractPreset,
  extensionsRegex,
  ReadOptions
} from '@zero-scripts/core';
import { WebpackConfig } from '@zero-scripts/config.webpack';
import { WebpackBabelExtensionOptions } from './WebpackBabelExtensionOptions';

@ReadOptions(WebpackBabelExtensionOptions, 'extension.webpack-babel')
export class WebpackBabelExtension<
  TParentExtensionOptions extends WebpackBabelExtensionOptions = WebpackBabelExtensionOptions
> extends AbstractExtension<TParentExtensionOptions> {
  public activate(preset: AbstractPreset): void {
    const _config = preset.getInstance(WebpackConfig);

    _config.beforeBuild(config => {
      const { plugins, flow, presets } = this.optionsContainer.build();

      config.insertModuleRule(options => {
        const { isDev, jsFileExtensions, paths, useTypescript } = options;
        return {
          test: extensionsRegex(jsFileExtensions),
          oneOf: [
            {
              include: paths.src,
              loader: require.resolve('babel-loader'),
              options: {
                babelrc: false,
                configFile: false,
                presets: [
                  ['@babel/preset-env', { loose: true, modules: false }],
                  useTypescript && '@babel/preset-typescript',
                  ...presets
                ].filter(Boolean),
                plugins: [
                  ['@babel/plugin-transform-runtime', { useESModules: true }],
                  '@babel/plugin-syntax-dynamic-import',
                  useTypescript && '@babel/plugin-proposal-decorators',
                  ['@babel/plugin-proposal-class-properties', { loose: true }],
                  ...plugins
                ].filter(Boolean),
                overrides: [
                  flow && {
                    exclude: /\.(ts|tsx)?$/,
                    plugins: ['@babel/plugin-transform-flow-strip-types']
                  },
                  useTypescript && {
                    test: /\.(ts|tsx)?$/,
                    plugins: [
                      ['@babel/plugin-proposal-decorators', { legacy: true }]
                    ]
                  }
                ].filter(Boolean),
                cacheDirectory: true,
                cacheCompression: !isDev,
                compact: !isDev
              }
            },
            {
              exclude: /@babel(?:\/|\\{1,2})runtime/,
              loader: require.resolve('babel-loader'),
              options: {
                babelrc: false,
                configFile: false,
                compact: false,
                presets: [['@babel/preset-env', { loose: true }]],
                cacheDirectory: true,
                cacheCompression: !isDev,
                sourceMaps: false
              }
            }
          ]
        };
      });

      config.insertPlugin(({ paths, useTypescript, isDev }) => {
        let ForkTsCheckerPlugin = undefined;

        if (useTypescript) {
          try {
            ForkTsCheckerPlugin = require('fork-ts-checker-webpack-plugin');
          } catch (e) {
            console.log(
              'Warning: If you want to checking types on your Typescript files' +
                ' , you need to manually install fork-ts-checker-webpack-plugin'
            );
          }
        }

        return ForkTsCheckerPlugin
          ? new ForkTsCheckerPlugin({
              typescript: require.resolve('typescript'),
              async: isDev,
              checkSyntacticErrors: true,
              useTypescriptIncrementalApi: true,
              tsconfig: paths.tsConfig,
              reportFiles: [
                '**',
                '!**/*.json',
                '!**/__tests__/**',
                '!**/?(*.)(spec|test).*',
                '!**/src/setupProxy.*',
                '!**/src/setupTests.*'
              ],
              watch: paths.src,
              silent: false
            })
          : undefined;
      });
    });
  }
}
