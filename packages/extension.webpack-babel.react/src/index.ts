import {
  WebpackBabelExtension,
  WebpackBabelExtensionOptions
} from '@zero-scripts/extension.webpack-babel';
import { AbstractPreset } from '@zero-scripts/core';

type WebpackBabelReactExtensionOptions = WebpackBabelExtensionOptions & {
  propTypes: boolean;
};

export class WebpackBabelReactExtension extends WebpackBabelExtension {
  constructor(
    preset: AbstractPreset,
    { presets, plugins, propTypes, ...rest }: WebpackBabelReactExtensionOptions
  ) {
    super(preset, {
      ...rest,
      presets: [
        ({ isDev }) => [
          '@babel/preset-react',
          { development: isDev, useBuiltIns: true }
        ],
        ...(presets ? presets : [])
      ],
      plugins: [
        ({ isDev }) =>
          !isDev &&
          propTypes && [
            'babel-plugin-transform-react-remove-prop-types',
            { removeImport: true }
          ],
        ...(plugins ? plugins : [])
      ]
    });
  }
}

export default WebpackBabelReactExtension;
