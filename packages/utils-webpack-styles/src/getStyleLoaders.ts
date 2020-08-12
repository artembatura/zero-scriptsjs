import { WebpackConfigOptions } from '@zero-scripts/webpack-config';

const rr = require.resolve;

export function getStyleLoaders(
  devLoader: string,
  cssOptions?: Record<string, unknown>,
  preprocessor?:
    | string
    | {
        loader: string;
        options: Record<string, unknown>;
      },
  customStyleLoader?: string
) {
  return ({ isDev, useSourceMap }: WebpackConfigOptions): Array<any> => {
    const loaders: any[] = [
      isDev
        ? rr('style-loader')
        : {
            loader: devLoader
          },
      {
        loader: rr(customStyleLoader || 'css-loader'),
        options: {
          sourceMap: !isDev && useSourceMap,
          importLoaders: preprocessor ? 2 : 1,
          ...(cssOptions ? cssOptions : {})
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
      const preprocessorObj = {
        loader:
          typeof preprocessor === 'object'
            ? preprocessor.loader
            : rr(preprocessor),
        options: {
          sourceMap: !isDev && useSourceMap,
          ...(typeof preprocessor === 'object' ? preprocessor.options : {})
        }
      };

      loaders.push(preprocessorObj);
    }

    return loaders;
  };
}
