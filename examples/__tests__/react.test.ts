import getPort = require('get-port');
import * as path from 'path';

import { readStream } from '../../e2e-helpers/readStream';
import { retryRequestWhile } from '../../e2e-helpers/retryRequestWhile';
import { run } from '../../e2e-helpers/run';
import { terminateDevServer } from '../../e2e-helpers/terminateDevServer';

const workPath = path.resolve(path.join(__dirname, '..'), 'react');

describe('example:react', () => {
  beforeAll(() => jest.setTimeout(1000 * 45));

  it('start', async () => {
    const devServerPort = await getPort();

    const process = run(workPath, [
      'start',
      '--port',
      devServerPort.toString(),
      '--smokeTest'
    ]);

    // process.once('uncaughtException', () => {
    //
    // });

    const [output, httpRes] = await Promise.all([
      readStream(process.stdout),
      retryRequestWhile('localhost', {
        port: devServerPort,
        doWhile: res => res.statusCode !== 200
      }).then(r => {
        terminateDevServer(devServerPort);
        return r;
      })
    ]);

    expect(output).toContain('Your application is available at');
    expect(httpRes.status).toBe(200);
  });

  it('build', async () => {
    const process = run(workPath, ['build']);

    const output = await readStream(process.stdout);

    expect(output).toContain(
      'Your application successfully built and available at'
    );
  });
});
