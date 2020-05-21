import getPort = require('get-port');
import * as path from 'path';

import { run } from '../../e2e-helpers/run';

const workPath = path.resolve(path.join(__dirname, '..'), 'react');

describe('example:react', () => {
  beforeAll(() => jest.setTimeout(1000 * 60));

  it('start', async () => {
    const port = await getPort();

    const output = await run(
      workPath,
      ['start', '--smokeTest', '--port', port.toString()],
      {
        port
      }
    );

    expect(output).toContain('Your application is available at');
  });

  it('build', async () => {
    const output = await run(workPath, ['build']);

    expect(output).toContain(
      'Your application successfully built and available at'
    );
  });
});
