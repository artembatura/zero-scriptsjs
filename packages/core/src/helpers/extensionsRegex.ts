export const extensionsRegex = (extensions: string[], fileName: string = '') =>
  new RegExp(`${fileName}\\.(${extensions.join('|')})$`);
