import * as fs from 'fs';
import * as path from 'path';

export function eslintConfigExists(rootPath: string): boolean {
  const basePath = path.resolve(rootPath, '.eslintrc');

  const extensions = ['', '.json', '.js', '.yaml'];

  return extensions.some(ext => {
    const path = basePath + ext;

    return fs.existsSync(path);
  });
}
