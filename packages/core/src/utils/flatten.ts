export const flatten = (
  object: any,
  map: Map<string, any> = new Map<string, any>(),
  splitter: string = '.',
  prevFlatKey?: string
): Map<string, any> => {
  // todo tests and refactor
  for (const [key, val] of Object.entries(object)) {
    const realKey: string = prevFlatKey ? prevFlatKey + splitter + key : key;
    if (val && typeof val === 'object' && !Array.isArray(val)) {
      flatten(val, map, splitter, realKey);
    } else {
      map.set(realKey, val);
    }
  }

  return map;
};
