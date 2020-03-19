import { SyncHook } from 'tapable';

import { AbstractOptionsContainer } from '../AbstractOptionsContainer';

export type ExtractOptions<T extends AbstractOptionsContainer> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any
    ? never
    : T[K] extends Record<string, SyncHook<any>>
    ? never
    : T[K];
};
