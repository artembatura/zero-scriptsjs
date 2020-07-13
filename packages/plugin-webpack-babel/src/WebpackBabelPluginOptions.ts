import { AbstractOptionsContainer, Option } from '@zero-scripts/core';

export class WebpackBabelPluginOptions extends AbstractOptionsContainer {
  @Option<WebpackBabelPluginOptions, 'flow'>()
  public flow: boolean = false;

  @Option<WebpackBabelPluginOptions, 'presets'>(
    ({ externalValue, defaultValue }) => [
      ...defaultValue,
      ...(externalValue ? externalValue : [])
    ]
  )
  public presets: (string | [string, any])[] = [];

  @Option<WebpackBabelPluginOptions, 'plugins'>(
    ({ externalValue, defaultValue }) => [
      ...defaultValue,
      ...(externalValue ? externalValue : [])
    ]
  )
  public plugins: (string | [string, any])[] = [];

  @Option<WebpackBabelPluginOptions, 'jsLoaders'>(
    ({ externalValue, defaultValue }) => [
      ...defaultValue,
      ...(externalValue ? externalValue : [])
    ]
  )
  public jsLoaders: Array<{ loader: string; options: object } | string> = [];
}
