import { resolvePath } from '@zero-scripts/core';

import { resolveModule } from './utils/resolveModule';
import { WebpackConfigOptions } from './WebpackConfigOptions';

export function resolvePaths(
  paths: WebpackConfigOptions['paths'],
  extensions: string[],
  isDevelopment: boolean
): WebpackConfigOptions['paths'] {
  return {
    src: resolvePath(paths.src),
    root: resolvePath(paths.root),
    publicPath: isDevelopment ? '/' : paths.publicPath,
    public: resolvePath(paths.public),
    build: resolvePath(paths.build),
    indexHtml: resolvePath(paths.indexHtml),
    indexJs: resolveModule(extensions, paths.indexJs),
    tsConfig: resolvePath(paths.tsConfig)
  };
}
