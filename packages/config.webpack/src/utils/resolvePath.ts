import path from 'path';
import { getRootDir } from './getRootDir';

export const resolvePath = (relPath: string): string =>
  path.resolve(getRootDir(), relPath);
