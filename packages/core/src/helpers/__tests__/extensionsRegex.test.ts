import { extensionsRegex } from '../extensionsRegex';

describe('core/helpers/extensionsRegex', () => {
  it('single', () => {
    const result = extensionsRegex(['js']);
    const resultWithFileName = extensionsRegex(['js'], 'file');

    expect(result.toString()).toBe('/\\.(js)$/');
    expect(resultWithFileName.toString()).toBe('/file\\.(js)$/');
  });

  it('multiple', () => {
    const result = extensionsRegex(['js', 'mjs']);
    const resultWithFileName = extensionsRegex(['js', 'mjs'], 'file');

    expect(result.toString()).toBe('/\\.(js|mjs)$/');
    expect(resultWithFileName.toString()).toBe('/file\\.(js|mjs)$/');
  });

  it('exception for empty array', () => {
    const throwable = () => {
      extensionsRegex([]);
    };

    const throwableWithFileName = () => {
      extensionsRegex([], 'file');
    };

    expect(throwable).toThrow(Error);
    expect(throwableWithFileName).toThrow(Error);
  });
});
