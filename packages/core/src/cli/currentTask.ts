import { Task } from '../Task';

type TaskMeta<
  T extends Task<any, any>,
  TArgs extends string[] = string[],
  TOptions extends Record<string, unknown> = Record<string, unknown>
> = {
  args: TArgs;
  options: TOptions;
  instance: T;
};

type ExtractMeta<T extends Task<any, any>> = TaskMeta<
  T,
  Parameters<T['run']>[0],
  Parameters<T['run']>[1]
>;

let taskMeta: TaskMeta<any, any> | undefined;

export function getCurrentTaskMeta<T extends Task<any, any>>():
  | ExtractMeta<T>
  | undefined {
  return taskMeta;
}

export function setCurrentTaskMeta(meta: TaskMeta<any>): void {
  taskMeta = meta;
}
