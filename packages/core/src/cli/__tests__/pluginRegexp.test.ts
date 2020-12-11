import { pluginRegexp } from '../pluginRegexp';

describe('core/cli/pluginRegexp', () => {
  it('default', () => {
    expect(pluginRegexp.test('@zero-scripts/plugin-test')).toBe(true);
    expect(pluginRegexp.test('@some-namespace/plugin-test')).toBe(false);
    expect(pluginRegexp.test('@zero-scripts/plugin-')).toBe(false);
    expect(pluginRegexp.test('@zero-scripts/plugin')).toBe(false);
    expect(pluginRegexp.test('@namespace/plugin-test')).toBe(false);
    expect(pluginRegexp.test('@namespace/plugin-')).toBe(false);
    expect(pluginRegexp.test('@namespace/plugin')).toBe(false);

    expect(pluginRegexp.test('@/plugin-test')).toBe(false);
    expect(pluginRegexp.test('/plugin-test')).toBe(false);
    expect(pluginRegexp.test('@plugin-test')).toBe(false);

    expect(pluginRegexp.test('@/plugin')).toBe(false);
    expect(pluginRegexp.test('/plugin')).toBe(false);
    expect(pluginRegexp.test('@plugin')).toBe(false);

    expect(pluginRegexp.test('plugin')).toBe(false);
    expect(pluginRegexp.test('@/')).toBe(false);
    expect(pluginRegexp.test('@')).toBe(false);
    expect(pluginRegexp.test('/')).toBe(false);
  });
});
