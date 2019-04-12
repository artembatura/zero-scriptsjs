import path from 'path';

import { WebpackConfig } from '@zero-scripts/config.webpack';

const FriendlyErrorsPlugin = require('@artemir/friendly-errors-webpack-plugin');

export function addFriendlyErrorsWebpackPlugin(config: WebpackConfig) {
  return config.insertPlugin(({ isDev, paths }) =>
    isDev
      ? new FriendlyErrorsPlugin({
          compilationSuccessInfo: {
            messages: ['You application is available at http://localhost:8080'],
            notes: [
              'The development build is not optimized',
              'To create a production build, run `build` script'
            ]
          }
        })
      : new FriendlyErrorsPlugin({
          compilationSuccessInfo: {
            messages: [
              `You application successfully built and available at ${paths.build
                .split(path.sep)
                .pop()} folder`
            ]
          }
        })
  );
}
