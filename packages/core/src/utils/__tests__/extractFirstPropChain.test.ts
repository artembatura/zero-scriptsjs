import { extractFirstPropChain } from '../extractFirstPropChain';

describe('utils/extractFirstPropChain', () => {
  it('function', () => {
    const result = extractFirstPropChain('function (a) { return a.b.c.f };');

    expect(result).toBe('b.c.f');
  });

  it('arrow function', () => {
    const result = extractFirstPropChain('a => a.b.c.f');

    expect(result).toBe('b.c.f');
  });
});
