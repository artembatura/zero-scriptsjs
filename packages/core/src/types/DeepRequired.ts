import { NonUndefined } from 'utility-types';

export type DeepRequired<T> = T extends (...args: any[]) => any
  ? T
  : T extends any[]
  ? T
  : T extends object
  ? _DeepRequiredObject<T>
  : T;

export type _DeepRequiredObject<T> = {
  [P in keyof T]-?: DeepRequired<NonUndefined<T[P]>>
};
