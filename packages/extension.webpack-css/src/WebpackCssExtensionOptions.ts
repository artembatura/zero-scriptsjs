import { AbstractOptionsContainer, Option } from '@zero-scripts/core';

export class WebpackCssExtensionOptions extends AbstractOptionsContainer {
  @Option<WebpackCssExtensionOptions, 'styleLoaders'>(
    ({ externalValue, defaultValue }) => [
      ...(externalValue ? externalValue : []),
      ...(defaultValue ? defaultValue : [])
    ]
  )
  public styleLoaders?: Array<{
    test: string;
    loader: string;
    exclude?: string;
    preprocessor?: string;
  }> = [];
}
