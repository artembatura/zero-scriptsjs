import fs from 'fs';

import { resolvePath } from '@zero-scripts/core';

export function resolveModule(
  extensions: string[],
  relativePath: string
): string {
  const extension = extensions.find(extension =>
    fs.existsSync(resolvePath(`${relativePath}.${extension}`))
  );

  if (extension) {
    return resolvePath(`${relativePath}.${extension}`);
  }

  return resolvePath(`${relativePath}.js`);
}
