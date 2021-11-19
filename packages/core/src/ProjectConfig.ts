import * as fs from 'fs';
import * as path from 'path';

import { readJson } from './utils';

export interface IConfig {
  precisePackageMap: Record<string, string[]>;
}

const initCfg: IConfig = {
  precisePackageMap: {}
};

export class ProjectConfig {
  constructor(public readonly projectRoot: string) {}

  public get path(): string {
    return path.join(this.projectRoot, 'zero-scripts.json');
  }

  public exists(): boolean {
    return fs.existsSync(this.path);
  }

  public read(): IConfig {
    return this.exists() ? (readJson(this.path) as IConfig) : initCfg;
  }

  public write(cfg: IConfig): void {
    return fs.writeFileSync(this.path, JSON.stringify(cfg, null, 2), 'utf8');
  }

  public merge(values: IConfig): void {
    const prevCfg = this.read();

    const newCfg: IConfig = {
      precisePackageMap: {
        ...prevCfg.precisePackageMap,
        ...values.precisePackageMap
      }
    };

    this.write(newCfg);
  }
}
