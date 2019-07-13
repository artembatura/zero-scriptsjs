import { WebpackPresetSpa } from '@zero-scripts/preset.webpack-spa';

export class WebpackSpaReactPreset extends WebpackPresetSpa {
  constructor(defaultExtensions: string[] = []) {
    super([
      '@zero-scripts/extension.webpack-babel.react',
      '@zero-scripts/extension.webpack-css',
      '@zero-scripts/extension.webpack-eslint.react',
      '@zero-scripts/extension.webpack-pwa',
      ...defaultExtensions
    ]);
  }
}
