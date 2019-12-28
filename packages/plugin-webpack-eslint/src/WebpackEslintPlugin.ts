import {
  AbstractPlugin,
  extensionsRegex,
  InsertPos,
  ReadOptions,
  PluginAPI
} from '@zero-scripts/core';
import { WebpackConfig } from '@zero-scripts/webpack-config';

import { WebpackEslintPluginOptions } from './WebpackEslintPluginOptions';

@ReadOptions(WebpackEslintPluginOptions, 'extension.webpack-eslint')
export class WebpackEslintPlugin<
  TOptions extends WebpackEslintPluginOptions = WebpackEslintPluginOptions
> extends AbstractPlugin<TOptions> {
  public apply(ws: PluginAPI): void {
    ws.hooks.beforeRun.tap('WebpackEslintPlugin', api => {
      const config = api.getConfigBuilder(WebpackConfig);

      config.hooks.build.tap(
        'WebpackEslintPlugin',
        (modifications, { jsFileExtensions, paths }) => {
          const pluginOptions = this.optionsContainer.build();

          modifications.insertCommonModuleRule(
            () => ({
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
                  extends: ['eslint:recommended', ...pluginOptions.extends],
                  plugins: ['import', ...pluginOptions.plugins],
                  parserOptions: {
                    ecmaVersion: 9,
                    sourceType: 'module',
                    ...pluginOptions.parserOptions
                  },
                  settings: pluginOptions.settings,
                  env: {
                    browser: true,
                    node: true,
                    ...pluginOptions.env
                  },
                  rules: {
                    'no-unused-vars': 'warn',
                    'no-console': 'warn',
                    ...pluginOptions.rules
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
      );
    });
  }
}
