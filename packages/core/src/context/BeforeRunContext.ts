import { AbstractConfigBuilder } from '../AbstractConfigBuilder';
import { AbstractPlugin } from '../AbstractPlugin';
import { Task } from '../Task';
import { AbstractConfigBuilderConstructor } from '../types/AbstractConfigBuilderConstructor';
import { WorkSpace } from '../WorkSpace';

export class BeforeRunContext {
  public constructor(private readonly ws: WorkSpace) {}

  public addTask(task: Task): void {
    if (this.ws.tasks.has(task.name)) {
      throw new Error(`Task ${task.name} is already defined`);
    }

    this.ws.tasks.set(task.name, task);
  }

  public getConfigBuilder<T extends AbstractConfigBuilder<any, any>>(
    Class: AbstractConfigBuilderConstructor<T>
  ): T {
    const className: string = Class.name;

    if (!this.ws.configBuilderInstances.get(className)) {
      this.ws.configBuilderInstances.set(className, new Class());
    }

    return this.ws.configBuilderInstances.get(className);
  }

  public findPlugin<T extends AbstractPlugin>(name: string): T | undefined {
    return this.ws.plugins.find(plugin => plugin.constructor.name === name) as
      | T
      | undefined;
  }
}
