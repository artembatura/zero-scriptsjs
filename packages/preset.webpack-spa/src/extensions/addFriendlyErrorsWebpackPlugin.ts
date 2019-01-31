import { WebpackConfig } from '@zero-scripts/config.webpack';
import path from 'path';

const FriendlyErrorsPlugin = require('@artemir/friendly-errors-webpack-plugin');

export const addFriendlyErrorsWebpackPlugin = (config: WebpackConfig) =>
  config.insertPlugin(({ isDev, paths }) =>
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
