import { Constructor } from '../types';

export const getBaseClass = (
  targetClass: Constructor,
  position: number = 0
) => {
  const baseClasses: any[] = [targetClass];

  for (
    let baseClass = targetClass;
    (baseClass = Object.getPrototypeOf(baseClass)) && baseClass.name;

  ) {
    baseClasses.push(baseClass);
  }

  return position >= baseClasses.length
    ? undefined
    : baseClasses.reverse()[position];
};
