import MiniCssExtractPlugin from 'mini-css-extract-plugin';

import { WebpackConfigOptions } from '@zero-scripts/webpack-config';

const rr = require.resolve;

export function getStyleLoaders(
  preprocessor?:
    | string
    | {
        loader: string;
        options: Record<string, unknown>;
      },
  customCssLoader?:
    | string
    | {
        loader?: string;
        options?: Record<string, unknown>;
      }
) {
  return ({ isDev, useSourceMap }: WebpackConfigOptions): Array<any> => {
    const cssLoader =
      typeof customCssLoader === 'object'
        ? customCssLoader.loader
        : customCssLoader;
    const cssLoaderOptions =
      typeof customCssLoader === 'object' ? customCssLoader.options : {};

    const loaders: any[] = [
      isDev
        ? rr('style-loader')
        : {
            loader: MiniCssExtractPlugin.loader
          },
      {
        loader: rr(cssLoader || 'css-loader'),
        options: {
          sourceMap: !isDev && useSourceMap,
          importLoaders: preprocessor ? 2 : 1,
          ...(cssLoaderOptions || {})
        }
      },
      {
        loader: rr('postcss-loader'),
        options: {
          postcssOptions: {
            plugins: [
              rr('postcss-flexbugs-fixes'),
              [
                rr('postcss-preset-env'),
                {
                  autoprefixer: {
                    flexbox: 'no-2009'
                  },
                  stage: 3
                }
              ]
            ]
          },
          sourceMap: !isDev && useSourceMap
        }
      }
    ];

    if (preprocessor) {
      const preprocessorObj = {
        loader:
          typeof preprocessor === 'object'
            ? rr(preprocessor.loader)
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
