import {
  WebpackEslintExtension,
  WebpackEslintExtensionOptions
} from '@zero-scripts/extension.webpack-eslint';
import { AbstractPreset } from '@zero-scripts/core';

export class WebpackEslintReactExtension extends WebpackEslintExtension {
  constructor(
    preset: AbstractPreset,
    {
      extends: _extends,
      parserOptions,
      settings,
      ...rest
    }: WebpackEslintExtensionOptions
  ) {
    super(preset, {
      extends: ['eslint-config-react-app', ...(_extends ? _extends : [])],
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        },
        ...parserOptions
      },
      settings: {
        react: {
          version: 'detect'
        },
        ...settings
      },
      ...rest
    });
  }
}

export default WebpackEslintReactExtension;
