import { realpathSync } from 'fs';

export function getRootDir() {
  return realpathSync(process.cwd());
}
