import { AbstractOptionsContainer, Option } from '@zero-scripts/core';

export class WebpackEslintExtensionOptions extends AbstractOptionsContainer {
  @Option<WebpackEslintExtensionOptions, 'plugins'>(
    ({ externalValue, defaultValue }) => [
      ...defaultValue,
      ...(externalValue ? externalValue : [])
    ]
  )
  public plugins: (string | [string, object])[] = [];

  @Option<WebpackEslintExtensionOptions, 'plugins'>(
    ({ externalValue, defaultValue }) => [
      ...defaultValue,
      ...(externalValue ? externalValue : [])
    ]
  )
  public extends: (string | [string, object])[] = [];

  @Option<WebpackEslintExtensionOptions, 'rules'>(
    ({ defaultValue, externalValue }) => ({
      ...defaultValue,
      ...externalValue
    })
  )
  public rules: Record<string, string | any[]> = {};

  @Option<WebpackEslintExtensionOptions, 'env'>(
    ({ defaultValue, externalValue }) => ({
      ...defaultValue,
      ...externalValue
    })
  )
  public env: Record<string, boolean> = {};

  @Option<WebpackEslintExtensionOptions, 'rules'>(
    ({ defaultValue, externalValue }) => ({
      ...defaultValue,
      ...externalValue
    })
  )
  public parserOptions: Record<string, any> = {};

  @Option<WebpackEslintExtensionOptions, 'rules'>(
    ({ defaultValue, externalValue }) => ({
      ...defaultValue,
      ...externalValue
    })
  )
  public settings: Record<string, any> = {};
}
