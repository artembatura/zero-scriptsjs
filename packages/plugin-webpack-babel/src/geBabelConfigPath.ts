import * as fs from 'fs';
import * as path from 'path';

export function getBabelConfigPath(rootPath: string): string | null {
  const basePath = path.resolve(rootPath, 'babel.config');

  const extensions = ['.json', '.js'];

  const existsExt = extensions.find(ext => {
    const path = basePath + ext;

    return fs.existsSync(path);
  });

  return existsExt ? basePath + existsExt : null;
}
