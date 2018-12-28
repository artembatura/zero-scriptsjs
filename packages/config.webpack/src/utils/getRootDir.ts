import { realpathSync } from 'fs';

export const getRootDir = () => realpathSync(process.cwd());
