import {
  WebpackBabelExtension,
  WebpackBabelExtensionOptions
} from '@zero-scripts/extension.webpack-babel';
import { AbstractPreset } from '@zero-scripts/core';

export class WebpackBabelReactExtension extends WebpackBabelExtension {
  constructor(
    preset: AbstractPreset,
    { presets, ...rest }: WebpackBabelExtensionOptions
  ) {
    super(preset, {
      ...rest,
      presets: [
        ({ isDev }) => [
          require.resolve('@babel/preset-react'),
          { development: isDev }
        ],
        ...(presets ? presets : [])
      ]
    });
  }
}

export default WebpackBabelReactExtension;
