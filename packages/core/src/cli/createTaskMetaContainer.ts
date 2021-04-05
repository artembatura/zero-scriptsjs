import { TaskMeta } from './TaskMeta';
import { TaskMetaContainer } from './TaskMetaContainer';

export function createTaskMetaContainer(
  initialMeta?: TaskMeta
): TaskMetaContainer {
  let taskMeta: TaskMeta | undefined = initialMeta;

  return {
    get: () => taskMeta as any,
    set: (meta: TaskMeta) => {
      taskMeta = meta;
    }
  };
}
