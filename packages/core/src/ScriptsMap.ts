import { ScriptHandler } from './types';

export class ScriptsMap {
  private readonly map: Map<string, ScriptHandler> = new Map();

  public get size() {
    return this.map.size;
  }

  public get(key: string): ScriptHandler | undefined {
    return this.map.get(key);
  }

  public has(key: string): boolean {
    return this.map.has(key);
  }

  public set(key: string, value: ScriptHandler): this {
    if (this.has(key)) {
      throw new Error(`Cannot override scripts (${key})`);
    }
    this.map.set(key, value);
    return this;
  }

  public entries(): IterableIterator<[string, ScriptHandler]> {
    return this.map.entries();
  }

  public keys(): IterableIterator<string> {
    return this.map.keys();
  }

  public values(): IterableIterator<ScriptHandler> {
    return this.map.values();
  }
}
