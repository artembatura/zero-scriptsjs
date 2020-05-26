import { readPackageJson } from '../readPackageJson';

describe('core/utils/readPackageJson', () => {
  it('relative', () => {
    const json = readPackageJson(undefined, {
      path: __dirname
    });

    expect(json).toEqual({
      _id: 'testPackageName@1.0.0',
      name: 'testPackageName',
      version: '1.0.0',
      readme: 'ERROR: No README data found!',
      dependencies: {}
    });
  });

  it('application', () => {
    const json = readPackageJson();

    expect(json).toMatchObject({
      private: true,
      name: '@zero-scriptsjs/monorepo'
    });
  });
});
