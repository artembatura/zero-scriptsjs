import { AbstractExtension } from '@zero-scripts/core';
import { WebpackConfig } from '@zero-scripts/config.webpack';

export type WebpackBabelExtensionOptions = {
  presets: string[];
};

export class WebpackBabelExtension extends AbstractExtension<
  WebpackBabelExtensionOptions
> {
  public activate(): void {
    this.preset
      .getInstance(WebpackConfig)
      .insertModuleRule(({ isDev, jsFileExtensions, paths }) => {
        const test = new RegExp(`\\.(${jsFileExtensions.join('|')})$`);

        return {
          oneOf: [
            {
              test,
              include: paths.src,
              use: {
                loader: require.resolve('babel-loader'),
                options: {
                  babelrc: false,
                  configFile: false,
                  presets: [
                    require.resolve('@babel/preset-env'),
                    ...(this.options.presets ? this.options.presets : [])
                  ]
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
                presets: [require.resolve('@babel/preset-env')],
                cacheDirectory: true,
                cacheCompression: isDev,
                sourceMaps: false
              }
            }
          ]
        };
      });
  }
}

export default WebpackBabelExtension;
