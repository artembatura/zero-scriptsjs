import { SyncHook } from 'tapable';

import { AbstractPlugin } from './AbstractPlugin';
import { WorkspaceBeforeRunAPI } from './api';
import { Task } from './Task';

export class WorkSpace {
  public readonly tasks: Map<string, Task<any, any>> = new Map();
  public readonly configBuilderInstances: Map<string, any> = new Map();
  public readonly plugins: AbstractPlugin[] = [];
  public readonly hooks = {
    beforeRun: new SyncHook<WorkspaceBeforeRunAPI>(['beforeRun'])
  };

  public constructor(public readonly name: string) {}
}
