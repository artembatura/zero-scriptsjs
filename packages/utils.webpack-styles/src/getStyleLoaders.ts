import MiniCssExtractPlugin from 'mini-css-extract-plugin';

import { WebpackConfigOptions } from '@zero-scripts/config.webpack';

export function getStyleLoaders(cssOptions: any, preprocessor?: string) {
  return ({ isDev, useSourceMap }: WebpackConfigOptions): Array<any> => {
    const loaders = [
      isDev
        ? require.resolve('style-loader')
        : {
            loader: MiniCssExtractPlugin.loader
          },
      {
        loader: require.resolve('css-loader'),
        options: cssOptions
      },
      {
        loader: require.resolve('postcss-loader'),
        options: {
          ident: 'postcss',
          plugins: () => [
            require('postcss-flexbugs-fixes'),
            require('postcss-preset-env')({
              autoprefixer: {
                flexbox: 'no-2009'
              },
              stage: 3
            })
          ],
          sourceMap: !isDev && useSourceMap
        }
      }
    ];

    if (preprocessor) {
      loaders.push({
        loader: require.resolve(preprocessor),
        options: {
          sourceMap: !isDev && useSourceMap
        }
      });
    }

    return loaders;
  };
}
