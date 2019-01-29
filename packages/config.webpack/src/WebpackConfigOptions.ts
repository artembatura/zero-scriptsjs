import { OptionsContainer, Option } from '@zero-scripts/core';
import { resolvePaths } from './resolvePaths';
import fs from 'fs';

export class WebpackConfigOptions extends OptionsContainer {
  @Option<WebpackConfigOptions, 'paths'>(
    ({ defaultValue, externalValue }) => ({
      ...defaultValue,
      ...externalValue
    }),
    [],
    (value, { jsFileExtensions }) => resolvePaths(value, jsFileExtensions)
  )
  public paths = {
    root: '',
    src: 'src',
    build: 'build',
    indexJs: 'src/index',
    indexHtml: 'public/index.html',
    publicPath: 'public',
    tsConfig: 'tsconfig.json'
  };

  @Option<WebpackConfigOptions, 'useSourceMap'>()
  public useSourceMap: boolean = true;

  @Option<WebpackConfigOptions, 'additionalEntry'>(
    ({ externalValue, defaultValue }) => [
      ...defaultValue,
      ...(externalValue ? externalValue : [])
    ]
  )
  public readonly additionalEntry: string[] = [];

  @Option<WebpackConfigOptions, 'moduleFileExtensions', 'useTypescript'>(
    ({ externalValue, defaultValue, dependencies: { useTypescript } }) => [
      ...defaultValue,
      ...(useTypescript ? ['.ts', '.tsx'] : []),
      ...(externalValue ? externalValue : [])
    ],
    ['useTypescript']
  )
  public readonly moduleFileExtensions: string[] = ['.json', '.js'];

  @Option<WebpackConfigOptions, 'jsFileExtensions', 'useTypescript'>(
    ({ externalValue, defaultValue, dependencies: { useTypescript } }) => [
      ...defaultValue,
      ...(useTypescript ? ['ts', 'tsx'] : []),
      ...(externalValue ? externalValue : [])
    ],
    ['useTypescript']
  )
  public readonly jsFileExtensions: string[] = ['js'];

  @Option<WebpackConfigOptions, 'isDev'>()
  public isDev: boolean = false;

  @Option<WebpackConfigOptions, 'useTypescript', 'paths'>(
    ({ externalValue, dependencies: { paths } }) =>
      typeof externalValue === 'boolean'
        ? externalValue
        : fs.existsSync(paths.tsConfig),
    ['paths']
  )
  public useTypescript: boolean = false;

  // todo method for returning metadata
}
