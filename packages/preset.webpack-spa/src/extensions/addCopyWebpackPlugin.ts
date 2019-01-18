import { resolvePath, WebpackConfig } from '@zero-scripts/config.webpack';
import CopyWebpackPlugin from 'copy-webpack-plugin';

export const addCopyWebpackPlugin = (config: WebpackConfig) =>
  config.insertPlugin(({ isDev, paths }) =>
    !isDev
      ? new CopyWebpackPlugin([
          {
            from: resolvePath(paths.public),
            to: resolvePath(paths.build),
            ignore: [resolvePath(paths.indexHtml)]
          }
        ])
      : undefined
  );
