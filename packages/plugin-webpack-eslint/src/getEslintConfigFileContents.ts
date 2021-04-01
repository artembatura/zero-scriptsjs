import { Linter } from 'eslint';

export function getEslintConfigFileContents(
  config: Linter.Config,
  resolverPaths: string[]
): string {
  return `
module.exports = ${JSON.stringify(config, null, 2)};

require("@zero-scripts/plugin-webpack-eslint/build/eslint-patch.js");

var resolveMap = [${resolverPaths
    .map(p => `"${p}"`)
    .join(
      ', '
    )}].reduce((acc, pkgPath) => ({ ...acc, ...require(pkgPath) }), {});

module.exports = require("@zero-scripts/core/build/utils/resolveReplace").resolveReplace(module.exports, resolveMap);
`.trimStart();
}
