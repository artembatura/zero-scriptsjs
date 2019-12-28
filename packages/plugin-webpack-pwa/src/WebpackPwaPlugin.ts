import WorkboxWebpackPlugin from 'workbox-webpack-plugin';

import {
  AbstractPlugin,
  InsertPos,
  ReadOptions,
  PluginAPI
} from '@zero-scripts/core';
import { WebpackConfig } from '@zero-scripts/webpack-config';

import { WebpackPwaPluginOptions } from './WebpackPwaPluginOptions';

@ReadOptions(WebpackPwaPluginOptions, 'extension.webpack-pwa')
export class WebpackPwaPlugin extends AbstractPlugin<WebpackPwaPluginOptions> {
  public apply(ws: PluginAPI): void {
    ws.hooks.beforeRun.tap('WebpackPwaPlugin', api => {
      const webpackConfigBuilder = api.getConfigBuilder(WebpackConfig);

      webpackConfigBuilder.hooks.build.tap(
        'WebpackPwaPlugin',
        (modifications, configOptions) => {
          modifications.insertPlugin(
            () =>
              !configOptions.isDev
                ? new WorkboxWebpackPlugin.GenerateSW({
                    clientsClaim: true,
                    exclude: [/\.map$/, /asset-manifest\.json$/],
                    importWorkboxFrom: 'cdn',
                    navigateFallback: '/index.html',
                    navigateFallbackBlacklist: [
                      new RegExp('^/_'),
                      new RegExp('/[^/]+\\.[^/]+$')
                    ]
                  })
                : undefined,
            InsertPos.End
          );
        }
      );
    });
  }
}
