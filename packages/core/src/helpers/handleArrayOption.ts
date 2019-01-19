import { ArrayOption } from './ArrayOption';

export const handleArrayOption = <T, TConfigOptions>(
  option: ArrayOption<T, TConfigOptions> | undefined,
  options: TConfigOptions
): T[] =>
  option
    ? option.map(funcOrValue =>
        typeof funcOrValue === 'function'
          ? (funcOrValue as (o: TConfigOptions) => T)(options)
          : funcOrValue
      )
    : [];
