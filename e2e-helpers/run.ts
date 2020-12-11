import { ChildProcessWithoutNullStreams, spawn } from 'child_process';

import { crossPlatformCommand } from './crossPlatformCommand';

export function run(
  cwd: string,
  args: string[]
): ChildProcessWithoutNullStreams {
  return spawn(crossPlatformCommand('yarn'), args, {
    cwd,
    env: {
      CI: 'true'
    }
  });
}
