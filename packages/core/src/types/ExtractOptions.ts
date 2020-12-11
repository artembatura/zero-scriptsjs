import { AbstractOptionsContainer } from '../AbstractOptionsContainer';

// OmitByValue<T, Record<string, SyncHook<any>> | ((...args: any[]) => any)>

export type ExtractOptions<T extends AbstractOptionsContainer> = Pick<
  T,
  Exclude<keyof T, keyof AbstractOptionsContainer>
>;
