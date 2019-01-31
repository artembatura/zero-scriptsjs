import {
  AbstractExtension,
  ArrayOption,
  extensionsRegex,
  handleArrayOption,
  InsertPos
} from '@zero-scripts/core';
import {
  WebpackConfig,
  WebpackConfigOptions
} from '@zero-scripts/config.webpack';

export type WebpackEslintExtensionOptions = {
  plugins: ArrayOption<string, WebpackConfigOptions>;
  extends: ArrayOption<string, WebpackConfigOptions>;
  rules: Record<string, string | any[]>;
  env: Record<string, boolean>;
  parserOptions: Record<string, any>;
  settings: Record<string, any>;
};

export class WebpackEslintExtension extends AbstractExtension<
  WebpackEslintExtensionOptions
> {
  public activate(): void {
    const config = this.preset.getInstance(WebpackConfig);

    config.insertCommonModuleRule(options => {
      const { jsFileExtensions, paths } = options;
      return {
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
            extends: [
              'eslint:recommended',
              ...handleArrayOption(this.options.extends, options)
            ],
            plugins: [
              'import',
              ...handleArrayOption(this.options.plugins, options)
            ],
            parserOptions: {
              ecmaVersion: 9,
              sourceType: 'module',
              ...(this.options.parserOptions ? this.options.parserOptions : {})
            },
            settings: this.options.settings ? this.options.settings : {},
            env: {
              browser: true,
              node: true,
              ...(this.options.env ? this.options.env : {})
            },
            rules: {
              'no-unused-vars': 'warn',
              'no-console': 'warn',
              ...(this.options.rules ? this.options.rules : {})
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
      };
    }, InsertPos.Start);
  }
}

export default WebpackEslintExtension;
