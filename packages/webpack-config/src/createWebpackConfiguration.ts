import InterpolateHtmlPlugin from '@k88/interpolate-html-plugin';
import path from 'path';
import TerserPlugin from 'terser-webpack-plugin';
import type { Configuration } from 'webpack';
import { DefinePlugin } from 'webpack';
import ManifestPlugin from 'webpack-assets-manifest';

import { ExtractOptions } from '@zero-scripts/core';

import { WebpackConfigOptions } from './WebpackConfigOptions';

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
    devtool: isDev ? 'eval-source-map' : useSourceMap && 'source-map',
    output: {
      path: paths.build,
      filename: isDev ? 'js/[name].js' : 'js/[name].[contenthash:8].js',
      publicPath: paths.publicPath,
      chunkFilename: isDev
        ? 'js/[name].chunk.js'
        : 'js/[name].[contenthash:8].chunk.js',
      devtoolModuleFilenameTemplate: !isDev
        ? info =>
            path
              .relative(paths.src, info.absoluteResourcePath)
              .replace(/\\/g, '/')
        : info => path.resolve(info.absoluteResourcePath).replace(/\\/g, '/')
    },
    bail: !isDev,
    optimization: {
      minimize: !isDev,
      minimizer: [
        new TerserPlugin({
          parallel: true,
          cache: true,
          sourceMap: useSourceMap
        })
      ],
      splitChunks: {
        chunks: 'all'
      },
      runtimeChunk: true
    },
    resolve: {
      modules: ['node_modules'],
      extensions: moduleFileExtensions
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
      }),
      new InterpolateHtmlPlugin({
        PUBLIC_PATH: paths.publicPath.endsWith('/')
          ? paths.publicPath.slice(0, -1)
          : paths.publicPath
      })
    ],
    node: {
      module: 'empty',
      dgram: 'empty',
      fs: 'empty',
      net: 'empty',
      tls: 'empty',
      child_process: 'empty'
    },
    stats: 'errors-only',
    infrastructureLogging: {
      level: 'error'
    }
  } as Configuration;
}
