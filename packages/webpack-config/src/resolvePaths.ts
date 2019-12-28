import { resolveModule, resolvePath } from './utils';
import { WebpackConfigOptions } from './WebpackConfigOptions';

export function resolvePaths(
  {
    tsConfig,
    indexJs,
    indexHtml,
    build,
    publicPath,
    root,
    src
  }: WebpackConfigOptions['paths'],
  extensions: string[]
): WebpackConfigOptions['paths'] {
  return {
    src: resolvePath(src),
    root: resolvePath(root),
    publicPath: resolvePath(publicPath),
    build: resolvePath(build),
    indexHtml: resolvePath(indexHtml),
    indexJs: resolveModule(extensions, indexJs),
    tsConfig: resolvePath(tsConfig)
  };
}
