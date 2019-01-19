export type Option<T, TOptions> = T | ((options: TOptions) => T);
