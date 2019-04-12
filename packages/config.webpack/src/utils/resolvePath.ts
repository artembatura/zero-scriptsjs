import path from 'path';

import { getRootDir } from './getRootDir';

export function resolvePath(relPath: string): string {
  return path.resolve(getRootDir(), relPath);
}
