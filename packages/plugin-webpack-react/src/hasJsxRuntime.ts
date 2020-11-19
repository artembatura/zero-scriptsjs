import { WebpackConfigOptions } from '@zero-scripts/webpack-config';

export function hasJsxRuntime(paths: WebpackConfigOptions['paths']): boolean {
  try {
    require.resolve('react/jsx-runtime', { paths: [paths.root] });
    return true;
  } catch (e) {
    return false;
  }
}
