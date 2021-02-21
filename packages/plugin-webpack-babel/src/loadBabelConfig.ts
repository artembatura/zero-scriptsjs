import fs from 'fs';
import path from 'path';

export function loadBabelConfig(root: string): string {
  try {
    return fs.readFileSync(path.resolve(root, 'babel.config.json')).toString();
  } catch {
    return '{}';
  }
}
