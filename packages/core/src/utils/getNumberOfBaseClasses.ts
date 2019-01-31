import { Constructor } from '../types';

export const getNumberOfBaseClasses = (targetClass: Constructor): number => {
  let baseClass = targetClass;
  let size = 0;

  while (baseClass) {
    const newBaseClass = Object.getPrototypeOf(baseClass);

    if (newBaseClass && newBaseClass !== Object && newBaseClass.name) {
      baseClass = newBaseClass;
      size++;
    } else {
      break;
    }
  }

  return size;
};
