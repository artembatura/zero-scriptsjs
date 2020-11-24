import ESLintPlugin from 'eslint-webpack-plugin';
import { Options } from 'eslint-webpack-plugin/declarations/options';

import { AbstractPlugin, ReadOptions, ApplyContext } from '@zero-scripts/core';
import { WebpackConfig } from '@zero-scripts/webpack-config';

import { getEslintRcPath } from './getEslintRcPath';
import { WebpackEslintPluginOptions } from './WebpackEslintPluginOptions';

const rr = require.resolve;

@ReadOptions(WebpackEslintPluginOptions, 'plugin-webpack-eslint')
export class WebpackEslintPlugin extends AbstractPlugin<
  WebpackEslintPluginOptions
> {
  public apply(applyContext: ApplyContext): void {
    applyContext.hooks.beforeRun.tap(
      'WebpackEslintPlugin',
      beforeRunContext => {
        const config = beforeRunContext.getConfigBuilder(WebpackConfig);

        config.hooks.build.tap(
          'WebpackEslintPlugin',
          (modifications, { jsFileExtensions, paths }) => {
            const pluginOptions = this.optionsContainer.build();

            const eslintRcConfig = getEslintRcPath(paths.root);

            modifications.insertPlugin(
              new ESLintPlugin({
                // Plugin options
                extensions: jsFileExtensions,
                formatter: rr('eslint-formatter-pretty'),
                eslintPath: rr('eslint'),
                overrideConfigFile: eslintRcConfig,
                useEslintrc: false,
                context: paths.src,
                cache: true,
                // ESLint class options
                cwd: paths.root,
                resolvePluginsRelativeTo: __dirname,
                baseConfig: {
                  parser: rr('babel-eslint'),
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
                    'no-console': 'error',
                    ...pluginOptions.rules
                  },
                  overrides: [
                    {
                      files: ['*.ts', '*.tsx'],
                      parser: rr('@typescript-eslint/parser'),
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
              } as Options)
            );
          }
        );
      }
    );
  }
}
