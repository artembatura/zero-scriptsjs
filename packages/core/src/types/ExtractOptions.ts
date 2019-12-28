import { SyncHook } from 'tapable';

import { AbstractOptionsContainer } from '../AbstractOptionsContainer';

export type ExtractOptions<T extends AbstractOptionsContainer<any>> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any
    ? never
    : T[K] extends Record<string, SyncHook>
    ? never
    : T[K];
};
