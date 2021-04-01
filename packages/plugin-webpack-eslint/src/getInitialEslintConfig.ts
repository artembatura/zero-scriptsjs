import { Linter } from 'eslint';

import { ExtractOptions } from '@zero-scripts/core';
import { WebpackConfigOptions } from '@zero-scripts/webpack-config';

const rr = (pkg: string, bool: boolean) => (bool ? require.resolve(pkg) : pkg);

export function getInitialEslintConfig(
  configOptions: ExtractOptions<WebpackConfigOptions>,
  baseConfig: Linter.Config,
  resolve: boolean
): Linter.Config {
  return {
    ...baseConfig,
    extends: [
      rr('@zero-scripts/eslint-config', resolve),
      ...(baseConfig.extends || [])
    ]
  };
}
