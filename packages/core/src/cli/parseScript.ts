import { ScriptData } from '../types';

function isLongParam(arg: string) {
  return arg.indexOf('--') === 0;
}

function isShortParam(arg: string) {
  return arg.indexOf('-') === 0 && !isLongParam(arg);
}

function isParam(arg: string) {
  return isShortParam(arg) || isLongParam(arg);
}

function hasScript(arg: string, namesOfScripts: string[]) {
  return namesOfScripts.includes(arg);
}

export function parseScript(
  argv: string[],
  definedScripts: string[]
): ScriptData | undefined {
  let name: string | undefined,
    options: Record<string, string | boolean> = {},
    args: string[] = [],
    met: boolean = false,
    skipNextArg: boolean = false;

  const isScript = (arg: string) => hasScript(arg, definedScripts);

  for (const [i, arg] of argv.entries()) {
    if (skipNextArg) {
      skipNextArg = false;
      continue;
    }

    if (typeof arg === 'string' && isParam(arg)) {
      const paramKey = isShortParam(arg) ? arg.slice(1) : arg.slice(2);
      const nextArg = argv[i + 1];
      const nextArgIsParamVal =
        nextArg && !isScript(nextArg) && !isParam(nextArg);

      skipNextArg = Boolean(nextArgIsParamVal);
      options[paramKey] = nextArgIsParamVal ? nextArg : true;
    } else if (!met && isScript(arg)) {
      met = true;
      name = arg;
    } else {
      args.push(arg);
    }
  }

  if (!met || !name || name.trim() === '') {
    return undefined;
  }

  return { name, args, options };
}
