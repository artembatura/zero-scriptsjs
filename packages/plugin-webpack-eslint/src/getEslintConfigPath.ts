import * as fs from 'fs';
import * as path from 'path';

export function getEslintConfigPath(rootPath: string): string | null {
  const basePath = path.resolve(rootPath, '.eslintrc');

  const extensions = ['', '.json', '.js', '.yaml'];

  const existsExt = extensions.find(ext => {
    const path = basePath + ext;

    return fs.existsSync(path);
  });

  return existsExt ? basePath + existsExt : null;
}
