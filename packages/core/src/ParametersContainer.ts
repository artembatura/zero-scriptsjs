export class ParametersContainer<TParameters> {
  constructor(externalParameters: TParameters) {
    Object.keys(externalParameters).forEach(option => {
      const prevMeta = Reflect.getMetadata(
        'data',
        this.constructor.prototype,
        option
      );

      if (prevMeta) {
        Reflect.deleteMetadata('data', this.constructor.prototype, option);
      }

      Reflect.defineMetadata(
        'data',
        {
          ...(prevMeta ? prevMeta : {}),
          externalValue: (externalParameters as any)[option]
        },
        this.constructor.prototype,
        option
      );
    });
  }
}
