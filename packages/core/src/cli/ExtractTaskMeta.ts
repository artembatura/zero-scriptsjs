import { AbstractTask } from '../AbstractTask';
import { TaskMeta } from './TaskMeta';

type ExtractName<T extends AbstractTask> = T extends AbstractTask<infer A>
  ? A
  : never;

export type ExtractTaskMeta<T extends AbstractTask> = TaskMeta<
  ExtractName<T>,
  Parameters<T['run']>[0],
  Parameters<T['run']>[1]
>;
