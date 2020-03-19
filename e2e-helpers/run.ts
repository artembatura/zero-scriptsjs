import { spawn } from 'child_process';

import { crossPlatformCommand } from './crossPlatformCommand';
import { waitForHttpStatus } from './waitForHttpStatus';

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

interface IOptions {
  timeout?: number;
  interval?: number;
  port?: number;
}

const defaultOptions = {
  timeout: 25000,
  interval: 150
};

export async function run(
  cwd: string,
  args: string[],
  options?: IOptions
): Promise<string> {
  const interval = options?.interval || defaultOptions.interval;
  const timeout = options?.timeout || defaultOptions.timeout;
  let processIsFinished: boolean = false;

  const spawnProc = spawn(crossPlatformCommand('yarn'), args, {
    cwd
  });

  const output: string[] = [];

  spawnProc.stdout &&
    spawnProc.stdout.on('data', data => {
      output.push(data.toString());
    });

  spawnProc.stderr &&
    spawnProc.stderr.on('data', data => {
      output.push(data.toString());
    });

  spawnProc.on('exit', code => {
    output.push(`Process finished with code ${code}`);

    processIsFinished = true;
  });

  spawnProc.on('error', error => {
    output.push(`Caught error: ${error}`);

    processIsFinished = true;
  });

  spawnProc.on('uncaughtException', (err, origin) => {
    output.push(`Caught exception: ${err}\n` + `Exception origin: ${origin}`);

    processIsFinished = true;
  });

  if (options?.port) {
    await waitForHttpStatus({
      port: options.port,
      host: 'localhost',
      canContinue: () => !processIsFinished,
      timeout,
      interval
    });
  } else {
    for (let attemptsCount = 0; !processIsFinished; attemptsCount++) {
      await wait(interval);

      if (attemptsCount * interval >= timeout) {
        throw new Error(
          `Timeout exception. Please, check that command "${args.join(
            ' '
          )}" is running correctly`
        );
      }
    }
  }

  return output.join('');
}
