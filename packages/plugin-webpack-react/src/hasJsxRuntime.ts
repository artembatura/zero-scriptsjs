import { WebpackConfigOptions } from '@zero-scripts/webpack-config';

export function hasJsxRuntime(paths: WebpackConfigOptions['paths']): boolean {
  if (process.env.DISABLE_NEW_JSX_TRANSFORM === 'true') {
    return false;
  }

  try {
    require.resolve('react/jsx-runtime', { paths: [paths.root] });
    return true;
  } catch (e) {
    return false;
  }
}
