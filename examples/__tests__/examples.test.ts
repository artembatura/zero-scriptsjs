import getPort = require('get-port');
import * as fs from 'fs';
import * as path from 'path';
import puppeteer from 'puppeteer';

import { runStart, readProcessOutput, run } from '../../e2e-helpers';

const getDirectories = (path: string) =>
  fs
    .readdirSync(path, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

describe('examples should works', () => {
  let browser: puppeteer.Browser;

  beforeAll(async () => {
    jest.setTimeout(1000 * 120);

    browser = await puppeteer.launch();
  });

  afterAll(async () => {
    await browser.close();
  });

  const examples = getDirectories(path.join(__dirname, '..')).filter(
    str => !str.startsWith('__')
  );

  examples.forEach(appName => {
    const appPath = path.resolve(path.join(__dirname, '..'), appName);

    describe(`${appName}-example`, () => {
      it('dev server should works', async () => {
        const devServerPort = await getPort();

        await runStart(appPath, devServerPort, async (response, readOutput) => {
          expect(response.status).toBe(200);

          expect(await readOutput()).toContain(
            'Your application is available at http://localhost:' +
              devServerPort.toString()
          );
        });
      });

      it('app should looks right', async () => {
        const devServerPort = await getPort();

        await runStart(appPath, devServerPort, async () => {
          const page = await browser.newPage();
          await page.goto('http://localhost:' + devServerPort);
          const screenshot = await page.screenshot();
          await page.close();

          expect(screenshot).toMatchImageSnapshot();
        });
      });

      it('run build', async () => {
        const process = run(appPath, ['build']);

        const output = await readProcessOutput(process);

        expect(output).toContain(
          'Your application successfully built and available at build folder'
        );
      });

      it('run watch', async () => {
        const process = run(appPath, ['watch', '--smokeTest']);

        const output = await readProcessOutput(process);

        expect(output).toContain(
          'Your application successfully built and available at build folder'
        );
      });
    });
  });
});
