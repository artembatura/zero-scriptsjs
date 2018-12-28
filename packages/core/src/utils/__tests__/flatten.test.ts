import { flatten } from '../flatten';

test('flatten', () => {
  const source = {
    foo: {
      bar: {
        foobar: 'foo.bar.foobar',
        a: 'foo.bar.a'
      },
      b: 'foo.b'
    },
    c: 'c'
  };

  const equal: Map<string, string> = new Map([
    ['foo.bar.foobar', 'foo.bar.foobar'],
    ['foo.bar.a', 'foo.bar.a'],
    ['foo.b', 'foo.b'],
    ['c', 'c']
  ]);

  expect(flatten(source)).toEqual(equal);
});
