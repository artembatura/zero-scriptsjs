import loaderUtils from 'loader-utils';
// eslint-disable-next-line import/no-unresolved
import type { loader } from 'webpack';

export function getLocalIdent(
  context: loader.LoaderContext,
  localIdentName: string,
  localName: string,
  options: Record<string, unknown>
): string {
  const fileNameOrFolder = context.resourcePath.match(
    /index\.module\.(css|scss|sass)$/
  )
    ? '[folder]'
    : '[name]';

  const hash = loaderUtils.getHashDigest(
    Buffer.from(context.resourcePath + localName),
    'md5',
    'base64',
    5
  );

  const className = loaderUtils.interpolateName(
    context,
    fileNameOrFolder + '_' + localName + '__' + hash,
    options
  );

  return className.replace('.module_', '_');
}
