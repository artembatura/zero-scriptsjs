import MiniCssExtractPlugin from 'mini-css-extract-plugin';

import { ExtractOptions } from '@zero-scripts/core';
import { WebpackConfigOptions } from '@zero-scripts/webpack-config';

const rr = require.resolve;

export function getStyleLoaders(
  postcssOptions?: {
    plugins?: any[];
  },
  cssLoader?:
    | string
    | {
        loader?: string;
        options?: Record<string, unknown>;
      },
  preprocessorLoader?:
    | string
    | {
        loader: string;
        options: Record<string, unknown>;
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
          importLoaders: preprocessorLoader ? 2 : 1,
          ...(cssLoaderOptions || {})
        }
      },
      {
        loader: rr('postcss-loader'),
        options: {
          postcssOptions: {
            plugins: [
              ...(postcssOptions?.plugins || []),
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

    if (preprocessorLoader) {
      loaders.push({
        loader:
          typeof preprocessorLoader === 'object'
            ? rr(preprocessorLoader.loader)
            : rr(preprocessorLoader),
        options: {
          sourceMap: !isDev && useSourceMap,
          ...(typeof preprocessorLoader === 'object'
            ? preprocessorLoader.options
            : {})
        }
      });
    }

    return loaders;
  };
}
