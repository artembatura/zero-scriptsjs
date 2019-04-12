import CleanWebpackPlugin from 'clean-webpack-plugin';

import { WebpackConfig } from '@zero-scripts/config.webpack';

export function addCleanWebpackPlugin(config: WebpackConfig) {
  return config.insertPlugin(({ isDev }) =>
    !isDev ? new CleanWebpackPlugin() : undefined
  );
}
