import { SyncHook } from 'tapable';

import { AbstractConfigBuilder } from './AbstractConfigBuilder';
import { AbstractPlugin } from './AbstractPlugin';
import { AbstractTask } from './AbstractTask';
import { BeforeRunContext } from './context';

export class WorkSpace {
  public readonly tasks: Map<string, AbstractTask> = new Map();
  public readonly configBuilderInstances: Map<
    string,
    AbstractConfigBuilder
  > = new Map();
  public readonly plugins: AbstractPlugin[] = [];
  public readonly hooks = {
    beforeRun: new SyncHook<BeforeRunContext>(['beforeRun'])
  };

  public constructor(public readonly name: string) {}
}
