import { readPackageJson } from './readPackageJson';

export const packageJsonOptionsKey = 'zero-scripts';

export const readZeroScriptsOptions = (key?: string) =>
  readPackageJson(data =>
    key
      ? data[packageJsonOptionsKey] && data[packageJsonOptionsKey][key]
      : data[packageJsonOptionsKey]
  );
