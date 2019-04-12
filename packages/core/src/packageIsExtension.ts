export function packageIsExtension(packageName: string) {
  return !!packageName.match('extension\\.[a-z]*');
}
