import { lstatSync } from 'fs';
import normalizePackageData, { Package } from 'normalize-package-data';
import { sep } from 'path';

import { Selector } from '../types';
import { readJson } from './readJson';

export type Options = {
  path?: string;
  normalize?: boolean;
};

export function readPackageJson<TPackage extends Package, TSelectedValue>(
  selector?: Selector<TPackage, TSelectedValue>,
  options?: Options
): TSelectedValue | TPackage {
  const { normalize, path }: Required<Options> = {
    path: process.cwd(),
    normalize: true,
    ...(options ? options : {})
  };

  if (!lstatSync(path).isDirectory()) {
    throw new Error(`Path "${path}" is not a directory`);
  }

  const packageJson = readJson(path + sep + 'package.json', selector);

  if (normalize) {
    normalizePackageData(packageJson);
  }

  return packageJson;
}
