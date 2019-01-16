import { resolvePath, WebpackConfig } from '@zero-scripts/config.webpack';
import CleanWebpackPlugin from 'clean-webpack-plugin';

export const addCopyWebpackPlugin = (config: WebpackConfig) =>
  config.insertPlugin(({ isDev, paths }) =>
    !isDev
      ? new CleanWebpackPlugin([resolvePath(paths.build)], {
          allowExternal: true
        })
      : undefined
  );
