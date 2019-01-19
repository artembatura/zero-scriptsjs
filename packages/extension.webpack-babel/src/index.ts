import { AbstractExtension } from '@zero-scripts/core';
import {
  resolvePath,
  WebpackConfig,
  WebpackConfigOptions
} from '@zero-scripts/config.webpack';
import { ArrayOption, handleArrayOption } from '@zero-scripts/core';

export type WebpackBabelExtensionOptions = {
  presets: ArrayOption<string | [string, object], WebpackConfigOptions>;
  plugins: ArrayOption<string, WebpackConfigOptions>;
  typescript: boolean;
};

export class WebpackBabelExtension extends AbstractExtension<
  WebpackBabelExtensionOptions
> {
  public activate(): void {
    const config = this.preset.getInstance(WebpackConfig);

    if (this.options.typescript) {
      config.addJsFileExtensions(['ts', 'tsx']);
    }

    config.insertModuleRule(options => {
      const { isDev, jsFileExtensions, paths } = options;
      const test = new RegExp(`\\.(${jsFileExtensions.join('|')})$`);

      return {
        oneOf: [
          {
            test,
            include: resolvePath(paths.src),
            use: {
              loader: require.resolve('babel-loader'),
              options: {
                babelrc: false,
                configFile: false,
                presets: [
                  [require.resolve('@babel/preset-env'), { loose: true }],
                  ...(this.options.typescript
                    ? [require.resolve('@babel/preset-typescript')]
                    : []),
                  ...handleArrayOption(this.options.presets, options)
                ],
                plugins: [
                  ...(this.options.plugins ? this.options.plugins : [])
                ],
                cacheDirectory: true,
                cacheCompression: !isDev,
                compact: !isDev
              }
            }
          },
          {
            test,
            exclude: /@babel(?:\/|\\{1,2})runtime/,
            loader: require.resolve('babel-loader'),
            options: {
              babelrc: false,
              configFile: false,
              compact: false,
              presets: [
                [require.resolve('@babel/preset-env'), { loose: true }]
              ],
              cacheDirectory: true,
              cacheCompression: !isDev,
              sourceMaps: false
            }
          }
        ]
      };
    });

    config.insertPlugin(({ paths }) => {
      let ForkTsCheckerPlugin = undefined;

      if (this.options.typescript) {
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
            tsconfig: resolvePath(paths.tsConfig),
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
            watch: resolvePath(paths.src),
            silent: false
          })
        : undefined;
    });
  }
}

export default WebpackBabelExtension;
