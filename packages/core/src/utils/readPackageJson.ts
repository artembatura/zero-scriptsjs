import { lstatSync } from 'fs';
import { Package } from 'normalize-package-data';
import { sep } from 'path';

import { Selector } from '../types';
import { readJson } from './readJson';

export type Options = {
  path?: string;
  normalize?: boolean;
};

export function readPackageJson<
  TPackage extends Package & { 'zero-scripts': Record<string, any> },
  TSelectedValue = null,
  TReturnValue extends TPackage | TSelectedValue = TSelectedValue extends null
    ? TPackage
    : TSelectedValue
>(
  selector?: Selector<TPackage, TSelectedValue>,
  options?: Options
): TReturnValue {
  const { normalize, path }: Required<Options> = {
    path: process.cwd(),
    normalize: true,
    ...(options ? options : {})
  };

  if (!lstatSync(path).isDirectory()) {
    throw new Error(`[readPackageJson]: ${path} isn't directory`);
  }

  const packageJson = readJson(path + sep + 'package.json') as TPackage;

  if (normalize) {
    require('normalize-package-data')(packageJson);
  }

  if (selector) {
    return selector(packageJson) as TReturnValue;
  }

  return packageJson as TReturnValue;
}
