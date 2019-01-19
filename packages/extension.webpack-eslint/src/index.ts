import {
  AbstractExtension,
  extensionsRegex,
  InsertPos
} from '@zero-scripts/core';
import { WebpackConfig } from '@zero-scripts/config.webpack';
import { resolvePath } from '@zero-scripts/config.webpack';

export class WebpackEslintExtension extends AbstractExtension {
  public activate(): void {
    this.preset.getInstance(WebpackConfig).insertCommonModuleRule(
      ({ jsFileExtensions, paths }) => ({
        test: extensionsRegex(jsFileExtensions),
        include: resolvePath(paths.src),
        enforce: 'pre',
        use: [
          {
            loader: require.resolve('eslint-loader'),
            options: {
              eslintPath: require.resolve('eslint'),
              formatter: require.resolve('eslint-formatter-pretty'),
              baseConfig: {
                parser: 'babel-eslint',
                extends: ['eslint:recommended'],
                plugins: ['import'],
                env: {
                  browser: true,
                  node: true
                },
                rules: {
                  'no-unused-vars': 'warn',
                  'no-console': 'warn'
                }
              },
              ignore: false,
              useEslintrc: false
            }
          }
        ]
      }),
      InsertPos.Start
    );
  }
}

export default WebpackEslintExtension;
