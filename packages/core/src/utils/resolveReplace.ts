const { createRequire } = require('module');

export function resolveReplace(
  config: Record<string, any>,
  mapCtxToPackage: Record<string, string[]>
): string {
  let tempString = JSON.stringify(config);

  Object.keys(mapCtxToPackage).forEach(rootPkg => {
    const pkgDeps = mapCtxToPackage[rootPkg];

    pkgDeps.forEach(pkgName => {
      const requireNested = createRequire(require.resolve(rootPkg));

      if (tempString.includes(pkgName)) {
        tempString = tempString.replace(
          new RegExp(`"${pkgName}"`, 'g'),
          () => `"${requireNested.resolve(pkgName)}"`
        );
      }
    });
  });

  return JSON.parse(tempString.replace(/\\/g, '\\\\'));
}
