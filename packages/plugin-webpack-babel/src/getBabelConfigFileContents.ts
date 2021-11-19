import type { TransformOptions } from '@babel/core';

export function getBabelConfigFileContents(
  config: TransformOptions,
  resolverPaths: string[]
): string {
  return `
module.exports = ${JSON.stringify(config, null, 2)};

module.exports = require("@zero-scripts/core").resolveConfigPaths(module.exports);
`.trimStart(); // TODO: replace with `module.exports = require('@zero-scripts/core').resolveConfigPaths(module.exports);`
}
