import getPort = require('get-port');
import { run } from '../../e2e-helpers/run';
import * as path from "path";

const workPath = path.join(require.resolve('../react-typescript/package.json'), '..');

describe('example:react-typescript', () => {
  beforeAll(() => jest.setTimeout(1000 * 60));

  it('start', async () => {
    const port = await getPort();

    const {
      errors,
      messages
    } = await run(workPath, ['start', '--smokeTest', `--port`, port.toString()], port);

    expect(errors.length).toBe(0);
  });

  it('build', async () => {
    const {
      process,
      errors,
      messages
    } = await run(workPath, ['build']);

    process.on('exit', () => {
      expect(errors.length).toBe(0);
    });
  });
});
