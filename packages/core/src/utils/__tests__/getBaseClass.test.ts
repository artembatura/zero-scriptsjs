import { getBaseClass } from '../getBaseClass';

describe(getBaseClass.name, () => {
  it('basic', () => {
    class Parent {}
    class Child extends Parent {}

    expect(getBaseClass(Child)).toBe(Parent);
  });

  it('positions', () => {
    class Parent {}
    class Child0 extends Parent {}
    class Child1 extends Child0 {}
    class Child2 extends Child1 {}

    expect(getBaseClass(Child1, 1)).toBe(Child0);
    expect(getBaseClass(Child2, 1)).toBe(Child0);
    expect(getBaseClass(Child2, 2)).toBe(Child1);
  });
});
