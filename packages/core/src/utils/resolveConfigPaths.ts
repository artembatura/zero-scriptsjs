import { ProjectConfig } from '../ProjectConfig';
import { getRootDir } from './getRootDir';

const { createRequire } = require('module');

export function resolveConfigPaths(config: Record<string, any>): string {
  const mapCtxToPackage: Record<string, string[]> = new ProjectConfig(
    getRootDir()
  ).read().precisePackageMap;

  let tempString = JSON.stringify(config);

  Object.keys(mapCtxToPackage).forEach(rootPkg => {
    const pkgDeps = mapCtxToPackage[rootPkg];

    pkgDeps.forEach(pkgName => {
      if (tempString.includes(pkgName)) {
        const requireNested = createRequire(require.resolve(rootPkg));

        tempString = tempString.replace(
          new RegExp(`"${pkgName}"`, 'g'),
          () => `"${requireNested.resolve(pkgName)}"`
        );
      }
    });
  });

  return JSON.parse(tempString.replace(/\\/g, '\\\\'));
}
