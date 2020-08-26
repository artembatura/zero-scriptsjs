export function extensionsRegex(
  extensions: string[],
  fileName: string = ''
): RegExp {
  if (extensions.length === 0) {
    throw new Error('Cannot create RegExp with extensions.length equals 0');
  }

  return new RegExp(`${fileName}\\.(${extensions.join('|')})$`);
}
