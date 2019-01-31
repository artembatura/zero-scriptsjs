import { getValueByPath } from './getValueByPath';

export const createObjectFromFlatKey = (
  keys: string[],
  val: any,
  obj: any = isNaN(keys[0] as any) ? {} : []
) => {
  const firstElementIsNumber = !isNaN(keys[0] as any);

  let curr: any = firstElementIsNumber ? [] : {},
    tmpObj: any = firstElementIsNumber ? [] : {};

  keys.forEach((key, i) => {
    const orgVal = getValueByPath(keys.slice(undefined, i + 1), obj);
    curr[key] =
      i === keys.length - 1
        ? val
        : orgVal || (isNaN(keys[i + 1] as any) ? {} : []);
    curr = curr[key];
    if (i === 0) {
      tmpObj[key] = curr;
    }
  });

  return tmpObj;
};
