import type { TransformOptions } from '@babel/core';

export function getBabelConfigFileContents(
  config: TransformOptions,
  handlerPaths: string[]
): string {
  return `
const __handlers = [${handlerPaths
    .map(str => `"${str}"`)
    .join(', ')}].map(pkg => require(pkg).default);

function __handle(config) {
  return JSON.parse(__handlers.reduce((acc, handler) => handler(acc), JSON.stringify(config)).replace(/\\\\/g, '\\\\\\\\'));
}

module.exports = __handle(${JSON.stringify(config, null, 2)});
`.trimStart();
}
