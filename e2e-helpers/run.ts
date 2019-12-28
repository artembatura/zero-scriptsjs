import { spawn, ChildProcessWithoutNullStreams } from 'child_process';
import processExists from 'process-exists';

import { crossPlatformCommand } from './crossPlatformCommand';
import { waitForHttpStatus } from './waitForHttpStatus';

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

interface IOptions {
  timeout?: number;
  interval?: number;
  port?: number;
}

const defaultOptions = {
  timeout: 15000,
  interval: 150
};

export async function run(
  cwd: string,
  args: string[],
  options?: IOptions
): Promise<{
  errors: string[];
  messages: string[];
  process: ChildProcessWithoutNullStreams;
}> {
  const interval = options?.interval || defaultOptions.interval;
  const timeout = options?.timeout || defaultOptions.timeout;

  const spawnProc = spawn(crossPlatformCommand('yarn'), args, {
    cwd
  });

  const stdoutMessages: string[] = [];
  const stderrMessages: string[] = [];

  spawnProc.stdout &&
    spawnProc.stdout.on('data', data => {
      stdoutMessages.push(data.toString());
    });

  spawnProc.stderr &&
    spawnProc.stderr.on('data', data => {
      stderrMessages.push(data.toString());
    });

  spawnProc.on('uncaughtException', (err, origin) => {
    stderrMessages.push(
      `Caught exception: ${err}\n` + `Exception origin: ${origin}`
    );
  });

  if (options?.port) {
    await waitForHttpStatus({
      port: options.port,
      host: 'localhost',
      canContinue: () => stderrMessages.length === 0,
      timeout,
      interval
    });
  }

  for (
    let attemptsCount = 0;
    await processExists(spawnProc.pid);
    attemptsCount++
  ) {
    await wait(interval);

    if (attemptsCount * interval >= timeout) {
      throw new Error(
        'Timeout exception. Please, check that command is running correctly'
      );
    }
  }

  return {
    process: spawnProc,
    errors: stderrMessages,
    messages: stdoutMessages
  };
}
