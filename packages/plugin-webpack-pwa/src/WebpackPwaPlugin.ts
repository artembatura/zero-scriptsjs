import { GenerateSW } from 'workbox-webpack-plugin';

import {
  AbstractPlugin,
  InsertPos,
  ReadOptions,
  ApplyContext
} from '@zero-scripts/core';
import { WebpackConfig } from '@zero-scripts/webpack-config';

import { WebpackPwaPluginOptions } from './WebpackPwaPluginOptions';

@ReadOptions(WebpackPwaPluginOptions, 'plugin-webpack-pwa')
export class WebpackPwaPlugin extends AbstractPlugin<WebpackPwaPluginOptions> {
  public apply(applyContext: ApplyContext): void {
    applyContext.hooks.beforeRun.tap('WebpackPwaPlugin', beforeRunContext => {
      const webpackConfigBuilder = beforeRunContext.getConfigBuilder(
        WebpackConfig
      );

      webpackConfigBuilder.hooks.build.tap(
        'WebpackPwaPlugin',
        (modifications, configOptions) => {
          if (!configOptions.isDev) {
            modifications.insertPlugin(
              new GenerateSW({
                clientsClaim: true,
                exclude: [/\.map$/, /asset-manifest\.json$/],
                navigateFallback: '/index.html',
                navigateFallbackDenylist: [
                  new RegExp('^/_'),
                  new RegExp('/[^/]+\\.[^/]+$')
                ]
              }),
              InsertPos.End
            );
          }
        }
      );
    });
  }
}
