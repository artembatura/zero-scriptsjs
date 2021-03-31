import type { TransformOptions } from '@babel/core';

export function getBabelConfigFileContents(
  config: TransformOptions,
  resolverPaths: string[]
): string {
  return `
module.exports = ${JSON.stringify(config, null, 2)};

var resolveMap = [${resolverPaths
    .map(p => `"${p}"`)
    .join(
      ', '
    )}].reduce((acc, pkgPath) => ({ ...acc, ...require(pkgPath) }), {});

module.exports = require("@zero-scripts/core/build/utils/resolveReplace").resolveReplace(module.exports, resolveMap);
`.trimStart(); // TODO: replace with `module.exports = require('@zero-scripts/plugin-webpack-babel').extendConfig(module.exports);`
}
