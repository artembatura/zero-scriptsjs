import { AbstractTask } from '../AbstractTask';
import { ExtractTaskMeta } from './ExtractTaskMeta';
import { TaskMeta } from './TaskMeta';

export type TaskMetaContainer = {
  get: <T extends AbstractTask>() => ExtractTaskMeta<T> | undefined;
  set: (taskMeta: TaskMeta) => void;
};
