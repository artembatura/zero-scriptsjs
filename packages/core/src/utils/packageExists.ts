export function packageExists(
  pkgName: string | string[],
  rootPath: string
): boolean {
  try {
    if (Array.isArray(pkgName)) {
      pkgName.forEach(_pkgName => {
        require.resolve(_pkgName, { paths: [rootPath] });
      });
    } else {
      require.resolve(pkgName, { paths: [rootPath] });
    }

    return true;
  } catch {
    return false;
  }
}
