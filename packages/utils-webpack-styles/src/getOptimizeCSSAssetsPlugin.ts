import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin';
import type { Compiler } from 'webpack';

import { WebpackConfigOptions } from '@zero-scripts/webpack-config';

let pluginInstance: OptimizeCSSAssetsPlugin | null = null;

interface WebpackPlugin {
  apply: (compiler: Compiler) => void;
}

export function getOptimizeCSSAssetsPlugin(
  configOptions: WebpackConfigOptions
): WebpackPlugin {
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