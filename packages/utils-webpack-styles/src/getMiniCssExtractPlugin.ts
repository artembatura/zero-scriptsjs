import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import type { Compiler } from 'webpack';

let pluginInstance: MiniCssExtractPlugin | null = null;

interface WebpackPlugin {
  apply: (compiler: Compiler) => void;
}

export function getMiniCssExtractPlugin(): WebpackPlugin {
  if (!pluginInstance) {
    pluginInstance = new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash:8].css',
      chunkFilename: 'css/[name].[contenthash:8].chunk.css'
    });
  }

  return pluginInstance as any;
}
