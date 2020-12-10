import { Linter } from 'eslint';

import { AbstractOptionsContainer, Option } from '@zero-scripts/core';

export class WebpackEslintPluginOptions extends AbstractOptionsContainer<WebpackEslintPluginOptions> {
  @Option<WebpackEslintPluginOptions, 'baseEslintConfig'>(
    ({ defaultValue, externalValue }) => ({
      ...defaultValue,
      ...externalValue
    })
  )
  public baseEslintConfig: Linter.Config = {};

  @Option<WebpackEslintPluginOptions, 'syncConfig'>(
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
