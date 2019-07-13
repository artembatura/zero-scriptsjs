import { AbstractPreset, ReadOptions } from '@zero-scripts/core';
import { WebpackEslintExtension } from '@zero-scripts/extension.webpack-eslint';

import { WebpackEslintReactExtensionOptions } from './WebpackEslintReactExtensionOptions';

@ReadOptions(
  WebpackEslintReactExtensionOptions,
  'extension.webpack-eslint.react'
)
export class WebpackEslintReactExtension extends WebpackEslintExtension<
  WebpackEslintReactExtensionOptions
> {
  public activate(preset: AbstractPreset): void {
    // TODO: we can back to eslint-config-react-app, when it's released
    this.optionsContainer.extends.push('eslint-config-react-app-fresh');

    this.optionsContainer.parserOptions = {
      ...this.optionsContainer.parserOptions,
      ecmaFeatures: {
        jsx: true
      }
    };

    this.optionsContainer.settings = {
      ...this.optionsContainer.settings,
      react: {
        version: 'detect'
      }
    };

    super.activate(preset);
  }
}
