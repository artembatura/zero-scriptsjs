import { Option, ParametersContainer } from '@zero-scripts/core';
import { WebpackConfigOptions } from './WebpackConfigOptions';
import { resolvePaths } from './resolvePaths';
import fs from 'fs';

export class WebpackConfigParameters extends ParametersContainer<
  WebpackConfigOptions
> {
  @Option<WebpackConfigParameters, 'paths'>(
    ({ defaultValue, externalValue }) => ({
      ...defaultValue,
      ...externalValue
    }),
    [],
    (value, { jsFileExtensions }) => resolvePaths(value, jsFileExtensions)
  )
  public paths: WebpackConfigOptions['paths'] = {
    root: '',
    src: 'src',
    build: 'build',
    indexJs: 'src/index',
    indexHtml: 'public/index.html',
    publicPath: 'public',
    tsConfig: 'tsconfig.json'
  };

  @Option<WebpackConfigParameters, 'useSourceMap'>()
  public useSourceMap: boolean = true;

  @Option<WebpackConfigParameters, 'additionalEntry'>(
    ({ externalValue, defaultValue }) => [
      ...defaultValue,
      ...(externalValue ? externalValue : [])
    ]
  )
  public readonly additionalEntry: string[] = [];

  @Option<WebpackConfigParameters, 'moduleFileExtensions', 'useTypescript'>(
    ({ externalValue, defaultValue, dependencies: { useTypescript } }) => [
      ...defaultValue,
      ...(useTypescript ? ['.ts', '.tsx'] : []),
      ...(externalValue ? externalValue : [])
    ],
    ['useTypescript']
  )
  public readonly moduleFileExtensions: string[] = ['.json', '.js'];

  @Option<WebpackConfigParameters, 'jsFileExtensions', 'useTypescript'>(
    ({ externalValue, defaultValue, dependencies: { useTypescript } }) => [
      ...defaultValue,
      ...(useTypescript ? ['ts', 'tsx'] : []),
      ...(externalValue ? externalValue : [])
    ],
    ['useTypescript']
  )
  public readonly jsFileExtensions: string[] = ['js'];

  @Option<WebpackConfigParameters, 'isDev'>()
  public isDev: boolean = false;

  @Option<WebpackConfigParameters, 'useTypescript', 'paths'>(
    ({ externalValue, dependencies: { paths } }) =>
      typeof externalValue === 'boolean'
        ? externalValue
        : fs.existsSync(paths.tsConfig),
    ['paths']
  )
  public useTypescript: boolean = false;

  // todo method for returning metadata
}
