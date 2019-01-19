export type ArrayOption<T, TOptions> = (
  | T
  | ((options: TOptions) => T | false | undefined)
  | false
  | undefined)[];
