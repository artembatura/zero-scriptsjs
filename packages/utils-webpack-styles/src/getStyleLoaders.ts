import MiniCssExtractPlugin from 'mini-css-extract-plugin';

import { ExtractOptions } from '@zero-scripts/core';
import { WebpackConfigOptions } from '@zero-scripts/webpack-config';

const rr = require.resolve;

export function getStyleLoaders(
  preprocessor?:
    | string
    | {
        loader: string;
        options: Record<string, unknown>;
      },
  cssLoader?:
    | string
    | {
        loader?: string;
        options?: Record<string, unknown>;
      }
) {
  return ({
    isDev,
    useSourceMap
  }: ExtractOptions<WebpackConfigOptions>): Array<any> => {
    const customCssLoader =
      typeof cssLoader === 'object' ? cssLoader.loader : cssLoader;

    const cssLoaderOptions =
      typeof cssLoader === 'object' ? cssLoader.options : {};

    const loaders: any[] = [
      isDev
        ? rr('style-loader')
        : {
            loader: MiniCssExtractPlugin.loader
          },
      {
        loader: customCssLoader || rr('css-loader'),
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
      const preprocessorLoader = {
        loader:
          typeof preprocessor === 'object'
            ? rr(preprocessor.loader)
            : rr(preprocessor),
        options: {
          sourceMap: !isDev && useSourceMap,
          ...(typeof preprocessor === 'object' ? preprocessor.options : {})
        }
      };

      loaders.push(preprocessorLoader);
    }

    return loaders;
  };
}
