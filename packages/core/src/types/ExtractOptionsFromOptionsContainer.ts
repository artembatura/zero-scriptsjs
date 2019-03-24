import { Omit } from './Omit';
import { AbstractOptionsContainer } from '../AbstractOptionsContainer';

export type ExtractOptionsFromOptionsContainer<
  T extends AbstractOptionsContainer
> = Omit<T, 'build'>;
