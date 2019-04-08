import { AbstractOptionsContainer, Option } from '@zero-scripts/core';

export class WebpackBabelExtensionOptions extends AbstractOptionsContainer {
  @Option<WebpackBabelExtensionOptions, 'flow'>()
  public flow: boolean = false;

  @Option<WebpackBabelExtensionOptions, 'presets'>(
    ({ externalValue, defaultValue }) => [
      ...defaultValue,
      ...(externalValue ? externalValue : [])
    ]
  )
  public presets: (string | [string, any])[] = [];

  @Option<WebpackBabelExtensionOptions, 'plugins'>(
    ({ externalValue, defaultValue }) => [
      ...defaultValue,
      ...(externalValue ? externalValue : [])
    ]
  )
  public plugins: (string | [string, any])[] = [];
}
