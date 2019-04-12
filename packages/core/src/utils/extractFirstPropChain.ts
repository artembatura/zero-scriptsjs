export function extractFirstPropChain(str: string): string {
  const result = str.match(/[a-zA-Z](\[([0-9]|[a-zA-Z])+\]|\.[a-zA-Z]+)+/gm);

  if (result && result.length > 0) {
    return result[0]
      .replace(/\[/g, '.')
      .replace(/\]/g, '')
      .split('.')
      .filter((_, i) => i !== 0)
      .join('.');
  }

  throw new Error(`Can't parse property chain from string: "${str}"`);
}
