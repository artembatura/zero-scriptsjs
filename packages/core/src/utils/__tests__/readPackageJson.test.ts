import { readPackageJson } from '../readPackageJson';

describe('core/utils/readPackageJson', () => {
  it('read package.json', () => {
    const testPJson = readPackageJson(undefined, {
      path: __dirname
    });

    expect(testPJson).toEqual({
      _id: 'testPackageName@1.0.0',
      name: 'testPackageName',
      version: '1.0.0',
      readme: 'ERROR: No README data found!',
      dependencies: {},
      'zero-scripts': {
        someExtension: {
          param1: true
        }
      }
    });

    const monoreportPJson = readPackageJson();

    expect(monoreportPJson).toMatchObject({
      private: true,
      name: 'root'
    });
  });

  it('read package.json with selector', () => {
    const zeroScriptsOptions = readPackageJson(
      packageJson => {
        return packageJson['zero-scripts'];
      },
      {
        path: __dirname
      }
    );

    expect(zeroScriptsOptions).toEqual({
      someExtension: {
        param1: true
      }
    });

    const extensionOptions = readPackageJson(
      packageJson => {
        return packageJson['zero-scripts'].someExtension;
      },
      {
        path: __dirname
      }
    );

    expect(extensionOptions).toEqual({
      param1: true
    });
  });
});
