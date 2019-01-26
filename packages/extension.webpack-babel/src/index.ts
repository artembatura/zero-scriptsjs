import {
  AbstractExtension,
  AbstractPreset,
  extensionsRegex,
  ArrayOption,
  handleArrayOption
} from '@zero-scripts/core';
import {
  WebpackConfig,
  WebpackConfigOptions
} from '@zero-scripts/config.webpack';

export type WebpackBabelExtensionOptions = {
  presets: ArrayOption<string | [string, object], WebpackConfigOptions>;
  plugins: ArrayOption<string | [string, object], WebpackConfigOptions>;
  flow: boolean;
};

export class WebpackBabelExtension extends AbstractExtension<
  WebpackBabelExtensionOptions
> {
  constructor(preset: AbstractPreset, options: WebpackBabelExtensionOptions) {
    super(preset, {
      flow: false,
      presets: [],
      plugins: [],
      ...options
    });
  }

  public activate(): void {
    const config = this.preset.getInstance(WebpackConfig);

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
                ...handleArrayOption(this.options.presets, options)
              ].filter(Boolean),
              plugins: [
                ['@babel/plugin-transform-runtime', { useESModules: true }],
                '@babel/plugin-syntax-dynamic-import',
                useTypescript && '@babel/plugin-proposal-decorators',
                ['@babel/plugin-proposal-class-properties', { loose: true }],
                ...handleArrayOption(this.options.plugins, options)
              ].filter(Boolean),
              overrides: [
                this.options.flow && {
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

    config.insertPlugin(({ paths, useTypescript }) => {
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
            async: true,
            checkSyntacticErrors: true,
            tsconfig: paths.tsConfig,
            compilerOptions: {
              module: 'esnext',
              moduleResolution: 'node',
              resolveJsonModule: true,
              isolatedModules: true,
              noEmit: true,
              jsx: 'preserve'
            },
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
  }
}

export default WebpackBabelExtension;
