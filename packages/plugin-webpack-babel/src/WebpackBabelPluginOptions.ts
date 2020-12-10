import type { TransformOptions } from '@babel/core';

import { AbstractOptionsContainer, Option } from '@zero-scripts/core';

type NonNullableObject<T> = {
  [P in keyof T]-?: NonNullable<T[P]>;
};

type BaseBabelConfig = Omit<
  TransformOptions,
  'presets' | 'plugins' | 'overrides'
> &
  NonNullableObject<
    Pick<TransformOptions, 'presets' | 'plugins' | 'overrides'>
  >;

export class WebpackBabelPluginOptions extends AbstractOptionsContainer<WebpackBabelPluginOptions> {
  @Option<WebpackBabelPluginOptions, 'flow'>()
  public flow: boolean = false;

  @Option<WebpackBabelPluginOptions, 'jsLoaders'>(
    ({ externalValue, defaultValue }) => [
      ...defaultValue,
      ...(externalValue ? externalValue : [])
    ]
  )
  public jsLoaders: Array<
    { loader: string; options: Record<string, unknown> } | string
  > = [];

  @Option<WebpackBabelPluginOptions, 'baseBabelConfig'>(
    ({ defaultValue, externalValue }) => ({
      ...defaultValue,
      ...externalValue
    })
  )
  public baseBabelConfig: BaseBabelConfig = {
    presets: [],
    plugins: [],
    overrides: []
  };

  @Option<WebpackBabelPluginOptions, 'syncConfig'>(
    ({ defaultValue, externalValue }) => ({
      ...defaultValue,
      ...externalValue
    })
  )
  public syncConfig: {
    enabled?: boolean;
    // regenerateIfNotEqual?: boolean;
  } = {
    enabled: true
  };
}
