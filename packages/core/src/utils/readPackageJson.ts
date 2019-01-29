import { sync } from 'read-pkg';
import { Selector } from '../types';
import { Package } from 'normalize-package-data';

export function readPackageJson<TSelectedValue>(
  selector: Selector<Package, TSelectedValue>
): TSelectedValue;
export function readPackageJson(): Package;
export function readPackageJson(selector?: Function | undefined) {
  return selector ? selector(sync()) : sync();
}
