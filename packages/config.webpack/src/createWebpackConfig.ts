import {
  Configuration,
  DefinePlugin,
  HotModuleReplacementPlugin
} from 'webpack';
import { CreateWebpackConfigParameters } from './CreateWebpackConfigParameters';
import ManifestPlugin from 'webpack-assets-manifest';

const TerserPlugin = require('terser-webpack-plugin');

export const createWebpackConfig = ({
  isDev,
  entry,
  outputPath,
  resolveExtensions,
  sourceMap
}: CreateWebpackConfigParameters): Configuration => ({
  mode: isDev ? 'development' : 'production',
  entry,
  devtool: isDev ? 'eval-source-map' : sourceMap ? 'source-map' : false,
  output: {
    path: !isDev ? outputPath : undefined,
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
        sourceMap
      })
    ],
    splitChunks: {
      chunks: 'all'
    },
    runtimeChunk: true
  },
  resolve: {
    modules: ['node_modules'],
    extensions: resolveExtensions
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
  ].concat(isDev ? [new HotModuleReplacementPlugin()] : []),
  node: false,
  stats: 'errors-only'
});
