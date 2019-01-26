import 'reflect-metadata';

export function Option<
  T,
  TOption extends keyof T,
  TDependency extends keyof T = keyof T
>(
  getValue?: (data: {
    dependencies: { [K in TDependency]: T[K] };
    defaultValue: T[TOption];
    externalValue: T[TOption];
  }) => T[TOption],
  dependencies: TDependency[] = [],
  handler?: (value: T[TOption]) => T[TOption]
) {
  return (target: any, propertyName: string) => {
    const values = new Map();

    Object.defineProperty(target, propertyName, {
      set(firstValue: any) {
        Object.defineProperty(this, propertyName, {
          get() {
            return values.get(this);
          },
          set(value: any) {
            values.set(this, value);
          },
          enumerable: true
        });

        this[propertyName] = firstValue;

        const getOptionValue = (options: any, externalValue: any) => {
          const defaultValue = this[propertyName];
          let value = null;

          if (getValue) {
            value = getValue({
              dependencies:
                dependencies.length > 0
                  ? dependencies.reduce(
                      (object, dependency) => ({
                        ...object,
                        [dependency]: options[dependency] || this[dependency]
                      }),
                      {} as T
                    )
                  : ({} as any),
              defaultValue,
              externalValue
            });
          } else {
            value = externalValue !== undefined ? externalValue : defaultValue;
          }

          return handler ? handler(value) : value;
        };

        Reflect.defineMetadata(
          'data',
          {
            getOptionValue,
            dependencies
          },
          target,
          propertyName
        );
      },
      enumerable: true,
      configurable: true
    });
  };
}
