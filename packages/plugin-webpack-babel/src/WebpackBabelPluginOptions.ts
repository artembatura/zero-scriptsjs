import type { TransformOptions } from '@babel/core';

import { AbstractOptionsContainer, Option } from '@zero-scripts/core';

interface TransformEnv {
  [index: string]: TransformOptions | null | undefined;
  development: Omit<BaseBabelConfig, 'env' | 'overrides'>;
  production: Omit<BaseBabelConfig, 'env' | 'overrides'>;
}

interface BaseBabelConfig extends TransformOptions {
  presets: NonNullable<TransformOptions['presets']>;
  plugins: NonNullable<TransformOptions['plugins']>;
  overrides: NonNullable<TransformOptions['overrides']>;
  env: TransformEnv;
}

export class WebpackBabelPluginOptions extends AbstractOptionsContainer<WebpackBabelPluginOptions> {
  // TODO: if flow package is installed,
  //  automatically enable this option
  @Option<WebpackBabelPluginOptions, 'flow'>()
  public flow: boolean = false;

  @Option<WebpackBabelPluginOptions, 'baseBabelConfig'>(
    ({ defaultValue, externalValue }) => ({
      ...defaultValue,
      ...externalValue
    })
  )
  public baseBabelConfig: BaseBabelConfig = {
    presets: [],
    plugins: [],
    overrides: [],
    env: {
      development: {
        presets: [],
        plugins: []
      },
      production: {
        presets: [],
        plugins: []
      }
    }
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
