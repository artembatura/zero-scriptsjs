import {
  Configuration,
  DefinePlugin,
  HotModuleReplacementPlugin
} from 'webpack';
import { WebpackConfigOptions } from './WebpackConfigOptions';
import { extensionsRegex } from '@zero-scripts/core';
import ManifestPlugin from 'webpack-assets-manifest';

const TerserPlugin = require('terser-webpack-plugin');

export const createWebpackConfiguration = ({
  isDev,
  paths,
  additionalEntry,
  useSourceMap,
  moduleFileExtensions
}: WebpackConfigOptions): Configuration => ({
  mode: isDev ? 'development' : 'production',
  entry: [paths.indexJs, ...additionalEntry],
  devtool: isDev ? 'eval-source-map' : useSourceMap && 'source-map',
  output: {
    path: !isDev ? paths.build : undefined,
    filename: isDev ? 'js/[name].js' : 'js/[name].[contenthash:8].js',
    chunkFilename: isDev
      ? 'js/[name].chunk.js'
      : 'js/[name].[contenthash:8].chunk.js'
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
    rules: [
      {
        oneOf: [
          {
            loader: require.resolve('file-loader'),
            exclude: [extensionsRegex(moduleFileExtensions), /\.html$/],
            options: {
              name: 'media/[name].[hash:8].[ext]'
            }
          }
        ]
      }
    ]
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
  ].concat(isDev ? [new HotModuleReplacementPlugin()] : []),
  node: false,
  stats: 'errors-only'
});
