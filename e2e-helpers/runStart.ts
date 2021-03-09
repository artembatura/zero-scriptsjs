import { readProcessOutput } from './readProcessOutput';
import { retryRequestWhile } from './retryRequestWhile';
import { run } from './run';
import { terminateDevServer } from './terminateDevServer';

export async function runStart(
  path: string,
  port: number,
  afterBootstrapCallback?: (
    httpResponse: {
      status?: number | undefined;
    },
    readOutput: () => Promise<string>
  ) => void | Promise<void>
): Promise<string> {
  const process = run(path, [
    'start',
    '--port',
    port.toString(),
    '--smokeTest'
  ]);

  let outputStreamIsFinished = false;

  const outputPromise = readProcessOutput(process).finally(() => {
    outputStreamIsFinished = true;
  });

  const httpResponse = await retryRequestWhile('localhost', {
    port,
    doWhile: res => res.statusCode !== 200,
    forceResolveIf: () => outputStreamIsFinished
  }).catch(err => {
    terminateDevServer(port);
    throw err;
  });

  function readOutput() {
    if (!outputStreamIsFinished) {
      terminateDevServer(port);
    }

    return outputPromise;
  }

  if (afterBootstrapCallback) {
    await Promise.resolve(
      afterBootstrapCallback(httpResponse, readOutput)
    ).catch(err => {
      terminateDevServer(port);
      throw err;
    });
  }

  return await readOutput();
}
