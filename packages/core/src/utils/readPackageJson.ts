import { Package } from 'normalize-package-data';
import { lstatSync } from 'fs';
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
    throw new Error(`[readPackageJson]: ${path} isn't directory`);
  }

  const packageJson = readJson(path + sep + 'package.json', selector);

  if (normalize) {
    require('normalize-package-data')(packageJson);
  }

  return packageJson;
}
