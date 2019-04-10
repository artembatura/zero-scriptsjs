import { spawn, ChildProcessWithoutNullStreams } from 'child_process';
import * as path from 'path';
import { crossPlatformCommand } from './crossPlatformCommand';
import { waitForHttpStatus } from './waitForHttpStatus';

export async function run(
  cwd: string,
  args: string[],
  port?: number
): Promise<{
  errors: string[];
  messages: string[];
  process: ChildProcessWithoutNullStreams;
}> {
  const process = spawn(crossPlatformCommand('yarn'), args, {
    cwd
  });

  const stdoutMessages: string[] = [];
  const stderrMessages: string[] = [];

  process.stdout &&
    process.stdout.on('data', data => {
      stdoutMessages.push(data.toString());
    });

  process.stderr &&
    process.stderr.on('data', data => {
      stderrMessages.push(data.toString());
    });

  if (port) {
    await waitForHttpStatus({
      port,
      host: 'localhost',
      canContinue: () => stderrMessages.length === 0
    });
  }

  return {
    process,
    errors: stderrMessages,
    messages: stdoutMessages
  };
}
