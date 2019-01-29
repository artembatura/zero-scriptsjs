export const getValueByPath = (keys: string[], obj: any) => {
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
