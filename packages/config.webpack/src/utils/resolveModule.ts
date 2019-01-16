import fs from 'fs';
import { resolvePath } from './resolvePath';

export const resolveModule = (extensions: string[], relativePath: string) => {
  const extension = extensions.find(extension =>
    fs.existsSync(resolvePath(`${relativePath}.${extension}`))
  );

  if (extension) {
    return resolvePath(`${relativePath}.${extension}`);
  }

  return resolvePath(`${relativePath}.js`);
};
