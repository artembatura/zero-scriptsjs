import * as path from "path";
import { spawn } from 'child_process';
import { request } from 'http';
import getPort from 'get-port';

const packageJson = require('../package.json');

const getCommand = (cmd: string) => process.platform === 'win32' ? cmd + '.cmd' : cmd;

const waitForHttpStatus = ({
  host,
  port,
  timeout = 150,
  ejectTimeout = 8000,
  method = 'GET',
  expectedStatusCode = 200,
  canContinue = () => true
}: {
  host: string;
  port: number;
  timeout?: number;
  ejectTimeout?: number;
  method?: string;
  expectedStatusCode?: number;
  canContinue?: () => boolean;
}) =>
  new Promise((resolve, reject) => {
    const retry = () => setTimeout(main, timeout);

    let totalTimeout = 0;
    const main = () => {
      const req = request({ method, port, host }, response => {
        if (response.statusCode === expectedStatusCode) {
          return resolve();
        }

        if (!canContinue() || totalTimeout > ejectTimeout) {
          return reject();
        }

        totalTimeout += timeout;

        retry();
      });

      req.on('error', retry);
      req.end();
    };

    main();
  });

describe(packageJson.name, () => {
  beforeEach(() => jest.setTimeout(1000 * 60));

  it('start', async () => {
    const port = await getPort();

    const proc = spawn(getCommand('yarn'), ['start', '--smokeTest', `--port`, port.toString()], {
      cwd: path.join(require.resolve('../package.json'), '..')
    });

    const errors = [];

    if (proc.stdout) {
      proc.stdout.on('data', data => {
        if (data.toString().toLowerCase().indexOf('error') !== -1) {
          errors.push(data.toString());
        }
      });
    }

    if (proc.stderr) {
      proc.stderr.on('data', data => {
        errors.push(data.toString());
      });
    }

    await waitForHttpStatus({
      port,
      host: 'localhost',
      canContinue: () => errors.length === 0
    });

    expect(errors.length).toBe(0);
  });

  it('build', async () => {
    const proc = spawn(getCommand('yarn'), ['build'], {
      cwd: path.join(require.resolve('../package.json'), '..')
    });

    const errors = [];

    if (proc.stdout) {
      proc.stdout.on('data', data => {
        console.log(data.toString());
        if (data.toString().toLowerCase().indexOf('error') !== -1) {
          errors.push(data.toString());
        }
      });
    }

    if (proc.stderr) {
      proc.stderr.on('data', data => {
        console.log(data.toString());
        errors.push(data.toString());
      });
    }

    proc.on('exit', () => {
      expect(errors.length).toBe(0);
    });
  });
});
