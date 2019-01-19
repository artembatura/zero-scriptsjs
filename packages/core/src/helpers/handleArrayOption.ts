import { ArrayOption } from './ArrayOption';

type ExcludeFalse = <T>(x: T | undefined | false) => x is T;

export const handleArrayOption = <T, TConfigOptions>(
  option: ArrayOption<T | false | undefined, TConfigOptions> | undefined,
  options: TConfigOptions
): T[] =>
  option
    ? option
        .map(funcOrValue =>
          typeof funcOrValue === 'function'
            ? (funcOrValue as (o: TConfigOptions) => T)(options)
            : funcOrValue
        )
        .filter((Boolean as any) as ExcludeFalse)
    : [];
