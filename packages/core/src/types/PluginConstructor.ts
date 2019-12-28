import { AbstractPlugin } from '../AbstractPlugin';

export type PluginConstructor<T extends AbstractPlugin> = {
  new (...args: any[]): T;
};
