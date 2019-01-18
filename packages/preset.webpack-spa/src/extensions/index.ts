import { addHtmlWebpackPlugin } from './addHtmlWebpackPlugin';
import { WebpackConfig } from '@zero-scripts/config.webpack';
import { addCopyWebpackPlugin } from './addCopyWebpackPlugin';
import { addCleanWebpackPlugin } from './addCleanWebpackPlugin';
import { addFriendlyErrorsWebpackPlugin } from './addFriendlyErrorsWebpackPlugin';

export const extensions: Array<(c: WebpackConfig) => WebpackConfig> = [
  addHtmlWebpackPlugin,
  addCopyWebpackPlugin,
  addCleanWebpackPlugin,
  addFriendlyErrorsWebpackPlugin
];
