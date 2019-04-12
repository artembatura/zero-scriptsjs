import WorkboxWebpackPlugin from 'workbox-webpack-plugin';

import { WebpackConfig } from '@zero-scripts/config.webpack';
import {
  AbstractExtension,
  AbstractPreset,
  InsertPos,
  ReadOptions
} from '@zero-scripts/core';

import { WebpackPwaExtensionOptions } from './WebpackPwaExtensionOptions';

@ReadOptions(WebpackPwaExtensionOptions, 'extension.webpack-pwa')
export class WebpackPwaExtension extends AbstractExtension<
  WebpackPwaExtensionOptions
> {
  public activate(preset: AbstractPreset): void {
    preset.getInstance(WebpackConfig).insertPlugin(
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
