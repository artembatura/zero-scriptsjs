import { ChildProcessWithoutNullStreams, spawn } from 'child_process';

import { crossPlatformCommand } from './crossPlatformCommand';

export function run(
  cwd: string,
  args: string[]
): ChildProcessWithoutNullStreams {
  return spawn(crossPlatformCommand('pnpm'), args, {
    cwd
  });
}
