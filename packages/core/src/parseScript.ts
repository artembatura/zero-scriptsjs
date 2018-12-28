import { ScriptData } from './ScriptData';

const isLongParam = (arg: string) => arg.indexOf('--') === 0;

const isShortParam = (arg: string) =>
  arg.indexOf('-') === 0 && !isLongParam(arg);

const isParam = (arg: string) => isShortParam(arg) || isLongParam(arg);

const hasScript = (arg: string, namesOfScripts: string[]) =>
  namesOfScripts.includes(arg);

export function parseScript(
  argv: string[],
  definedScripts: string[]
): ScriptData | undefined {
  let name: string | undefined;

  let options: Record<string, string | boolean> = {};

  let args: string[] = [];

  let met: boolean = false;

  let skipNextArg: boolean = false;

  const isScript = (arg: string) => hasScript(arg, definedScripts);

  for (const [i, arg] of argv.entries()) {
    if (skipNextArg) {
      skipNextArg = false;
      continue;
    }

    if (isParam(arg)) {
      const paramKey = isShortParam(arg) ? arg.slice(1) : arg.slice(2);
      const nextArg = argv[i + 1];
      const nextArgIsParamVal = !isScript(nextArg) && !isParam(nextArg);

      skipNextArg = nextArgIsParamVal;
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
