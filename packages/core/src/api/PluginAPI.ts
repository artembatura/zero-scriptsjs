import { WorkSpace } from '../WorkSpace';

export class PluginAPI {
  public constructor(private readonly ws: WorkSpace) {}

  get hooks(): typeof WorkSpace.prototype.hooks {
    return this.ws.hooks;
  }
}
