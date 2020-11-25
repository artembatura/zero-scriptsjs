import MiniCssExtractPlugin from 'mini-css-extract-plugin';

import { WebpackConfigOptions } from '@zero-scripts/webpack-config';

const rr = require.resolve;

export function getStyleLoaders(
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
            loader: MiniCssExtractPlugin.loader
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
