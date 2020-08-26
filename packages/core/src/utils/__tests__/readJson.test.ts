import { readJson } from '../readJson';

type PackageJson = {
  name: string;
  version: string;
  dependencies: Record<string, string>;
};

describe('core/utils/readJson', () => {
  const packageJsonPath = `${__dirname}/package.json`;

  it('basic', () => {
    const json = readJson(packageJsonPath);

    expect(json).toEqual({
      name: 'test-package-name',
      version: '1.0.0',
      dependencies: {},
      'zero-scripts': {
        someExtension: {
          param1: true
        }
      }
    });
  });

  it('with selector', () => {
    const packageJsonName = readJson(
      packageJsonPath,
      ({ name }: PackageJson) => name
    );

    expect(packageJsonName).toBe('test-package-name');
  });

  it('check caching', () => {
    const json1 = readJson(packageJsonPath);
    const json2 = readJson(packageJsonPath);

    expect(json1).toBe(json2);
  });
});
