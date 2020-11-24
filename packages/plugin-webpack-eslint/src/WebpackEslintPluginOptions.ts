import { AbstractOptionsContainer, Option } from '@zero-scripts/core';

export class WebpackEslintPluginOptions extends AbstractOptionsContainer<WebpackEslintPluginOptions> {
  @Option<WebpackEslintPluginOptions, 'plugins'>(
    ({ externalValue, defaultValue }) => [
      ...defaultValue,
      ...(externalValue ? externalValue : [])
    ]
  )
  public plugins: (string | [string, Record<string, unknown>])[] = [];

  @Option<WebpackEslintPluginOptions, 'extends'>(
    ({ externalValue, defaultValue }) => [
      ...defaultValue,
      ...(externalValue ? externalValue : [])
    ]
  )
  public extends: (string | [string, Record<string, unknown>])[] = [];

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
  public parserOptions: Record<string, unknown> = {};

  @Option<WebpackEslintPluginOptions, 'settings'>(
    ({ defaultValue, externalValue }) => ({
      ...defaultValue,
      ...externalValue
    })
  )
  public settings: Record<string, unknown> = {};
}
