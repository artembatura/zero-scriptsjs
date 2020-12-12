import path from 'path';
import TerserPlugin from 'terser-webpack-plugin';
import type { Configuration } from 'webpack';
import { DefinePlugin } from 'webpack';

import { ExtractOptions } from '@zero-scripts/core';

import { WebpackConfigOptions } from './WebpackConfigOptions';

const ManifestPlugin = require('webpack-assets-manifest');

export function createWebpackConfiguration({
  isDev,
  paths,
  additionalEntry,
  useSourceMap,
  moduleFileExtensions
}: ExtractOptions<WebpackConfigOptions>): Configuration {
  return {
    mode: isDev ? 'development' : 'production',
    entry: [paths.indexJs, ...additionalEntry],
    devtool: isDev ? 'cheap-module-source-map' : useSourceMap && 'source-map',
    output: {
      path: paths.build,
      filename: isDev ? 'js/[name].js' : 'js/[name].[contenthash:8].js',
      publicPath: paths.publicUrlOrPath,
      chunkFilename: isDev
        ? 'js/[name].chunk.js'
        : 'js/[name:7].[contenthash:8].chunk.js',
      devtoolModuleFilenameTemplate: !isDev
        ? (info: any) =>
            path
              .relative(paths.src, info.absoluteResourcePath)
              .replace(/\\/g, '/')
        : (info: any) =>
            path.resolve(info.absoluteResourcePath).replace(/\\/g, '/')
    },
    bail: !isDev,
    optimization: {
      minimize: !isDev,
      minimizer: [
        new TerserPlugin({
          parallel: true
        })
      ],
      splitChunks: {
        chunks: 'all'
      },
      runtimeChunk: true
    },
    resolve: {
      modules: ['node_modules', paths.src],
      extensions: moduleFileExtensions.map(ext => '.' + ext)
    },
    module: {
      strictExportPresence: true,
      rules: []
    },
    plugins: [
      new DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify(process.env.NODE_ENV)
        }
      }),
      new ManifestPlugin({
        output: 'asset-manifest.json'
      })
    ],
    node: false,
    stats: 'none',
    infrastructureLogging: {
      level: 'none'
    }
  };
}
