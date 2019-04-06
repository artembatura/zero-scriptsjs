import { WebpackBabelExtension } from '@zero-scripts/extension.webpack-babel';
import { AbstractPreset, ReadOptions } from '@zero-scripts/core';
import { WebpackConfig } from '@zero-scripts/config.webpack';
import { WebpackBabelReactExtensionOptions } from './WebpackBabelReactExtensionOptions';

@ReadOptions(WebpackBabelReactExtensionOptions)
export class WebpackBabelReactExtension extends WebpackBabelExtension<
  WebpackBabelReactExtensionOptions
> {
  activate(preset: AbstractPreset): void {
    const { optionsContainer } = preset.getInstance(WebpackConfig);
    // give defaultValue of isDev option,
    // which can be modified before config building is started
    const { isDev } = optionsContainer.build();
    console.log(`isDev: ${isDev}`);

    this.optionsContainer.presets.push([
      '@babel/preset-react',
      { development: isDev, useBuiltIns: true }
    ]);

    const { propTypes } = this.optionsContainer.build();
    console.log(`propTypes: ${propTypes}`);

    if (isDev && propTypes) {
      this.optionsContainer.plugins.push([
        'babel-plugin-transform-react-remove-prop-types',
        { removeImport: true }
      ]);
    }

    super.activate(preset);
  }
}
