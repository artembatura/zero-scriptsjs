import { SyncHook } from 'tapable';

import { AbstractPlugin } from './AbstractPlugin';
import { WorkspaceBeforeRunAPI } from './api';
import { Task } from './Task';

export class Workspace {
  public readonly tasks: Map<string, Task<any, any>> = new Map();
  public readonly configBuilderInstances: Map<string, any> = new Map();
  public readonly plugins: AbstractPlugin[] = [];
  public readonly hooks = {
    beforeRun: new SyncHook<WorkspaceBeforeRunAPI>(['beforeRun'])
  };

  public constructor(public readonly name: string) {}

  // private readonly rootDepNode: DependencyNode = new DependencyNode('root');
  // private readonly beforeApplyMap: Map<string, Function> = new Map();

  // public beforeApply<
  //   T extends PluginConstructor,
  //   TPlugin = T extends PluginConstructor<infer R> ? R : never
  // >(PluginClass: T, id: string, fnCallback: (plugin: TPlugin) => void): void {
  //   const dependencyNode =
  //     findRecursive(this.rootDepNode, PluginClass.name) ||
  //     this.rootDepNode.addOrGetEdge(PluginClass.name);
  //
  //   const callbackId = `${PluginClass.name}/${id}`;
  //
  //   this.beforeApplyMap.set(callbackId, fnCallback);
  //
  //   dependencyNode.addOrGetEdge(callbackId);
  //
  //   return undefined;
  // }
}
