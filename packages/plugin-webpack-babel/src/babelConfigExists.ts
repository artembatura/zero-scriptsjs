import * as fs from 'fs';
import * as path from 'path';

export function babelConfigExists(rootPath: string): boolean {
  const basePath = path.resolve(rootPath, 'babel.config');

  const extensions = ['.json', '.js'];

  return extensions.some(ext => {
    const path = basePath + ext;

    return fs.existsSync(path);
  });
}
