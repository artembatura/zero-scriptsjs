import { realpathSync } from 'fs';

export function getRootDir(): string {
  return realpathSync(process.cwd());
}
