import ESLintPlugin from 'eslint-webpack-plugin';
import * as fs from 'fs';
import * as path from 'path';

import { AbstractPlugin, ReadOptions, ApplyContext } from '@zero-scripts/core';
import { WebpackConfig } from '@zero-scripts/webpack-config';

import { getBaseEslintConfig } from './getBaseEslintConfig';
import { getEslintConfigPath } from './getEslintConfigPath';
import { WebpackEslintPluginOptions } from './WebpackEslintPluginOptions';

@ReadOptions(WebpackEslintPluginOptions, 'plugin-webpack-eslint')
export class WebpackEslintPlugin extends AbstractPlugin<WebpackEslintPluginOptions> {
  public apply(applyContext: ApplyContext): void {
    applyContext.hooks.beforeRun.tap(
      'WebpackEslintPlugin',
      beforeRunContext => {
        const config = beforeRunContext.getConfigBuilder(WebpackConfig);

        config.hooks.build.tap(
          'WebpackEslintPlugin',
          (modifications, configOptions) => {
            const { jsFileExtensions, paths } = configOptions;
            const pluginOptions = this.optionsContainer.build();

            if (pluginOptions.syncConfig.enabled) {
              const eslintRcConfig = getEslintConfigPath(paths.root);

              if (!eslintRcConfig) {
                const baseEslintConfig = getBaseEslintConfig(
                  configOptions,
                  pluginOptions.baseEslintConfig
                );

                const eslintConfigPath = path.resolve(
                  paths.root,
                  '.eslintrc.json'
                );

                // eslint-disable-next-line no-console
                console.log('Create .eslintrc.json...');

                fs.writeFileSync(
                  eslintConfigPath,
                  JSON.stringify(baseEslintConfig, null, 2)
                );

                // TODO: check if packages declared in eslint config
                // is not installed to node_modules - ask user to install it
                // if user will decline it, disable eslint to prevent build crash

                // TODO: if option `regenerateIfNotEqual` is true
                // check eslint config and regenerate it if something is not equal
                // useful when some plugins added which adds some eslint settings
                // and will replace old config with new updated
              }
            }

            modifications.insertPlugin(
              new ESLintPlugin({
                extensions: jsFileExtensions,
                formatter: require.resolve('eslint-formatter-pretty'),
                context: paths.src,
                cache: true,
                cwd: paths.root
              })
            );
          }
        );
      }
    );
  }
}
