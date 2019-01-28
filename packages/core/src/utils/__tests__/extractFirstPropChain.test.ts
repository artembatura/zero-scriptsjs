import { extractFirstPropChain } from '../extractFirstPropChain';

describe('extractFirstPropChain', () => {
  it('function', () => {
    expect(
      extractFirstPropChain('function (a) { return a.b.c[0][1].f };')
    ).toBe('b.c.0.1.f');
  });

  it('arrow function', () => {
    expect(extractFirstPropChain('a => a.b.c[0][1].f')).toBe('b.c.0.1.f');
  });
});
