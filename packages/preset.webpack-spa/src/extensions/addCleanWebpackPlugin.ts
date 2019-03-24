import { WebpackConfig } from '@zero-scripts/config.webpack';
import CleanWebpackPlugin from 'clean-webpack-plugin';

export const addCleanWebpackPlugin = (config: WebpackConfig) =>
  config.insertPlugin(({ isDev }) =>
    !isDev ? new CleanWebpackPlugin() : undefined
  );
