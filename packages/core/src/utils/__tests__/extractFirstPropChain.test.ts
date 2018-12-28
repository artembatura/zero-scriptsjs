import { extractFirstPropChain } from '../extractFirstPropChain';

test('arrow function', () => {
  expect(extractFirstPropChain('a => a.b.c')).toBe('b.c');
});

test('function', () => {
  expect(extractFirstPropChain('function (a) { return a.b.c };')).toBe('b.c');
});
