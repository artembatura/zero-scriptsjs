const getValueByPath = (keys: string[], obj: any) => {
  let currentValue: any;
  let completed: boolean = true;

  for (const key of keys) {
    if (currentValue && currentValue.hasOwnProperty(key)) {
      currentValue = currentValue[key];
    } else if (!currentValue && obj.hasOwnProperty(key)) {
      currentValue = obj[key];
    } else {
      completed = false;
      break;
    }
  }

  return completed ? currentValue : undefined;
};

const createObjectFromFlatKey = (
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
