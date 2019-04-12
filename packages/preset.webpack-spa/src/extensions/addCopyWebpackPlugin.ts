import CopyWebpackPlugin from 'copy-webpack-plugin';

import { WebpackConfig } from '@zero-scripts/config.webpack';

export function addCopyWebpackPlugin(config: WebpackConfig) {
  return config.insertPlugin(({ isDev, paths }) =>
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
}
