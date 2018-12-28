export const packageIsExtension = (packageName: string) =>
  !!packageName.match('extension\\.[a-z]*');
