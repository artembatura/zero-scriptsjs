import { Option, AbstractOptionsContainer } from '@zero-scripts/core';

export class WebpackReactPluginOptions extends AbstractOptionsContainer<
  WebpackReactPluginOptions
> {
  @Option<WebpackReactPluginOptions, 'propTypes'>()
  public propTypes: boolean = false;

  @Option<WebpackReactPluginOptions, 'fastRefresh'>()
  public fastRefresh: boolean = false;

  @Option<WebpackReactPluginOptions, 'svgReactComponent'>()
  public svgReactComponent: boolean = false;
}
