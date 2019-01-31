import { DependencyNode } from '../graph';

export const METADATA_OPTIONS = 'METADATA_OPTIONS';
export const METADATA_ROOT_DEPENDENCY_NODE = 'METADATA_ROOT_DEPENDENCY_NODE';

export type OptionMetadata<T, TOptionValue extends T[keyof T]> = {
  getOptionValue: (options: any, externalValue: any) => TOptionValue;
  externalValue: TOptionValue;
  postModifier: (value: TOptionValue, options: any) => TOptionValue;
};

export type RootDependencyMetadata = {
  instance: DependencyNode;
};
