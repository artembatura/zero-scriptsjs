import { AbstractPreset } from '@zero-scripts/core';
import { WebpackEslintExtension } from '@zero-scripts/extension.webpack-eslint';
import { WebpackEslintReactExtensionOptions } from './WebpackEslintReactExtensionOptions';

export class WebpackEslintReactExtension extends WebpackEslintExtension<
  WebpackEslintReactExtensionOptions
> {
  public activate(preset: AbstractPreset): void {
    this.optionsContainer.extends.push('eslint-config-react-app');

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
