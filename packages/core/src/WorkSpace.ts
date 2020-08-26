import { SyncHook } from 'tapable';

import { AbstractPlugin } from './AbstractPlugin';
import { BeforeRunContext } from './context';
import { Task } from './Task';

export class WorkSpace {
  public readonly tasks: Map<string, Task> = new Map();
  public readonly configBuilderInstances: Map<string, any> = new Map();
  public readonly plugins: AbstractPlugin[] = [];
  public readonly hooks = {
    beforeRun: new SyncHook<BeforeRunContext>(['beforeRun'])
  };

  public constructor(public readonly name: string) {}
}
