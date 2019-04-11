import { realpathSync, readFileSync } from 'fs';

import { Selector } from '../types';

const _cache: Record<string, any> = {};

export function readJson<T extends Record<string, any>, TSelectedValue>(
  _path: string,
  selector?: Selector<T, TSelectedValue>
): TSelectedValue | T {
  const realPath: string = realpathSync(_path);

  if (!_cache[realPath]) {
    _cache[realPath] = JSON.parse(readFileSync(realPath, 'utf8'));
  }

  return selector ? selector(_cache[realPath]) : _cache[realPath];
}
