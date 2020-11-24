import fs from 'fs';
import path from 'path';

export function getEslintRcPath(rootPath: string): string | null {
  const basePath = path.resolve(rootPath, '.eslintrc');

  const extensions = ['', '.json', '.js', '.yaml'];

  const existsExt = extensions.find(ext => {
    const path = basePath + ext;

    return fs.existsSync(path);
  });

  return existsExt ? basePath + existsExt : null;
}
