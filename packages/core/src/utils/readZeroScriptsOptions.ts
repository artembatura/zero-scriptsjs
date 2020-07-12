import { readPackageJson } from './readPackageJson';

export const packageJsonOptionsKey = 'zero-scripts';

export function readZeroScriptsOptions(key?: string) {
  return readPackageJson(data => {
    const value = key
      ? data[packageJsonOptionsKey] && data[packageJsonOptionsKey][key]
      : data[packageJsonOptionsKey];

    return value ? value : {};
  });
}
