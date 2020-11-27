import { Task } from '../Task';

type TaskMeta<
  TName extends string = string,
  TArgs extends string[] = string[],
  TOptions extends Record<string, unknown> = Record<string, unknown>
> = {
  args: TArgs;
  options: TOptions;
  name: TName;
};

type ExtractName<T extends Task> = T extends Task<infer A> ? A : never;

type ExtractMeta<T extends Task> = TaskMeta<
  ExtractName<T>,
  Parameters<T['run']>[0],
  Parameters<T['run']>[1]
>;

let taskMeta: TaskMeta<any> | undefined;

export function getCurrentTaskMeta<T extends Task>():
  | ExtractMeta<T>
  | undefined {
  return taskMeta;
}

export function setCurrentTaskMeta(meta: TaskMeta): void {
  taskMeta = meta;
}
