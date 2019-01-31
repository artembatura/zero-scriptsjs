import { flatten } from '../flatten';

describe('flatten', () => {
  it('object', () => {
    const source: Record<string, any> = {
      foo: {
        bar: {
          foobar: 'foo.bar.foobar',
          a: 'foo.bar.a'
        },
        b: 'foo.b'
      },
      c: 'c'
    };

    const mustEqual: Map<string, string> = new Map([
      ['foo.bar.foobar', 'foo.bar.foobar'],
      ['foo.bar.a', 'foo.bar.a'],
      ['foo.b', 'foo.b'],
      ['c', 'c']
    ]);

    expect(flatten(source)).toEqual(mustEqual);
  });

  it('object&array', () => {
    const source: Record<string, any> = [
      '0',
      ['1.0', '1.1', { foo: '1.2.foo', bar: ['1.2.bar.0'] }],
      ['2.0']
    ];

    const mustEqual: Map<string, string> = new Map([
      ['0', '0'],
      ['1.0', '1.0'],
      ['1.1', '1.1'],
      ['1.2.foo', '1.2.foo'],
      ['1.2.bar.0', '1.2.bar.0'],
      ['2.0', '2.0']
    ]);

    expect(flatten(source)).toEqual(mustEqual);
  });
});
