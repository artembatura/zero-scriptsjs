import { TaskMetaContainer } from '../cli';
import { WorkSpace } from '../WorkSpace';

export class ApplyContext {
  public constructor(
    private readonly ws: WorkSpace,
    public readonly taskMetaContainer: TaskMetaContainer
  ) {}

  get hooks(): typeof WorkSpace.prototype.hooks {
    return this.ws.hooks;
  }
}
