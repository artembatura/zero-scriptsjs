export function extensionsRegex(extensions: string[], fileName: string = '') {
  return new RegExp(`${fileName}\\.(${extensions.join('|')})$`);
}
