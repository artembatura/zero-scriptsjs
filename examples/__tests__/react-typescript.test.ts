import getPort = require('get-port');
import { run } from '../../e2e-helpers/run';
import * as path from 'path';

const workPath = path.resolve(path.join(__dirname, '..'), 'react-typescript');

const COMPLETE_START_MESSAGE = /.*Your application is available at .*/;
const COMPLETE_BUILD_MESSAGE = /.*Your application successfully built and available at .*/;

describe('example:react-typescript', () => {
  beforeAll(() => jest.setTimeout(1000 * 60));

  it('start', async () => {
    const port = await getPort();

    const {
      messages
    } = await run(workPath, ['start', '--smokeTest', `--port`, port.toString()], {
      port
    });

    const isContainCompleteMsg = messages.some(msg => COMPLETE_START_MESSAGE.test(msg));

    try {
      expect(isContainCompleteMsg).toBe(true);
    } catch (e) {
      throw new Error("Result of stdout: \n" + messages.join("") + "\n doesn't include complete message " + COMPLETE_START_MESSAGE);
    }
  });

  it('build', async () => {
    const {
      messages
    } = await run(workPath, ['build']);

    const isContainCompleteMsg = messages.some(msg => COMPLETE_BUILD_MESSAGE.test(msg));

    try {
      expect(isContainCompleteMsg).toBe(true);
    } catch (e) {
      throw new Error("Result of stdout: \n" + messages.join("") + "\n doesn't include complete message " + COMPLETE_BUILD_MESSAGE);
    }
  });
});
