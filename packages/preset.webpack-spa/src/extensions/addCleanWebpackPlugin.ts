import { WebpackConfig } from '@zero-scripts/config.webpack';
import CopyWebpackPlugin from 'copy-webpack-plugin';

export const addCleanWebpackPlugin = (config: WebpackConfig) =>
  config.insertPlugin(({ isDev, paths }) =>
    !isDev
      ? new CopyWebpackPlugin([
          { from: paths.public, to: paths.build, ignore: [paths.indexHtml] }
        ])
      : undefined
  );
