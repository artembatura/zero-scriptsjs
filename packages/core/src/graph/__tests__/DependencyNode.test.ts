import { DependencyNode } from '../DependencyNode';

describe('graph/DependencyNode', () => {
  it('default', () => {
    const root = new DependencyNode('root');
    const parent0 = root.addOrGetEdge('parent-0');
    const parent1 = root.addOrGetEdge('parent-1');

    parent0.addOrGetEdge('child-01');
    parent0.addOrGetEdge('child-02');

    parent1.addOrGetEdge('child-11');
    parent1.addOrGetEdge('child-12');

    const result = root.resolve().map(v => v.toString());

    expect(result).toEqual([
      'child-01',
      'child-02',
      'parent-0',
      'child-11',
      'child-12',
      'parent-1',
      'root'
    ]);
  });

  it('circular reference', () => {
    const a = new DependencyNode('a');
    const b = a.addOrGetEdge('b');
    const c = b.addOrGetEdge('c');
    c.addOrGetEdge('a');

    const throwable = () => {
      a.resolve();
    };

    expect(throwable).toThrow(Error);
  });
});
