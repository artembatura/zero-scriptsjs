import { Selector } from '../types';
import { Package } from 'normalize-package-data';
import path from 'path';

export type Options = {
  cwd: string;
  normalize: boolean;
};

export function readPackageJson<TSelectedValue>(
  selector?: Selector<Package, TSelectedValue>,
  options?: Options
): TSelectedValue {
  const _options: Options = {
    cwd: process.cwd(),
    normalize: true,
    ...(options ? options : {})
  };

  const filePath = path.resolve(_options.cwd, 'package.json');
  const json = require(filePath);

  if (_options.normalize) {
    require('normalize-package-data')(json);
  }

  return selector ? selector(json) : json;
}
