import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin';

import { WebpackConfigOptions } from '@zero-scripts/webpack-config';

let pluginInstance: OptimizeCSSAssetsPlugin | null = null;

export function getOptimizeCSSAssetsPlugin(
  configOptions: WebpackConfigOptions
): OptimizeCSSAssetsPlugin {
  if (!pluginInstance) {
    pluginInstance = new OptimizeCSSAssetsPlugin({
      cssProcessorOptions: {
        parser: require('postcss-safe-parser'),
        map: configOptions.useSourceMap
          ? {
              inline: false,
              annotation: true
            }
          : false
      }
    });
  }

  return pluginInstance;
}
