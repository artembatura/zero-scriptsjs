import { readPackageJson } from './readPackageJson';

const packageJsonOptionsKey = 'zero-scripts';

export const readZeroScriptsOptions = (key?: string) =>
  readPackageJson(data =>
    key
      ? data[packageJsonOptionsKey] && data[packageJsonOptionsKey][key]
      : data[packageJsonOptionsKey]
  );
