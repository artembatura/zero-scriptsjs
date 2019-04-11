import { readJson } from '../readJson';

type PackageJson = {
  name: string;
  version: string;
  dependencies: object;
};

describe('utils:readJson', () => {
  const packageJsonPath = `${__dirname}/package.json`;

  it('default', () => {
    const json = readJson(packageJsonPath);

    expect(json).toEqual({
      name: 'testPackageName',
      version: '1.0.0',
      dependencies: {}
    });
  });

  it('selector', () => {
    const packageJsonName = readJson(
      packageJsonPath,
      ({ name }: PackageJson) => name
    );

    expect(packageJsonName).toBe('testPackageName');
  });

  it('caching', () => {
    const json1 = readJson(packageJsonPath);
    const json2 = readJson(packageJsonPath);

    expect(json1).toBe(json2);
  });
});
