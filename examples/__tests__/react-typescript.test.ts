import getPort = require('get-port');
import * as path from 'path';

import { readProcessOutput } from '../../e2e-helpers/readProcessOutput';
import { retryRequestWhile } from '../../e2e-helpers/retryRequestWhile';
import { run } from '../../e2e-helpers/run';
import { terminateDevServer } from '../../e2e-helpers/terminateDevServer';

const workPath = path.resolve(path.join(__dirname, '..'), 'react-typescript');

describe('example:react-typescript', () => {
  beforeAll(() => jest.setTimeout(1000 * 120));

  it('run start', async () => {
    const devServerPort = await getPort();

    const process = run(workPath, [
      'start',
      '--',
      '--port',
      devServerPort.toString(),
      '--smokeTest'
    ]);

    let outputStreamIsFinished = false;

    const [output, httpRes] = await Promise.all([
      readProcessOutput(process).finally(() => {
        outputStreamIsFinished = true;
      }),
      retryRequestWhile('localhost', {
        port: devServerPort,
        doWhile: res => res.statusCode !== 200,
        forceResolveIf: () => outputStreamIsFinished
      }).then(r => {
        terminateDevServer(devServerPort);
        return r;
      })
    ]);

    expect(output).toContain('Your application is available at');
    expect(httpRes.status).toBe(200);
  });

  it('run build', async () => {
    const process = run(workPath, ['build']);

    const output = await readProcessOutput(process);

    expect(output).toContain(
      'Your application successfully built and available at'
    );
  });
});
