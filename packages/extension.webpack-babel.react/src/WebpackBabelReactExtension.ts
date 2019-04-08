import { WebpackBabelExtension } from '@zero-scripts/extension.webpack-babel';
import { AbstractPreset, ReadOptions } from '@zero-scripts/core';
import { WebpackConfig } from '@zero-scripts/config.webpack';
import { WebpackBabelReactExtensionOptions } from './WebpackBabelReactExtensionOptions';

@ReadOptions(WebpackBabelReactExtensionOptions)
export class WebpackBabelReactExtension<
  TParentExtensionOptions extends WebpackBabelReactExtensionOptions = WebpackBabelReactExtensionOptions
> extends WebpackBabelExtension<TParentExtensionOptions> {
  public activate(preset: AbstractPreset): void {
    const _config = preset.getInstance(WebpackConfig);

    _config.beforeBuild(config => {
      const { isDev } = config.optionsContainer.build();

      this.optionsContainer.presets.push([
        '@babel/preset-react',
        { development: isDev, useBuiltIns: true }
      ]);

      // TODO: given undefined
      const { propTypes } = this.optionsContainer.build();

      if (isDev && propTypes) {
        this.optionsContainer.plugins.push([
          'babel-plugin-transform-react-remove-prop-types',
          { removeImport: true }
        ]);
      }
    });

    super.activate(preset);
  }
}
