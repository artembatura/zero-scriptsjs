import { addHtmlWebpackPlugin } from './addHtmlWebpackPlugin';
import { WebpackConfig } from '@zero-scripts/config.webpack';
import { addCleanWebpackPlugin } from './addCleanWebpackPlugin';
import { addCopyWebpackPlugin } from './addCopyWebpackPlugin';

export const index: Array<(c: WebpackConfig) => WebpackConfig> = [
  addHtmlWebpackPlugin,
  addCleanWebpackPlugin,
  addCopyWebpackPlugin
];
