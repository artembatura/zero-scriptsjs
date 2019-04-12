import { WebpackConfig } from '@zero-scripts/config.webpack';

import { addCleanWebpackPlugin } from './addCleanWebpackPlugin';
import { addCopyWebpackPlugin } from './addCopyWebpackPlugin';
import { addFriendlyErrorsWebpackPlugin } from './addFriendlyErrorsWebpackPlugin';
import { addHtmlWebpackPlugin } from './addHtmlWebpackPlugin';

export const extensions: Array<(c: WebpackConfig) => WebpackConfig> = [
  addHtmlWebpackPlugin,
  addCopyWebpackPlugin,
  addCleanWebpackPlugin,
  addFriendlyErrorsWebpackPlugin
];
