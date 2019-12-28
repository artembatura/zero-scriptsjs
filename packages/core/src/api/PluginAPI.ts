import { Workspace } from '../Workspace';

export class PluginAPI {
  public constructor(private readonly ws: Workspace) {}

  get hooks(): typeof Workspace.prototype.hooks {
    return this.ws.hooks;
  }
}
