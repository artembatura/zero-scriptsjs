import { AbstractExtension, InsertPos } from '@zero-scripts/core';
import { WebpackConfig } from '@zero-scripts/config.webpack';
import WorkboxWebpackPlugin from 'workbox-webpack-plugin';

export class WebpackPwaExtension extends AbstractExtension {
  public activate(): void {
    const config = this.preset.getInstance(WebpackConfig);

    config.insertPlugin(
      ({ isDev }) =>
        !isDev
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
}

export default WebpackPwaExtension;
