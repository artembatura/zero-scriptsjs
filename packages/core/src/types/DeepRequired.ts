import { NonUndefined } from 'utility-types';

type _DeepRequiredObject<T> = {
  [P in keyof T]-?: DeepRequired<NonUndefined<T[P]>>
};

export type DeepRequired<T> = T extends (...args: any[]) => any
  ? T
  : T extends any[]
  ? T
  : T extends object
  ? _DeepRequiredObject<T>
  : T;
