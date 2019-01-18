import { resolvePath, WebpackConfig } from '@zero-scripts/config.webpack';
import CleanWebpackPlugin from 'clean-webpack-plugin';

export const addCleanWebpackPlugin = (config: WebpackConfig) =>
  config.insertPlugin(({ isDev, paths }) =>
    !isDev
      ? new CleanWebpackPlugin([resolvePath(paths.build)], {
          allowExternal: true,
          verbose: false
        })
      : undefined
  );
