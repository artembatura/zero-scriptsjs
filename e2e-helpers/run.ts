import { spawn } from 'child_process';
import MultiStream = require('@nearform/multistream');

import { crossPlatformCommand } from './crossPlatformCommand';

export function run(cwd: string, args: string[]) {
  const spawnedProc = spawn(crossPlatformCommand('yarn'), args, {
    cwd
  });

  return {
    outputStream: new MultiStream([spawnedProc.stdout, spawnedProc.stderr]),
    process: spawnedProc
  };
}
