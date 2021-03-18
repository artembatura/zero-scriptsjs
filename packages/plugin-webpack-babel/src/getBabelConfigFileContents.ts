import type { TransformOptions } from '@babel/core';

export function getBabelConfigFileContents(config: TransformOptions): string {
  return `
module.exports = ${JSON.stringify(config, null, 2)};

module.exports = require("@zero-scripts/core/build/utils/resolveReplace").resolveReplace(module.exports, require("@zero-scripts/plugin-webpack-babel/build/resolveMap").resolveMap);
`.trimStart(); // TODO: replace with `module.exports = require('@zero-scripts/plugin-webpack-babel').extendConfig(module.exports);`
}
