export const extensionsRegex = (extensions: string[]) =>
  new RegExp(`\\.(${extensions.join('|')})$`);
