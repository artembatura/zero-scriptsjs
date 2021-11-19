import { realpathSync, readFileSync } from 'fs';

import { Selector } from '../types';

export function readJson<T extends Record<string, unknown>, TSelectedValue>(
  _path: string,
  selector?: Selector<T, TSelectedValue>
): TSelectedValue | T {
  const realPath: string = realpathSync(_path);

  const parsedJson = JSON.parse(readFileSync(realPath, 'utf8'));

  return selector ? selector(parsedJson) : parsedJson;
}
