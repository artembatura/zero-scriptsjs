import { AbstractOptionsContainer, Option } from '@zero-scripts/core';

export class WebpackEslintPluginOptions extends AbstractOptionsContainer {
  @Option<WebpackEslintPluginOptions, 'plugins'>(
    ({ externalValue, defaultValue }) => [
      ...defaultValue,
      ...(externalValue ? externalValue : [])
    ]
  )
  public plugins: (string | [string, object])[] = [];

  @Option<WebpackEslintPluginOptions, 'extends'>(
    ({ externalValue, defaultValue }) => [
      ...defaultValue,
      ...(externalValue ? externalValue : [])
    ]
  )
  public extends: (string | [string, object])[] = [];

  @Option<WebpackEslintPluginOptions, 'rules'>(
    ({ defaultValue, externalValue }) => ({
      ...defaultValue,
      ...externalValue
    })
  )
  public rules: Record<string, string | any[]> = {};

  @Option<WebpackEslintPluginOptions, 'env'>(
    ({ defaultValue, externalValue }) => ({
      ...defaultValue,
      ...externalValue
    })
  )
  public env: Record<string, boolean> = {};

  @Option<WebpackEslintPluginOptions, 'parserOptions'>(
    ({ defaultValue, externalValue }) => ({
      ...defaultValue,
      ...externalValue
    })
  )
  public parserOptions: Record<string, any> = {};

  @Option<WebpackEslintPluginOptions, 'settings'>(
    ({ defaultValue, externalValue }) => ({
      ...defaultValue,
      ...externalValue
    })
  )
  public settings: Record<string, any> = {};
}
