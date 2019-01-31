export const flatten = (
  object: any,
  map: Map<string, any> = new Map<string, any>(),
  delimiter: string = '.',
  prevFlatKey?: string
): Map<string, any> => {
  for (const [key, val] of Object.entries(object)) {
    const realKey: string = prevFlatKey ? prevFlatKey + delimiter + key : key;

    if (
      val &&
      typeof val === 'object' &&
      (val.constructor.name === 'Object' || val.constructor.name === 'Array')
    ) {
      flatten(val, map, delimiter, realKey);
    } else {
      map.set(realKey, val);
    }
  }

  return map;
};
