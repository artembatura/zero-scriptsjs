import { createObjectFromFlatKey } from './createObjectFromFlatKey';

export const unflatten = (map: Map<string, any>, delimiter: string = '.') => {
  const result = Array.from(map.entries()).reduce(
    (obj, [key, val]) => ({
      ...obj,
      ...createObjectFromFlatKey(key.split(delimiter), val, obj)
    }),
    {}
  );

  return Object.keys(result).some(key => isNaN(key as any))
    ? result
    : Object.values(result);
};
