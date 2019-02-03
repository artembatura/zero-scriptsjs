import { extractFirstPropChain } from '../extractFirstPropChain';

describe('extractFirstPropChain', () => {
  it('function', () => {
    expect(extractFirstPropChain('function (a) { return a.b.c.f };')).toBe(
      'b.c.f'
    );
  });

  it('arrow function', () => {
    expect(extractFirstPropChain('a => a.b.c.f')).toBe('b.c.f');
  });
});
