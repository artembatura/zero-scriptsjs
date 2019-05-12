import { cloneInstance } from '../cloneInstance';

describe('utils/cloneInstance', () => {
  it('default', () => {
    class Clazz {
      prop = false;
    }

    const instance = new Clazz();
    const result = cloneInstance(instance);

    expect(result).toEqual(instance);
    expect(instance === result).toBe(false);
  });
});
