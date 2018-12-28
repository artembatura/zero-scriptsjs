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

const createObjectFromFlatKey = (keys: string[], val: any, obj: any = {}) => {
  let curr: any = {};

  let tmpObj: any = {};

  keys.forEach((key, i) => {
    const orgVal = getValueByPath(keys.slice(undefined, i + 1), obj);
    curr[key] = i === keys.length - 1 ? val : orgVal || {};
    curr = curr[key];
    if (i === 0) {
      tmpObj[key] = curr;
    }
  });

  return tmpObj;
};

export const unflatten = <T = any>(
  map: Map<string, any>,
  splitter: string = '.'
): T =>
  Array.from(map.entries()).reduce(
    (obj, [key, val]) => ({
      ...obj,
      ...createObjectFromFlatKey(key.split(splitter), val, obj)
    }),
    {} as T
  );
