import { Constructor } from '../types';
import { getNumberOfBaseClasses } from './getNumberOfBaseClasses';

export const getBaseClass = (
  targetClass: Constructor,
  position: number = 0,
  includeTargetClass: boolean = true
) => {
  let baseClass = targetClass;
  let currentPosition: number = includeTargetClass
    ? getNumberOfBaseClasses(targetClass) + 1
    : getNumberOfBaseClasses(targetClass);

  while (baseClass) {
    const newBaseClass = includeTargetClass
      ? baseClass
      : Object.getPrototypeOf(baseClass);

    if (includeTargetClass) {
      includeTargetClass = false;
    }

    if (newBaseClass && newBaseClass !== Object && newBaseClass.name) {
      baseClass = newBaseClass;
      currentPosition--;

      if (currentPosition === position) {
        return baseClass;
      }
    } else {
      break;
    }
  }

  return undefined;
};
