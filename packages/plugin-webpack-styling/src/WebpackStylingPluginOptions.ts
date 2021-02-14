import { AbstractOptionsContainer, Option } from '@zero-scripts/core';

export class WebpackStylingPluginOptions extends AbstractOptionsContainer<WebpackStylingPluginOptions> {
  @Option<WebpackStylingPluginOptions, 'styleLoaders'>(
    ({ externalValue, defaultValue }) => [
      ...(externalValue ? externalValue : []),
      ...(defaultValue ? defaultValue : [])
    ]
  )
  public styleLoaders: Array<{
    test: string;
    loader:
      | string
      | {
          loader?: string;
          options?: Record<string, unknown>;
        };
    exclude?: string;
    preprocessor?:
      | string
      | {
          loader: string;
          options: Record<string, unknown>;
        };
  }> = [];

  @Option<WebpackStylingPluginOptions, 'postcssOptions'>(
    ({ externalValue, defaultValue }) => ({
      ...(externalValue ? externalValue : {}),
      ...(defaultValue ? defaultValue : {})
    })
  )
  public postcssOptions: {
    plugins?: any[];
    [option: string]: any;
  } = {};
}
