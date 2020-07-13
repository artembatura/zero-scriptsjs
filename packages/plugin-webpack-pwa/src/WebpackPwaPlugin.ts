import { GenerateSW } from 'workbox-webpack-plugin';

import {
  AbstractPlugin,
  InsertPos,
  ReadOptions,
  PluginAPI
} from '@zero-scripts/core';
import { WebpackConfig } from '@zero-scripts/webpack-config';

import { WebpackPwaPluginOptions } from './WebpackPwaPluginOptions';

@ReadOptions(WebpackPwaPluginOptions, 'plugin-webpack-pwa')
export class WebpackPwaPlugin extends AbstractPlugin<WebpackPwaPluginOptions> {
  public apply(ws: PluginAPI): void {
    ws.hooks.beforeRun.tap('WebpackPwaPlugin', api => {
      const webpackConfigBuilder = api.getConfigBuilder(WebpackConfig);

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
