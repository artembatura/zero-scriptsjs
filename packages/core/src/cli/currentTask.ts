import { Task } from '../Task';

type TaskMeta<
  T extends Task,
  TArgs extends string[] = string[],
  TOptions extends Record<string, unknown> = Record<string, unknown>
> = {
  args: TArgs;
  options: TOptions;
  instance: T;
};

type ExtractMeta<T extends Task> = TaskMeta<
  T,
  Parameters<T['run']>[0],
  Parameters<T['run']>[1]
>;

let taskMeta: TaskMeta<any, any> | undefined;

export function getCurrentTaskMeta<T extends Task>():
  | ExtractMeta<T>
  | undefined {
  return taskMeta;
}

export function setCurrentTaskMeta(meta: TaskMeta<any>): void {
  taskMeta = meta;
}
