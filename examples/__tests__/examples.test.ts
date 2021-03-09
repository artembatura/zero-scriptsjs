import getPort = require('get-port');
import * as fs from 'fs';
import * as path from 'path';
import puppeteer from 'puppeteer';

import { runStart, readProcessOutput, run } from '../../e2e-helpers';

function testExample(appName: string, getBrowser: () => puppeteer.Browser) {
  const appPath = path.resolve(path.join(__dirname, '..'), appName);

  if (!fs.existsSync(appPath)) {
    throw new Error(`Path ${appPath} doesn't exists`);
  }

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
    const browser = getBrowser();

    await runStart(appPath, devServerPort, async () => {
      const page = await browser.newPage();
      await page.goto('http://localhost:' + devServerPort);
      const screenshot = await page.screenshot();
      await page.close();

      expect(screenshot).toMatchImageSnapshot({
        failureThreshold: 0.05,
        failureThresholdType: 'percent'
      });
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
}

describe('examples should works', () => {
  let browser: puppeteer.Browser;
  const getBrowser = () => browser;

  beforeAll(async () => {
    jest.setTimeout(1000 * 120);

    browser = await puppeteer.launch();
  });

  afterAll(async () => {
    await browser.close();
  });

  describe('react', () => {
    testExample('react', getBrowser);
  });

  describe('react-16', () => {
    testExample('react-16', getBrowser);
  });

  describe('react-astroturf', () => {
    testExample('react-astroturf', getBrowser);
  });

  describe('react-eslint', () => {
    testExample('react-eslint', getBrowser);
  });

  describe('react-fast-refresh', () => {
    testExample('react-fast-refresh', getBrowser);
  });

  describe('react-less', () => {
    testExample('react-less', getBrowser);
  });

  describe('react-sass', () => {
    testExample('react-sass', getBrowser);
  });

  describe('react-svg-component', () => {
    testExample('react-svg-component', getBrowser);
  });

  describe('react-typescript', () => {
    testExample('react-typescript', getBrowser);
  });

  describe('spa-import-json', () => {
    testExample('spa-import-json', getBrowser);
  });
});
