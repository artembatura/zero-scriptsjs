export type ArrayOption<T, TOptions> = (T | ((options: TOptions) => T))[];
