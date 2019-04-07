import {
  AbstractExtension,
  AbstractPreset,
  extensionsRegex,
  InsertPos,
  ReadOptions
} from '@zero-scripts/core';
import { WebpackConfig } from '@zero-scripts/config.webpack';
import { WebpackEslintExtensionOptions } from './WebpackEslintExtensionOptions';

@ReadOptions(WebpackEslintExtensionOptions)
export class WebpackEslintExtension<
  TParentExtensionOptions extends WebpackEslintExtensionOptions = WebpackEslintExtensionOptions
> extends AbstractExtension<TParentExtensionOptions> {
  public activate(preset: AbstractPreset): void {
    const config = preset.getInstance(WebpackConfig);

    const {
      extends: _extends,
      plugins,
      parserOptions,
      settings,
      env,
      rules
    } = this.optionsContainer.build();

    config.insertCommonModuleRule(
      ({ jsFileExtensions, paths }) => ({
        test: extensionsRegex(jsFileExtensions),
        include: paths.src,
        enforce: 'pre',
        loader: require.resolve('eslint-loader'),
        options: {
          eslintPath: require.resolve('eslint'),
          formatter: require.resolve('eslint-formatter-pretty'),
          ignore: false,
          useEslintrc: false,
          baseConfig: {
            parser: 'babel-eslint',
            extends: ['eslint:recommended', ..._extends],
            plugins: ['import', ...plugins],
            parserOptions: {
              ecmaVersion: 9,
              sourceType: 'module',
              ...parserOptions
            },
            settings,
            env: {
              browser: true,
              node: true,
              ...env
            },
            rules: {
              'no-unused-vars': 'warn',
              'no-console': 'warn',
              ...rules
            },
            overrides: [
              {
                files: ['*.ts', '*.tsx'],
                parser: '@typescript-eslint/parser',
                plugins: ['@typescript-eslint'],
                rules: {
                  'no-undef': 'off',
                  'no-unused-vars': 'off',
                  'no-restricted-globals': 'off',
                  'no-use-before-define': 'off',
                  '@typescript-eslint/no-unused-vars': [
                    'warn',
                    {
                      vars: 'all',
                      args: 'after-used',
                      ignoreRestSiblings: false
                    }
                  ]
                }
              }
            ]
          }
        }
      }),
      InsertPos.Start
    );
  }
}
