import { AbstractOptionsContainer } from '../AbstractOptionsContainer';
import { Omit } from './Omit';

export type ExtractOptionsFromOptionsContainer<
  T extends AbstractOptionsContainer
> = Omit<T, 'build'>;
