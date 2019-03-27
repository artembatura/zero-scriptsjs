import { Option } from '@zero-scripts/core';
import { WebpackBabelExtensionOptions } from '@zero-scripts/extension.webpack-babel';

export class WebpackBabelReactExtensionOptions extends WebpackBabelExtensionOptions {
  @Option<WebpackBabelReactExtensionOptions, 'propTypes'>()
  public propTypes: boolean = false;
}
