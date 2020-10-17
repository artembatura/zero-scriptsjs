import { existsSync } from 'fs';

import { AbstractOptionsContainer, Option } from '@zero-scripts/core';

import { resolvePaths } from './resolvePaths';

export class WebpackConfigOptions extends AbstractOptionsContainer<
  WebpackConfigOptions
> {
  @Option<WebpackConfigOptions, 'paths'>(
    ({ defaultValue, externalValue }) => ({
      ...defaultValue,
      ...externalValue
    }),
    [],
    (value, { jsFileExtensions, isDev }) =>
      resolvePaths(value, jsFileExtensions, isDev)
  )
  public paths = {
    root: '',
    src: 'src',
    build: 'build',
    indexJs: 'src/index',
    indexHtml: 'public/index.html',
    public: 'public',
    publicUrlOrPath: process.env.PUBLIC_URL || '',
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
    ({ externalValue, defaultValue, dependencies }) => [
      ...defaultValue,
      ...(dependencies.useTypescript ? ['.ts'] : []),
      ...(externalValue ? externalValue : [])
    ],
    ['useTypescript']
  )
  public readonly moduleFileExtensions: string[] = ['json', 'js', 'mjs'];

  @Option<WebpackConfigOptions, 'jsFileExtensions', 'useTypescript'>(
    ({ externalValue, defaultValue, dependencies }) => [
      ...defaultValue,
      ...(dependencies.useTypescript ? ['ts'] : []),
      ...(externalValue ? externalValue : [])
    ],
    ['useTypescript']
  )
  public readonly jsFileExtensions: string[] = ['js', 'mjs'];

  @Option<WebpackConfigOptions, 'isDev'>()
  public isDev: boolean = false;

  @Option<WebpackConfigOptions, 'useTypescript', 'paths'>(
    ({ externalValue, dependencies }) =>
      externalValue ? externalValue : existsSync(dependencies.paths.tsConfig),
    ['paths']
  )
  public useTypescript: boolean = false;
}
