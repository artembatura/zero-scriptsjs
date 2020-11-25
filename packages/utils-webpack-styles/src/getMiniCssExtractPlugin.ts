import MiniCssExtractPlugin from 'mini-css-extract-plugin';

let pluginInstance: MiniCssExtractPlugin | null = null;

export function getMiniCssExtractPlugin(): MiniCssExtractPlugin {
  if (!pluginInstance) {
    pluginInstance = new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash:8].css',
      chunkFilename: 'css/[name].[contenthash:8].chunk.css'
    });
  }

  return pluginInstance;
}
