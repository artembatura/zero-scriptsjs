import type { TransformOptions } from '@babel/core';
import fs from 'fs';
import path from 'path';

const babelPackages: string[] = [
  '@babel/preset-typescript',
  '@babel/plugin-proposal-decorators',
  '@babel/plugin-transform-flow-strip-types',
  '@babel/preset-env',
  '@babel/plugin-transform-runtime',
  '@babel/plugin-syntax-dynamic-import',
  '@babel/plugin-proposal-class-properties'
];

export function loadBabelConfig(
  root: string,
  preprocessors: Array<(s: string) => string>
): TransformOptions {
  try {
    let jsonString = fs
      .readFileSync(path.resolve(root, 'babel.config.json'))
      .toString();

    babelPackages.forEach(pkgName => {
      if (jsonString.includes(pkgName)) {
        jsonString = jsonString.replace(new RegExp(pkgName, 'g'), () =>
          require.resolve(pkgName)
        );
      }
    });

    preprocessors.forEach(preprocess => {
      jsonString = preprocess(jsonString);
    });

    return JSON.parse(jsonString);
  } catch {
    return {};
  }
}
