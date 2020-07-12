import { WebpackConfigOptions } from '@zero-scripts/webpack-config';

const rr = require.resolve;

export function getStyleLoaders(
  devLoader: string,
  cssOptions?: any,
  preprocessor?: string
) {
  return ({ isDev, useSourceMap }: WebpackConfigOptions): Array<any> => {
    const loaders = [
      isDev
        ? rr('style-loader')
        : {
            loader: devLoader
          },
      {
        loader: rr('css-loader'),
        options: {
          sourceMap: !isDev && useSourceMap,
          importLoaders: preprocessor ? 2 : 1,
          ...cssOptions
        }
      },
      {
        loader: rr('postcss-loader'),
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
        loader: rr(preprocessor),
        options: {
          sourceMap: !isDev && useSourceMap
        }
      });
    }

    return loaders;
  };
}
