import loaderUtils from 'loader-utils';

export function getLocalIdent(
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  context: any,
  localIdentName: string,
  localName: string,
  options: Record<string, unknown>
): string {
  const fileNameOrFolder = context.resourcePath.match(
    /index\.(module|m)\.(css|scss|sass)$/
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

  return className.replace(/.(module|m)_/, '_');
}
