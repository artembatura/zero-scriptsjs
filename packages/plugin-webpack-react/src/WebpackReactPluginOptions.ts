import { Option, AbstractOptionsContainer } from '@zero-scripts/core';

export class WebpackReactPluginOptions extends AbstractOptionsContainer {
  @Option<WebpackReactPluginOptions, 'propTypes'>()
  public propTypes: boolean = false;
}
