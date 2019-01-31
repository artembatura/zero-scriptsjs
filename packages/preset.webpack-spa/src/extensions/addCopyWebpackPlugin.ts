import { WebpackConfig } from '@zero-scripts/config.webpack';
import CopyWebpackPlugin from 'copy-webpack-plugin';

export const addCopyWebpackPlugin = (config: WebpackConfig) =>
  config.insertPlugin(({ isDev, paths }) =>
    !isDev
      ? new CopyWebpackPlugin([
          {
            from: paths.publicPath,
            to: paths.build,
            ignore: [paths.indexHtml]
          }
        ])
      : undefined
  );
