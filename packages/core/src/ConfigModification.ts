export class ConfigModification<TMap extends Map<any, any> = any> {
  constructor(
    public readonly path: string,
    protected readonly createNewValue: (map: TMap) => any,
    public readonly id?: string
  ) {}

  public apply(target: TMap): this {
    target.set(this.path, this.createNewValue(target));
    return this;
  }
}
